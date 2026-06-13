import {
  getLinkFieldHref,
  getLinkFieldRel,
  getLinkFieldTarget,
} from '../../../utils/content-fields.js';
import {
  isGenericGoogleMapsLink,
  resolveOfficeMapUrls,
} from '../../../utils/google-maps-place.js';
import { getDataHSToken } from '../../../utils/inline-editing.js';
import { createComponent } from '../../../utils/create-component.js';
import cx, { staticWithModule } from '../../../utils/classnames.js';
import { OfficeCardItem, OfficeCardProps } from '../types.js';
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
    hublData: { manualHubDbRows = [], feedFromManualHubDbOnly = false } = {},
  } = props;

  const inlineModuleName = useHubDB ? undefined : moduleName;

  const isManualOfficeFeed = Boolean(
    useHubDB && feedFromManualHubDbOnly && Array.isArray(manualHubDbRows) && manualHubDbRows.length > 0,
  );
  const isFallbackEmpty = Boolean(
    useHubDB && feedFromManualHubDbOnly && (!manualHubDbRows?.length),
  );
  const cardCount = isManualOfficeFeed
    ? manualHubDbRows.length
    : isFallbackEmpty
      ? 0
      : groupOfficeCards.length;
  const cardIndices = Array.from({ length: cardCount }, (_, j) => j);

  return (
    <Section className={swm('hs-elevate-office-cards')}>
      <Grid className={swm('hs-elevate-office-cards__grid')}>
        {cardIndices.map((index) => {
          const card = groupOfficeCards[index] as OfficeCardItem | undefined;
          const emptyShell: Partial<OfficeCardItem> = {};
          const c = (card ?? emptyShell) as OfficeCardItem;
          const gInfo = c.groupInfo;
          const gMap = c.groupMap;
          const hubDbSource = useHubDB
            ? (manualHubDbRows[index] ?? c.groupHubdbRow)
            : undefined;

          const officeName = getHubDbString(hubDbSource, ['office_name']) ?? gInfo?.officeName;
          const streetAddress = getHubDbString(hubDbSource, ['street_address']) ?? gInfo?.streetAddress;
          const postalCode = getHubDbString(hubDbSource, ['postal_code']) ?? gInfo?.postalCode;
          const city = getHubDbString(hubDbSource, ['city']) ?? gInfo?.city;
          const country = getHubDbString(hubDbSource, ['country']) ?? gInfo?.country;
          const emailText = getHubDbString(hubDbSource, ['email', 'email_address']) ?? gInfo?.emailText;
          const phoneText = getHubDbString(hubDbSource, ['phone', 'phone_number']) ?? gInfo?.phoneText;

          const hubZoom = getHubDbNumber(hubDbSource, ['map_zoom', 'zoom']);
          const officeLocationPair = getHubDbLocation(hubDbSource, ['office_location']);
          const mapLocationRaw = gMap?.mapLocation?.trim();
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
            typeof gMap?.mapZoom === 'number' && Number.isFinite(gMap.mapZoom)
              ? gMap.mapZoom
              : 12;
          const zoom = hubZoom ?? zoomFromModule;

          const mapImageSrc = getHubDbImageSrc(hubDbSource, ['map_image']) ?? gMap?.mapImage?.src;
          const placeQueryFromAddress = [streetAddress, postalCode, city, country]
            .filter(Boolean)
            .join(', ');

          const hubMapsUrl = getHubDbString(hubDbSource, ['google_maps_url']);
          const hubEmbedUrl = getHubDbString(hubDbSource, ['google_maps_embed_url']);
          const hubPlaceId = getHubDbString(hubDbSource, ['google_place_id']);
          const configuredMapsHref = getLinkFieldHref(gMap?.googleMapsLink);
          const preferredConfiguredMapHref = isGenericGoogleMapsLink(configuredMapsHref)
            ? undefined
            : configuredMapsHref;
          const { embedUrl, mapHref } = resolveOfficeMapUrls({
            hubMapsUrl,
            hubEmbedUrl,
            hubPlaceId,
            configuredMapsHref: preferredConfiguredMapHref,
            officeName,
            placeQueryFromAddress,
            mapLocationPlaceQuery,
            lat,
            lng,
            zoom,
            useHubDB,
          });

          const mapTarget = hubMapsUrl ? '_blank' : getLinkFieldTarget(gMap?.googleMapsLink) || '_blank';
          const mapRel = hubMapsUrl ? 'noopener noreferrer' : getLinkFieldRel(gMap?.googleMapsLink) || 'noopener noreferrer';

          const addressLine1 = [streetAddress, postalCode].filter(Boolean).join(', ');
          const addressLine2 = [city, country].filter(Boolean).join(', ');

          const phoneHref = phoneText
            ? getFallbackOrLinkHref(phoneText, getLinkFieldHref(gInfo?.phoneLink), 'phone')
            : undefined;
          const emailHref = emailText
            ? getFallbackOrLinkHref(emailText, getLinkFieldHref(gInfo?.emailLink), 'email')
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
                    data-hs-token={getDataHSToken(inlineModuleName, `groupOfficeCards[${String(index)}].groupInfo.officeName`)}
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
                    rel={getLinkFieldRel(gInfo?.phoneLink)}
                    target={getLinkFieldTarget(gInfo?.phoneLink)}
                    data-hs-token={getDataHSToken(inlineModuleName, `groupOfficeCards[${String(index)}].groupInfo.phoneText`)}
                  >
                    {phoneText}
                  </PhoneLink>
                )}
                {emailText && emailHref && (
                  <EmailRow className={swm('hs-elevate-office-cards__email-row')}>
                    <EmailLink
                      className={swm('hs-elevate-office-cards__email-link')}
                      href={emailHref}
                      rel={getLinkFieldRel(gInfo?.emailLink)}
                      target={getLinkFieldTarget(gInfo?.emailLink)}
                      data-hs-token={getDataHSToken(inlineModuleName, `groupOfficeCards[${String(index)}].groupInfo.emailText`)}
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
