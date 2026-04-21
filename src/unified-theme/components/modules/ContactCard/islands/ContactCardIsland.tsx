import { Icon } from '@hubspot/cms-components';
import { AlignmentFieldType } from '@hubspot/cms-components/fields';
import { Card } from '../../../CardComponent/index.js';
import { Button } from '../../../ButtonComponent/index.js';
import {
  getLinkFieldHref,
  getLinkFieldRel,
  getLinkFieldTarget,
} from '../../../utils/content-fields.js';
import { getAlignmentFieldCss } from '../../../utils/style-fields.js';
import { getDataHSToken } from '../../../utils/inline-editing.js';
import { createComponent } from '../../../utils/create-component.js';
import cx, { staticWithModule } from '../../../utils/classnames.js';
import { CSSPropertiesMap } from '../../../types/components.js';
import { ContactCardProps } from '../types.js';
import styles from '../contact-card.module.css';

const swm = staticWithModule(styles);

function generateColorCssVars(cardVariantField: string): CSSPropertiesMap {
  const cardColorsMap = {
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

  return {
    '--hsElevate--contactCard__textColor': cardColorsMap[cardVariantField].textColor,
    '--hsElevate--contactCard__accentColor': cardColorsMap[cardVariantField].accentColor,
    '--hsElevate--contactCard__linkColor': cardColorsMap[cardVariantField].linkColor,
    '--hsElevate--contactCard__linkHoverColor': cardColorsMap[cardVariantField].linkHoverColor,
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
    '--hsElevate--contactCard__containerAlignment': cardsAlignmentCss.justifyContent || 'center',
    '--hsElevate--contactCard__innerAlignment': contentAlignmentCss.justifyContent || 'center',
    '--hsElevate--contactCard__innerTextAlignment': contentTextAlign,
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
    getHubDbString(row, ['email', 'email_address']) ||
    getHubDbString(row, ['phone', 'phone_number']),
  );
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

const ContactCardsContainer = createComponent('div');
const Region = createComponent('p');
const ContactImage = createComponent('img');
const Name = createComponent('h3');
const Department = createComponent('p');
const ContactsWrapper = createComponent('div');
const ContactLink = createComponent('a');
const SocialLinksWrapper = createComponent('div');
const SocialLink = createComponent('a');
const CardTop = createComponent('div');
const CardBottom = createComponent('div');
const CardRow = createComponent('div');

export default function ContactCardIsland(props: ContactCardProps) {
  const {
    moduleName,
    useHubDB = false,
    groupContactCards,
    hublData: { manualHubDbRows = [] } = {},
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
  const inlineModuleName = useHubDB ? undefined : moduleName;

  return (
    <ContactCardsContainer className={swm('hs-elevate-contact-card-container')} style={cssVarsMap}>
      {groupContactCards.map((card, index) => {
        const {
          groupHubdbRow,
          groupRegion,
          groupIdentity,
          groupPhone,
          groupEmail,
          groupSocial,
          groupButton,
        } = card;

        const hubDbSource = useHubDB ? (manualHubDbRows[index] ?? groupHubdbRow) : undefined;
        const isHubDbCard = useHubDB && hasHubDbRowData(hubDbSource);
        const hubDbName = getHubDbString(hubDbSource, ['full_name', 'name', 'hs_name']);
        const hubDbDepartment = getHubDbString(hubDbSource, ['department', 'job_title', 'role']);
        const hubDbRegion = getHubDbString(hubDbSource, ['region', 'country_region', 'location']);
        const hubDbPhoneText = getHubDbString(hubDbSource, ['phone', 'phone_number', 'mobile']);
        const hubDbPhoneLink = getHubDbString(hubDbSource, ['phone_link', 'phone_url']);
        const hubDbEmailText = getHubDbString(hubDbSource, ['email', 'email_address']);
        const hubDbEmailLink = getHubDbString(hubDbSource, ['email_link', 'email_url']);
        const hubDbButtonText = getHubDbString(hubDbSource, ['button_text', 'cta_text', 'button_label']);
        const hubDbButtonLink = getHubDbString(hubDbSource, ['button_link', 'button_url', 'cta_link']);
        const hubDbImageSrc = getHubDbImageSrc(hubDbSource, ['contact_image', 'image', 'photo', 'profile_image']);
        const hubDbShowRegion = getHubDbBoolean(hubDbSource, ['show_region']);
        const hubDbShowPhone = getHubDbBoolean(hubDbSource, ['show_phone']);
        const hubDbShowEmail = getHubDbBoolean(hubDbSource, ['show_email']);
        const hubDbShowSocial = getHubDbBoolean(hubDbSource, ['show_social_media']);
        const hubDbShowButton = getHubDbBoolean(hubDbSource, ['show_button']);

        const effectiveRegion = {
          ...groupRegion,
          showRegion: isHubDbCard ? (hubDbShowRegion ?? groupRegion?.showRegion) : groupRegion?.showRegion,
          region: isHubDbCard ? (hubDbRegion ?? groupRegion?.region) : groupRegion?.region,
        };
        const effectiveIdentity = {
          ...groupIdentity,
          fullName: isHubDbCard ? (hubDbName ?? groupIdentity?.fullName) : groupIdentity?.fullName,
          department: isHubDbCard ? (hubDbDepartment ?? groupIdentity?.department) : groupIdentity?.department,
          contactImage: isHubDbCard && hubDbImageSrc
            ? {
              ...groupIdentity?.contactImage,
              src: hubDbImageSrc,
            }
            : groupIdentity?.contactImage,
        };
        const effectivePhoneLink = isHubDbCard
          ? (createExternalLinkField(hubDbPhoneLink) ?? groupPhone?.phoneLink)
          : groupPhone?.phoneLink;
        const effectiveEmailLink = isHubDbCard
          ? (createExternalLinkField(hubDbEmailLink) ?? groupEmail?.emailLink)
          : groupEmail?.emailLink;
        const effectivePhone = {
          ...groupPhone,
          showPhone: isHubDbCard ? (hubDbShowPhone ?? groupPhone?.showPhone) : groupPhone?.showPhone,
          phoneText: isHubDbCard ? (hubDbPhoneText ?? groupPhone?.phoneText) : groupPhone?.phoneText,
          phoneLink: effectivePhoneLink,
        };
        const effectiveEmail = {
          ...groupEmail,
          showEmail: isHubDbCard ? (hubDbShowEmail ?? groupEmail?.showEmail) : groupEmail?.showEmail,
          emailText: isHubDbCard ? (hubDbEmailText ?? groupEmail?.emailText) : groupEmail?.emailText,
          emailLink: effectiveEmailLink,
        };
        const effectiveSocial = {
          ...groupSocial,
          showSocialMedia: isHubDbCard ? (hubDbShowSocial ?? false) : groupSocial?.showSocialMedia,
        };
        const effectiveButton = {
          ...groupButton,
          showButton: isHubDbCard ? (hubDbShowButton ?? groupButton?.showButton) : groupButton?.showButton,
          buttonContentText: isHubDbCard ? (hubDbButtonText ?? groupButton?.buttonContentText) : groupButton?.buttonContentText,
          buttonContentLink: isHubDbCard
            ? (createExternalLinkField(hubDbButtonLink) ?? groupButton?.buttonContentLink)
            : groupButton?.buttonContentLink,
        };

        const phoneHref = getFallbackOrLinkHref(
          effectivePhone?.phoneText || '',
          getLinkFieldHref(effectivePhone?.phoneLink),
          'phone',
        );
        const emailHref = getFallbackOrLinkHref(
          effectiveEmail?.emailText || '',
          getLinkFieldHref(effectiveEmail?.emailLink),
          'email',
        );

        const cardInlineStyles: CSSPropertiesMap | undefined = showCardBorder ? undefined : { border: 'none' };
        const hasPhone = Boolean(effectivePhone?.showPhone && effectivePhone?.phoneText);
        const hasEmail = Boolean(effectiveEmail?.showEmail && effectiveEmail?.emailText);
        const hasSocial = Boolean(effectiveSocial?.showSocialMedia && effectiveSocial?.groupSocialLinks?.length > 0);
        const hasButton = Boolean(effectiveButton?.showButton);
        const hasRegion = Boolean(effectiveRegion?.showRegion && effectiveRegion?.region);
        const visibleInfoRowsCount = Number(hasPhone) + Number(hasEmail) + Number(hasSocial);
        const shouldEvenlyDistributeSingleInfoRow = !hasButton && visibleInfoRowsCount === 1;
        const shouldRenderCardBottom = hasPhone || hasEmail || hasSocial || hasButton;

        return (
          <Card
            key={index}
            cardStyleVariant={cardStyleVariant}
            cardOrientation='column'
            inlineStyles={cardInlineStyles}
            additionalClassArray={[
              swm('hs-elevate-contact-card-container__card'),
              showCardShadow ? swm('hs-elevate-contact-card-container__card--drop-shadow') : '',
            ]}
          >
            <CardTop
              className={cx(
                swm('hs-elevate-contact-card-container__card-top'),
                {
                  [swm('hs-elevate-contact-card-container__card-top--without-region')]: !hasRegion,
                },
              )}
            >
              {hasRegion && (
                <Region
                  className={swm('hs-elevate-contact-card-container__region')}
                  data-hs-token={getDataHSToken(inlineModuleName, `groupContactCards[${index}].groupRegion.region`)}
                >
                  {effectiveRegion.region}
                </Region>
              )}

              {effectiveIdentity?.contactImage?.src && (
                <ContactImage
                  className={swm('hs-elevate-contact-card-container__image')}
                  src={effectiveIdentity.contactImage.src}
                  alt={effectiveIdentity.contactImage.alt || effectiveIdentity.fullName || 'Contact image'}
                  width={effectiveIdentity.contactImage.width}
                  height={effectiveIdentity.contactImage.height}
                  loading={effectiveIdentity.contactImage.loading !== 'disabled' ? effectiveIdentity.contactImage.loading : 'eager'}
                  data-hs-token={getDataHSToken(inlineModuleName, `groupContactCards[${index}].groupIdentity.contactImage`)}
                />
              )}

              {effectiveIdentity?.fullName && (
                <Name
                  className={swm('hs-elevate-contact-card-container__name')}
                  data-hs-token={getDataHSToken(inlineModuleName, `groupContactCards[${index}].groupIdentity.fullName`)}
                >
                  {effectiveIdentity.fullName}
                </Name>
              )}

              {effectiveIdentity?.department && (
                <Department
                  className={swm('hs-elevate-contact-card-container__department')}
                  data-hs-token={getDataHSToken(inlineModuleName, `groupContactCards[${index}].groupIdentity.department`)}
                >
                  {effectiveIdentity.department}
                </Department>
              )}
            </CardTop>

            {shouldRenderCardBottom && (
              <CardBottom
                className={cx(
                  swm('hs-elevate-contact-card-container__card-bottom'),
                  {
                    [swm('hs-elevate-contact-card-container__card-bottom--single-info-row')]:
                      shouldEvenlyDistributeSingleInfoRow,
                  },
                )}
              >
                {hasPhone && (
                  <CardRow className={swm('hs-elevate-contact-card-container__row hs-elevate-contact-card-container__row--phone')}>
                  <ContactsWrapper className={swm('hs-elevate-contact-card-container__contacts')}>
                    <ContactLink
                      className={swm('hs-elevate-contact-card-container__contact-link')}
                      href={phoneHref}
                      rel={getLinkFieldRel(effectivePhone.phoneLink)}
                      target={getLinkFieldTarget(effectivePhone.phoneLink)}
                      data-hs-token={getDataHSToken(inlineModuleName, `groupContactCards[${index}].groupPhone.phoneText`)}
                    >
                      {effectivePhone.phoneText}
                    </ContactLink>
                  </ContactsWrapper>
                  </CardRow>
                )}

                {hasEmail && (
                  <CardRow className={swm('hs-elevate-contact-card-container__row hs-elevate-contact-card-container__row--email')}>
                  <ContactsWrapper className={swm('hs-elevate-contact-card-container__contacts')}>
                    <div className={swm('hs-elevate-contact-card-container__email-row')}>
                      <ContactLink
                        className={cx(
                          swm('hs-elevate-contact-card-container__contact-link'),
                          swm('hs-elevate-contact-card-container__contact-link--small'),
                          swm('hs-elevate-contact-card-container__contact-link--email'),
                        )}
                        href={emailHref}
                        rel={getLinkFieldRel(effectiveEmail.emailLink)}
                        target={getLinkFieldTarget(effectiveEmail.emailLink)}
                        data-hs-token={getDataHSToken(inlineModuleName, `groupContactCards[${index}].groupEmail.emailText`)}
                      >
                        {effectiveEmail.emailText}
                      </ContactLink>
                      <button
                        type="button"
                        className={swm('hs-elevate-contact-card-container__copy-email-button')}
                        onClick={() => {
                          void copyTextToClipboard(effectiveEmail.emailText);
                        }}
                        aria-label={`Copy email ${effectiveEmail.emailText}`}
                      />
                    </div>
                  </ContactsWrapper>
                  </CardRow>
                )}

                {hasSocial && (
                  <CardRow className={swm('hs-elevate-contact-card-container__row hs-elevate-contact-card-container__row--social')}>
                  <SocialLinksWrapper className={swm('hs-elevate-contact-card-container__social')}>
                    {effectiveSocial.groupSocialLinks.map((socialLink, socialIndex) => (
                      <SocialLink
                        key={socialIndex}
                        className={swm('hs-elevate-contact-card-container__social-link')}
                        href={getLinkFieldHref(socialLink.socialLink)}
                        rel={getLinkFieldRel(socialLink.socialLink)}
                        target={getLinkFieldTarget(socialLink.socialLink)}
                      >
                        <Icon
                          purpose='DECORATIVE'
                          fieldPath={!useHubDB ? `groupContactCards[${index}].groupSocial.groupSocialLinks[${socialIndex}].socialIcon` : undefined}
                        />
                        {socialLink.socialLabel}
                      </SocialLink>
                    ))}
                  </SocialLinksWrapper>
                  </CardRow>
                )}

                {hasButton && (
                  <CardRow className={swm('hs-elevate-contact-card-container__row hs-elevate-contact-card-container__row--button')}>
                    <Button
                      additionalClassArray={[swm('hs-elevate-contact-card-container__button')]}
                      buttonStyle={buttonStyleVariant}
                      buttonSize={buttonStyleSize}
                      href={getLinkFieldHref(effectiveButton.buttonContentLink)}
                      rel={getLinkFieldRel(effectiveButton.buttonContentLink)}
                      target={getLinkFieldTarget(effectiveButton.buttonContentLink)}
                      iconFieldPath={!useHubDB ? `groupContactCards[${index}].groupButton.buttonContentIcon` : undefined}
                      showIcon={effectiveButton.buttonContentShowIcon}
                      iconPosition={effectiveButton.buttonContentIconPosition}
                      moduleName={inlineModuleName}
                      textFieldPath={!useHubDB ? `groupContactCards[${index}].groupButton.buttonContentText` : undefined}
                    >
                      {effectiveButton.buttonContentText}
                    </Button>
                  </CardRow>
                )}
              </CardBottom>
            )}
          </Card>
        );
      })}
    </ContactCardsContainer>
  );
}
