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

function getDividerHorizontalAlignmentClass(
  alignment: AlignmentFieldType['default'] | undefined,
): string {
  const horizontal = alignment?.horizontal_align || 'LEFT';
  if (horizontal === 'CENTER') {
    return swm('hs-elevate-image-and-text__divider--align-center');
  }
  if (horizontal === 'RIGHT') {
    return swm('hs-elevate-image-and-text__divider--align-right');
  }
  return swm('hs-elevate-image-and-text__divider--align-left');
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

function backgroundImageStyleFromField(src: string | undefined): CSSPropertiesMap | undefined {
  if (typeof src !== 'string' || !src.trim()) {
    return undefined;
  }
  return { backgroundImage: `url(${src})` };
}

export const Component = (props: ImageAndTextProps) => {
  const {
    moduleName,
    groupImage: { imagePosition, image, containerBackgroundImage },
    groupContent: {
      headingAndTextHeadingLevel,
      headingAndTextHeading,
      richTextContentHTML,
      showList = false,
      listIcon,
      groupListItems = [],
    },
    groupButton: { showButton, buttonContentText: text, buttonContentLink: link, buttonContentShowIcon: showIcon, buttonContentIconPosition: iconPosition },
    groupStyle: {
      groupContent: {
        sectionStyleVariant,
        headingStyleVariant,
        verticalAlignment,
        headingUppercase = false,
        showContentDivider = false,
        dividerHorizontalAlignment,
      },
      groupButton: { buttonStyleSize, buttonStyleVariant },
    },
  } = props;

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
  const hasContent =
    headingAndTextHeading ||
    richTextContentHTML ||
    showButton ||
    showContentDivider ||
    hasListBlock;

  const cssVarsMap = {
    ...generateImagePositionCssVars(imagePosition),
    ...generateColorCssVars(sectionStyleVariant),
    ...generateAlignmentCssVars(verticalAlignment),
  };

  return (
    <ImageAndText className={swm('hs-elevate-image-and-text')} style={cssVarsMap}>
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
        <ContentContainer className={swm('hs-elevate-image-and-text__content-container')}>
          {showContentDivider && (
            <DividerRule
              className={cx(
                swm('hs-elevate-image-and-text__divider'),
                getDividerHorizontalAlignmentClass(dividerHorizontalAlignment),
              )}
              aria-hidden={true}
            />
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
