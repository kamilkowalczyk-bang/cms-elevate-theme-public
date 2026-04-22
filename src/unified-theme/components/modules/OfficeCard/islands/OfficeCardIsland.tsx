import {
  getLinkFieldHref,
  getLinkFieldRel,
  getLinkFieldTarget,
} from '../../../utils/content-fields.js';
import { getDataHSToken } from '../../../utils/inline-editing.js';
import { createComponent } from '../../../utils/create-component.js';
import cx, { staticWithModule } from '../../../utils/classnames.js';
import { OfficeCardProps } from '../types.js';
import styles from '../office-card.module.css';

const swm = staticWithModule(styles);

function toTelHref(phone: string): string {
  const normalizedPhone = phone.replace(/[^\d+]/g, '');
  return normalizedPhone ? `tel:${normalizedPhone}` : '#';
}

function toMailHref(email: string): string {
  return email ? `mailto:${email}` : '#';
}

function getFallbackOrLinkHref(rawText: string, linkHref: string | undefined, fallbackType: 'phone' | 'email'): string {
  if (linkHref && linkHref.trim()) {
    return linkHref;
  }
  if (fallbackType === 'phone') {
    return toTelHref(rawText);
  }
  return toMailHref(rawText);
}

function getHubDbValuesObject(row: unknown): Record<string, unknown> | undefined {
  if (!row || typeof row !== 'object') return undefined;
  const rowObject = row as Record<string, unknown>;

  if (rowObject.values && typeof rowObject.values === 'object' && !Array.isArray(rowObject.values)) {
    return rowObject.values as Record<string, unknown>;
  }

  return undefined;
}

function getHubDbRowValue(row: unknown, keys: string[]): unknown {
  if (!row || typeof row !== 'object') return undefined;
  const rowObject = row as Record<string, unknown>;
  const values = getHubDbValuesObject(row);

  for (const key of keys) {
    if (rowObject[key] !== undefined) return rowObject[key];

    if (values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        return values[key];
      }

      const loweredKey = key.toLowerCase();
      for (const valuesKey of Object.keys(values)) {
        if (valuesKey.toLowerCase() === loweredKey) {
          return values[valuesKey];
        }
      }
    }
  }

  return undefined;
}

function getHubDbString(row: unknown, keys: string[]): string | undefined {
  const raw = getHubDbRowValue(row, keys);

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    return trimmed || undefined;
  }

  if (raw && typeof raw === 'object') {
    const record = raw as Record<string, unknown>;
    const nested = record.href ?? record.url ?? record.value ?? record.label;
    if (typeof nested === 'string') {
      const trimmed = nested.trim();
      return trimmed || undefined;
    }
  }

  return undefined;
}

function getHubDbNumber(row: unknown, keys: string[]): number | undefined {
  const raw = getHubDbRowValue(row, keys);
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === 'string') {
    const n = parseFloat(raw.trim().replace(',', '.'));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function getHubDbImageSrc(row: unknown, keys: string[]): string | undefined {
  const raw = getHubDbRowValue(row, keys);
  if (!raw) return undefined;

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    return trimmed || undefined;
  }

  if (typeof raw === 'object') {
    const record = raw as Record<string, unknown>;
    const src = record.url ?? record.src ?? record.full_url ?? record.file_url;
    if (typeof src === 'string') {
      const trimmed = src.trim();
      return trimmed || undefined;
    }

    if (record.image && typeof record.image === 'object') {
      const nested = record.image as Record<string, unknown>;
      const nestedSrc = nested.url ?? nested.src ?? nested.full_url;
      if (typeof nestedSrc === 'string') {
        const trimmed = nestedSrc.trim();
        return trimmed || undefined;
      }
    }
  }

  return undefined;
}

function parseLocationPair(raw: string | undefined): { lat?: number; lng?: number } {
  if (!raw) return {};
  const parts = raw.split(/[,;\s]+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const lat = parseFloat(parts[0].replace(',', '.'));
    const lng = parseFloat(parts[1].replace(',', '.'));
    return {
      lat: Number.isFinite(lat) ? lat : undefined,
      lng: Number.isFinite(lng) ? lng : undefined,
    };
  }
  return {};
}

/** True when the field is only decimal lat/lng (no letters) — used as coordinate fallback, not as a Google place query. */
function isLatLngOnlyString(raw: string | undefined): boolean {
  if (!raw?.trim()) return false;
  if (/[a-z]/i.test(raw)) return false;
  const { lat, lng } = parseLocationPair(raw);
  return lat !== undefined && lng !== undefined;
}

function toCoordinate(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const n = parseFloat(value.replace(',', '.').trim());
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function getHubDbLocation(row: unknown, keys: string[]): { lat?: number; lng?: number } {
  const raw = getHubDbRowValue(row, keys);
  if (!raw) return {};

  if (typeof raw === 'string') {
    return parseLocationPair(raw);
  }

  if (typeof raw === 'object') {
    const record = raw as Record<string, unknown>;
    return {
      lat: toCoordinate(record.lat ?? record.latitude),
      lng: toCoordinate(record.long ?? record.lng ?? record.longitude),
    };
  }

  return {};
}

function buildGoogleMapsEmbedUrl(lat: number, lng: number, zoom: number): string {
  const z = Math.min(21, Math.max(1, Math.round(zoom)));
  return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=${z}&hl=en&output=embed`;
}

function buildGoogleMapsSearchUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

function buildGoogleMapsEmbedUrlFromPlaceQuery(placeQuery: string, zoom: number): string {
  const z = Math.min(21, Math.max(1, Math.round(zoom)));
  return `https://maps.google.com/maps?q=${encodeURIComponent(placeQuery)}&z=${z}&hl=en&output=embed`;
}

function buildGoogleMapsSearchUrlFromQuery(placeQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeQuery)}`;
}

function extractPlaceQueryFromUrl(urlString: string | undefined): string | undefined {
  if (!urlString) return undefined;

  try {
    const parsed = new URL(urlString);
    const query = parsed.searchParams.get('query') ?? parsed.searchParams.get('q');
    if (query && query.trim()) return query.trim();
  } catch {
    const match = urlString.match(/[?&](?:query|q)=([^&#]+)/i);
    if (match?.[1]) return decodeURIComponent(match[1]).trim();
  }

  return undefined;
}

function isGenericGoogleMapsUrl(urlString: string | undefined): boolean {
  if (!urlString) return false;

  const normalized = urlString.trim().replace(/\/+$/, '');
  return normalized === 'https://www.google.com/maps' || normalized === 'https://maps.google.com';
}

async function copyTextToClipboard(text: string): Promise<void> {
  if (!text) return;

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document !== 'undefined') {
    const fallbackInput = document.createElement('textarea');
    fallbackInput.value = text;
    fallbackInput.setAttribute('readonly', '');
    fallbackInput.style.position = 'fixed';
    fallbackInput.style.opacity = '0';
    document.body.appendChild(fallbackInput);
    fallbackInput.select();
    document.execCommand('copy');
    document.body.removeChild(fallbackInput);
  }
}

const Section = createComponent('section');
const Grid = createComponent('div');
const Card = createComponent('article');
const MapBlock = createComponent('div');
const MapLink = createComponent('a');
const MapImage = createComponent('img');
const MapIframe = createComponent('iframe');
const Details = createComponent('div');
const OfficeName = createComponent('h3');
const BodyLine = createComponent('p');
const PhoneLink = createComponent('a');
const EmailRow = createComponent('div');
const EmailLink = createComponent('a');

export default function OfficeCardIsland(props: OfficeCardProps) {
  const {
    moduleName,
    useHubDB = false,
    groupOfficeCards = [],
    hublData: { manualHubDbRows = [] } = {},
  } = props;

  const inlineModuleName = useHubDB ? undefined : moduleName;

  return (
    <Section className={swm('hs-elevate-office-cards')}>
      <Grid className={swm('hs-elevate-office-cards__grid')}>
        {groupOfficeCards.map((card, index) => {
          const hubDbSource = useHubDB ? (manualHubDbRows[index] ?? card.groupHubdbRow) : undefined;

          const officeName = getHubDbString(hubDbSource, ['office_name']) ?? card.groupInfo.officeName;
          const streetAddress = getHubDbString(hubDbSource, ['street_address']) ?? card.groupInfo.streetAddress;
          const postalCode = getHubDbString(hubDbSource, ['postal_code']) ?? card.groupInfo.postalCode;
          const city = getHubDbString(hubDbSource, ['city']) ?? card.groupInfo.city;
          const country = getHubDbString(hubDbSource, ['country']) ?? card.groupInfo.country;
          const emailText = getHubDbString(hubDbSource, ['email', 'email_address']) ?? card.groupInfo.emailText;
          const phoneText = getHubDbString(hubDbSource, ['phone', 'phone_number']) ?? card.groupInfo.phoneText;

          const hubZoom = getHubDbNumber(hubDbSource, ['map_zoom', 'zoom']);
          const officeLocationPair = getHubDbLocation(hubDbSource, ['office_location']);
          const mapLocationRaw = card.groupMap.mapLocation?.trim();
          const mapLocationIsLatLng = Boolean(mapLocationRaw && isLatLngOnlyString(mapLocationRaw));
          const moduleLocationPair = mapLocationRaw && mapLocationIsLatLng ? parseLocationPair(mapLocationRaw) : {};
          const mapLocationPlaceQuery = mapLocationRaw && !mapLocationIsLatLng ? mapLocationRaw : undefined;
          const lat =
            officeLocationPair.lat ??
            moduleLocationPair.lat;
          const lng =
            officeLocationPair.lng ??
            moduleLocationPair.lng;

          const zoomFromModule =
            typeof card.groupMap.mapZoom === 'number' && Number.isFinite(card.groupMap.mapZoom)
              ? card.groupMap.mapZoom
              : 12;
          const zoom = hubZoom ?? zoomFromModule;

          const mapImageSrc = getHubDbImageSrc(hubDbSource, ['map_image']) ?? card.groupMap.mapImage?.src;
          const hasCoords = lat !== undefined && lng !== undefined;
          const placeQueryFromAddress = [streetAddress, postalCode, city, country]
            .filter(Boolean)
            .join(', ');

          const hubMapsUrl = getHubDbString(hubDbSource, ['google_maps_url']);
          const configuredMapsHref = getLinkFieldHref(card.groupMap.googleMapsLink);
          const preferredConfiguredMapHref = isGenericGoogleMapsUrl(configuredMapsHref)
            ? undefined
            : configuredMapsHref;
          const extractedHubQuery = extractPlaceQueryFromUrl(hubMapsUrl);
          const extractedConfiguredQuery = extractPlaceQueryFromUrl(preferredConfiguredMapHref);
          const placeQuery = useHubDB
            ? (extractedHubQuery ?? placeQueryFromAddress ?? mapLocationPlaceQuery ?? extractedConfiguredQuery ?? officeName)
            : (placeQueryFromAddress || mapLocationPlaceQuery || extractedHubQuery || extractedConfiguredQuery || officeName);
          const embedUrl = placeQuery
            ? buildGoogleMapsEmbedUrlFromPlaceQuery(placeQuery, zoom)
            : (hasCoords ? buildGoogleMapsEmbedUrl(lat, lng, zoom) : undefined);
          const mapHref =
            hubMapsUrl ||
            preferredConfiguredMapHref ||
            (placeQuery ? buildGoogleMapsSearchUrlFromQuery(placeQuery) : undefined) ||
            (hasCoords ? buildGoogleMapsSearchUrl(lat, lng) : undefined);

          const mapTarget = hubMapsUrl ? '_blank' : getLinkFieldTarget(card.groupMap.googleMapsLink) || '_blank';
          const mapRel = hubMapsUrl ? 'noopener noreferrer' : getLinkFieldRel(card.groupMap.googleMapsLink) || 'noopener noreferrer';

          const addressLine1 = [streetAddress, postalCode].filter(Boolean).join(', ');
          const addressLine2 = [city, country].filter(Boolean).join(', ');

          const phoneHref = phoneText
            ? getFallbackOrLinkHref(phoneText, getLinkFieldHref(card.groupInfo.phoneLink), 'phone')
            : undefined;
          const emailHref = emailText
            ? getFallbackOrLinkHref(emailText, getLinkFieldHref(card.groupInfo.emailLink), 'email')
            : undefined;

          const hasMapEmbed = Boolean(embedUrl);
          const hasMapImage = Boolean(mapImageSrc);
          const showMap = hasMapEmbed || hasMapImage;

          return (
            <Card key={index} className={swm('hs-elevate-office-cards__card')}>
              {showMap && (
                <MapBlock
                  className={cx(
                    swm('hs-elevate-office-cards__map'),
                    { [swm('hs-elevate-office-cards__map--embed')]: hasMapEmbed },
                  )}
                >
                  {hasMapEmbed && embedUrl && mapHref && (
                    <>
                      <MapIframe
                        className={swm('hs-elevate-office-cards__map-iframe')}
                        src={embedUrl}
                        title={officeName ? `Google Map of ${officeName}` : 'Google Map'}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <MapLink
                        className={swm('hs-elevate-office-cards__map-hit-area')}
                        href={mapHref}
                        target={mapTarget}
                        rel={mapRel}
                        aria-label={officeName ? `Open ${officeName} in Google Maps` : 'Open in Google Maps'}
                      />
                    </>
                  )}
                  {!hasMapEmbed && hasMapImage && mapHref && (
                    <MapLink
                      className={swm('hs-elevate-office-cards__map-link')}
                      href={mapHref}
                      target={mapTarget}
                      rel={mapRel}
                    >
                      <MapImage
                        className={swm('hs-elevate-office-cards__map-image')}
                        src={mapImageSrc}
                        alt={officeName ? `Map of ${officeName}` : 'Office map'}
                        loading="lazy"
                      />
                    </MapLink>
                  )}
                  {!hasMapEmbed && hasMapImage && !mapHref && (
                    <MapImage
                      className={swm('hs-elevate-office-cards__map-image')}
                      src={mapImageSrc}
                      alt={officeName ? `Map of ${officeName}` : 'Office map'}
                      loading="lazy"
                    />
                  )}
                </MapBlock>
              )}

              <Details className={swm('hs-elevate-office-cards__details')}>
                {officeName && (
                  <OfficeName
                    className={swm('hs-elevate-office-cards__office-name')}
                    data-hs-token={getDataHSToken(inlineModuleName, `groupOfficeCards[${index}].groupInfo.officeName`)}
                  >
                    {officeName}
                  </OfficeName>
                )}
                {addressLine1 && <BodyLine className={swm('hs-elevate-office-cards__body-line')}>{addressLine1}</BodyLine>}
                {addressLine2 && <BodyLine className={swm('hs-elevate-office-cards__body-line')}>{addressLine2}</BodyLine>}
                {phoneText && phoneHref && (
                  <PhoneLink
                    className={swm('hs-elevate-office-cards__phone-link')}
                    href={phoneHref}
                    rel={getLinkFieldRel(card.groupInfo.phoneLink)}
                    target={getLinkFieldTarget(card.groupInfo.phoneLink)}
                    data-hs-token={getDataHSToken(inlineModuleName, `groupOfficeCards[${index}].groupInfo.phoneText`)}
                  >
                    {phoneText}
                  </PhoneLink>
                )}
                {emailText && emailHref && (
                  <EmailRow className={swm('hs-elevate-office-cards__email-row')}>
                    <EmailLink
                      className={swm('hs-elevate-office-cards__email-link')}
                      href={emailHref}
                      rel={getLinkFieldRel(card.groupInfo.emailLink)}
                      target={getLinkFieldTarget(card.groupInfo.emailLink)}
                      data-hs-token={getDataHSToken(inlineModuleName, `groupOfficeCards[${index}].groupInfo.emailText`)}
                    >
                      {emailText}
                    </EmailLink>
                    <button
                      type="button"
                      className={swm('hs-elevate-office-cards__copy-email-button')}
                      onClick={() => {
                        void copyTextToClipboard(emailText);
                      }}
                      aria-label={`Copy email ${emailText}`}
                    />
                  </EmailRow>
                )}
              </Details>
            </Card>
          );
        })}
      </Grid>
    </Section>
  );
}
