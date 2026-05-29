import { ModuleMeta } from '../../types/modules.js';
import { Icon, usePageUrl } from '@hubspot/cms-components';
import socialIconSvg from './assets/social-follow.svg';
import { TextFieldType, AlignmentFieldType, IconFieldType, ImageFieldType, BooleanFieldType } from '@hubspot/cms-components/fields';
import { StandardSizeType, ButtonStyleType } from '../../types/fields.js';
import { getAlignmentFieldCss } from '../../utils/style-fields.js';
import { ButtonStyleFieldLibraryType } from '../../fieldLibrary/ButtonStyle/types.js';
import styles from './social-share.module.css';
import { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { CSSPropertiesMap } from '../../types/components.js';

const swm = staticWithModule(styles);

// Types

type ShapeOption = 'square' | 'rounded' | 'circle';
type SizeOption = StandardSizeType;
type BorderOption = 'default' | 'none';

type DefaultTextProps = {
  twitterLinkAriaLabel: TextFieldType['default'];
  facebookLinkAriaLabel: TextFieldType['default'];
  linkedinLinkAriaLabel: TextFieldType['default'];
  pinterestLinkAriaLabel: TextFieldType['default'];
  emailLinkAriaLabel: TextFieldType['default'];
};

type SocialShareProps = {
  open_in_new_tab?: BooleanFieldType['default'];
  platforms: ('twitter' | 'facebook' | 'linkedin' | 'pinterest' | 'email')[];
  customPlatforms?: {
    platformLabel?: TextFieldType['default'];
    urlTemplate?: TextFieldType['default'];
    ariaLabel?: TextFieldType['default'];
    iconSource?: 'icon' | 'image';
    icon?: IconFieldType['default'];
    image?: ImageFieldType['default'];
  }[];
  groupDefaultText: DefaultTextProps;
  groupStyle: ButtonStyleFieldLibraryType & {
    shape: ShapeOption;
    spaceBetweenIcons: StandardSizeType;
    alignment: AlignmentFieldType['default'];
    iconBorder?: BorderOption;
  };
};

// Functions to pull in corresponding CSS variables on component based on field values

function generateIconSizeAndPaddingCssVars(iconSizeField: StandardSizeType): CSSPropertiesMap {
  const iconSizing = {
    small: {
      padding: 'var(--hsElevate--spacing--10, 10px)',
      iconSize: 'var(--hsElevate--icon--small__size)',
    },
    medium: {
      padding: 'var(--hsElevate--spacing--14, 14px)',
      iconSize: 'var(--hsElevate--icon--medium__size)',
    },
    large: {
      padding: 'var(--hsElevate--spacing--18, 18px)',
      iconSize: 'var(--hsElevate--icon--large__size)',
    },
  };

  return {
    '--hsElevate--socialShareIcon__padding': iconSizing[iconSizeField].padding,
    '--hsElevate--socialShareIcon__size': iconSizing[iconSizeField].iconSize,
  };
}

function generateIconShapeCssVars(iconShapeField: ShapeOption): CSSPropertiesMap {
  const iconShapeMap = {
    square: 'var(--hsElevate-sharp)',
    rounded: 'var(--hsElevate-rounded)',
    circle: 'var(--hsElevate-circle)',
  };

  return {
    '--hsElevate--socialShareIcon__shape': iconShapeMap[iconShapeField],
  };
}

function generateIconGapCssVars(iconGapField: SizeOption): CSSPropertiesMap {
  const iconGapMap = {
    small: 'var(--hsElevate--spacing--12, 12px)',
    medium: 'var(--hsElevate--spacing--24, 24px)',
    large: 'var(--hsElevate--spacing--48, 48px)',
  };

  return {
    '--hsElevate--socialShareIcon__gap': iconGapMap[iconGapField],
  };
}

function generateButtonStyles(buttonStyleVariant: ButtonStyleType): CSSPropertiesMap {
  const iconStyles = {
    primary: {
      backgroundColor: 'var(--hsElevate--socialShareIcon__backgroundColorOverride, transparent)',
      textColor: 'var(--hsElevate--button--primary__textColor)',
      borderColor: 'var(--hsElevate--button--primary__borderColor)',
      borderWidth: 'var(--hsElevate--button--primary__borderThickness)',
      hoverBackgroundColor: 'var(--hsElevate--socialShareIcon__hover--backgroundColorOverride, transparent)',
      hoverTextColor: 'var(--hsElevate--button--primary__hover--textColor)',
      hoverBorderColor: 'var(--hsElevate--button--primary__hover--borderColor)',
      hoverBorderWidth: 'var(--hsElevate--button--primary__hover--borderThickness)',
      activeBackgroundColor: 'var(--hsElevate--socialShareIcon__active--backgroundColorOverride, transparent)',
      activeTextColor: 'var(--hsElevate--button--primary__active--textColor)',
      activeBorderColor: 'var(--hsElevate--button--primary__active--borderColor)',
      activeBorderWidth: 'var(--hsElevate--button--primary__active--borderThickness)',
    },
    secondary: {
      backgroundColor: 'var(--hsElevate--socialShareIcon__backgroundColorOverride, transparent)',
      textColor: 'var(--hsElevate--button--secondary__textColor)',
      borderColor: 'var(--hsElevate--button--secondary__borderColor)',
      borderWidth: 'var(--hsElevate--button--secondary__borderThickness)',
      hoverBackgroundColor: 'var(--hsElevate--socialShareIcon__hover--backgroundColorOverride, transparent)',
      hoverTextColor: 'var(--hsElevate--button--secondary__hover--textColor)',
      hoverBorderColor: 'var(--hsElevate--button--secondary__hover--borderColor)',
      hoverBorderWidth: 'var(--hsElevate--button--secondary__hover--borderThickness)',
      activeBackgroundColor: 'var(--hsElevate--socialShareIcon__active--backgroundColorOverride, transparent)',
      activeTextColor: 'var(--hsElevate--button--secondary__active--textColor)',
      activeBorderColor: 'var(--hsElevate--button--secondary__active--borderColor)',
      activeBorderWidth: 'var(--hsElevate--button--secondary__active--borderThickness)',
    },
    tertiary: {
      backgroundColor: 'var(--hsElevate--socialShareIcon__backgroundColorOverride, transparent)',
      textColor: 'var(--hsElevate--button--tertiary__textColor)',
      borderColor: 'var(--hsElevate--button--tertiary__borderColor)',
      borderWidth: 'var(--hsElevate--button--tertiary__borderThickness)',
      hoverBackgroundColor: 'var(--hsElevate--socialShareIcon__hover--backgroundColorOverride, transparent)',
      hoverTextColor: 'var(--hsElevate--button--tertiary__hover--textColor)',
      hoverBorderColor: 'var(--hsElevate--button--tertiary__hover--borderColor)',
      hoverBorderWidth: 'var(--hsElevate--button--tertiary__hover--borderThickness)',
      activeBackgroundColor: 'var(--hsElevate--socialShareIcon__active--backgroundColorOverride, transparent)',
      activeTextColor: 'var(--hsElevate--button--tertiary__active--textColor)',
      activeBorderColor: 'var(--hsElevate--button--tertiary__active--borderColor)',
      activeBorderWidth: 'var(--hsElevate--button--tertiary__active--borderThickness)',
    },
    accent: {
      backgroundColor: 'var(--hsElevate--socialShareIcon__backgroundColorOverride, transparent)',
      textColor: 'var(--hsElevate--button--accent__textColor)',
      borderColor: 'var(--hsElevate--button--accent__borderColor)',
      borderWidth: 'var(--hsElevate--button--accent__borderThickness)',
      hoverBackgroundColor: 'var(--hsElevate--socialShareIcon__hover--backgroundColorOverride, transparent)',
      hoverTextColor: 'var(--hsElevate--button--accent__hover--textColor)',
      hoverBorderColor: 'var(--hsElevate--button--accent__hover--borderColor)',
      hoverBorderWidth: 'var(--hsElevate--button--accent__hover--borderThickness)',
      activeBackgroundColor: 'var(--hsElevate--socialShareIcon__active--backgroundColorOverride, transparent)',
      activeTextColor: 'var(--hsElevate--button--accent__active--textColor)',
      activeBorderColor: 'var(--hsElevate--button--accent__active--borderColor)',
      activeBorderWidth: 'var(--hsElevate--button--accent__active--borderThickness)',
    },
  };

  return {
    '--hsElevate--socialShareIcon__backgroundColor': iconStyles[buttonStyleVariant].backgroundColor,
    '--hsElevate--socialShareIcon__color': iconStyles[buttonStyleVariant].textColor,
    '--hsElevate--socialShareIcon__borderColor': iconStyles[buttonStyleVariant].borderColor,
    '--hsElevate--socialShareIcon__borderWidth': iconStyles[buttonStyleVariant].borderWidth,
    '--hsElevate--socialShareIcon__hover--backgroundColor': iconStyles[buttonStyleVariant].hoverBackgroundColor,
    '--hsElevate--socialShareIcon__hover--color': iconStyles[buttonStyleVariant].hoverTextColor,
    '--hsElevate--socialShareIcon__hover--borderColor': iconStyles[buttonStyleVariant].hoverBorderColor,
    '--hsElevate--socialShareIcon__hover--borderWidth': iconStyles[buttonStyleVariant].hoverBorderWidth,
    '--hsElevate--socialShareIcon__active--backgroundColor': iconStyles[buttonStyleVariant].activeBackgroundColor,
    '--hsElevate--socialShareIcon__active--color': iconStyles[buttonStyleVariant].activeTextColor,
    '--hsElevate--socialShareIcon__active--borderColor': iconStyles[buttonStyleVariant].activeBorderColor,
    '--hsElevate--socialShareIcon__active--borderWidth': iconStyles[buttonStyleVariant].activeBorderWidth,
  };
}

function generateBorderOverrideCssVars(iconBorder?: BorderOption): CSSPropertiesMap {
  if (iconBorder !== 'none') {
    return {};
  }

  return {
    '--hsElevate--socialShareIcon__borderColor': 'transparent',
    '--hsElevate--socialShareIcon__borderWidth': '0',
    '--hsElevate--socialShareIcon__hover--borderColor': 'transparent',
    '--hsElevate--socialShareIcon__hover--borderWidth': '0',
    '--hsElevate--socialShareIcon__active--borderColor': 'transparent',
    '--hsElevate--socialShareIcon__active--borderWidth': '0',
    '--hsElevate--socialShareIcon__borderStyle': 'none',
  };
}

function generateAlignmentCssVars(alignmentField: AlignmentFieldType['default']): CSSPropertiesMap {
  const alignmentCss = getAlignmentFieldCss(alignmentField);

  return {
    '--hsElevate--socialShare__justifyContent': alignmentCss.justifyContent || 'flex-start',
  };
}

// Components

const SocialShareContainer = createComponent('div');
const SocialLink = createComponent('a');
const SocialImage = createComponent('img');

function getPlatformMetaData(socialLink: string, defaultText: DefaultTextProps) {
  const platformMetaData = {
    twitter: {
      name: 'twitter',
      aria_label: defaultText.twitterLinkAriaLabel,
      base_url: 'https://twitter.com/intent/tweet?url=',
    },
    facebook: {
      name: 'facebook',
      aria_label: defaultText.facebookLinkAriaLabel,
      base_url: 'https://www.facebook.com/sharer/sharer.php?u=',
    },
    linkedin: {
      name: 'linkedin',
      aria_label: defaultText.linkedinLinkAriaLabel,
      base_url: 'https://www.linkedin.com/shareArticle?mini=true&url=',
    },
    pinterest: {
      name: 'pinterest',
      aria_label: defaultText.pinterestLinkAriaLabel,
      base_url: 'https://pinterest.com/pin/create/button/?url=',
    },
    email: {
      name: 'envelope',
      aria_label: defaultText.emailLinkAriaLabel,
      base_url: 'mailto:',
    },
  };

  return platformMetaData[socialLink] || {};
}

function getShareLinkTarget(openInNewTab: boolean): string | undefined {
  return openInNewTab ? '_blank' : undefined;
}

function getShareLinkRel(openInNewTab: boolean): string | undefined {
  return openInNewTab ? 'noopener noreferrer' : undefined;
}

function resolveCustomUrl(urlTemplate: string, currentUrl: string): string {
  if (!urlTemplate) {
    return '';
  }

  if (urlTemplate.includes('{{url}}')) {
    return urlTemplate.replaceAll('{{url}}', encodeURIComponent(currentUrl));
  }

  return urlTemplate;
}

export const Component = (props: SocialShareProps) => {
  const {
    open_in_new_tab = true,
    platforms,
    customPlatforms = [],
    groupDefaultText,
    groupStyle: { shape, buttonStyleVariant, buttonStyleSize, spaceBetweenIcons, alignment, iconBorder },
  } = props;

  const linkTarget = getShareLinkTarget(open_in_new_tab);
  const linkRel = getShareLinkRel(open_in_new_tab);

  const cssVarsMap = {
    ...generateIconSizeAndPaddingCssVars(buttonStyleSize),
    ...generateIconShapeCssVars(shape),
    ...generateIconGapCssVars(spaceBetweenIcons),
    ...generateButtonStyles(buttonStyleVariant),
    ...generateAlignmentCssVars(alignment),
    ...generateBorderOverrideCssVars(iconBorder),
  };

  const currentUrl = usePageUrl().href;
  if (!currentUrl) {
    return null;
  }

  return (
    <SocialShareContainer className={swm('hs-elevate-social-share')} style={cssVarsMap}>
      {platforms.map(platform => {
        const platformMetaData = getPlatformMetaData(platform, groupDefaultText);
        let iconFieldPath = `groupDefaultIcons.${platformMetaData.name}`;

        return (
          <SocialLink
            className={swm('hs-elevate-social-share__link')}
            key={platform}
            href={`${platformMetaData.base_url}${encodeURIComponent(currentUrl)}`}
            aria-label={platformMetaData.aria_label}
            target={linkTarget}
            rel={linkRel}
          >
            <Icon className={swm('hs-elevate-social-share__icon')} purpose="DECORATIVE" fieldPath={iconFieldPath} />
          </SocialLink>
        );
      })}
      {customPlatforms.map((platform, index) => {
        const href = resolveCustomUrl(platform.urlTemplate || '', currentUrl);

        if (!href) {
          return null;
        }

        const ariaLabel = platform.ariaLabel || (platform.platformLabel ? `Share on ${platform.platformLabel}` : `Custom share ${index + 1}`);
        const iconFieldPath = `customPlatforms[${index}].icon`;
        const imageSrc = platform.image?.src;
        const imageAlt = platform.image?.alt || platform.platformLabel || '';
        const useImage = platform.iconSource === 'image' && Boolean(imageSrc);

        return (
          <SocialLink
            className={swm('hs-elevate-social-share__link')}
            key={`custom-${index}`}
            href={href}
            aria-label={ariaLabel}
            target={linkTarget}
            rel={linkRel}
          >
            {useImage ? (
              <SocialImage
                className={swm('hs-elevate-social-share__image')}
                src={imageSrc}
                alt={imageAlt}
                width={platform.image?.width}
                height={platform.image?.height}
                loading={platform.image?.loading !== 'disabled' ? platform.image?.loading : 'lazy'}
              />
            ) : (
              <Icon className={swm('hs-elevate-social-share__icon')} purpose="DECORATIVE" fieldPath={iconFieldPath} />
            )}
          </SocialLink>
        );
      })}
    </SocialShareContainer>
  );
};

export { fields } from './fields.js';

export const meta: ModuleMeta = {
  label: 'Social share',
  content_types: ['BLOG_LISTING', 'BLOG_POST', 'SITE_PAGE', 'LANDING_PAGE', 'CASE_STUDY'],
  icon: socialIconSvg,
  categories: ['media'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/social_share',
  version: 0,
  themeModule: true,
};
