import {
  ModuleFields,
  RepeatedFieldGroup,
  HubDbRowField,
} from '@hubspot/cms-components/fields';
import StyleFields from './styleFields.js';
import { HUBDB_TABLE_NAMES } from '../../utils/hubdb-table-names.js';

export const fields = (
  <ModuleFields>
    <RepeatedFieldGroup
      label="Regional sales reps (order)"
      name="groupRegionalCards"
      occurrence={{
        min: 1,
        max: 12,
        default: 4,
      }}
      default={[{}, {}, {}, {}]}
      helpText="Drag to set card order. Pick contact_cards rows per slot—including the default sales rep if they should appear here when another rep is active. HubDB “Default sales rep” only sets who is featured on first load / hard reload. Rows with Sales region = N/A are skipped. While a repeater row matches the active featured rep, that slot stays in the repeater but is visually hidden (no duplicate under the featured row)."
    >
      <HubDbRowField
        label="Contact (HubDB)"
        name="groupHubdbRow"
        tableNameOrId={HUBDB_TABLE_NAMES.contactCard}
        required={false}
        locked={false}
        columnsToFetch={[
          'hs_id',
          'full_name',
          'department',
          'region',
          'sales_region',
          'default_sales_rep',
          'meeting_embed_url',
          'phone',
          'phone_text',
          'email',
          'email_text',
          'phone_link',
          'email_link',
          'button_text',
          'button_link',
          'contact_image',
          'show_phone',
          'show_email',
          'show_region',
          'show_social_media',
          'show_button',
          'social_icon_name',
          'social_label',
          'social_link',
        ]}
        displayColumns={['full_name']}
        displayFormat="%0"
        helpText="Use contact_cards. Set Sales region to a real region for this card to appear, or N/A to skip this slot."
      />
    </RepeatedFieldGroup>
    <StyleFields />
  </ModuleFields>
);
