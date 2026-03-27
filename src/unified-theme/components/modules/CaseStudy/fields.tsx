import {
  ModuleFields,
  FieldGroup,
  BooleanField,
  TextField,
  AlignmentField,
  TextAlignmentField,
  AdvancedVisibility,
  Visibility,
} from '@hubspot/cms-components/fields';
import {
  ButtonContent,
  ButtonStyle,
  HeadingAndText,
  HeadingStyle,
  RichTextContent,
  SectionStyle,
} from '../../fieldLibrary/index.js';

const buttonFieldVisibility: AdvancedVisibility = {
  boolean_operator: 'OR',
  criteria: [
    {
      controlling_field_path: 'groupButton.showButton',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
  ],
} as const;

const captionFieldsVisibility: Visibility = {
  controlling_field_path: 'groupContent.showCaption',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
};

const dividerVisibility: Visibility = {
  controlling_field_path: 'groupContent.showDivider',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
};

export const fields = (
  <ModuleFields>
    <FieldGroup label="Content" name="groupContent" display="inline">
      <BooleanField label="Show divider" name="showDivider" display="toggle" default={false} />
      <BooleanField label="Show caption" name="showCaption" display="toggle" default={true} />
      <TextField
        label="Caption"
        name="captionText"
        visibility={captionFieldsVisibility}
        default="Gaining trust"
        inlineEditable={true}
      />
      <HeadingAndText
        headingTextLabel="Heading"
        headingLevelDefault="h2"
        textDefault="Understanding the challenges and solving them"
      />
      <RichTextContent
        label="Description"
        richTextDefault="<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>"
        featureSet="text"
      />
    </FieldGroup>
    <FieldGroup label="Button" name="groupButton" display="inline">
      <BooleanField label="Show button" name="showButton" display="toggle" default={true} />
      <ButtonContent
        textDefault="Learn more"
        linkDefault={{
          open_in_new_tab: false,
        }}
        textVisibility={buttonFieldVisibility}
        linkVisibility={buttonFieldVisibility}
        showIconVisibility={buttonFieldVisibility}
      />
    </FieldGroup>
    <FieldGroup label="Styles" name="groupStyle" tab="STYLE">
      <FieldGroup label="Content" name="groupContent" display="inline">
        <SectionStyle sectionStyleDefault="section_variant_1" />
        <HeadingStyle headingStyleAsDefault="h2" />
        <BooleanField label="Uppercase heading" name="headingUppercase" display="toggle" default={true} />
        <TextAlignmentField
          label="Heading alignment"
          name="headingTextAlignment"
          default={{
            text_align: 'LEFT',
          }}
        />
        <TextAlignmentField
          label="Description alignment"
          name="richTextTextAlignment"
          default={{
            text_align: 'LEFT',
          }}
        />
        <AlignmentField
          label="Divider alignment"
          name="dividerHorizontalAlignment"
          visibility={dividerVisibility}
          alignmentDirection="HORIZONTAL"
          default={{
            horizontal_align: 'LEFT',
          }}
        />
        <AlignmentField
          label="Caption alignment"
          name="captionHorizontalAlignment"
          visibility={captionFieldsVisibility}
          alignmentDirection="HORIZONTAL"
          default={{
            horizontal_align: 'LEFT',
          }}
        />
      </FieldGroup>
      <FieldGroup label="Button" name="groupButton" display="inline">
        <ButtonStyle
          buttonStyleDefault="primary"
          buttonSizeDefault="medium"
          buttonSizeVisibility={buttonFieldVisibility}
          buttonStyleVisibility={buttonFieldVisibility}
        />
        <AlignmentField
          label="Button alignment"
          name="buttonHorizontalAlignment"
          visibility={buttonFieldVisibility as unknown as Visibility}
          alignmentDirection="HORIZONTAL"
          default={{
            horizontal_align: 'CENTER',
          }}
        />
      </FieldGroup>
    </FieldGroup>
  </ModuleFields>
);
