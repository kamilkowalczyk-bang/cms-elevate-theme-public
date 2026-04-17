import { ModuleMeta } from '../../types/modules.js';
import styles from './image-and-caption.module.css';
import imageAndCaptionIconSvg from './assets/image.svg';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { CSSPropertiesMap } from '../../types/components.js';
import { ImageAndCaptionProps } from './types.js';
import { getDataHSToken } from '../../utils/inline-editing.js';

const swm = staticWithModule(styles);

const ImageAndCaptionSection = createComponent('section');
const ImageAndCaptionContainer = createComponent('figure');
const Image = createComponent('img');
const Caption = createComponent('figcaption');

function colorWithOpacity(color: string, opacityPercent?: number): string {
  if (opacityPercent == null || opacityPercent >= 100) {
    return color;
  }
  if (opacityPercent <= 0) {
    return 'transparent';
  }

  const hex = color.trim().replace('#', '');
  const fullHex = hex.length === 3 ? hex.split('').map((ch) => `${ch}${ch}`).join('') : hex;
  if (fullHex.length !== 6) {
    return color;
  }

  const r = Number.parseInt(fullHex.slice(0, 2), 16);
  const g = Number.parseInt(fullHex.slice(2, 4), 16);
  const b = Number.parseInt(fullHex.slice(4, 6), 16);

  if ([r, g, b].some((value) => Number.isNaN(value))) {
    return color;
  }

  return `rgba(${r}, ${g}, ${b}, ${opacityPercent / 100})`;
}

function getAlignmentClass(alignment: ImageAndCaptionProps['captionAlignment']): string {
  const horizontalAlign = alignment?.horizontal_align ?? 'LEFT';

  if (horizontalAlign === 'CENTER') {
    return swm('hs-elevate-image-and-caption__caption--center');
  }
  if (horizontalAlign === 'RIGHT') {
    return swm('hs-elevate-image-and-caption__caption--right');
  }
  return swm('hs-elevate-image-and-caption__caption--left');
}

export const Component = (props: ImageAndCaptionProps) => {
  const {
    moduleName,
    image,
    addCaption = false,
    img_caption = '',
    captionAlignment,
    groupStyle: {
      captionBackgroundColor = { color: '#FFFFFF', opacity: 100 },
      captionTextColor = { color: '#2B2D3A', opacity: 100 },
    } = {},
  } = props;

  const hasImage = Boolean(image?.src);
  const captionText = img_caption?.trim() || '';
  const showCaption = addCaption === true && captionText.length > 0;

  const cssVarsMap: CSSPropertiesMap = {
    '--hsElevate--imageAndCaption__captionBackgroundColor': colorWithOpacity(
      captionBackgroundColor.color ?? '#FFFFFF',
      captionBackgroundColor.opacity,
    ),
    '--hsElevate--imageAndCaption__captionTextColor': colorWithOpacity(
      captionTextColor.color ?? '#2B2D3A',
      captionTextColor.opacity,
    ),
  };

  return (
    <ImageAndCaptionSection
      className={swm('hs-elevate-image-and-caption__section')}
      style={cssVarsMap}
    >
      <ImageAndCaptionContainer className={swm('hs-elevate-image-and-caption')}>
        {hasImage && (
          <Image
            className={swm('hs-elevate-image-and-caption__image')}
            src={image?.src}
            alt={image?.alt}
            width={image?.width}
            height={image?.height}
            loading={image?.loading && image.loading !== 'disabled' ? image.loading : 'lazy'}
            data-hs-token={getDataHSToken(moduleName, 'image')}
          />
        )}
        {showCaption && (
          <Caption
            className={cx(
              swm('hs-elevate-image-and-caption__caption'),
              getAlignmentClass(captionAlignment),
            )}
            data-hs-token={getDataHSToken(moduleName, 'img_caption')}
          >
            {img_caption}
          </Caption>
        )}
      </ImageAndCaptionContainer>
    </ImageAndCaptionSection>
  );
};

export { fields } from './fields.js';

export const meta: ModuleMeta = {
  label: 'Image with caption',
  content_types: ['BLOG_LISTING', 'BLOG_POST', 'SITE_PAGE', 'LANDING_PAGE'],
  icon: imageAndCaptionIconSvg,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/image_and_caption',
  version: 0,
  themeModule: true,
};
