import { useEffect, useMemo, useState } from 'react';
import { ModuleMeta } from '../../types/modules.js';
import { Island } from '@hubspot/cms-components';
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
import {
  buildHubDbCategoryTabList,
  normalizeCategoryLabel,
  normalizeHubDbCategories,
  resolveActiveServiceCategory,
} from './hubdb-category-tabs.js';
import { HUBDB_TABLE_NAMES } from '../../utils/hubdb-table-names.js';

// @ts-expect-error -- ?island not typed
import ServiceCardIsland from './islands/ServiceCardIsland.js?island';

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

type GroupLayoutStyles = {
  groupLayout?: {
    cardsAlignment: AlignmentFieldType['default'];
  };
};

type GroupStyle = GroupCardStyles & GroupLayoutStyles & GroupContentStyles & GroupButtonStyles;

type HubDBServiceCard = {
  /** Raw HubDB multi-select value for filtering in React. */
  serviceCategories?: unknown;
  /** HubDB checkbox value for featured cards. */
  isFeatured?: unknown;
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

/** See ServiceCardIsland — server-filled via `hubdb_table_row` when manual HubDB row is selected. */
type ManualHubDbRowSnapshot = {
  service_title?: string;
  service_description?: string;
  service_link_text?: string;
  service_link_url?: string;
  bgSrc?: string | unknown;
  /** Raw HubDB IMAGE cell when present; used if `bgSrc` is empty or not a usable string. */
  service_bg_img?: unknown;
};

type ServiceCardProps = {
  moduleName?: string;
  imageOrIcon: 'icon' | 'image';
  groupCards: GroupCards[];
  groupStyle: GroupStyle;
  useHubDBFeed?: boolean;
  serviceCategory?: string;
  showFeaturedCards?: boolean;
  hideCategoryTabs?: boolean;
  hublData: {
    renderedWithGrids: boolean;
    hubdbCards?: HubDBServiceCard[];
    manualHubDbRows?: (ManualHubDbRowSnapshot | null)[];
    /** From HubL `hubdb_table_column` → `service_categories.options` when Use HubDB feed is on. */
    hubdbCategoryTabOptions?: unknown;
  };
};

// Functions to generate CSS variables

function generateAlignmentCssVars(
  cardsAlignment: AlignmentFieldType['default'],
  contentAlignment: AlignmentFieldType['default'],
): CSSPropertiesMap {
  const cardsAlignmentCss = getAlignmentFieldCss(cardsAlignment);
  const contentAlignmentCss = getAlignmentFieldCss(contentAlignment);
  const textAlignment = contentAlignment.horizontal_align?.toLowerCase() as 'left' | 'right' | 'center';
  return {
    '--hsElevate--card__containerAlignment': cardsAlignmentCss.justifyContent ?? 'center',
    '--hsElevate--card__alignment': contentAlignmentCss.justifyContent,
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

// Components

const CardContainer = createComponent('div');
const IconWrapper = createComponent('div');
const ImageWrapper = createComponent('div');
const Image = createComponent('img');
const CardContent = createComponent('div');
const ButtonWrapper = createComponent('div');
const Caption = createComponent('p');

const ServiceCardServer = (props: ServiceCardProps) => {
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
      groupLayout,
      groupContent: { alignment, headingStyleVariant, headingUppercase = false },
      groupButton: { buttonStyleVariant, buttonStyleSize },
    },
    hublData: { renderedWithGrids = false, hubdbCards = [], hubdbCategoryTabOptions },
    useHubDBFeed = false,
    serviceCategory,
    showFeaturedCards = false,
    hideCategoryTabs = false,
  } = props;

  const categoryTabs = useMemo(
    () =>
      useHubDBFeed
        ? buildHubDbCategoryTabList(hubdbCategoryTabOptions, hubdbCards)
        : [],
    [useHubDBFeed, hubdbCategoryTabOptions, hubdbCards],
  );

  const [activeCategory, setActiveCategory] = useState(serviceCategory ?? 'show_all_categories');

  useEffect(() => {
    if (!useHubDBFeed) return;
    setActiveCategory(resolveActiveServiceCategory(serviceCategory, categoryTabs));
  }, [serviceCategory, useHubDBFeed, categoryTabs]);

  const inlineModuleName = useHubDBFeed ? undefined : moduleName;

  const cardsToRender = useMemo(() => {
    if (!useHubDBFeed) return groupCards;
    if (showFeaturedCards) {
      return hubdbCards.filter(
        (card) =>
          card.isFeatured === true ||
          card.isFeatured === 'true' ||
          card.isFeatured === 'on' ||
          card.isFeatured === 1 ||
          card.isFeatured === '1',
      );
    }
    const activeCategoryNormalized = normalizeCategoryLabel(activeCategory);
    return hubdbCards.filter((card) => normalizeHubDbCategories(card.serviceCategories).includes(activeCategoryNormalized));
  }, [activeCategory, groupCards, hubdbCards, useHubDBFeed, showFeaturedCards]);

  const isIcon = imageOrIcon === 'icon';
  const isImage = imageOrIcon === 'image';
  const textAlignment = alignment.horizontal_align?.toLowerCase() as 'left' | 'right' | 'center';

  const headingInlineStyles = { textAlign: textAlignment };

  /** When groupLayout is absent (modules saved before this field), match legacy behavior: row followed inner alignment. */
  const cardsAlignmentField = groupLayout?.cardsAlignment ?? alignment;

  const cssVarsMap = {
    ...generateColorCssVars(cardStyleVariant),
    ...generateAlignmentCssVars(cardsAlignmentField, alignment),
  };

  const layoutClass = renderedWithGrids
    ? 'hs-elevate-service-card-container--grids'
    : 'hs-elevate-service-card-container--bootstrap';

  return (
    <>
      {useHubDBFeed && !showFeaturedCards && !hideCategoryTabs && (
        <div className={swm('hs-elevate-service-card__category-tabs')} style={cssVarsMap}>
          {categoryTabs.map((tab) => {
            const isActive = tab.value === activeCategory;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveCategory(tab.value)}
                aria-pressed={isActive}
                className={swm('hs-elevate-service-card__category-tab')}
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

export const Component = (props: ServiceCardProps) => {
  return <Island hydrateOn="load" module={ServiceCardIsland} {...props} />;
};

export { fields } from './fields.js';

export const hublDataTemplate = `
  {% set hubdbCards = [] %}
  {% set manualHubDbRows = [] %}
  {% set hubdb_category_tab_options = [] %}
  {% unless module.useHubDBFeed %}
    {% for card in module.groupCards %}
      {% set picker = card.groupHubdbRow %}
      {% set rid = none %}
      {% if picker %}
        {% if picker.id is not none %}
          {% set rid = picker.id %}
        {% elif picker.rowId is not none %}
          {% set rid = picker.rowId %}
        {% elif picker.row_id is not none %}
          {% set rid = picker.row_id %}
        {% elif picker.values and picker.values.hs_id is not none %}
          {% set rid = picker.values.hs_id %}
        {% endif %}
      {% endif %}
      {% if rid %}
        {% set dbrow = hubdb_table_row("${HUBDB_TABLE_NAMES.serviceCard}", rid|int) %}
        {% set bgRaw = dbrow.service_bg_img %}
        {% if not bgRaw and dbrow.values and dbrow.values.service_bg_img %}
          {% set bgRaw = dbrow.values.service_bg_img %}
        {% endif %}
        {% if bgRaw %}
          {% if bgRaw.url %}
            {% set bgSrcSnap = bgRaw.url %}
          {% elif bgRaw.full_url %}
            {% set bgSrcSnap = bgRaw.full_url %}
          {% elif bgRaw.image and bgRaw.image.url %}
            {% set bgSrcSnap = bgRaw.image.url %}
          {% elif bgRaw.image and bgRaw.image.default and bgRaw.image.default.url %}
            {% set bgSrcSnap = bgRaw.image.default.url %}
          {% elif bgRaw.default and bgRaw.default.url %}
            {% set bgSrcSnap = bgRaw.default.url %}
          {% elif bgRaw.src %}
            {% set bgSrcSnap = bgRaw.src %}
          {% elif bgRaw.href %}
            {% set bgSrcSnap = bgRaw.href %}
          {% elif bgRaw.file_url %}
            {% set bgSrcSnap = bgRaw.file_url %}
          {% else %}
            {% set bgSrcSnap = bgRaw %}
          {% endif %}
        {% else %}
          {% set bgSrcSnap = "" %}
        {% endif %}
        {% set lu = dbrow.service_link_url %}
        {% if lu %}
          {% if lu.href %}
            {% set linkStr = lu.href %}
          {% elif lu.url %}
            {% set linkStr = lu.url %}
          {% else %}
            {% set linkStr = lu %}
          {% endif %}
        {% else %}
          {% set linkStr = "" %}
        {% endif %}
        {% do manualHubDbRows.append({
          "service_title": dbrow.service_title,
          "service_description": dbrow.service_description,
          "service_link_text": dbrow.service_link_text,
          "service_link_url": linkStr,
          "bgSrc": bgSrcSnap,
          "service_bg_img": bgRaw
        }) %}
      {% else %}
        {% do manualHubDbRows.append(none) %}
      {% endif %}
    {% endfor %}
  {% endunless %}
  {% if module.useHubDBFeed %}
    {% set hubdb_svc_table_id = "${HUBDB_TABLE_NAMES.serviceCard}" %}
    {% set hubdb_cat_col = hubdb_table_column(hubdb_svc_table_id, "service_categories") %}
    {% if hubdb_cat_col and hubdb_cat_col.options %}
      {% if hubdb_cat_col.options is mapping %}
        {% for opt_key in hubdb_cat_col.options %}
          {% set opt = hubdb_cat_col.options[opt_key] %}
          {% do hubdb_category_tab_options.append({
            "id": opt_key,
            "name": opt.name,
            "label": opt.label|default(opt.name)
          }) %}
        {% endfor %}
      {% else %}
        {% for opt in hubdb_cat_col.options %}
          {% do hubdb_category_tab_options.append({
            "name": opt.name,
            "label": opt.label|default(opt.name)
          }) %}
        {% endfor %}
      {% endif %}
    {% endif %}
    {% set hubdbRows = hubdb_table_rows(hubdb_svc_table_id) %}

    {% for row in hubdbRows %}
      {% if row.service_bg_img %}
        {% set bgRaw = row.service_bg_img %}
      {% elif row.image %}
        {% set bgRaw = row.image %}
      {% else %}
        {% set bgRaw = none %}
      {% endif %}
      {% if bgRaw %}
        {% if bgRaw.url %}
          {% set bgSrc = bgRaw.url %}
        {% elif bgRaw.full_url %}
          {% set bgSrc = bgRaw.full_url %}
        {% elif bgRaw.image and bgRaw.image.url %}
          {% set bgSrc = bgRaw.image.url %}
        {% elif bgRaw.image and bgRaw.image.default and bgRaw.image.default.url %}
          {% set bgSrc = bgRaw.image.default.url %}
        {% elif bgRaw.default and bgRaw.default.url %}
          {% set bgSrc = bgRaw.default.url %}
        {% elif bgRaw.src %}
          {% set bgSrc = bgRaw.src %}
        {% elif bgRaw.href %}
          {% set bgSrc = bgRaw.href %}
        {% elif bgRaw.file_url %}
          {% set bgSrc = bgRaw.file_url %}
        {% else %}
          {% set bgSrc = bgRaw %}
        {% endif %}
      {% else %}
        {% set bgSrc = "" %}
      {% endif %}
      {% set title = row.service_title %}
      {% set descriptionHTML = row.service_description %}
      {% set linkText = row.service_link_text %}
      {% set linkUrl = row.service_link_url %}
      {% set categories = row.service_categories %}
      {% set featured = row.featured_service %}

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
        "isFeatured": featured,
        "groupImage": {
          "showRoundImageBorder": false,
          "image": { "src": "", "alt": "", "loading": "disabled" }
        },
        "groupCardBackground": {
          "image": { "src": bgSrc, "alt": "", "loading": "lazy" }
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
      "hubdbCards": hubdbCards,
      "manualHubDbRows": manualHubDbRows,
      "hubdbCategoryTabOptions": hubdb_category_tab_options
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

