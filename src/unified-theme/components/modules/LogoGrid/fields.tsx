import {
  ModuleFields,
  FieldGroup,
  TextField,
  RepeatedFieldGroup,
  HubDbRowField,
} from '@hubspot/cms-components/fields';
import { HeadingAndText } from '../../fieldLibrary/index.js';
import StyleFields from './styleFields.js';
import { HUBDB_TABLE_NAMES } from '../../utils/hubdb-table-names.js';

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
      <RepeatedFieldGroup
        label="Logos"
        name="groupLogos"
        occurrence={{
          min: 1,
          default: 1,
          sorting_label_field: 'groupHubdbRow',
        }}
      >
        <HubDbRowField
          label="HubDB logo row"
          name="groupHubdbRow"
          required={false}
          locked={false}
          tableNameOrId={HUBDB_TABLE_NAMES.logoGrid}
          columnsToFetch={[
            'hs_id',
            'logo',
            'company_name',
          ]}
          displayColumns={['company_name']}
          displayFormat="%0"
          helpText="Select a row to render its logo in the grid. If logo alt text is empty, company_name is used."
        />
      </RepeatedFieldGroup>
    </FieldGroup>
    <StyleFields />
  </ModuleFields>
);

