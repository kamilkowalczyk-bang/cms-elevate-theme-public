import {
  ModuleFields,
  FieldGroup,
  TextField,
} from '@hubspot/cms-components/fields';
import { HeadingAndText } from '../../fieldLibrary/index.js';
import StyleFields from './styleFields.js';

export const fields = (
  <ModuleFields>
    <FieldGroup
      label="Content"
      name="groupContent"
    >
      <HeadingAndText
        headingLevelDefault="h2"
        textDefault="We have helped them"
      />
      <TextField
        label="Description"
        name="description"
        inlineEditable={true}
      />
    </FieldGroup>
    <StyleFields />
  </ModuleFields>
);

