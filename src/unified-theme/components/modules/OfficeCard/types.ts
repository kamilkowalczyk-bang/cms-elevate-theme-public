import {
  BooleanFieldType,
  ImageFieldType,
  LinkFieldType,
  NumberFieldType,
  TextFieldType,
} from '@hubspot/cms-components/fields';

export type OfficeCardItem = {
  groupHubdbRow?: {
    id?: unknown;
    rowId?: unknown;
    row_id?: unknown;
    values?: Record<string, unknown>;
    [key: string]: unknown;
  };
  groupInfo: {
    officeName: TextFieldType['default'];
    streetAddress: TextFieldType['default'];
    postalCode: TextFieldType['default'];
    city: TextFieldType['default'];
    country: TextFieldType['default'];
    emailText: TextFieldType['default'];
    phoneText: TextFieldType['default'];
    emailLink: LinkFieldType['default'];
    phoneLink: LinkFieldType['default'];
  };
  groupMap: {
    mapLocation: TextFieldType['default'];
    mapZoom: NumberFieldType['default'];
    googleMapsLink: LinkFieldType['default'];
    mapImage?: ImageFieldType['default'];
  };
};

export type OfficeCardProps = {
  moduleName?: string;
  useHubDB?: BooleanFieldType['default'];
  /** When true, hubl can fill from `offices` if repeater picks resolve to nothing. */
  hubdbFallbackOfficesWhenEmpty?: BooleanFieldType['default'];
  groupOfficeCards?: OfficeCardItem[];
  hublData?: {
    manualHubDbRows?: (Record<string, unknown> | null)[];
    feedFromManualHubDbOnly?: boolean;
  };
};
