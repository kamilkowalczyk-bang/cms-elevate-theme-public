import { useEffect, useMemo, useState } from 'react';
import { ModuleMeta } from '../../types/modules.js';
import { Icon, RichText } from '@hubspot/cms-components';
import {
  AlignmentFieldType,
  BooleanFieldType,
  IconFieldType,
  ImageFieldType,
  TextFieldType,
} from '@hubspot/cms-components/fields';
import { ButtonStyleType, StandardSizeType } from '../../types/fields.js';
import cardIconSvg from './assets/card-icon-temp.svg';
import { getAlignmentFieldCss } from '../../utils/style-fields.js';
import { getLinkFieldHref, getLinkFieldRel, getLinkFieldTarget } from '../../utils/content-fields.js';
import { Card } from '../../CardComponent/index.js';
import HeadingComponent from '../../HeadingComponent/index.js';
import styles from './service-card.module.css';
import { RichTextContentFieldLibraryType } from '../../fieldLibrary/RichTextContent/types.js';
import { Button } from '../../ButtonComponent/index.js';
import SanitizedContent from '../../SanitizeHTML/index.js';
import { ButtonContentType } from '../../fieldLibrary/ButtonContent/types.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../fieldLibrary/HeadingAndText/types.js';
import { CardStyleFieldLibraryType } from '../../fieldLibrary/CardStyle/types.js';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { CSSPropertiesMap } from '../../types/components.js';
import { getDataHSToken } from '../../utils/inline-editing.js';

const swm = staticWithModule(styles);

// Types

type IconGroup = {
  groupIcon: {
    icon: IconFieldType['default'];
  };
};

type ImageGroup = {
  groupImage: {
    image: ImageFieldType['default'];
    showRoundImageBorder?: BooleanFieldType['default'];
  };
};

type ContentGroup = {
  groupContent: RichTextContentFieldLibraryType &
    HeadingAndTextFieldLibraryType & {
      showCaption?: BooleanFieldType['default'];
      captionText?: TextFieldType['default'];
    };
};

type ButtonGroup = {
  groupButton: ButtonContentType & {
    showButton: BooleanFieldType['default'];
  };
};

type CardBackgroundGroup = {
  groupCardBackground: {
    image: ImageFieldType['default'];
  };
};

type GroupCards = IconGroup & ImageGroup & ContentGroup & ButtonGroup & Partial<CardBackgroundGroup>;

type GroupCardStyles = {
  groupCard: CardStyleFieldLibraryType & {
    cardOrientation: 'row' | 'column';
    showIconBorder?: BooleanFieldType['default'];
    showCardShadow?: BooleanFieldType['default'];
    showCardBorder?: BooleanFieldType['default'];
  };
};

type GroupContentStyles = {
  groupContent: HeadingStyleFieldLibraryType & {
    alignment: AlignmentFieldType['default'];
    headingUppercase?: BooleanFieldType['default'];
  };
};

type GroupButtonStyles = {
  groupButton: {
    buttonStyleSize: StandardSizeType;
    buttonStyleVariant: ButtonStyleType;
  };
};

type GroupStyle = GroupCardStyles & GroupContentStyles & GroupButtonStyles;

type HubDBServiceCard = {
  /** Raw HubDB multi-select value for filtering in React. */
  serviceCategories?: unknown;
  groupCardBackground: {
    image: {
      // In hubDB mode, this can be a URL string or an object containing `src`.
      src?: unknown;
      alt?: string;
      loading?: string;
    };
  };
  groupContent: {
    showCaption?: boolean;
    captionText?: string;
    headingAndTextHeadingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    headingAndTextHeading: string;
    richTextContentHTML: string;
  };
  groupButton: {
    showButton: boolean;
    buttonContentText: string;
    buttonContentLink: any;
    buttonContentShowIcon: boolean;
    buttonContentIconPosition: 'left' | 'right';
  };
  groupImage: {
    showRoundImageBorder: boolean;
    image: {
      src?: unknown;
      alt?: string;
      loading?: string;
      width?: number;
      height?: number;
    };
  };
  // Optional — if empty, icon won't render.
  groupIcon?: {
    icon: {
      name?: string;
    };
  };
};

type ServiceCardProps = {
  moduleName?: string;
  imageOrIcon: 'icon' | 'image';
  groupCards: GroupCards[];
  groupStyle: GroupStyle;
  useHubDBFeed?: boolean;
  serviceCategory?: string;
  hublData: {
    renderedWithGrids: boolean;
    hubdbCards?: HubDBServiceCard[];
  };
};

// Functions to generate CSS variables

function generateAlignmentCssVars(alignment: AlignmentFieldType['default']): CSSPropertiesMap {
  const textAlignment = alignment.horizontal_align?.toLowerCase() as 'left' | 'right' | 'center';
  return {
    '--hsElevate--card__alignment': getAlignmentFieldCss(alignment).justifyContent,
    '--hsElevate--card__textAlignment': textAlignment,
  };
}

function generateColorCssVars(cardVariantField: string): CSSPropertiesMap {
  const iconColorsMap = {
    card_variant_1: {
      borderRadius: 'var(--hsElevate--card--variant1__iconBorderRadius)',
      fillColor: 'var(--hsElevate--card--variant1__iconColor)',
      backgroundColor: 'var(--hsElevate--card--variant1__iconBackgroundColor)',
    },
    card_variant_2: {
      borderRadius: 'var(--hsElevate--card--variant2__iconBorderRadius)',
      fillColor: 'var(--hsElevate--card--variant2__iconColor)',
      backgroundColor: 'var(--hsElevate--card--variant2__iconBackgroundColor)',
    },
    card_variant_3: {
      borderRadius: 'var(--hsElevate--card--variant3__iconBorderRadius)',
      fillColor: 'var(--hsElevate--card--variant3__iconColor)',
      backgroundColor: 'var(--hsElevate--card--variant3__iconBackgroundColor)',
    },
    card_variant_4: {
      borderRadius: 'var(--hsElevate--card--variant4__iconBorderRadius)',
      fillColor: 'var(--hsElevate--card--variant4__iconColor)',
      backgroundColor: 'var(--hsElevate--card--variant4__iconBackgroundColor)',
    },
  };

  return {
    '--hsElevate--cardIcon__borderRadius': iconColorsMap[cardVariantField].borderRadius,
    '--hsElevate--cardIcon__fillColor': iconColorsMap[cardVariantField].fillColor,
    '--hsElevate--cardIcon__backgroundColor': iconColorsMap[cardVariantField].backgroundColor,
  };
}

// Checks if image path has '-use-background-' in its name to get the card icon's background color applied

function imageShouldUseBackground(imagePath: string): boolean {
  if (!imagePath) {
    return false;
  }
  return /-use-background-/.test(imagePath);
}

function getCardBackgroundImageSrc(image: Partial<ImageFieldType['default']> | { src?: unknown } | undefined): string | undefined {
  if (!image) return undefined;

  const srcCandidate = (image as any)?.src ?? image;

  if (typeof srcCandidate === 'string' && srcCandidate.trim()) {
    return srcCandidate.trim();
  }

  if (srcCandidate && typeof srcCandidate === 'object') {
    const nestedCandidate = (srcCandidate as any).src ?? (srcCandidate as any).url ?? (srcCandidate as any).href;
    if (typeof nestedCandidate === 'string' && nestedCandidate.trim()) {
      return nestedCandidate.trim();
    }
  }

  return undefined;
}

function normalizeHubDbCategories(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          const maybeLabel = (item as any).name ?? (item as any).label ?? (item as any).value;
          return typeof maybeLabel === 'string' ? maybeLabel : [];
        }
        return [];
      })
      .map((v) => (typeof v === 'string' ? v.trim() : ''))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }

  if (value && typeof value === 'object') {
    const maybeItems = (value as any).items ?? (value as any).values;
    return normalizeHubDbCategories(maybeItems);
  }

  return [];
}

function isShowAllCategory(category: string | undefined): boolean {
  return !category || category === 'service_all';
}

// Components

const CardContainer = createComponent('div');
const IconWrapper = createComponent('div');
const ImageWrapper = createComponent('div');
const Image = createComponent('img');
const CardContent = createComponent('div');
const ButtonWrapper = createComponent('div');
const Caption = createComponent('p');

export const Component = (props: ServiceCardProps) => {
  const {
    moduleName,
    imageOrIcon,
    groupCards,
    groupStyle: {
      groupCard: {
        cardStyleVariant,
        cardOrientation,
        showIconBorder = true,
        showCardShadow = false,
        showCardBorder = true,
      },
      groupContent: { alignment, headingStyleVariant, headingUppercase = false },
      groupButton: { buttonStyleVariant, buttonStyleSize },
    },
    hublData: { renderedWithGrids = false, hubdbCards = [] },
    useHubDBFeed = false,
    serviceCategory,
  } = props;

  const tabOptions = useMemo(
    () => [
      { value: 'service_all', label: 'Show all' },
      { value: 'Communication systems', label: 'Communication systems' },
      { value: 'Positioning & tracking systems', label: 'Positioning & tracking systems' },
      { value: 'Manufacturing technologies', label: 'Manufacturing technologies' },
    ],
    [],
  );

  const [activeCategory, setActiveCategory] = useState(serviceCategory ?? 'service_all');

  useEffect(() => {
    if (!useHubDBFeed) return;
    setActiveCategory(serviceCategory ?? 'service_all');
  }, [serviceCategory, useHubDBFeed]);

  const inlineModuleName = useHubDBFeed ? undefined : moduleName;

  const cardsToRender = useMemo(() => {
    if (!useHubDBFeed) return groupCards;
    if (isShowAllCategory(activeCategory)) return hubdbCards;
    return hubdbCards.filter((card) => normalizeHubDbCategories(card.serviceCategories).includes(activeCategory));
  }, [activeCategory, groupCards, hubdbCards, useHubDBFeed]);

  const isIcon = imageOrIcon === 'icon';
  const isImage = imageOrIcon === 'image';
  const textAlignment = alignment.horizontal_align?.toLowerCase() as 'left' | 'right' | 'center';

  const headingInlineStyles = { textAlign: textAlignment };

  const cssVarsMap = {
    ...generateColorCssVars(cardStyleVariant),
    ...generateAlignmentCssVars(alignment),
  };

  const layoutClass = renderedWithGrids
    ? 'hs-elevate-service-card-container--grids'
    : 'hs-elevate-service-card-container--bootstrap';

  return (
    <>
      {useHubDBFeed && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBlockEnd: 24 }}>
          {tabOptions.map((tab) => {
            const isActive = tab.value === activeCategory;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveCategory(tab.value)}
                aria-pressed={isActive}
                style={{
                  borderRadius: 9999,
                  padding: '10px 16px',
                  border: isActive ? '1px solid #B9CDBE' : '1px solid rgba(0,0,0,0.12)',
                  background: isActive ? '#B9CDBE' : 'transparent',
                  color: isActive ? '#0b1a22' : '#0b1a22',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
      <CardContainer
        className={cx(swm('hs-elevate-service-card-container'), styles[layoutClass])}
        style={cssVarsMap}
      >
        {cardsToRender.map((card, index) => {
        const {
          groupButton: {
            showButton,
            buttonContentText: text,
            buttonContentLink: link = {},
            buttonContentShowIcon: showIcon,
            buttonContentIconPosition: iconPosition,
          },
        } = card;

        const hasValidImageSrc = card?.groupImage?.image?.src;
        const isCardImageWithBackground = hasValidImageSrc && imageShouldUseBackground(card.groupImage.image.src);
        const cardImageUsesBackground = isImage && isCardImageWithBackground;
        const isImageVisible = isImage && hasValidImageSrc;
        const hasValidIconName = card?.groupIcon?.icon?.name;
        const isIconVisible = isIcon && hasValidIconName;

        const cardBackgroundSrc = getCardBackgroundImageSrc(card.groupCardBackground?.image);
        const hasCardBackgroundImage = Boolean(cardBackgroundSrc);

        const cardClasses = cx('hs-elevate-service-card-container__card', styles[`hs-elevate-service-card-container__card--${cardOrientation}`], {
          [styles['hs-elevate-service-card-container__card--no-button']]: !showButton,
          [styles['hs-elevate-service-card-container__card--bg-image']]: hasCardBackgroundImage,
          [styles['hs-elevate-service-card-container__card--drop-shadow']]: showCardShadow,
        });

        const cardSurfaceStyles: CSSPropertiesMap | undefined = (() => {
          const stylesMap: CSSPropertiesMap = {};
          if (hasCardBackgroundImage) {
            stylesMap.backgroundImage = `url(${cardBackgroundSrc})`;
          }
          if (showCardBorder === false) {
            stylesMap.border = 'none';
          }
          return Object.keys(stylesMap).length ? stylesMap : undefined;
        })();

        const showRoundImageBorder = card.groupImage?.showRoundImageBorder === true;

        const imageWrapperClasses = cx(swm('hs-elevate-service-card-container__image-wrapper'), {
          [styles['hs-elevate-service-card-container__image-wrapper--use-background']]: cardImageUsesBackground,
          [styles['hs-elevate-service-card-container__image-wrapper--round-border']]:
            isImageVisible && showRoundImageBorder,
        });

        return (
          <Card
            additionalClassArray={[cardClasses]}
            key={index}
            cardStyleVariant={cardStyleVariant}
            cardOrientation={cardOrientation}
            inlineStyles={cardSurfaceStyles}
          >
            {isIconVisible && (
              <IconWrapper className={swm('hs-elevate-service-card-container__icon-wrapper')}>
                <Icon
                  className={cx(swm('hs-elevate-service-card-container__icon'), {
                    [styles['hs-elevate-service-card-container__icon--no-frame']]: !showIconBorder,
                  })}
                  purpose="DECORATIVE"
                  fieldPath={!useHubDBFeed ? `groupCards[${index}].groupIcon.icon` : undefined}
                />
              </IconWrapper>
            )}
            {isImageVisible && (
              <ImageWrapper className={cx(imageWrapperClasses)}>
                <Image
                  className={swm('hs-elevate-service-card-container__image')}
                  src={card.groupImage.image.src}
                  alt={card.groupImage.image.alt}
                  width={card.groupImage.image.width}
                  height={card.groupImage.image.height}
                  loading={card.groupImage.image.loading !== 'disabled' ? card.groupImage.image.loading : 'eager'}
                  data-hs-token={getDataHSToken(inlineModuleName, `groupCards[${index}].groupImage.image`)}
                />
              </ImageWrapper>
            )}
            <CardContent className={swm('hs-elevate-service-card-container__content')}>
              {card.groupContent.showCaption === true && Boolean(card.groupContent.captionText?.trim()) && (
                <Caption
                  className={swm('hs-elevate-service-card-container__caption')}
                  style={{ textAlign: textAlignment }}
                  data-hs-token={getDataHSToken(inlineModuleName, `groupCards[${index}].groupContent.captionText`)}
                >
                  {card.groupContent.captionText}
                </Caption>
              )}
              {card.groupContent.headingAndTextHeading && (
                <HeadingComponent
                  headingLevel={card.groupContent.headingAndTextHeadingLevel}
                  heading={card.groupContent.headingAndTextHeading}
                  headingStyleVariant={headingStyleVariant}
                  inlineStyles={headingInlineStyles}
                  headingUppercase={headingUppercase}
                  additionalClassArray={[swm('hs-elevate-service-card-container__title')]}
                  moduleName={inlineModuleName}
                  fieldPath={!useHubDBFeed ? `groupCards[${index}].groupContent.headingAndTextHeading` : undefined}
                />
              )}
              {useHubDBFeed ? (
                <div className={swm('hs-elevate-service-card-container__body')}>
                  <SanitizedContent content={card.groupContent.richTextContentHTML} />
                </div>
              ) : (
                <RichText
                  fieldPath={`groupCards[${index}].groupContent.richTextContentHTML`}
                  className={swm('hs-elevate-service-card-container__body')}
                  data-hs-token={getDataHSToken(inlineModuleName, `groupCards[${index}].groupContent.richTextContentHTML`)}
                />
              )}
              {showButton && (
                <ButtonWrapper className={swm('hs-elevate-service-card-container__button-wrapper')}>
                  <Button
                    buttonSize={buttonStyleSize}
                    buttonStyle={buttonStyleVariant}
                    href={getLinkFieldHref(link)}
                    rel={getLinkFieldRel(link)}
                    target={getLinkFieldTarget(link)}
                    iconFieldPath={!useHubDBFeed ? `groupCards[${index}].groupButton.buttonContentIcon` : undefined}
                    showIcon={showIcon}
                    iconPosition={iconPosition}
                    additionalClassArray={['hs-elevate-service-card-container__button']}
                    moduleName={inlineModuleName}
                    textFieldPath={!useHubDBFeed ? `groupCards[${index}].groupButton.buttonContentText` : undefined}
                  >
                    {text}
                  </Button>
                </ButtonWrapper>
              )}
            </CardContent>
          </Card>
        );
        })}
      </CardContainer>
    </>
  );
};

export { fields } from './fields.js';

export const hublDataTemplate = `
  {% set hubdbCards = [] %}
  {% if module.useHubDBFeed %}
    {% set hubdbRows = hubdb_table_rows(1756583141) %}

    {% for row in hubdbRows %}
      {% set bgImage = row.service_bg_img %}
      {% set title = row.service_title %}
      {% set descriptionHTML = row.service_description %}
      {% set linkText = row.service_link_text %}
      {% set linkUrl = row.service_link_url %}
      {% set categories = row.service_categories %}

      {% if linkUrl %}
        {% set showButton = true %}
      {% else %}
        {% set showButton = false %}
      {% endif %}

      {% if showButton %}
        {% set buttonLink = {
          "url": { "href": linkUrl, "type": "EXTERNAL" },
          "open_in_new_tab": true
        } %}
      {% else %}
        {% set buttonLink = {} %}
      {% endif %}

      {% do hubdbCards.append({
        "serviceCategories": categories,
        "groupImage": {
          "showRoundImageBorder": false,
          "image": { "src": "", "alt": "", "loading": "disabled" }
        },
        "groupCardBackground": {
          "image": { "src": bgImage, "alt": "", "loading": "lazy" }
        },
        "groupIcon": {
          "icon": { "name": "" }
        },
        "groupContent": {
          "showCaption": false,
          "captionText": "",
          "headingAndTextHeadingLevel": "h4",
          "headingAndTextHeading": title,
          "richTextContentHTML": descriptionHTML
        },
        "groupButton": {
          "showButton": showButton,
          "buttonContentText": linkText,
          "buttonContentLink": buttonLink,
          "buttonContentShowIcon": false,
          "buttonContentIconPosition": "right"
        }
      }) %}
    {% endfor %}
  {% endif %}

  {% set hublData = {
      "renderedWithGrids": rendered_with_grids,
      "hubdbCards": hubdbCards
    }
  %}
`;

export const meta: ModuleMeta = {
  label: 'Service Card',
  content_types: ['BLOG_LISTING', 'BLOG_POST', 'SITE_PAGE', 'LANDING_PAGE', 'CASE_STUDY'],
  icon: cardIconSvg,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/service_card',
  version: 0,
  themeModule: true,
};

