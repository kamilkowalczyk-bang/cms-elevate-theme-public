import {
  ModuleFields,
  RepeatedFieldGroup,
  FieldGroup,
  ImageField,
  ChoiceField,
  TextField,
  BooleanField,
  ColorField,
  AdvancedVisibility,
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

const headingRichTextVisibility: AdvancedVisibility = {
  boolean_operator: 'AND',
  criteria: [
    {
      controlling_field_path: 'groupHeading.showHeadingRichText',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
  ],
};

export const fields = (
  <ModuleFields>
    <BooleanField label="Elevate (offset)" name="isElevated" display="toggle" default={false} />

    <FieldGroup label="Heading" name="groupHeading" display="inline">
      <TextField
        label="Heading text"
        name="heading"
        default="YOUR TRUSTED ANTENNA DESIGN PARTNER"
        inlineEditable={true}
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
      <BooleanField
        label="Show text below heading"
        name="showHeadingRichText"
        display="toggle"
        default={false}
        helpText="When enabled, rich text appears under the main heading."
      />
      <RichTextContent
        label="Text below heading"
        featureSet="extended"
        richTextDefault="<p>Lorem ipsum dolor sit amet consectetur. Non dis eget ut aliquam magna dui nec facilisi. Dui gravida aliquam nisl dis in.</p>"
        richTextVisibility={headingRichTextVisibility}
      />
    </FieldGroup>

    <FieldGroup label="Styles" name="groupStyle" tab="STYLE" display="inline">
      <ColorField
        label="Module background"
        name="sectionBackgroundColor"
        helpText="Background color and opacity for the whole module (section container)."
        default={{ color: '#F0F0F3', opacity: 100 }}
      />
      <SectionStyle sectionStyleDefault="section_variant_1" />
      <HeadingStyle headingStyleAsDefault="display_title" />
    </FieldGroup>

    <RepeatedFieldGroup
      label="Feature cards"
      name="groupCards"
      id="groupCards"
      occurrence={{
        min: 0,
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

