import { ImageFieldType, TextFieldType, LinkFieldType, BooleanFieldType } from '@hubspot/cms-components/fields';
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

export type TestimonialLayoutProps = {
  layoutType: TestimonialSliderLayoutType;
};

// Types for testimonial slide styles

export type TestimonialStyleProps = CardStyleFieldLibraryType;

// Types for the testimonial slider

export type TestimonialSliderProps = {
  moduleName?: string;
  groupLayout?: TestimonialLayoutProps;
  groupTestimonial: TestimonialContentProps[];
  groupStyle: TestimonialStyleProps;
  groupDefaultText: TestimonialDefaultTextProps;
};
