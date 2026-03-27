import { ModuleMeta } from '../../types/modules.js';
import { Icon, RichText } from '@hubspot/cms-components';
import HeadingComponent from '../../HeadingComponent/index.js';
import { Button } from '../../ButtonComponent/index.js';
import { AlignmentFieldType } from '@hubspot/cms-components/fields';
import { ElementPositionType, SectionVariantType } from '../../types/fields.js';
import { getLinkFieldHref, getLinkFieldRel, getLinkFieldTarget } from '../../utils/content-fields.js';
import { getAlignmentFieldCss } from '../../utils/style-fields.js';
import styles from './image-and-text.module.css';
import imageAndTextIconSvg from './assets/image.svg';
import { sectionColorsMap } from '../../utils/section-color-map.js';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { CSSPropertiesMap } from '../../types/components.js';
import { ImageAndTextProps } from './types.js';
import { getDataHSToken } from '../../utils/inline-editing.js';

const swm = staticWithModule(styles);

// Image and text component

// Functions to pull in corresponding CSS variables on component based on field values

function generateColorCssVars(sectionVariantField: SectionVariantType): CSSPropertiesMap {
  return {
    '--hsElevate--imageAndText__textColor': sectionColorsMap[sectionVariantField].textColor,
    '--hsElevate--imageAndText__sectionCaptionColor': sectionColorsMap[sectionVariantField].sectionCaptionColor,
    '--hsElevate--imageAndText__accentColor': sectionColorsMap[sectionVariantField].accentColor,
    '--hsElevate--blockquote__textColor': sectionColorsMap[sectionVariantField].blockquoteTextColor,
    '--hsElevate--blockquote__backgroundColor': sectionColorsMap[sectionVariantField].blockquoteBackgroundColor,
    '--hsElevate--blockquote__accentColor': sectionColorsMap[sectionVariantField].blockquoteAccentColor,
  };
}

function generateImagePositionCssVars(imagePositionField: ElementPositionType): CSSPropertiesMap {
  const imagePositionMap = {
    left: '0',
    right: '1',
  };

  return { '--hsElevate--imageAndText__order': imagePositionMap[imagePositionField] };
}

function generateAlignmentCssVars(alignmentField: AlignmentFieldType['default']): CSSPropertiesMap {
  const alignmentCss = getAlignmentFieldCss(alignmentField);

  return { '--hsElevate--imageAndText__alignItems': alignmentCss.alignItems || 'center' };
}

function getHorizontalAlignmentClass(
  alignment: AlignmentFieldType['default'] | undefined,
  element: 'divider' | 'caption',
): string {
  const horizontal = alignment?.horizontal_align || 'LEFT';
  const prefix =
    element === 'divider'
      ? 'hs-elevate-image-and-text__divider--align-'
      : 'hs-elevate-image-and-text__caption--align-';
  if (horizontal === 'CENTER') {
    return swm(`${prefix}center`);
  }
  if (horizontal === 'RIGHT') {
    return swm(`${prefix}right`);
  }
  return swm(`${prefix}left`);
}

// Components

const ImageAndText = createComponent('div');
const ImageContainer = createComponent('div');
const Image = createComponent('img');
const ContentContainer = createComponent('div');
const DividerRule = createComponent('hr');
const ListContainer = createComponent('ul');
const ListItem = createComponent('li');
const ListIconContainer = createComponent('span');
const ListItemText = createComponent('span');
const Caption = createComponent('p');

function backgroundImageStyleFromField(src: string | undefined): CSSPropertiesMap | undefined {
  if (typeof src !== 'string' || !src.trim()) {
    return undefined;
  }
  return { backgroundImage: `url(${src})` };
}

function colorWithOpacity(color: string, opacityPercent?: number): string {
  if (opacityPercent == null) return color;
  if (opacityPercent >= 100) return color;
  if (opacityPercent <= 0) return 'transparent';

  const trimmed = color.trim();
  if (!trimmed.startsWith('#')) return color;

  const hex = trimmed.slice(1);
  const isShort = hex.length === 3;
  const isLong = hex.length === 6;
  if (!isShort && !isLong) return color;

  const expanded = isShort ? hex.split('').map((ch) => `${ch}${ch}`).join('') : hex;
  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);

  if ([r, g, b].some((n) => Number.isNaN(n))) return color;

  const alpha = opacityPercent / 100;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const Component = (props: ImageAndTextProps) => {
  const {
    moduleName,
    groupImage: { imagePosition, image, containerBackgroundImage },
    groupContent: {
      headingAndTextHeadingLevel,
      headingAndTextHeading,
      richTextContentHTML,
      showCaption = false,
      captionText = '',
      showList = false,
      listIcon,
      groupListItems = [],
    },
    groupButton: { showButton, buttonContentText: text, buttonContentLink: link, buttonContentShowIcon: showIcon, buttonContentIconPosition: iconPosition },
    groupStyle: {
      groupModule,
      groupContent: {
        sectionStyleVariant,
        headingStyleVariant,
        verticalAlignment,
        contentBackgroundColor: contentBackgroundColorField = { color: '#FFFFFF', opacity: 0 },
        captionColor: captionColorField = { color: '#FFFFFF', opacity: 0 },
        headingUppercase = false,
        showContentDivider = false,
        dividerHorizontalAlignment,
      },
      groupButton: { buttonStyleSize, buttonStyleVariant },
    },
  } = props;

  const showDropShadow = groupModule?.showDropShadow === true;
  const showRoundedCorners = groupModule?.showRoundedCorners === true;

  const buttonHref = getLinkFieldHref(link);
  const buttonRel = getLinkFieldRel(link);
  const buttonTarget = getLinkFieldTarget(link);

  const mainImageSrc = image?.src;
  const hasMainImage = Boolean(mainImageSrc);
  const backgroundSrc = containerBackgroundImage?.src;
  const hasBackgroundImage = typeof backgroundSrc === 'string' && Boolean(backgroundSrc.trim());
  const showImageColumn = hasMainImage || hasBackgroundImage;

  const imageContainerClass = cx(
    swm('hs-elevate-image-and-text__image-container'),
    hasBackgroundImage && swm('hs-elevate-image-and-text__image-container--bg'),
    hasBackgroundImage && !hasMainImage && swm('hs-elevate-image-and-text__image-container--bg-only'),
  );

  const imageContainerStyle: CSSPropertiesMap | undefined = hasBackgroundImage
    ? backgroundImageStyleFromField(backgroundSrc)
    : undefined;

  const hasListBlock = showList && groupListItems.length > 0;
  const hasCaptionBlock = showCaption === true && Boolean(captionText?.trim());
  const hasContent =
    headingAndTextHeading ||
    richTextContentHTML ||
    showButton ||
    showContentDivider ||
    hasListBlock ||
    hasCaptionBlock;

  const captionUsesThemeCaptionColor =
    captionColorField?.opacity == null || captionColorField.opacity <= 0;

  const cssVarsMap: CSSPropertiesMap = {
    ...generateImagePositionCssVars(imagePosition),
    ...generateColorCssVars(sectionStyleVariant),
    ...generateAlignmentCssVars(verticalAlignment),
    ...(!captionUsesThemeCaptionColor
      ? {
          '--hsElevate--imageAndText__captionColor': colorWithOpacity(
            captionColorField?.color ?? '#FFFFFF',
            captionColorField?.opacity,
          ),
        }
      : {}),
  };

  const contentContainerStyle: CSSPropertiesMap = {
    backgroundColor: colorWithOpacity(
      contentBackgroundColorField?.color ?? '#FFFFFF',
      contentBackgroundColorField?.opacity,
    ),
  };

  return (
    <ImageAndText
      className={cx(
        swm('hs-elevate-image-and-text'),
        showDropShadow && swm('hs-elevate-image-and-text--drop-shadow'),
        showRoundedCorners && swm('hs-elevate-image-and-text--rounded-corners'),
      )}
      style={cssVarsMap}
    >
      {showImageColumn && (
        <ImageContainer className={imageContainerClass} style={imageContainerStyle}>
          {hasMainImage && (
            <Image
              className={swm('hs-elevate-image-and-text__image')}
              src={mainImageSrc}
              alt={image?.alt}
              width={image?.width}
              height={image?.height}
              loading={image?.loading && image.loading !== 'disabled' ? image.loading : 'eager'}
              data-hs-token={getDataHSToken(moduleName, 'groupImage.image')}
            />
          )}
        </ImageContainer>
      )}
      {hasContent && (
        <ContentContainer className={swm('hs-elevate-image-and-text__content-container')} style={contentContainerStyle}>
          {showContentDivider && (
            <DividerRule
              className={cx(
                swm('hs-elevate-image-and-text__divider'),
                getHorizontalAlignmentClass(dividerHorizontalAlignment, 'divider'),
              )}
              aria-hidden={true}
            />
          )}
          {hasCaptionBlock && (
            <Caption
              className={cx(
                swm('hs-elevate-image-and-text__caption'),
                getHorizontalAlignmentClass(dividerHorizontalAlignment, 'caption'),
              )}
              data-hs-token={getDataHSToken(moduleName, 'groupContent.captionText')}
            >
              {captionText}
            </Caption>
          )}
          {headingAndTextHeading && (
            <HeadingComponent
              additionalClassArray={['hs-elevate-image-and-text__title']}
              headingLevel={headingAndTextHeadingLevel}
              headingStyleVariant={headingStyleVariant}
              heading={headingAndTextHeading}
              headingUppercase={headingUppercase}
              moduleName={moduleName}
              fieldPath="groupContent.headingAndTextHeading"
            />
          )}
          {richTextContentHTML && (
            <RichText
              fieldPath="groupContent.richTextContentHTML"
              className="hs-elevate-image-and-text__body"
              data-hs-token={getDataHSToken(moduleName, 'groupContent.richTextContentHTML')}
            />
          )}
          {hasListBlock && (
            <ListContainer className={swm('hs-elevate-image-and-text__list')}>
              {groupListItems.map((item, index) => (
                <ListItem className={swm('hs-elevate-image-and-text__list-item')} key={index}>
                  {listIcon?.name && (
                    <ListIconContainer className={swm('hs-elevate-image-and-text__list-icon-container')}>
                      <Icon className={swm('hs-elevate-image-and-text__list-icon')} fieldPath="groupContent.listIcon" purpose="DECORATIVE" />
                    </ListIconContainer>
                  )}
                  <ListItemText data-hs-token={getDataHSToken(moduleName, `groupContent.groupListItems[${index}].groupListContent.listItemContent`)}>
                    {item.groupListContent.listItemContent}
                  </ListItemText>
                </ListItem>
              ))}
            </ListContainer>
          )}
          {showButton && (
            <Button
              additionalClassArray={['hs-elevate-image-and-text__button']}
              buttonSize={buttonStyleSize}
              buttonStyle={buttonStyleVariant}
              href={buttonHref}
              rel={buttonRel}
              target={buttonTarget}
              showIcon={showIcon}
              iconFieldPath="groupButton.buttonContentIcon"
              iconPosition={iconPosition}
              moduleName={moduleName}
              textFieldPath="groupButton.buttonContentText"
            >
              {text}
            </Button>
          )}
        </ContentContainer>
      )}
    </ImageAndText>
  );
};

export { fields } from './fields.js';

export const meta: ModuleMeta = {
  label: 'Image and text',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: imageAndTextIconSvg,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/image_and_text',
  version: 0,
  themeModule: true,
};
