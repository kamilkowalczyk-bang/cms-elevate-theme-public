import { Icon } from '@hubspot/cms-components';
import { AlignmentFieldType } from '@hubspot/cms-components/fields';
import { ModuleMeta } from '../../types/modules.js';
import { Card } from '../../CardComponent/index.js';
import { Button } from '../../ButtonComponent/index.js';
import {
  getLinkFieldHref,
  getLinkFieldRel,
  getLinkFieldTarget,
} from '../../utils/content-fields.js';
import { getAlignmentFieldCss } from '../../utils/style-fields.js';
import { getDataHSToken } from '../../utils/inline-editing.js';
import { createComponent } from '../../utils/create-component.js';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { CSSPropertiesMap } from '../../types/components.js';
import cardIconSvg from '../Card/assets/card-icon-temp.svg';
import { ContactCardProps } from './types.js';
import styles from './contact-card.module.css';

const swm = staticWithModule(styles);

function generateColorCssVars(cardVariantField: string): CSSPropertiesMap {
  const cardColorsMap = {
    card_variant_1: {
      textColor: 'var(--hsElevate--card--variant1__textColor)',
      accentColor: 'var(--hsElevate--card--variant1__iconColor)',
    },
    card_variant_2: {
      textColor: 'var(--hsElevate--card--variant2__textColor)',
      accentColor: 'var(--hsElevate--card--variant2__iconColor)',
    },
    card_variant_3: {
      textColor: 'var(--hsElevate--card--variant3__textColor)',
      accentColor: 'var(--hsElevate--card--variant3__iconColor)',
    },
    card_variant_4: {
      textColor: 'var(--hsElevate--card--variant4__textColor)',
      accentColor: 'var(--hsElevate--card--variant4__iconColor)',
    },
  };

  return {
    '--hsElevate--contactCard__textColor': cardColorsMap[cardVariantField].textColor,
    '--hsElevate--contactCard__accentColor': cardColorsMap[cardVariantField].accentColor,
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

const ContactCardsContainer = createComponent('div');
const Region = createComponent('p');
const ContactImage = createComponent('img');
const Name = createComponent('h3');
const Department = createComponent('p');
const ContactsWrapper = createComponent('div');
const ContactLink = createComponent('a');
const SocialLinksWrapper = createComponent('div');
const SocialLink = createComponent('a');

export const Component = (props: ContactCardProps) => {
  const {
    moduleName,
    groupContactCards,
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

  return (
    <ContactCardsContainer className={swm('hs-elevate-contact-card-container')} style={cssVarsMap}>
      {groupContactCards.map((card, index) => {
        const {
          groupRegion,
          groupIdentity,
          groupPhone,
          groupEmail,
          groupSocial,
          groupButton,
        } = card;

        const phoneHref = getFallbackOrLinkHref(
          groupPhone?.phoneText || '',
          getLinkFieldHref(groupPhone?.phoneLink),
          'phone',
        );
        const emailHref = getFallbackOrLinkHref(
          groupEmail?.emailText || '',
          getLinkFieldHref(groupEmail?.emailLink),
          'email',
        );

        const cardInlineStyles: CSSPropertiesMap | undefined = showCardBorder ? undefined : { border: 'none' };

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
            <div>
              {groupRegion?.showRegion && groupRegion?.region && (
                <Region
                  className={swm('hs-elevate-contact-card-container__region')}
                  data-hs-token={getDataHSToken(moduleName, `groupContactCards[${index}].groupRegion.region`)}
                >
                  {groupRegion.region}
                </Region>
              )}

              {groupIdentity?.contactImage?.src && (
                <ContactImage
                  className={swm('hs-elevate-contact-card-container__image')}
                  src={groupIdentity.contactImage.src}
                  alt={groupIdentity.contactImage.alt || groupIdentity.fullName || 'Contact image'}
                  width={groupIdentity.contactImage.width}
                  height={groupIdentity.contactImage.height}
                  loading={groupIdentity.contactImage.loading !== 'disabled' ? groupIdentity.contactImage.loading : 'eager'}
                  data-hs-token={getDataHSToken(moduleName, `groupContactCards[${index}].groupIdentity.contactImage`)}
                />
              )}

              {groupIdentity?.fullName && (
                <Name
                  className={swm('hs-elevate-contact-card-container__name')}
                  data-hs-token={getDataHSToken(moduleName, `groupContactCards[${index}].groupIdentity.fullName`)}
                >
                  {groupIdentity.fullName}
                </Name>
              )}

              {groupIdentity?.department && (
                <Department
                  className={swm('hs-elevate-contact-card-container__department')}
                  data-hs-token={getDataHSToken(moduleName, `groupContactCards[${index}].groupIdentity.department`)}
                >
                  {groupIdentity.department}
                </Department>
              )}
            </div>

            <div>
              <ContactsWrapper className={swm('hs-elevate-contact-card-container__contacts')}>
                {groupPhone?.showPhone && groupPhone?.phoneText && (
                  <ContactLink
                    className={swm('hs-elevate-contact-card-container__contact-link')}
                    href={phoneHref}
                    rel={getLinkFieldRel(groupPhone.phoneLink)}
                    target={getLinkFieldTarget(groupPhone.phoneLink)}
                    data-hs-token={getDataHSToken(moduleName, `groupContactCards[${index}].groupPhone.phoneText`)}
                  >
                    {groupPhone.phoneText}
                  </ContactLink>
                )}
                {groupEmail?.showEmail && groupEmail?.emailText && (
                  <ContactLink
                    className={cx(
                      swm('hs-elevate-contact-card-container__contact-link'),
                      swm('hs-elevate-contact-card-container__contact-link--small'),
                    )}
                    href={emailHref}
                    rel={getLinkFieldRel(groupEmail.emailLink)}
                    target={getLinkFieldTarget(groupEmail.emailLink)}
                    data-hs-token={getDataHSToken(moduleName, `groupContactCards[${index}].groupEmail.emailText`)}
                  >
                    {groupEmail.emailText}
                  </ContactLink>
                )}
              </ContactsWrapper>

              {groupSocial?.showSocialMedia && groupSocial?.groupSocialLinks?.length > 0 && (
                <SocialLinksWrapper className={swm('hs-elevate-contact-card-container__social')}>
                  {groupSocial.groupSocialLinks.map((socialLink, socialIndex) => (
                    <SocialLink
                      key={socialIndex}
                      className={swm('hs-elevate-contact-card-container__social-link')}
                      href={getLinkFieldHref(socialLink.socialLink)}
                      rel={getLinkFieldRel(socialLink.socialLink)}
                      target={getLinkFieldTarget(socialLink.socialLink)}
                    >
                      <Icon
                        purpose='DECORATIVE'
                        fieldPath={`groupContactCards[${index}].groupSocial.groupSocialLinks[${socialIndex}].socialIcon`}
                      />
                      {socialLink.socialLabel}
                    </SocialLink>
                  ))}
                </SocialLinksWrapper>
              )}

              {groupButton.showButton && (
                <Button
                  additionalClassArray={[swm('hs-elevate-contact-card-container__button')]}
                  buttonStyle={buttonStyleVariant}
                  buttonSize={buttonStyleSize}
                  href={getLinkFieldHref(groupButton.buttonContentLink)}
                  rel={getLinkFieldRel(groupButton.buttonContentLink)}
                  target={getLinkFieldTarget(groupButton.buttonContentLink)}
                  iconFieldPath={`groupContactCards[${index}].groupButton.buttonContentIcon`}
                  showIcon={groupButton.buttonContentShowIcon}
                  iconPosition={groupButton.buttonContentIconPosition}
                  moduleName={moduleName}
                  textFieldPath={`groupContactCards[${index}].groupButton.buttonContentText`}
                >
                  {groupButton.buttonContentText}
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </ContactCardsContainer>
  );
};

export { fields } from './fields.js';

export const meta: ModuleMeta = {
  label: 'Contact card',
  content_types: ['SITE_PAGE', 'LANDING_PAGE', 'CASE_STUDY'],
  icon: cardIconSvg,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/contact_card',
  version: 0,
  themeModule: true,
};
