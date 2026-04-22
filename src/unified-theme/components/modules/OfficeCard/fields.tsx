import {
  ModuleFields,
  RepeatedFieldGroup,
  FieldGroup,
  BooleanField,
  HubDbRowField,
  TextField,
  LinkField,
  NumberField,
  Visibility,
} from '@hubspot/cms-components/fields';
import { HUBDB_TABLE_NAMES } from '../../utils/hubdb-table-names.js';

const manualCardFieldVisibility = {
  controlling_field_path: 'useHubDB',
  controlling_value_regex: 'false',
  operator: 'EQUAL',
} as const satisfies Visibility;

const hubDbPickerVisibility = {
  controlling_field_path: 'useHubDB',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
} as const satisfies Visibility;

export const fields = (
  <ModuleFields>
    <BooleanField
      label="Use HubDB"
      name="useHubDB"
      display="toggle"
      default={false}
      helpText="When enabled, each office card can be populated from the offices HubDB table."
    />
    <RepeatedFieldGroup
      label="Office cards"
      name="groupOfficeCards"
      occurrence={{
        min: 1,
        max: 20,
        default: 2,
      }}
      default={[
        {
          groupInfo: {
            officeName: 'HQ - Tampere',
            streetAddress: 'Visiokatu 4',
            postalCode: '33720',
            city: 'Tampere',
            country: 'Finland',
            emailText: 'contact@radientum.fi',
            phoneText: '+358 40 501 3535',
            emailLink: {
              url: {
                type: 'EMAIL_ADDRESS',
                content_id: 0,
                href: 'contact@radientum.fi',
              },
            },
            phoneLink: {
              url: {
                type: 'PHONE_NUMBER',
                content_id: 0,
                href: '+358405013535',
              },
            },
          },
          groupMap: {
            mapLocation: '61.4981,23.7608',
            mapZoom: 15,
            googleMapsLink: {
              url: {
                type: 'EXTERNAL',
                content_id: 0,
                href: 'https://www.google.com/maps/search/?api=1&query=Visiokatu+4,+33720+Tampere,+Finland',
              },
              open_in_new_tab: true,
            },
          },
        },
        {
          groupInfo: {
            officeName: 'Design office - Espoo',
            streetAddress: 'Tekniikantie 14',
            postalCode: '02150',
            city: 'Espoo',
            country: 'Finland',
            emailText: '',
            phoneText: '',
            emailLink: {
              url: {
                type: 'EMAIL_ADDRESS',
                content_id: 0,
                href: '',
              },
            },
            phoneLink: {
              url: {
                type: 'PHONE_NUMBER',
                content_id: 0,
                href: '',
              },
            },
          },
          groupMap: {
            mapLocation: '60.1868,24.826',
            mapZoom: 15,
            googleMapsLink: {
              url: {
                type: 'EXTERNAL',
                content_id: 0,
                href: 'https://www.google.com/maps/search/?api=1&query=Tekniikantie+14,+02150+Espoo,+Finland',
              },
              open_in_new_tab: true,
            },
          },
        },
      ]}
    >
      <HubDbRowField
        label="Choose from HubDB"
        name="groupHubdbRow"
        tableNameOrId={HUBDB_TABLE_NAMES.officeCard}
        required={false}
        locked={false}
        columnsToFetch={[
          'hs_id',
          'office_name',
          'street_address',
          'postal_code',
          'city',
          'country',
          'email',
          'phone',
          'map_zoom',
          'office_location',
          'google_maps_url',
          'map_image',
        ]}
        displayColumns={['office_name']}
        displayFormat="%0"
        visibility={hubDbPickerVisibility}
        helpText="Select a row from offices to populate this card."
      />
      <FieldGroup
        label="Office info"
        name="groupInfo"
        display="inline"
        visibility={manualCardFieldVisibility}
      >
        <TextField label="Office name" name="officeName" default="HQ - Tampere" inlineEditable={true} />
        <TextField label="Street address" name="streetAddress" default="Visiokatu 4" inlineEditable={true} />
        <TextField label="Postal code" name="postalCode" default="33720" inlineEditable={true} />
        <TextField label="City" name="city" default="Tampere" inlineEditable={true} />
        <TextField label="Country" name="country" default="Finland" inlineEditable={true} />
        <TextField label="Email" name="emailText" default="contact@radientum.fi" inlineEditable={true} />
        <LinkField
          label="Email link (optional)"
          name="emailLink"
          supportedTypes={['EMAIL_ADDRESS', 'EXTERNAL']}
          default={{
            url: {
              type: 'EMAIL_ADDRESS',
              content_id: 0,
              href: 'contact@radientum.fi',
            },
          }}
        />
        <TextField label="Phone" name="phoneText" default="+358 40 501 3535" inlineEditable={true} />
        <LinkField
          label="Phone link (optional)"
          name="phoneLink"
          supportedTypes={['PHONE_NUMBER', 'EXTERNAL']}
          default={{
            url: {
              type: 'PHONE_NUMBER',
              content_id: 0,
              href: '+358405013535',
            },
          }}
        />
      </FieldGroup>
      <FieldGroup
        label="Map"
        name="groupMap"
        display="inline"
        visibility={manualCardFieldVisibility}
      >
        <TextField
          label="Map location"
          name="mapLocation"
          default="61.4981,23.7608"
          helpText="Enter latitude and longitude as one value: lat,lng (for example 61.4981,23.7608)."
        />
        <NumberField
          label="Map zoom"
          name="mapZoom"
          display="text"
          min={1}
          max={21}
          step={1}
          default={15}
        />
        <LinkField
          label="Google Maps URL (optional)"
          name="googleMapsLink"
          supportedTypes={['EXTERNAL']}
          default={{
            url: {
              type: 'EXTERNAL',
              content_id: 0,
              href: 'https://www.google.com/maps',
            },
            open_in_new_tab: true,
          }}
          helpText="Opens when visitors click the map. If empty, a link is built from map location coordinates."
        />
      </FieldGroup>
    </RepeatedFieldGroup>
  </ModuleFields>
);
