import {
  ModuleFields,
  FieldGroup,
  ImageField,
  TextField,
  BooleanField,
  TextAlignmentField,
  ChoiceField,
} from '@hubspot/cms-components/fields';
import { HeadingAndText, HeadingStyle, SectionStyle } from '../../fieldLibrary/index.js';

export const fields = (
  <ModuleFields>
    <FieldGroup name="groupLayout" label="Layout" tab="STYLE">
      <ChoiceField
        label="Layout type"
        name="layoutType"
        display="select"
        choices={[
          ['split', 'Split (text left, image right)'],
          ['overlay', 'Overlay (text on image)'],
        ]}
        required={true}
        default="split"
      />
    </FieldGroup>

    <HeadingAndText headingLevelDefault="h1" textDefault="" />

    <FieldGroup name="groupStyle" label="Styles" tab="STYLE" locked={false}>
      <SectionStyle sectionStyleDefault="section_variant_4" />
      <HeadingStyle headingStyleAsDefault="display_title" />
      <TextAlignmentField
        label="Alignment"
        name="alignment"
        default={{
          text_align: 'LEFT',
        }}
      />
      <BooleanField
        label="Uppercase heading"
        name="headingUppercase"
        display="toggle"
        default={true}
      />
    </FieldGroup>

    <TextField
      name="eyebrow"
      label="Eyebrow (optional)"
      default=""
      inlineEditable={true}
    />

    <BooleanField
      name="showSubtext"
      label="Show subtext"
      display="toggle"
      default={false}
      helpText="When enabled, displays subtext under the title."
    />
    <TextField
      name="subtext"
      label="Subtext"
      default=""
      inlineEditable={true}
      visibility={{
        controlling_field_path: 'showSubtext',
        controlling_value_regex: 'true',
        operator: 'EQUAL',
      }}
    />

    <ImageField
      label="Hero image"
      name="image"
      resizable={false}
      responsive={false}
      showLoading={false}
      default={{
        src: '',
        alt: '',
        loading: 'eager',
      }}
    />
  </ModuleFields>
);

