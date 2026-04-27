import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlignmentFieldType } from '@hubspot/cms-components/fields';
import { Card } from '../../../CardComponent/index.js';
import { Button } from '../../../ButtonComponent/index.js';
import {
  getLinkFieldHref,
  getLinkFieldRel,
  getLinkFieldTarget,
} from '../../../utils/content-fields.js';
import { getAlignmentFieldCss } from '../../../utils/style-fields.js';
import { createComponent } from '../../../utils/create-component.js';
import cx, { staticWithModule } from '../../../utils/classnames.js';
import { CSSPropertiesMap } from '../../../types/components.js';
import { SalesTeamProps } from '../types.js';
import styles from '../sales-team.module.css';

const swm = staticWithModule(styles);

const SALES_REGION_OPTION_NAMES = new Set([
  'usa_canada',
  'dach_eastern_europe',
  'nordic_baltic',
  'rest_of_europe',
]);

const SALES_REGION_LABELS: Record<string, string> = {
  usa_canada: 'USA & Canada',
  dach_eastern_europe: 'DACH & Eastern Europe',
  nordic_baltic: 'Nordic & Baltic Countries',
  rest_of_europe: 'Rest of Europe',
};

function generateColorCssVars(cardVariantField: string): CSSPropertiesMap {
  const cardColorsMap: Record<
    string,
    { textColor: string; accentColor: string; linkColor: string; linkHoverColor: string }
  > = {
    card_variant_1: {
      textColor: 'var(--hsElevate--card--variant1__textColor)',
      accentColor: 'var(--hsElevate--card--variant1__iconColor)',
      linkColor: 'var(--hsElevate--card--variant1--link__fontColor)',
      linkHoverColor: 'var(--hsElevate--card--variant1--link__hover--fontColor)',
    },
    card_variant_2: {
      textColor: 'var(--hsElevate--card--variant2__textColor)',
      accentColor: 'var(--hsElevate--card--variant2__iconColor)',
      linkColor: 'var(--hsElevate--card--variant2--link__fontColor)',
      linkHoverColor: 'var(--hsElevate--card--variant2--link__hover--fontColor)',
    },
    card_variant_3: {
      textColor: 'var(--hsElevate--card--variant3__textColor)',
      accentColor: 'var(--hsElevate--card--variant3__iconColor)',
      linkColor: 'var(--hsElevate--card--variant3--link__fontColor)',
      linkHoverColor: 'var(--hsElevate--card--variant3--link__hover--fontColor)',
    },
    card_variant_4: {
      textColor: 'var(--hsElevate--card--variant4__textColor)',
      accentColor: 'var(--hsElevate--card--variant4__iconColor)',
      linkColor: 'var(--hsElevate--card--variant4--link__fontColor)',
      linkHoverColor: 'var(--hsElevate--card--variant4--link__hover--fontColor)',
    },
  };

  const variantKey = cardVariantField in cardColorsMap ? cardVariantField : 'card_variant_3';
  const colors = cardColorsMap[variantKey];

  return {
    '--hsElevate--salesTeam__textColor': colors.textColor,
    '--hsElevate--salesTeam__accentColor': colors.accentColor,
    '--hsElevate--salesTeam__linkColor': colors.linkColor,
    '--hsElevate--salesTeam__linkHoverColor': colors.linkHoverColor,
  };
}

function generateAlignmentCssVars(
  cardsAlignmentField: AlignmentFieldType['default'],
  contentAlignmentField: AlignmentFieldType['default'],
): CSSPropertiesMap {
  const cardsAlignmentCss = getAlignmentFieldCss(cardsAlignmentField);
  const contentAlignmentCss = getAlignmentFieldCss(contentAlignmentField);
  const contentTextAlignMap = {
    'flex-start': 'left',
    center: 'center',
    'flex-end': 'right',
  } as const;
  const contentTextAlign = contentTextAlignMap[contentAlignmentCss.justifyContent] || 'center';

  return {
    '--hsElevate--salesTeam__containerAlignment': cardsAlignmentCss.justifyContent || 'center',
    '--hsElevate--salesTeam__innerAlignment': contentAlignmentCss.justifyContent || 'center',
    '--hsElevate--salesTeam__innerTextAlignment': contentTextAlign,
  };
}

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

  const candidateValues = [
    (row as Record<string, unknown>).values,
    (row as Record<string, unknown>).row,
    (row as Record<string, unknown>).selectedRow,
  ];

  for (const candidate of candidateValues) {
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      if ('values' in candidate && (candidate as Record<string, unknown>).values) {
        const nested = (candidate as Record<string, unknown>).values;
        if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
          return nested as Record<string, unknown>;
        }
      }
    }
  }

  if ((row as Record<string, unknown>).values && typeof (row as Record<string, unknown>).values === 'object') {
    return (row as Record<string, unknown>).values as Record<string, unknown>;
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

function getHubDbBoolean(row: unknown, keys: string[]): boolean | undefined {
  const raw = getHubDbRowValue(row, keys);
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'number') return raw === 1;
  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return undefined;
}

function getHubDbImageSrc(row: unknown, keys: string[]): string | undefined {
  const raw = getHubDbRowValue(row, keys);
  if (!raw) return undefined;
  if (typeof raw === 'string') return raw.trim() || undefined;
  if (typeof raw === 'object') {
    const record = raw as Record<string, unknown>;
    const src = record.url ?? record.src ?? record.full_url ?? record.file_url;
    if (typeof src === 'string') return src.trim() || undefined;
    if (record.image && typeof record.image === 'object') {
      const nestedSrc = getHubDbImageSrc({ image: (record.image as Record<string, unknown>) }, ['image']);
      if (nestedSrc) return nestedSrc;
    }
  }
  return undefined;
}

function createExternalLinkField(href: string | undefined): any {
  if (!href) return undefined;
  return {
    url: {
      type: 'EXTERNAL',
      content_id: 0,
      href,
    },
  };
}

function hasHubDbRowData(row: unknown): boolean {
  return Boolean(
    getHubDbRowValue(row, ['id', 'rowId', 'row_id', 'hs_id']) ||
      getHubDbString(row, ['full_name', 'name']) ||
      getHubDbString(row, ['email', 'email_address', 'email_text']) ||
      getHubDbString(row, ['phone', 'phone_number', 'phone_text']),
  );
}

function getSalesRegionOptionName(row: unknown): string | undefined {
  const raw = getHubDbRowValue(row, ['sales_region']);
  if (typeof raw === 'string') {
    const t = raw.trim().toLowerCase();
    return t || undefined;
  }
  if (raw && typeof raw === 'object' && raw !== null && 'name' in raw) {
    const n = (raw as { name?: string }).name;
    return typeof n === 'string' ? n.trim().toLowerCase() : undefined;
  }
  return undefined;
}

function isRegionalSalesRepRow(row: unknown): boolean {
  if (!hasHubDbRowData(row)) return false;
  const department = getHubDbString(row, ['department', 'job_title', 'role']);
  // Business rule: any contact marked as Sales should be rendered on Sales tab,
  // regardless of region/checkbox combinations.
  if (department && department.trim().toLowerCase().includes('sales')) {
    return true;
  }
  const name = getSalesRegionOptionName(row);
  if (!name) {
    const fallbackRegionLabel = getHubDbString(row, ['region', 'country_region', 'location']);
    if (!fallbackRegionLabel) return false;
    const normalized = fallbackRegionLabel.trim().toLowerCase();
    if (normalized === '' || normalized === 'none' || normalized === 'n/a' || normalized === 'na') {
      return false;
    }
    return true;
  }
  if (name === 'none' || name === 'na' || name === 'n_a') return false;
  return SALES_REGION_OPTION_NAMES.has(name);
}

function getRowId(row: unknown): string | number | null {
  const raw = getHubDbRowValue(row, ['hs_id', 'id', 'rowId', 'row_id']);
  if (raw == null) return null;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  const n = parseInt(String(raw), 10);
  if (Number.isFinite(n)) return n;
  return String(raw);
}

function rowIdsEqual(a: string | number | null, b: string | number | null): boolean {
  if (a === null || b === null) return false;
  return String(a) === String(b);
}

function getDisplayRegionLabel(row: unknown): string | undefined {
  const legacy = getHubDbString(row, ['region', 'country_region', 'location']);
  if (legacy) return legacy;
  const opt = getSalesRegionOptionName(row);
  if (opt && SALES_REGION_LABELS[opt]) return SALES_REGION_LABELS[opt];
  return undefined;
}

function getMeetingEmbedUrl(row: unknown): string | undefined {
  const raw = getHubDbString(row, ['meeting_embed_url', 'meeting_embed']);
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    if (u.protocol === 'https:' || u.protocol === 'http:') return raw;
  } catch {
    return undefined;
  }
  return undefined;
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

const Root = createComponent('div');
const FeaturedRow = createComponent('div');
const FeaturedCardCol = createComponent('div');
const MeetingCol = createComponent('div');
const MeetingFrameWrap = createComponent('div');
const MeetingIframe = createComponent('iframe');
const MeetingFallbackLink = createComponent('a');
const MeetingFooterActions = createComponent('div');
const GridSection = createComponent('div');
const GridInner = createComponent('div');
const GridSlot = createComponent('div');
const GridCardWrap = createComponent('div');
const SelectHit = createComponent('button');
const Region = createComponent('p');
const ContactImage = createComponent('img');
const Name = createComponent('h3');
const Department = createComponent('p');
const ContactsWrapper = createComponent('div');
const ContactLink = createComponent('a');
const CardTop = createComponent('div');
const CardBottom = createComponent('div');
const CardRow = createComponent('div');
const SocialLinksWrapper = createComponent('div');
const SocialLink = createComponent('a');
const BookDemoCta = createComponent('p');
const BookDemoCtaLink = createComponent('a');

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function SalesTeamIsland(props: SalesTeamProps) {
  const {
    bookDemo = false,
    groupBookDemoCta: {
      prefaceText: bookDemoCtaPrefaceText = 'Not your region?',
      linkText: bookDemoCtaLinkText = 'Contact our sales team',
      link: bookDemoCtaLinkField,
    } = {},
    hublData: { manualHubDbRowsRegional = [], featuredHubDbRow = null, featuredRowId = null } = {},
    groupStyle: {
      groupCard: { cardStyleVariant, showCardShadow = true, showCardBorder = true },
      groupLayout: { cardsAlignment, contentAlignment },
      groupButton: { buttonStyleVariant, buttonStyleSize },
    },
  } = props;

  const cssVarsMap = {
    ...generateColorCssVars(cardStyleVariant),
    ...generateAlignmentCssVars(cardsAlignment, contentAlignment),
  };

  const initialActiveId = useMemo(() => {
    if (bookDemo) {
      for (let i = 0; i < manualHubDbRowsRegional.length; i++) {
        const r = manualHubDbRowsRegional[i];
        if (r && isRegionalSalesRepRow(r)) {
          const id = getRowId(r);
          if (id != null) return id;
        }
      }
      return null;
    }

    if (featuredRowId != null && Number.isFinite(Number(featuredRowId))) {
      return Number(featuredRowId) as number;
    }
    const fromRow = getRowId(featuredHubDbRow);
    if (fromRow != null) return fromRow;
    for (let i = 0; i < manualHubDbRowsRegional.length; i++) {
      const r = manualHubDbRowsRegional[i];
      if (r && isRegionalSalesRepRow(r)) {
        const id = getRowId(r);
        if (id != null) return id;
      }
    }
    return null;
  }, [bookDemo, featuredHubDbRow, featuredRowId, manualHubDbRowsRegional]);

  const [activeRowId, setActiveRowId] = useState<string | number | null>(() => initialActiveId);
  const [featuredDimmed, setFeaturedDimmed] = useState(false);
  const featuredCardColRef = useRef<HTMLDivElement | null>(null);
  const [meetingFramePx, setMeetingFramePx] = useState<number | null>(null);

  useEffect(() => {
    const el = featuredCardColRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const h = entry.contentRect.height;
      if (!Number.isFinite(h) || h <= 0) return;
      setMeetingFramePx(Math.round(h));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [activeRowId]);

  const rowById = useMemo(() => {
    const m = new Map<string, unknown>();
    const add = (row: unknown) => {
      const id = getRowId(row);
      if (id != null) m.set(String(id), row);
    };
    if (featuredHubDbRow) add(featuredHubDbRow);
    for (const r of manualHubDbRowsRegional) {
      if (r) add(r);
    }
    return m;
  }, [featuredHubDbRow, manualHubDbRowsRegional]);

  const activeRow = useMemo(() => {
    if (activeRowId == null) return null;
    return rowById.get(String(activeRowId)) ?? null;
  }, [activeRowId, rowById]);

  const selectRep = useCallback(
    (row: unknown) => {
      const id = getRowId(row);
      if (id == null || rowIdsEqual(id, activeRowId)) return;

      const apply = () => setActiveRowId(id);
      if (prefersReducedMotion()) {
        apply();
        return;
      }
      setFeaturedDimmed(true);
      window.setTimeout(() => {
        apply();
        setFeaturedDimmed(false);
      }, 160);
    },
    [activeRowId],
  );

  const meetingSrc = activeRow ? getMeetingEmbedUrl(activeRow) : undefined;

  const rootStyleWithMeeting = useMemo((): CSSPropertiesMap => {
    const next: CSSPropertiesMap = { ...cssVarsMap };
    if (meetingFramePx != null) {
      next['--hsElevate--salesTeam__meetingFramePx'] = `${meetingFramePx}px`;
    }
    next['--hsElevate--salesTeam__bookDemoDesktopMeetingExtraPx'] = bookDemo ? '15px' : '0px';
    return next;
  }, [bookDemo, cssVarsMap, meetingFramePx]);

  const ctaHref = getLinkFieldHref(bookDemoCtaLinkField);
  const ctaRel = getLinkFieldRel(bookDemoCtaLinkField);
  const ctaTarget = getLinkFieldTarget(bookDemoCtaLinkField);
  const hasBookDemoCta = Boolean(
    bookDemo &&
      bookDemoCtaPrefaceText?.trim() &&
      bookDemoCtaLinkText?.trim() &&
      ctaHref?.trim(),
  );

  const renderHubCard = (hubRow: unknown, opts: { variant: 'featured' | 'grid'; gridPickLabel?: string }) => {
    const hubDbName = getHubDbString(hubRow, ['full_name', 'name', 'hs_name']);
    const hubDbDepartment = getHubDbString(hubRow, ['department', 'job_title', 'role']);
    const hubDbPhoneText = getHubDbString(hubRow, ['phone', 'phone_text', 'phone_number', 'mobile']);
    const hubDbPhoneLink = getHubDbString(hubRow, ['phone_link', 'phone_url']);
    const hubDbEmailText = getHubDbString(hubRow, ['email', 'email_text', 'email_address']);
    const hubDbEmailLink = getHubDbString(hubRow, ['email_link', 'email_url']);
    const hubDbButtonText = getHubDbString(hubRow, ['button_text', 'cta_text', 'button_label']);
    const hubDbButtonLink = getHubDbString(hubRow, ['button_link', 'button_url', 'cta_link']);
    const hubDbImageSrc = getHubDbImageSrc(hubRow, ['contact_image', 'image', 'photo', 'profile_image']);
    const hubDbShowRegion = getHubDbBoolean(hubRow, ['show_region']);
    const hubDbShowPhone = getHubDbBoolean(hubRow, ['show_phone']);
    const hubDbShowEmail = getHubDbBoolean(hubRow, ['show_email']);
    const hubDbShowSocial = getHubDbBoolean(hubRow, ['show_social_media']);
    const hubDbShowButton = getHubDbBoolean(hubRow, ['show_button']);
    const socialLabel = getHubDbString(hubRow, ['social_label']);
    const socialLink = getHubDbString(hubRow, ['social_link', 'social_url']);

    const regionLabel = getDisplayRegionLabel(hubRow);
    const showRegion = hubDbShowRegion !== false && Boolean(regionLabel);

    const effectivePhoneLink = createExternalLinkField(hubDbPhoneLink);
    const effectiveEmailLink = createExternalLinkField(hubDbEmailLink);
    const effectiveButtonLink = createExternalLinkField(hubDbButtonLink);

    const phoneHref = getFallbackOrLinkHref(hubDbPhoneText || '', getLinkFieldHref(effectivePhoneLink), 'phone');
    const emailHref = getFallbackOrLinkHref(hubDbEmailText || '', getLinkFieldHref(effectiveEmailLink), 'email');

    const hasPhone = Boolean(hubDbShowPhone !== false && hubDbPhoneText);
    const hasEmail = Boolean(hubDbShowEmail !== false && hubDbEmailText);
    const hasSocial = Boolean(hubDbShowSocial && socialLink && socialLabel);
    const hasButton = Boolean(!bookDemo && hubDbShowButton !== false && hubDbButtonText);
    const shouldRenderCardBottom = hasPhone || hasEmail || hasSocial || hasButton;

    const cardInlineStyles: CSSPropertiesMap | undefined = showCardBorder ? undefined : { border: 'none' };

    const cardInner = (
      <Card
        cardStyleVariant={cardStyleVariant}
        cardOrientation="column"
        inlineStyles={cardInlineStyles}
        additionalClassArray={[
          swm('hs-elevate-sales-team__card'),
          showCardShadow ? swm('hs-elevate-sales-team__card--drop-shadow') : '',
        ]}
      >
        <CardTop
          className={cx(swm('hs-elevate-sales-team__card-top'), {
            [swm('hs-elevate-sales-team__card-top--without-region')]: !showRegion,
          })}
        >
          {showRegion && regionLabel && (
            <Region className={swm('hs-elevate-sales-team__region')}>{regionLabel}</Region>
          )}

          {hubDbImageSrc && (
            <ContactImage
              className={swm('hs-elevate-sales-team__image')}
              src={hubDbImageSrc}
              alt={hubDbName || 'Contact image'}
              loading="lazy"
            />
          )}

          {hubDbName && <Name className={swm('hs-elevate-sales-team__name')}>{hubDbName}</Name>}

          {hubDbDepartment && (
            <Department className={swm('hs-elevate-sales-team__department')}>{hubDbDepartment}</Department>
          )}
        </CardTop>

        {shouldRenderCardBottom && (
          <CardBottom className={swm('hs-elevate-sales-team__card-bottom')}>
            {hasPhone && (
              <CardRow className={swm('hs-elevate-sales-team__row hs-elevate-sales-team__row--phone')}>
                <ContactsWrapper className={swm('hs-elevate-sales-team__contacts')}>
                  <ContactLink
                    className={cx(swm('hs-elevate-sales-team__contact-link'), swm('hs-elevate-sales-team__interactive'))}
                    href={phoneHref}
                    rel={getLinkFieldRel(effectivePhoneLink)}
                    target={getLinkFieldTarget(effectivePhoneLink)}
                  >
                    {hubDbPhoneText}
                  </ContactLink>
                </ContactsWrapper>
              </CardRow>
            )}

            {hasEmail && (
              <CardRow className={swm('hs-elevate-sales-team__row hs-elevate-sales-team__row--email')}>
                <ContactsWrapper className={swm('hs-elevate-sales-team__contacts')}>
                  <div className={swm('hs-elevate-sales-team__email-row')}>
                    <ContactLink
                      className={cx(
                        swm('hs-elevate-sales-team__contact-link'),
                        swm('hs-elevate-sales-team__contact-link--small'),
                        swm('hs-elevate-sales-team__contact-link--email'),
                        swm('hs-elevate-sales-team__interactive'),
                      )}
                      href={emailHref}
                      rel={getLinkFieldRel(effectiveEmailLink)}
                      target={getLinkFieldTarget(effectiveEmailLink)}
                    >
                      {hubDbEmailText}
                    </ContactLink>
                    <button
                      type="button"
                      className={cx(swm('hs-elevate-sales-team__copy-email-button'), swm('hs-elevate-sales-team__interactive'))}
                      onClick={() => {
                        void copyTextToClipboard(hubDbEmailText || '');
                      }}
                      aria-label={`Copy email ${hubDbEmailText}`}
                    />
                  </div>
                </ContactsWrapper>
              </CardRow>
            )}

            {hasSocial && socialLink && socialLabel && (
              <CardRow className={swm('hs-elevate-sales-team__row hs-elevate-sales-team__row--social')}>
                <SocialLinksWrapper className={swm('hs-elevate-sales-team__social')}>
                  <SocialLink
                    className={cx(swm('hs-elevate-sales-team__social-link'), swm('hs-elevate-sales-team__interactive'))}
                    href={socialLink}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {socialLabel}
                  </SocialLink>
                </SocialLinksWrapper>
              </CardRow>
            )}

            {hasButton && (
              <CardRow className={swm('hs-elevate-sales-team__row hs-elevate-sales-team__row--button')}>
                <Button
                  additionalClassArray={[swm('hs-elevate-sales-team__button')]}
                  buttonStyle={buttonStyleVariant}
                  buttonSize={buttonStyleSize}
                  href={getLinkFieldHref(effectiveButtonLink) || '#'}
                  rel={getLinkFieldRel(effectiveButtonLink) || ''}
                  target={getLinkFieldTarget(effectiveButtonLink) || '_self'}
                  showIcon={false}
                >
                  {hubDbButtonText}
                </Button>
              </CardRow>
            )}
          </CardBottom>
        )}
      </Card>
    );

    if (opts.variant === 'grid') {
      const rid = getRowId(hubRow);
      const label =
        opts.gridPickLabel ||
        (hubDbName ? `Select ${hubDbName} to book a meeting` : 'Select this rep to book a meeting');
      return (
        <GridCardWrap className={swm('hs-elevate-sales-team__grid-card')}>
          <SelectHit
            type="button"
            className={swm('hs-elevate-sales-team__grid-card-select-hit')}
            aria-label={label}
            onClick={() => selectRep(hubRow)}
          />
          <div className={swm('hs-elevate-sales-team__grid-card-surface')}>{cardInner}</div>
        </GridCardWrap>
      );
    }

    return cardInner;
  };

  if (!activeRow) {
    return (
      <Root
        className={cx(swm('hs-elevate-sales-team'), {
          [swm('hs-elevate-sales-team--book-demo')]: bookDemo,
        })}
        style={cssVarsMap}
      >
        <p className={swm('hs-elevate-sales-team__empty')}>No sales rep data available.</p>
      </Root>
    );
  }

  return (
    <Root
      className={cx(swm('hs-elevate-sales-team'), {
        [swm('hs-elevate-sales-team--book-demo')]: bookDemo,
      })}
      style={rootStyleWithMeeting}
    >
      <FeaturedRow className={swm('hs-elevate-sales-team__featured-row')}>
        <FeaturedCardCol
          className={cx(swm('hs-elevate-sales-team__featured-card'), {
            [swm('hs-elevate-sales-team__featured-card--dim')]: featuredDimmed,
          })}
        >
          <div ref={featuredCardColRef} className={swm('hs-elevate-sales-team__featured-card-measure')}>
            {renderHubCard(activeRow, { variant: 'featured' })}
          </div>
          {hasBookDemoCta && (
            <BookDemoCta className={swm('hs-elevate-sales-team__book-demo-cta')}>
              {bookDemoCtaPrefaceText}{' '}
              <BookDemoCtaLink
                className={swm('hs-elevate-sales-team__book-demo-cta-link')}
                href={ctaHref}
                rel={ctaRel || undefined}
                target={ctaTarget || undefined}
              >
                {bookDemoCtaLinkText}
              </BookDemoCtaLink>
            </BookDemoCta>
          )}
        </FeaturedCardCol>
        <MeetingCol className={swm('hs-elevate-sales-team__meeting-col')}>
          <MeetingFrameWrap
            className={cx(swm('hs-elevate-sales-team__meeting-frame'), {
              [swm('hs-elevate-sales-team__featured-card--dim')]: featuredDimmed,
            })}
          >
            {meetingSrc ? (
              <MeetingIframe
                key={String(activeRowId)}
                className={swm('hs-elevate-sales-team__meeting-iframe')}
                src={meetingSrc}
                title="Book a meeting"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className={swm('hs-elevate-sales-team__meeting-placeholder')}>
                Add a Meetings embed URL (iframe src) in HubDB for this rep.
              </div>
            )}
          </MeetingFrameWrap>
          {(meetingSrc || hasBookDemoCta) && (
            <MeetingFooterActions className={swm('hs-elevate-sales-team__meeting-footer-actions')}>
              {meetingSrc && (
                <MeetingFallbackLink
                  className={swm('hs-elevate-sales-team__meeting-fallback-link')}
                  href={meetingSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open meeting in a new tab
                </MeetingFallbackLink>
              )}
              {hasBookDemoCta && (
                <BookDemoCta
                  className={cx(
                    swm('hs-elevate-sales-team__book-demo-cta'),
                    swm('hs-elevate-sales-team__book-demo-cta--meeting-footer-only'),
                  )}
                >
                  {bookDemoCtaPrefaceText}{' '}
                  <BookDemoCtaLink
                    className={swm('hs-elevate-sales-team__book-demo-cta-link')}
                    href={ctaHref}
                    rel={ctaRel || undefined}
                    target={ctaTarget || undefined}
                  >
                    {bookDemoCtaLinkText}
                  </BookDemoCtaLink>
                </BookDemoCta>
              )}
            </MeetingFooterActions>
          )}
        </MeetingCol>
      </FeaturedRow>

      {!bookDemo && (
        <GridSection className={swm('hs-elevate-sales-team__grid-section')}>
          <GridInner className={swm('hs-elevate-sales-team__grid-inner')}>
            {manualHubDbRowsRegional.map((hubRow, index) => {
              if (!hubRow || !hasHubDbRowData(hubRow)) return null;
              if (!isRegionalSalesRepRow(hubRow)) return null;
              const rid = getRowId(hubRow);
              const isActiveSlot = rid != null && rowIdsEqual(rid, activeRowId);
              const slotKey = rid != null ? `rep-${String(rid)}` : `slot-${index}`;

              if (isActiveSlot) {
                return (
                  <GridSlot
                    key={slotKey}
                    className={cx(
                      swm('hs-elevate-sales-team__grid-slot'),
                      swm('hs-elevate-sales-team__grid-slot--hidden-active'),
                    )}
                    aria-hidden
                    tabIndex={-1}
                  />
                );
              }

              return (
                <GridSlot key={slotKey} className={swm('hs-elevate-sales-team__grid-slot')}>
                  {renderHubCard(hubRow, { variant: 'grid' })}
                </GridSlot>
              );
            })}
          </GridInner>
        </GridSection>
      )}
    </Root>
  );
}
