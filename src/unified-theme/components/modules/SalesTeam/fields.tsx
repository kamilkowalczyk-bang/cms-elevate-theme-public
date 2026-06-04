import {
  ModuleFields,
  RepeatedFieldGroup,
  HubDbRowField,
  BooleanField,
  FieldGroup,
  TextField,
  LinkField,
  Visibility,
} from '@hubspot/cms-components/fields';
import StyleFields from './styleFields.js';
import { HUBDB_TABLE_NAMES } from '../../utils/hubdb-table-names.js';
import { CONTACT_CARD_LOCALIZED_COLUMNS_TO_FETCH } from '../../utils/hubdb-contact-card-i18n.js';

const bookDemoFieldVisibility = {
  controlling_field_path: 'bookDemo',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
} as const satisfies Visibility;

const geoAutoSelectFieldVisibility = {
  controlling_field_path: 'bookDemo',
  controlling_value_regex: 'false',
  operator: 'EQUAL',
} as const satisfies Visibility;

export const fields = (
  <ModuleFields>
    <BooleanField
      label="Book demo"
      name="bookDemo"
      display="toggle"
      default={false}
      helpText="When enabled, the featured rep and meeting are taken from the ordered regional cards list and the second row is hidden."
    />
    <BooleanField
      label="Auto-select featured rep by visitor region"
      name="enableGeoAutoSelect"
      display="toggle"
      default={false}
      visibility={geoAutoSelectFieldVisibility}
      helpText="Uses visitor IP country (client-side) to match a contact_cards row by Sales region; falls back to the Default sales rep when unknown. Ignored when Book demo is on."
    />
    <BooleanField
      label="Simplify regional picker cards"
      name="simplifyRegionalGridCards"
      display="toggle"
      default={false}
      visibility={geoAutoSelectFieldVisibility}
      helpText="When on, the bottom regional grid hides phone, email, social link, and book/CTA button so each card is only a rep selector; the featured card beside the meeting stays unchanged. Default off for other pages."
    />
    <FieldGroup
      label="Book demo CTA"
      name="groupBookDemoCta"
      display="inline"
      visibility={bookDemoFieldVisibility}
    >
      <TextField
        label="CTA preface text"
        name="prefaceText"
        default="Not your region?"
      />
      <TextField
        label="CTA link text"
        name="linkText"
        default="Contact our sales team"
      />
      <LinkField
        label="CTA link"
        name="link"
        default={{
          url: {
            type: 'EXTERNAL',
            content_id: 0,
            href: '',
          },
          open_in_new_tab: false,
        }}
      />
    </FieldGroup>
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
          ...CONTACT_CARD_LOCALIZED_COLUMNS_TO_FETCH,
        ]}
        displayColumns={['full_name']}
        displayFormat="%0"
        helpText="Use contact_cards. Set Sales region to a real region for this card to appear, or N/A to skip this slot."
      />
    </RepeatedFieldGroup>
    <StyleFields />
  </ModuleFields>
);
