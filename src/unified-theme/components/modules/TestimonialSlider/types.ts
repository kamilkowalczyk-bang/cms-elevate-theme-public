import { ImageFieldType, TextFieldType, LinkFieldType, BooleanFieldType, NumberFieldType } from '@hubspot/cms-components/fields';
import { CardStyleFieldLibraryType } from '../../fieldLibrary/CardStyle/types.js';
import { RichTextContentFieldLibraryType } from '../../fieldLibrary/RichTextContent/types.js';
import { ButtonContentType } from '../../fieldLibrary/ButtonContent/types.js';

// Types for testimonial default text

export type TestimonialDefaultTextProps = {
  previousArrowAltText: TextFieldType['default'];
  nextArrowAltText: TextFieldType['default'];
  navigateToSlideNumberAriaLabel: TextFieldType['default'];
  navigateToPreviousSlideAriaLabel: TextFieldType['default'];
  navigateToNextSlideAriaLabel: TextFieldType['default'];
  navigateToFirstSlideAriaLabel: TextFieldType['default'];
  navigateToLastSlideAriaLabel: TextFieldType['default'];
  carouselAriaLabel: TextFieldType['default'];
  selectSlideNavigationAriaLabel: TextFieldType['default'];
  slideAriaLabel: TextFieldType['default'];
  slideNumberOfSlidesTotalAriaLabel: TextFieldType['default'];
};

// Types for testimonial link

export type TestimonialLinkProps = {
  contentCentered?: boolean;
  linkText?: TextFieldType['default'];
  link?: LinkFieldType['default'];
  moduleName?: string;
  testimonialIndex: number;
};

// Types for testimonial author

export type TestimonialAuthorProps = {
  authorName?: TextFieldType['default'];
  authorTitle?: TextFieldType['default'];
  authorImage?: ImageFieldType['default'];
  moduleName?: string;
  testimonialIndex: number;
};

// Types for the testimonial meta

export type TestimonialMetaProps = TestimonialLinkProps & TestimonialAuthorProps;

// Types for testimonial image

export type TestimonialImageProps = {
  showImage?: BooleanFieldType['default'];
  image?: ImageFieldType['default'];
};

// Types for individual testimonial slide

export type TestimonialProps = TestimonialAuthorProps &
  TestimonialImageProps &
  TestimonialLinkProps & {
    quote: TextFieldType['default'];
  };

// Types for tesitmonial content

export type TestimonialContentProps = {
  groupQuote: {
    quote: TextFieldType['default'];
  };
  groupAuthor?: TestimonialAuthorProps;
  groupImage?: TestimonialImageProps;
  groupLink?: TestimonialLinkProps;
  groupInfoContent?: RichTextContentFieldLibraryType;
  groupInfoImage?: TestimonialImageProps;
  groupInfoButton?: ButtonContentType & {
    showButton?: BooleanFieldType['default'];
  };
};

// Layout type for testimonial slider

export type TestimonialSliderLayoutType = 'testimonial' | 'info';

/** Info-layout Splide autoplay interval (ms). */
export const TESTIMONIAL_SLIDER_INFO_AUTOPLAY_INTERVAL_DEFAULT = 8000;
export const TESTIMONIAL_SLIDER_INFO_AUTOPLAY_INTERVAL_MIN = 4000;
export const TESTIMONIAL_SLIDER_INFO_AUTOPLAY_INTERVAL_MAX = 16000;

/** Info-layout Splide transition speed (ms). */
export const TESTIMONIAL_SLIDER_INFO_TRANSITION_SPEED_DEFAULT = 600;
export const TESTIMONIAL_SLIDER_INFO_TRANSITION_SPEED_MIN = 300;
export const TESTIMONIAL_SLIDER_INFO_TRANSITION_SPEED_MAX = 1200;

export type TestimonialLayoutProps = {
  layoutType: TestimonialSliderLayoutType;
  showInfoArrows?: BooleanFieldType['default'];
  infoAutoplayInterval?: NumberFieldType['default'];
  infoTransitionSpeed?: NumberFieldType['default'];
};

// Types for testimonial slide styles

export type TestimonialStyleProps = CardStyleFieldLibraryType & {
  showTestimonialDropShadow?: BooleanFieldType['default'];
  showTestimonialQuoteBoldUppercase?: BooleanFieldType['default'];
  /** Max width (px) of the large testimonial slide image column; stylesheet reads via `--hsElevate--testimonial-slider__featuredImageMaxWidth`. */
  testimonialFeaturedImageMaxWidth?: NumberFieldType['default'];
};

// Types for the testimonial slider

export type TestimonialSliderProps = {
  moduleName?: string;
  groupLayout?: TestimonialLayoutProps;
  groupTestimonial: TestimonialContentProps[];
  groupStyle: TestimonialStyleProps;
  groupDefaultText: TestimonialDefaultTextProps;
};
