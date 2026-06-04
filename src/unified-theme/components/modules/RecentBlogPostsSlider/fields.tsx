import { ModuleFields, BlogField, BooleanField, TagField, FieldGroup, TextField, NumberField } from '@hubspot/cms-components/fields';
import StyleFields from './styleFields.js';
import { HeadingAndText } from '../../fieldLibrary/index.js';
import { AdvancedVisibility } from '@hubspot/cms-components/fields';

const textVisibility: AdvancedVisibility = {
  boolean_operator: 'AND',
  criteria: [
    {
      controlling_field_path: 'headingAndTextHeadingLevel',
      operator: 'EQUAL',
      controlling_value_regex: 'ThisFieldShouldAlwaysBeHidden',
    },
  ],
};

export const fields = (
  <ModuleFields>
    <BlogField label="Blog" name="blog" />
    <BooleanField
      label="Exclude current post"
      display="toggle"
      name="excludeCurrentPost"
      default={true}
      helpText="When enabled on blog post pages, the current post will be excluded from this list."
    />
    <BooleanField label="Filter by tag" display="toggle" name="filterByTag" default={false} />
    <TagField
      label="Tag"
      name="tag"
      tagValue="SLUG"
      visibility={{
        controlling_field_path: 'filterByTag',
        controlling_value_regex: 'true',
        operator: 'EQUAL',
      }}
    />
    <NumberField
      label="Number of posts"
      name="postLimit"
      display="slider"
      min={1}
      max={9}
      default={3}
      step={1}
      helpText="Set how many recent posts to show."
    />
    <BooleanField
      label="Show navigation arrows"
      name="showNavigationArrows"
      display="toggle"
      default={true}
    />
    <TextField label="Read article link label" name="readArticleLabel" default="Read the article" />
    <HeadingAndText headingLevelDefault="h5" textVisibility={textVisibility} />
    <StyleFields />
    <FieldGroup label="Placeholder text" name="groupPlaceholderText" locked={true}>
      <TextField label="Title" name="placeholderTitle" default="No posts found" />
      <TextField label="Description" name="placeholderDescription" default="Select a blog in the sidebar" />
    </FieldGroup>
  </ModuleFields>
);
