import {
  AdvancedVisibility,
  BooleanField,
  FieldGroup,
  IconField,
  ModuleFields,
  RepeatedFieldGroup,
  RichTextField,
  TextField,
} from '@hubspot/cms-components/fields';
import { SectionStyle } from '../../fieldLibrary/index.js';

const contentDefault = 'Add a list item here.';
const groupListContentDefault = {
  groupListContent: {
    listItemContent: contentDefault,
  },
};

const listItemTextVisibility: AdvancedVisibility = {
  boolean_operator: 'AND',
  criteria: [{
    controlling_field_path: 'groupListItems.groupListContent.useAdvancedEditing',
    controlling_value_regex: 'false',
    operator: 'EQUAL',
  }],
} as const;

const listItemRichTextVisibility: AdvancedVisibility = {
  boolean_operator: 'AND',
  criteria: [{
    controlling_field_path: 'groupListItems.groupListContent.useAdvancedEditing',
    controlling_value_regex: 'true',
    operator: 'EQUAL',
  }],
} as const;

export const fields = (
  <ModuleFields>
    <IconField
      label="Icon"
      name="listIcon"
      iconSet="fontawesome-6.4.2"
      default={{
        name: 'check',
      }}
    />

    <RepeatedFieldGroup
      label="List items"
      name="groupListItems"
      id="groupListItems"
      occurrence={{
        min: 1,
        max: 20,
        default: 4,
      }}
      default={[groupListContentDefault, groupListContentDefault, groupListContentDefault, groupListContentDefault]}
    >
      <FieldGroup label="List items" name="groupListContent" display="inline">
        <BooleanField
          label="Advanced editing"
          name="useAdvancedEditing"
          display="toggle"
          default={false}
        />
        <TextField
          label="Item"
          name="listItemContent"
          default={contentDefault}
          inlineEditable={true}
          visibilityRules="ADVANCED"
          advancedVisibility={listItemTextVisibility}
        />
        <RichTextField
          label="Advanced editor"
          name="listItemContentRichTextHTML"
          default={`<p>${contentDefault}</p>`}
          inlineEditable={true}
          visibilityRules="ADVANCED"
          advancedVisibility={listItemRichTextVisibility}
        />
      </FieldGroup>
    </RepeatedFieldGroup>

    <FieldGroup label="Styles" name="groupStyle" tab="STYLE">
      <SectionStyle sectionStyleDefault="section_variant_1" />
    </FieldGroup>
  </ModuleFields>
);
