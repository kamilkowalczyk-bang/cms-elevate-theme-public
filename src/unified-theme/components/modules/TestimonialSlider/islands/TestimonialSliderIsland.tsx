import { Splide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { RichText } from '@hubspot/cms-components';
import styles from '../testimonial-slider.module.css';
import cx, { staticWithModule } from '../../../utils/classnames.js';
import { createComponent } from '../../../utils/create-component.js';
import {
  TestimonialImageProps,
  TestimonialLinkProps,
  TestimonialMetaProps,
  TestimonialProps,
  TestimonialSliderProps,
  TESTIMONIAL_SLIDER_INFO_AUTOPLAY_INTERVAL_DEFAULT,
  TESTIMONIAL_SLIDER_INFO_AUTOPLAY_INTERVAL_MAX,
  TESTIMONIAL_SLIDER_INFO_AUTOPLAY_INTERVAL_MIN,
  TESTIMONIAL_SLIDER_INFO_TRANSITION_SPEED_DEFAULT,
  TESTIMONIAL_SLIDER_INFO_TRANSITION_SPEED_MAX,
  TESTIMONIAL_SLIDER_INFO_TRANSITION_SPEED_MIN,
} from '../types.js';
import type { ImageFieldType } from '@hubspot/cms-components/fields';
import { CardVariantType, ElementPositionType } from '../../../types/fields.js';
import { getLinkFieldHref, getLinkFieldRel, getLinkFieldTarget } from '../../../utils/content-fields.js';
import { getDataHSToken } from '../../../utils/inline-editing.js';
import { useEffect, useId, useState } from 'react';
import { getCardVariantClassName } from '../../../utils/card-variants.js';
import { CSSPropertiesMap } from '../../../types/components.js';
import { Button } from '../../../ButtonComponent/index.js';

const swm = staticWithModule(styles);

// Checks if an image path corresponds to one of the default images used on the testimonial slider module in one of our sections/templates

function isDefaultTestimonialImage(imagePath: string): boolean {
  if (!imagePath) {
    return false;
  }
  return /testimonial-user-image-[1-5]/.test(imagePath);
}

// Navigation

type NavigationArrowProps = {
  altText?: string;
};

const NavigationArrowImage = createComponent('svg');

const NavigationArrow = (props: NavigationArrowProps) => {
  const { altText } = props;

  const uniqueInstanceId = useId();
  const ariaLabelledBy = altText ? uniqueInstanceId : undefined;

  return (
    <NavigationArrowImage
      aria-labelledby={ariaLabelledBy}
      aria-label={altText}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="39"
      viewBox="0 0 24 39"
      fill="none"
      className={swm('hs-elevate-testimonial-slider__navigation-icon')}
    >
      {altText && (
        <title className="hs-elevate-testimonial-slider__navigation-icon-title" id={uniqueInstanceId}>
          {altText}
        </title>
      )}
      <path d="M23.2946 17.505C24.2321 18.4425 24.2321 19.965 23.2946 20.9025L8.89457 35.3025C7.95707 36.24 6.43457 36.24 5.49707 35.3025C4.55957 34.365 4.55957 32.8425 5.49707 31.905L18.2021 19.2L5.50457 6.49503C4.56707 5.55753 4.56707 4.03503 5.50457 3.09753C6.44207 2.16003 7.96457 2.16003 8.90207 3.09753L23.3021 17.4975L23.2946 17.505Z" />
    </NavigationArrowImage>
  );
};

type NavigationProps = {
  previousAltText: string;
  nextAltText: string;
};

const NavigationButton = createComponent('button');

const Navigation = ({ previousAltText, nextAltText }: NavigationProps) => {
  return (
    <div className="splide__arrows hs-elevate-testimonial-slider__navigation">
      <NavigationButton className={cx('splide__arrow', 'splide__arrow--prev', swm('hs-elevate-testimonial-slider__prev'))}>
        <NavigationArrow altText={previousAltText} />
      </NavigationButton>
      <NavigationButton className={cx('splide__arrow', 'splide__arrow--next', swm('hs-elevate-testimonial-slider__next'))}>
        <NavigationArrow altText={nextAltText} />
      </NavigationButton>
    </div>
  );
};

// Testimonial link

const LinkArrowImage = createComponent('svg');

const LinkArrow = () => {
  return (
    <LinkArrowImage
      width="8"
      height="15"
      viewBox="0 0 8 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={swm('hs-elevate-testimonial-slider__link-icon')}
    >
      <path d="M7.70625 6.79414C8.09688 7.18477 8.09688 7.81914 7.70625 8.20977L1.70625 14.2098C1.31563 14.6004 0.681251 14.6004 0.290626 14.2098C-0.0999985 13.8191 -0.0999985 13.1848 0.290626 12.7941L5.58438 7.50039L0.293751 2.20664C-0.0968735 1.81602 -0.0968735 1.18164 0.293751 0.791016C0.684376 0.400391 1.31875 0.400391 1.70938 0.791016L7.70938 6.79102L7.70625 6.79414Z" />
    </LinkArrowImage>
  );
};

const Link = createComponent('a');

const TestimonialLink = (props: TestimonialLinkProps) => {
  const { linkText, link } = props;

  const linkHref = getLinkFieldHref(link);
  const linkRel = getLinkFieldRel(link);
  const linkTarget = getLinkFieldTarget(link);
  return (
    <>
      {linkText && (
        <Link className={swm('hs-elevate-testimonial-slider__link')} href={linkHref} rel={linkRel} target={linkTarget}>
          {linkText} <LinkArrow />
        </Link>
      )}
    </>
  );
};

// Testimonial meta (author and link)

const Footer = createComponent('footer');
const AuthorContainer = createComponent('div');
const AuthorImageContainer = createComponent('div');
const AuthorImage = createComponent('img');
const AuthorName = createComponent('span');
const AuthorTitle = createComponent('span');

const TestimonialMeta = (props: TestimonialMetaProps) => {
  const { moduleName, testimonialIndex, authorName, authorTitle, authorImage, linkText, link } = props;

  const hasAuthorElement = authorName || authorTitle || authorImage.src;

  const isDefaultAuthorImage = authorImage.src && isDefaultTestimonialImage(authorImage.src);

  const authorImageClasses = cx(swm('hs-elevate-testimonial-slider__author-image'), {
    [styles['hs-elevate-testimonial-slider__author-image--use-background']]: isDefaultAuthorImage,
  });

  return (
    <>
      {(hasAuthorElement || linkText) && (
        <Footer className={swm('hs-elevate-testimonial-slider__footer')}>
          {hasAuthorElement && (
            <AuthorContainer className={swm('hs-elevate-testimonial-slider__author-container')}>
              {authorImage.src && (
                <AuthorImageContainer className={swm('hs-elevate-testimonial-slider__author-image-container')}>
                  <AuthorImage
                    data-splide-lazy={authorImage.src}
                    alt={authorImage.alt}
                    width={authorImage.width}
                    height={authorImage.height}
                    className={cx(authorImageClasses)}
                  />
                </AuthorImageContainer>
              )}
              {(authorName || authorTitle) && (
                <div>
                  {authorName && <AuthorName className={swm('hs-elevate-testimonial-slider__author-name')}>{authorName}</AuthorName>}
                  {authorTitle && <AuthorTitle className={swm('hs-elevate-testimonial-slider__author-title')}>{authorTitle}</AuthorTitle>}
                </div>
              )}
            </AuthorContainer>
          )}
          <TestimonialLink moduleName={moduleName} testimonialIndex={testimonialIndex} linkText={linkText} link={link} />
        </Footer>
      )}
    </>
  );
};

// Testimonial slide content

const SlideContainer = createComponent('div');
const ImageContainer = createComponent('div');
const TestimonialImage = createComponent('img');
const ContentContainer = createComponent('div');
const QuoteText = createComponent('span');

function generateAlignmentCSSVars(contentCentered: boolean): CSSPropertiesMap {
  return {
    '--hsElevate--testimonial__alignment': contentCentered ? 'center' : 'flex-start',
    '--hsElevate--testimonial__textAlign': contentCentered ? 'center' : 'left',
  };
}

const Testimonial = (props: TestimonialProps) => {
  const { moduleName, testimonialIndex, quote, authorName, authorTitle, authorImage, showImage, image, linkText, link } = props;

  // If there is an image the content in the slider is left aligned, otherwise it is center aligned
  const contentCentered = !(showImage && image.src);

  const cssVarsMap = { ...generateAlignmentCSSVars(contentCentered) };

  const isDefaultImage = image.src && isDefaultTestimonialImage(image.src);

  const testimonialImageClasses = cx(swm('hs-elevate-testimonial-slider__image'), {
    [styles['hs-elevate-testimonial-slider__image--use-background']]: isDefaultImage,
  });

  return (
    <SlideContainer style={cssVarsMap} className={swm('hs-elevate-testimonial-slider__slide')}>
      {showImage && image.src && (
        <ImageContainer className={swm('hs-elevate-testimonial-slider__image-container')}>
          <TestimonialImage className={cx(testimonialImageClasses)} data-splide-lazy={image.src} alt={image.alt} width={image.width} height={image.height} />
        </ImageContainer>
      )}
      <ContentContainer className={swm('hs-elevate-testimonial-slider__content-container')}>
        <QuoteText className={swm('hs-elevate-testimonial-slider__quote-text')}>{quote}</QuoteText>
        <TestimonialMeta
          moduleName={moduleName}
          testimonialIndex={testimonialIndex}
          authorName={authorName}
          authorTitle={authorTitle}
          authorImage={authorImage}
          linkText={linkText}
          link={link}
        />
      </ContentContainer>
    </SlideContainer>
  );
};

// Info slide content (rich text)

const InfoContentWrapper = createComponent('div');
const InfoButtonContainer = createComponent('div');
const InfoBackgroundImage = createComponent('img');

/** srcset/sizes may be present at runtime when responsive={true} but are not on ImageFieldType. */
function getImageResponsiveAttributes(image?: ImageFieldType['default']): {
  srcSet?: string;
  sizes?: string;
} {
  if (image == null || typeof image !== 'object') {
    return {};
  }

  const record = image as Record<string, unknown>;
  const srcset = record.srcset ?? record.srcSet;
  const sizes = record.sizes;

  return {
    ...(typeof srcset === 'string' && srcset.length > 0 ? { srcSet: srcset } : {}),
    ...(typeof sizes === 'string' && sizes.length > 0 ? { sizes } : {}),
  };
}

function getInfoBackgroundLoading(image: ImageFieldType['default'] | undefined, slideIndex: number): 'eager' | 'lazy' {
  if (image?.loading && image.loading !== 'disabled') {
    return image.loading;
  }

  return slideIndex === 0 ? 'eager' : 'lazy';
}

function hasInfoBackgroundImage(groupInfoImage?: TestimonialImageProps): boolean {
  return groupInfoImage?.showImage === true && Boolean(groupInfoImage?.image?.src);
}

type InfoBackgroundImageProps = {
  image: ImageFieldType['default'];
  slideIndex: number;
};

const InfoBackgroundImageElement = ({ image, slideIndex }: InfoBackgroundImageProps) => {
  const loading = getInfoBackgroundLoading(image, slideIndex);
  const alt = image.alt ?? '';
  const isDecorative = alt.length === 0;

  return (
    <InfoBackgroundImage
      className={swm('hs-elevate-testimonial-slider__info-bg-image')}
      src={image.src}
      alt={alt}
      {...(isDecorative ? { 'aria-hidden': true } : {})}
      {...(typeof image.width === 'number' ? { width: image.width } : {})}
      {...(typeof image.height === 'number' ? { height: image.height } : {})}
      loading={loading}
      {...(slideIndex === 0 && loading === 'eager' ? { fetchPriority: 'high' as const } : {})}
      {...getImageResponsiveAttributes(image)}
    />
  );
};

type InfoContentProps = {
  moduleName?: string;
  index: number;
  richTextContentHTML?: string;
};

const InfoContent = ({ moduleName, index, richTextContentHTML }: InfoContentProps) => {
  const cssVarsMap = generateAlignmentCSSVars(true);
  const fieldPath = `groupTestimonial[${index}].groupInfoContent.richTextContentHTML`;

  return (
    <InfoContentWrapper
      className={swm('hs-elevate-testimonial-slider__info-content')}
      style={cssVarsMap}
    >
      {richTextContentHTML && (
        <RichText
          fieldPath={fieldPath}
          className={swm('hs-elevate-testimonial-slider__info-rich-text')}
          data-hs-token={getDataHSToken(moduleName, fieldPath)}
        />
      )}
    </InfoContentWrapper>
  );
};

type InfoButtonProps = {
  moduleName?: string;
  index: number;
  button?: {
    showButton?: boolean;
    buttonContentText?: TestimonialLinkProps['linkText'];
    buttonContentLink?: TestimonialLinkProps['link'];
    buttonContentShowIcon?: boolean;
    buttonContentIconPosition?: ElementPositionType;
  };
};

const InfoButton = ({ moduleName, index, button }: InfoButtonProps) => {
  if (!button?.showButton) {
    return null;
  }

  const href = getLinkFieldHref(button.buttonContentLink);
  const rel = getLinkFieldRel(button.buttonContentLink);
  const target = getLinkFieldTarget(button.buttonContentLink);

  return (
    <InfoButtonContainer className={swm('hs-elevate-testimonial-slider__info-button-container')}>
      <Button
        buttonStyle="primary"
        buttonSize="medium"
        href={href}
        rel={rel}
        target={target}
        showIcon={button.buttonContentShowIcon}
        iconFieldPath={`groupTestimonial[${index}].groupInfoButton.buttonContentIcon`}
        iconPosition={button.buttonContentIconPosition}
        moduleName={moduleName}
        textFieldPath={`groupTestimonial[${index}].groupInfoButton.buttonContentText`}
      >
        {button.buttonContentText}
      </Button>
    </InfoButtonContainer>
  );
};

// Testimonial slider component

// Function to generate CSS variables for colors

function generateIconColorCssVar(cardVariantField: CardVariantType): CSSPropertiesMap {
  const iconColorsMap = {
    card_variant_1: 'var(--hsElevate--card--variant1__iconColor)',
    card_variant_2: 'var(--hsElevate--card--variant2__iconColor)',
    card_variant_3: 'var(--hsElevate--card--variant3__iconColor)',
    card_variant_4: 'var(--hsElevate--card--variant4__iconColor)',
  };

  return { '--hsElevate--cardIcon__fillColor': iconColorsMap[cardVariantField] };
}

function generateLinkCssVar(cardVariantField: CardVariantType): CSSPropertiesMap {
  const linkColorsMap = {
    card_variant_1: 'var(--hsElevate--card--variant1--link__fontColor)',
    card_variant_2: 'var(--hsElevate--card--variant2--link__fontColor)',
    card_variant_3: 'var(--hsElevate--card--variant3--link__fontColor)',
    card_variant_4: 'var(--hsElevate--card--variant4--link__fontColor)',
  };

  return { '--hsElevate--links__fontColor': linkColorsMap[cardVariantField] };
}

function generateBlockquoteCssVar(cardVariantField: CardVariantType): CSSPropertiesMap {
  const cardColorsMap = {
    card_variant_1: 'var(--hsElevate--card--variant1__textColor)',
    card_variant_2: 'var(--hsElevate--card--variant2__textColor)',
    card_variant_3: 'var(--hsElevate--card--variant3__textColor)',
    card_variant_4: 'var(--hsElevate--card--variant4__textColor)',
  };

  return {
    '--hsElevate--blockquote__fontColor': cardColorsMap[cardVariantField],
    '--hsElevate--blockquote__backgroundColor': 'transparent',
    '--hsElevate--blockquote__accentColor': 'transparent',
  };
}

function resolveInfoAutoplayInterval(intervalMs?: number): number {
  const raw = typeof intervalMs === 'number' && !Number.isNaN(intervalMs) ? intervalMs : TESTIMONIAL_SLIDER_INFO_AUTOPLAY_INTERVAL_DEFAULT;

  return Math.min(TESTIMONIAL_SLIDER_INFO_AUTOPLAY_INTERVAL_MAX, Math.max(TESTIMONIAL_SLIDER_INFO_AUTOPLAY_INTERVAL_MIN, raw));
}

function resolveInfoTransitionSpeed(speedMs?: number): number {
  const raw = typeof speedMs === 'number' && !Number.isNaN(speedMs) ? speedMs : TESTIMONIAL_SLIDER_INFO_TRANSITION_SPEED_DEFAULT;

  return Math.min(TESTIMONIAL_SLIDER_INFO_TRANSITION_SPEED_MAX, Math.max(TESTIMONIAL_SLIDER_INFO_TRANSITION_SPEED_MIN, raw));
}

/** Testimonial slide featured image column; clamped like LogoGrid slider max dimensions. */
function generateFeaturedImageMaxWidthCssVar(widthPx?: number): CSSPropertiesMap {
  const raw = typeof widthPx === 'number' && !Number.isNaN(widthPx) ? widthPx : 400;
  const clamped = Math.min(1200, Math.max(120, raw));

  return { '--hsElevate--testimonial-slider__featuredImageMaxWidth': `${clamped}px` };
}

const TestimonialSliderContainer = createComponent('div');

const TestimonialSlider = (props: TestimonialSliderProps) => {
  const {
    moduleName,
    groupLayout,
    groupTestimonial,
    groupStyle: {
      cardStyleVariant,
      showTestimonialDropShadow,
      showTestimonialQuoteBoldUppercase,
      testimonialFeaturedImageMaxWidth,
    },
    groupDefaultText,
  } = props;

  const layoutType = groupLayout?.layoutType ?? 'testimonial';

  const cssVarsMap = {
    ...generateIconColorCssVar(cardStyleVariant),
    ...generateLinkCssVar(cardStyleVariant),
    ...generateBlockquoteCssVar(cardStyleVariant),
    ...generateFeaturedImageMaxWidthCssVar(testimonialFeaturedImageMaxWidth),
  };

  const [htmlDirection, setHtmlDirection] = useState('ltr');

  useEffect(() => {
    const htmlElement = document.documentElement;
    setHtmlDirection(htmlElement.dir || 'ltr');
  }, []);

  const hasMultipleTestimonials = groupTestimonial.length > 1;
  const cardVariantClassName = getCardVariantClassName({ cardVariant: cardStyleVariant, fallbackCardVariant: 'card_variant_1' });
  const isInfoLayout = layoutType === 'info';
  const showArrows =
    hasMultipleTestimonials && (!isInfoLayout || groupLayout?.showInfoArrows !== false);
  const infoAutoplayInterval = resolveInfoAutoplayInterval(groupLayout?.infoAutoplayInterval);
  const infoTransitionSpeed = resolveInfoTransitionSpeed(groupLayout?.infoTransitionSpeed);

  return (
    <TestimonialSliderContainer
      style={cssVarsMap}
      className={cx(swm('hs-elevate-testimonial-slider'), cardVariantClassName, {
        [styles['hs-elevate-testimonial-slider--info']]: isInfoLayout,
        [styles['hs-elevate-testimonial-slider--drop-shadow']]: !isInfoLayout && showTestimonialDropShadow === true,
        [styles['hs-elevate-testimonial-slider--quote-bold-uppercase']]: !isInfoLayout && showTestimonialQuoteBoldUppercase === true,
      })}
    >
      <Splide
        className={swm('hs-elevate-testimonial-slider__slider')}
        hasTrack={false}
        options={{
          lazyLoad: true,
          rewind: true,
          autoplay: isInfoLayout,
          ...(isInfoLayout
            ? {
                interval: infoAutoplayInterval,
                speed: infoTransitionSpeed,
                pauseOnHover: true,
                pauseOnFocus: true,
              }
            : {}),
          direction: htmlDirection,
          arrows: showArrows,
          pagination: hasMultipleTestimonials,
          i18n: {
            // https://splidejs.com/guides/i18n/
            prev: groupDefaultText.navigateToPreviousSlideAriaLabel,
            next: groupDefaultText.navigateToNextSlideAriaLabel,
            first: groupDefaultText.navigateToFirstSlideAriaLabel,
            last: groupDefaultText.navigateToLastSlideAriaLabel,
            slideX: groupDefaultText.navigateToSlideNumberAriaLabel,
            carousel: groupDefaultText.carouselAriaLabel,
            select: groupDefaultText.selectSlideNavigationAriaLabel,
            slide: groupDefaultText.slideAriaLabel,
            slideLabel: groupDefaultText.slideNumberOfSlidesTotalAriaLabel,
          },
        }}
      >
        <div className="splide__track hs-elevate-testimonial-slider__track">
          <div className="splide__list hs-elevate-testimonial-slider__list">
            {groupTestimonial.map((testimonial, index) => {
              const hasInfoBackground = layoutType === 'info' && hasInfoBackgroundImage(testimonial.groupInfoImage);
              const infoImage = hasInfoBackground ? testimonial.groupInfoImage?.image : undefined;

              return (
                <div
                  className={cx('splide__slide', 'hs-elevate-testimonial-slider__slide', {
                    [styles['hs-elevate-testimonial-slider__slide--info-has-bg']]: hasInfoBackground,
                  })}
                  key={index}
                >
                  {layoutType === 'info' ? (
                    <>
                      {infoImage && <InfoBackgroundImageElement image={infoImage} slideIndex={index} />}
                      <ContentContainer className={swm('hs-elevate-testimonial-slider__content-container')}>
                      <InfoContent
                        moduleName={moduleName}
                        index={index}
                        richTextContentHTML={testimonial.groupInfoContent?.richTextContentHTML}
                      />
                      <InfoButton moduleName={moduleName} index={index} button={testimonial.groupInfoButton} />
                    </ContentContainer>
                    </>
                  ) : (
                    <Testimonial
                      moduleName={moduleName}
                      testimonialIndex={index}
                      quote={testimonial.groupQuote.quote}
                      authorName={testimonial.groupAuthor?.authorName}
                      authorTitle={testimonial.groupAuthor?.authorTitle}
                      authorImage={testimonial.groupAuthor?.authorImage}
                      showImage={testimonial.groupImage?.showImage}
                      image={testimonial.groupImage?.image}
                      linkText={testimonial.groupLink?.linkText}
                      link={testimonial.groupLink?.link}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {hasMultipleTestimonials && <Navigation previousAltText={groupDefaultText.previousArrowAltText} nextAltText={groupDefaultText.nextArrowAltText} />}
      </Splide>
    </TestimonialSliderContainer>
  );
};

export default TestimonialSlider;
