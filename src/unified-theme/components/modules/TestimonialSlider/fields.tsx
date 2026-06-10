import { ModuleFields, RepeatedFieldGroup, FieldGroup, TextField, ImageField, BooleanField, LinkField, ChoiceField, AdvancedVisibility } from '@hubspot/cms-components/fields';
import { ButtonContent, RichTextContent } from '../../fieldLibrary/index.js';
import StyleFields from './styleFields.js';
import authorImage from './assets/author-avatar.png';
import heroImage from './assets/hero.avif';
import testimonialImageOne from './assets/testimonial-image-1.png';
import testimonialImageTwo from './assets/testimonial-image-2.jpg';
import testimonialImageThree from './assets/testimonial-image-3.jpg';
import testimonialImageFour from './assets/testimonial-image-4.jpg';
import testimonialImageFive from './assets/testimonial-image-5.jpg';
import testimonialUserImageOne from './assets/testimonial-user-image-1.png';
import testimonialUserImageTwo from './assets/testimonial-user-image-2.png';
import testimonialUserImageThree from './assets/testimonial-user-image-3.png';
import testimonialUserImageFour from './assets/testimonial-user-image-4.png';
import testimonialUserImageFive from './assets/testimonial-user-image-5.png';

/**
 * Default content for both layouts. HubSpot does not support different default
 * arrays per layout (e.g. one for "testimonial", another for "info"). The repeater
 * has a single `default` array, so we include data for both layouts in every slide.
 * When editors switch layout in Design Manager, they always see example content.
 */
const defaultRichTextInfo =
  '<h4 style="text-transform: uppercase;">Wireless performance matters</h4><p class="hs-elevate-display-title">in Industrial IoT &amp; Smart Metering</p><p>Lorem ipsum dolor sit amet consectetur. Aenean id eleifend vitae sed augue velit. Est quam vel purus sagittis commodo non amet erat rhoncus.</p>';

/** Hero-style example for first slide when using Info layout (e.g. in page Hero). */
const defaultRichTextInfoHero =
  '<h4 style="text-transform: uppercase;">Wireless performance matters</h4><p class="hs-elevate-display-title">in Industrial IoT &amp; Smart Metering</p><p>Lorem ipsum dolor sit amet consectetur. Aenean id eleifend vitae sed augue velit. Est quam vel purus sagittis commodo non amet erat rhoncus.</p>';

const defaultTestimonial = {
  groupQuote: { quote: '' },
  groupAuthor: {
    authorName: '',
    authorTitle: '',
    authorImage: {
      alt: '',
      max_height: 100,
      max_width: 100,
      size_type: 'auto_custom_max',
      src: authorImage,
    },
  },
  groupImage: {
    showImage: true,
    image: {
      alt: '',
      max_height: 315,
      max_width: 315,
      size_type: 'auto_custom_max',
      src: '',
    },
  },
  groupLink: {
    linkText: 'Read case study',
    link: { open_in_new_tab: true },
  },
  groupInfoContent: {
    richTextContentHTML: defaultRichTextInfo,
  },
  groupInfoImage: {
    showImage: false,
    image: {
      alt: '',
      loading: 'lazy',
      max_height: 1080,
      max_width: 1920,
      size_type: 'auto_custom_max',
      src: heroImage,
    },
  },
  groupInfoButton: {
    showButton: false,
    buttonContentText: 'Industrial IoT & smart metering',
    buttonContentLink: { open_in_new_tab: false },
    buttonContentShowIcon: false,
    buttonContentIconPosition: 'right',
  },
};

/** First slide: hero-style example for Info layout (button visible), testimonial example for Testimonial layout. */
const testimonial1 = {
  ...defaultTestimonial,
  groupQuote: { quote: 'Add a testimonial quote #1 here. Keep it concise and impactful to enhance credibility with your business' },
  groupAuthor: {
    authorName: 'Customer name one',
    authorTitle: 'Customer role one',
    authorImage: {
      ...defaultTestimonial.groupAuthor.authorImage,
      src: testimonialUserImageOne,
    },
  },
  groupImage: {
    ...defaultTestimonial.groupImage,
    image: {
      ...defaultTestimonial.groupImage.image,
      src: testimonialImageOne,
    },
  },
  groupInfoContent: { richTextContentHTML: defaultRichTextInfoHero },
  groupInfoImage: {
    ...defaultTestimonial.groupInfoImage,
    showImage: true,
    image: { ...defaultTestimonial.groupInfoImage.image, loading: 'eager', src: heroImage },
  },
  groupInfoButton: {
    ...defaultTestimonial.groupInfoButton,
    showButton: true,
  },
};

const testimonial2 = {
  ...defaultTestimonial,
  groupQuote: { quote: 'Add a testimonial quote #2 here. Keep it concise and impactful to enhance credibility with your business' },
  groupAuthor: {
    authorName: 'Customer name two',
    authorTitle: 'Customer role two',
    authorImage: {
      ...defaultTestimonial.groupAuthor.authorImage,
      src: testimonialUserImageTwo,
    },
  },
  groupImage: {
    ...defaultTestimonial.groupImage,
    image: {
      ...defaultTestimonial.groupImage.image,
      src: testimonialImageTwo,
    },
  },
};

const testimonial3 = {
  ...defaultTestimonial,
  groupQuote: { quote: 'Add a testimonial quote #3 here. Keep it concise and impactful to enhance credibility with your business' },
  groupAuthor: {
    authorName: 'Customer name three',
    authorTitle: 'Customer role three',
    authorImage: {
      ...defaultTestimonial.groupAuthor.authorImage,
      src: testimonialUserImageThree,
    },
  },
  groupImage: {
    ...defaultTestimonial.groupImage,
    image: {
      ...defaultTestimonial.groupImage.image,
      src: testimonialImageThree,
    },
  },
};

const testimonial4 = {
  ...defaultTestimonial,
  groupQuote: { quote: 'Add a testimonial quote #4 here. Keep it concise and impactful to enhance credibility with your business' },
  groupAuthor: {
    authorName: 'Customer name four',
    authorTitle: 'Customer role four',
    authorImage: {
      ...defaultTestimonial.groupAuthor.authorImage,
      src: testimonialUserImageFour,
    },
  },
  groupImage: {
    ...defaultTestimonial.groupImage,
    image: {
      ...defaultTestimonial.groupImage.image,
      src: testimonialImageFour,
    },
  },
};

const testimonial5 = {
  ...defaultTestimonial,
  groupQuote: { quote: 'Add a testimonial quote #5 here. Keep it concise and impactful to enhance credibility with your business' },
  groupAuthor: {
    authorName: 'Customer name five',
    authorTitle: 'Customer role five',
    authorImage: {
      ...defaultTestimonial.groupAuthor.authorImage,
      src: testimonialUserImageFive,
    },
  },
  groupImage: {
    ...defaultTestimonial.groupImage,
    image: {
      ...defaultTestimonial.groupImage.image,
      src: testimonialImageFive,
    },
  },
};

const infoButtonFieldVisibility: AdvancedVisibility = {
  boolean_operator: 'OR',
  criteria: [
    {
      controlling_field_path: 'groupTestimonial.groupInfoButton.showButton',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
  ],
} as const;

export const fields = (
  <ModuleFields>
    <FieldGroup label="Layout" name="groupLayout" display="inline">
      <ChoiceField
        label="Layout type"
        name="layoutType"
        display="radio"
        choices={[
          ['testimonial', 'Testimonial'],
          ['info', 'Info'],
        ]}
        default="testimonial"
      />
      <BooleanField
        label="Show navigation arrows (info layout)"
        name="showInfoArrows"
        display="toggle"
        default={true}
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'info',
          operator: 'EQUAL',
        }}
      />
    </FieldGroup>
    <RepeatedFieldGroup
      label="Testimonial"
      name="groupTestimonial"
      occurrence={{
        min: 1,
        max: 20,
        default: 3,
        sorting_label_field: 'groupTestimonial.groupQuote.quote',
      }}
      default={[testimonial1, testimonial2, testimonial3, testimonial4, testimonial5]}
    >
      <FieldGroup
        label="Quote"
        name="groupQuote"
        display="inline"
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'testimonial',
          operator: 'EQUAL',
        }}
      >
        <TextField
          label="Quotation text"
          name="quote"
          required={true}
          default="The measurable results have transformed our business. Highly recommend for anyone looking to elevate their marketing game."
        />
      </FieldGroup>
      <FieldGroup
        label="Author"
        name="groupAuthor"
        display="inline"
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'testimonial',
          operator: 'EQUAL',
        }}
      >
        <TextField label="Name" name="authorName" default="Sarah Johnson" />
        <TextField label="Title" name="authorTitle" default="Chief Marketing Officer @ StellarForge" />
        <ImageField
          label="Image"
          name="authorImage"
          resizable={false}
          responsive={false}
          showLoading={false}
          default={{
            alt: '',
            src: authorImage,
          }}
        />
      </FieldGroup>
      <FieldGroup
        label="Image"
        name="groupImage"
        display="inline"
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'testimonial',
          operator: 'EQUAL',
        }}
      >
        <BooleanField label="Show image" name="showImage" display="toggle" default={true} />
        <ImageField
          label="Image"
          name="image"
          resizable={false}
          responsive={false}
          showLoading={false}
          visibility={{
            controlling_field_path: 'groupTestimonial.groupImage.showImage',
            controlling_value_regex: 'true',
            operator: 'EQUAL',
          }}
          default={{
            alt: '',
            src: testimonialImageOne,
          }}
        />
      </FieldGroup>
      <FieldGroup
        label="Link"
        name="groupLink"
        display="inline"
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'testimonial',
          operator: 'EQUAL',
        }}
      >
        <TextField label="Link text" name="linkText" default="Read case study" />
        <LinkField
          label="Link"
          name="link"
          supportedTypes={['EXTERNAL', 'CONTENT', 'FILE', 'EMAIL_ADDRESS', 'CALL_TO_ACTION', 'BLOG', 'PAYMENT']}
          default={{}}
        />
      </FieldGroup>
      <FieldGroup
        label="Info content"
        name="groupInfoContent"
        display="inline"
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'info',
          operator: 'EQUAL',
        }}
      >
        <RichTextContent
          label="Info content"
          richTextDefault={defaultRichTextInfo}
          featureSet="text"
        />
      </FieldGroup>
      <FieldGroup
        label="Info background image"
        name="groupInfoImage"
        display="inline"
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'info',
          operator: 'EQUAL',
        }}
      >
        <BooleanField label="Show background image" name="showImage" display="toggle" default={false} />
        <ImageField
          label="Background image"
          name="image"
          resizable={true}
          responsive={true}
          showLoading={true}
          visibility={{
            controlling_field_path: 'groupTestimonial.groupInfoImage.showImage',
            controlling_value_regex: 'true',
            operator: 'EQUAL',
          }}
          default={{
            alt: '',
            loading: 'lazy',
            max_height: 1080,
            max_width: 1920,
            size_type: 'auto_custom_max',
            src: heroImage,
          }}
        />
      </FieldGroup>
      <FieldGroup
        label="Info button"
        name="groupInfoButton"
        display="inline"
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'info',
          operator: 'EQUAL',
        }}
      >
        <BooleanField label="Show button" name="showButton" display="toggle" default={false} />
        <ButtonContent
          textDefault="Industrial IoT &amp; smart metering"
          linkDefault={{
            open_in_new_tab: false,
          }}
          textVisibility={infoButtonFieldVisibility}
          linkVisibility={infoButtonFieldVisibility}
          showIconVisibility={infoButtonFieldVisibility}
        />
      </FieldGroup>
    </RepeatedFieldGroup>
    <FieldGroup label="Default text" name="groupDefaultText" locked={true}>
      <TextField label="Previous" name="previousArrowAltText" default="Previous" />
      <TextField label="Next" name="nextArrowAltText" default="Next" />
      <TextField label="Navigate to slide number" name="navigateToSlideNumberAriaLabel" default="Go to slide %s" />
      <TextField label="Navigate to prev slide" name="navigateToPreviousSlideAriaLabel" default="Go to previous slide" />
      <TextField label="Navigate to next slide" name="navigateToNextSlideAriaLabel" default="Go to next slide" />
      <TextField label="Navigate to first slide" name="navigateToFirstSlideAriaLabel" default="Go to first slide" />
      <TextField label="Navigate to last slide" name="navigateToLastSlideAriaLabel" default="Go to last slide" />
      <TextField label="Carousel" name="carouselAriaLabel" default="Carousel" />
      <TextField label="Select slide to show" name="selectSlideNavigationAriaLabel" default="Select a slide to show" />
      <TextField label="Slide" name="slideAriaLabel" default="Slide" />
      <TextField label="Slide num of slides total" name="slideNumberOfSlidesTotalAriaLabel" default="%s of %s" />
    </FieldGroup>
    <StyleFields />
  </ModuleFields>
);
