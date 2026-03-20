import {
  ModuleFields,
  RepeatedFieldGroup,
  FieldGroup,
  ImageField,
  ChoiceField,
} from '@hubspot/cms-components/fields';
import { HeadingStyle, SectionStyle, RichTextContent } from '../../fieldLibrary/index.js';

const headingLevelChoices: Array<[string, string]> = [
  ['h1', 'Heading 1'],
  ['h2', 'Heading 2'],
  ['h3', 'Heading 3'],
  ['h4', 'Heading 4'],
  ['h5', 'Heading 5'],
  ['h6', 'Heading 6'],
];

const iconUrl = 'https://51079453.fs1.hubspotusercontent-na1.net/hubfs/51079453/Radientum_assets_2026/dashboard-speed.svg';

export const fields = (
  <ModuleFields>
    <FieldGroup label="Heading" name="groupHeading" display="inline">
      {/* Use RichText so designers can include line breaks like the screenshot */}
      <RichTextContent
        label="Heading text"
        richTextDefault={'YOUR TRUSTED<br/>ANTENNA DESIGN PARTNER'}
        featureSet="text"
      />
      <ChoiceField
        label="Semantic heading level"
        name="headingLevel"
        display="select"
        choices={headingLevelChoices}
        default="h2"
        required={true}
        helpText="This affects screen readers and how search engines understand your content."
      />
    </FieldGroup>

    <FieldGroup label="Styles" name="groupStyle" tab="STYLE" display="inline">
      <SectionStyle sectionStyleDefault="section_variant_1" />
      <HeadingStyle headingStyleAsDefault="display_title" />
    </FieldGroup>

    <RepeatedFieldGroup
      label="Feature cards"
      name="groupCards"
      id="groupCards"
      occurrence={{
        min: 1,
        max: 4,
      }}
      default={[
        {
          groupIcon: {
            image: {
              src: iconUrl,
              alt: '',
              loading: 'lazy',
            },
          },
          groupCardText: {
            richTextContentHTML: '<h4>Better performance</h4>',
          },
        },
        {
          groupIcon: {
            image: {
              src: iconUrl,
              alt: '',
              loading: 'lazy',
            },
          },
          groupCardText: {
            richTextContentHTML: '<h4>Faster time-to-market</h4>',
          },
        },
        {
          groupIcon: {
            image: {
              src: iconUrl,
              alt: '',
              loading: 'lazy',
            },
          },
          groupCardText: {
            richTextContentHTML: '<h4>Higher revenue</h4>',
          },
        },
        {
          groupIcon: {
            image: {
              src: iconUrl,
              alt: '',
              loading: 'lazy',
            },
          },
          groupCardText: {
            richTextContentHTML: '<h4>Reduced costs</h4>',
          },
        },
      ]}
    >
      <FieldGroup label="Icon" name="groupIcon" display="inline">
        <ImageField
          label="Icon image"
          name="image"
          resizable={false}
          responsive={false}
          showLoading={true}
          inlineEditable={true}
          default={{
            src: iconUrl,
            alt: '',
            loading: 'lazy',
          }}
        />
      </FieldGroup>

      <FieldGroup label="Card text" name="groupCardText" display="inline">
        <RichTextContent
          label="Title"
          featureSet="text"
          richTextDefault={'<h4>Better performance</h4>'}
        />
      </FieldGroup>
    </RepeatedFieldGroup>
  </ModuleFields>
);

