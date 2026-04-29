import { ModuleMeta } from '../../types/modules.js';
import styles from './image-and-caption.module.css';
import imageAndCaptionIconSvg from './assets/image.svg';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { CSSPropertiesMap } from '../../types/components.js';
import { ImageAndCaptionProps, ImageAspectRatioChoice } from './types.js';
import { getDataHSToken } from '../../utils/inline-editing.js';
import type { CSSProperties } from 'react';
import type { AlignmentFieldType } from '@hubspot/cms-components/fields';

const swm = staticWithModule(styles);

const ImageAndCaptionSection = createComponent('section');
const ImageAndCaptionContainer = createComponent('figure');
const ImageAndCaptionMedia = createComponent('div');
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

/**
 * Maps AlignmentField values to CSS object-position (used with object-fit: cover).
 * CMS JSON may use different casing than the field defaults.
 */
function alignmentToObjectPosition(
  pos: AlignmentFieldType['default'] | undefined,
): string {
  const h = String(pos?.horizontal_align ?? 'CENTER').toUpperCase();
  const v = String(pos?.vertical_align ?? 'MIDDLE').toUpperCase();
  const hMap: Record<string, string> = {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right',
  };
  const vMap: Record<string, string> = {
    TOP: 'top',
    MIDDLE: 'center',
    BOTTOM: 'bottom',
  };
  return `${hMap[h] ?? 'center'} ${vMap[v] ?? 'center'}`;
}

function aspectRatioMediaClass(ratio: ImageAspectRatioChoice | undefined): string | undefined {
  if (ratio === 'ratio_16_9') {
    return swm('hs-elevate-image-and-caption__media--ratio-16-9');
  }
  if (ratio === 'ratio_4_3') {
    return swm('hs-elevate-image-and-caption__media--ratio-4-3');
  }
  if (ratio === 'ratio_3_2') {
    return swm('hs-elevate-image-and-caption__media--ratio-3-2');
  }
  return undefined;
}

function toPositiveNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return undefined;
}

/**
 * Recreates ImageField sizing semantics for basic mode so it behaves like native fields:
 * - exact: use provided width/height
 * - auto_custom_max: preserve aspect ratio while constraining to max dimensions
 * - auto/default: keep intrinsic sizing
 */
function getNativeImageDimensions(image: ImageAndCaptionProps['image']): {
  width?: number;
  height?: number;
} {
  const width = toPositiveNumber(image?.width);
  const height = toPositiveNumber(image?.height);
  const maxWidth = toPositiveNumber(image?.max_width);
  const maxHeight = toPositiveNumber(image?.max_height);
  const sizeType = typeof image?.size_type === 'string' ? image.size_type : 'auto';

  if (sizeType !== 'auto_custom_max' || width == null || height == null) {
    return { width, height };
  }

  const maxWidthScale = maxWidth != null ? maxWidth / width : Number.POSITIVE_INFINITY;
  const maxHeightScale = maxHeight != null ? maxHeight / height : Number.POSITIVE_INFINITY;
  const scale = Math.min(1, maxWidthScale, maxHeightScale);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export const Component = (props: ImageAndCaptionProps) => {
  const {
    moduleName,
    image,
    addCaption = false,
    img_caption = '',
    captionAlignment,
    useAdvancedImageEditing = false,
    imageAspectRatio = 'original',
    imageObjectFitCover = false,
    imageObjectPosition,
    groupStyle: {
      captionBackgroundColor = { color: '#FFFFFF', opacity: 100 },
      captionTextColor = { color: '#2B2D3A', opacity: 100 },
    } = {},
  } = props;

  const hasImage = Boolean(image?.src);
  const captionText = img_caption?.trim() || '';
  const showCaption = addCaption === true && captionText.length > 0;

  const aspectChoice = (imageAspectRatio ?? 'original') as ImageAspectRatioChoice;
  const needsMediaFrame =
    hasImage &&
    useAdvancedImageEditing === true &&
    (aspectChoice !== 'original' || imageObjectFitCover === true);

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

  const imageWidth = typeof image?.width === 'number' ? image.width : undefined;
  const imageHeight = typeof image?.height === 'number' ? image.height : undefined;
  const nativeImageDimensions = getNativeImageDimensions(image);

  const mediaStyle: CSSProperties = {
    maxWidth: '100%',
    ...(imageWidth != null
      ? { width: `${imageWidth}px` }
      : { width: 'min(100%, 960px)' }),
    ...(aspectChoice === 'original' &&
    imageObjectFitCover === true &&
    imageHeight != null &&
    imageWidth != null
      ? { height: `${imageHeight}px` }
      : {}),
  };

  /* object-position only affects layout when the image is cropped (object-fit: cover + aspect mismatch). */
  const framedImageStyle: CSSProperties | undefined = needsMediaFrame
    ? {
        objectPosition: imageObjectFitCover
          ? alignmentToObjectPosition(imageObjectPosition)
          : 'center center',
      }
    : undefined;

  const renderImage = () => (
    <Image
      className={swm('hs-elevate-image-and-caption__image')}
      src={image?.src}
      alt={image?.alt}
      width={needsMediaFrame ? undefined : nativeImageDimensions.width}
      height={needsMediaFrame ? undefined : nativeImageDimensions.height}
      loading={image?.loading && image.loading !== 'disabled' ? image.loading : 'lazy'}
      data-hs-token={getDataHSToken(moduleName, 'image')}
      style={framedImageStyle}
    />
  );

  return (
    <ImageAndCaptionSection
      className={swm('hs-elevate-image-and-caption__section')}
      style={cssVarsMap}
    >
      <ImageAndCaptionContainer className={swm('hs-elevate-image-and-caption')}>
        {hasImage && !needsMediaFrame && renderImage()}
        {hasImage && needsMediaFrame && (
          <ImageAndCaptionMedia
            className={cx(
              swm('hs-elevate-image-and-caption__media'),
              aspectRatioMediaClass(aspectChoice),
              imageObjectFitCover === true && swm('hs-elevate-image-and-caption__media--cover'),
            )}
            style={mediaStyle}
          >
            {renderImage()}
          </ImageAndCaptionMedia>
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
