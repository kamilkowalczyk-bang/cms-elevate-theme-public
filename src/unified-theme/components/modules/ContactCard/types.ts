import {
  AlignmentFieldType,
  BooleanFieldType,
  IconFieldType,
  ImageFieldType,
  LinkFieldType,
  TextFieldType,
} from '@hubspot/cms-components/fields';
import { ButtonContentType } from '../../fieldLibrary/ButtonContent/types.js';
import { ButtonStyleType, StandardSizeType } from '../../types/fields.js';
import { CardStyleFieldLibraryType } from '../../fieldLibrary/CardStyle/types.js';

export type ContactSocialLink = {
  socialIcon: IconFieldType['default'];
  socialLabel: TextFieldType['default'];
  socialLink: LinkFieldType['default'];
};

export type ContactCardItem = {
  groupHubdbRow?: {
    id?: unknown;
    rowId?: unknown;
    row_id?: unknown;
    values?: Record<string, unknown>;
    [key: string]: unknown;
  };
  groupRegion: {
    showRegion: BooleanFieldType['default'];
    region: TextFieldType['default'];
  };
  groupIdentity: {
    contactImage: ImageFieldType['default'];
    fullName: TextFieldType['default'];
    department: TextFieldType['default'];
  };
  groupPhone: {
    showPhone: BooleanFieldType['default'];
    phoneText: TextFieldType['default'];
    phoneLink: LinkFieldType['default'];
  };
  groupEmail: {
    showEmail: BooleanFieldType['default'];
    emailText: TextFieldType['default'];
    emailLink: LinkFieldType['default'];
  };
  groupSocial: {
    showSocialMedia: BooleanFieldType['default'];
    groupSocialLinks: ContactSocialLink[];
  };
  groupButton: ButtonContentType & {
    showButton: BooleanFieldType['default'];
  };
};

/** Server-resolved HubDB row for manual / feed mode (`hubdb_table_row` in hublDataTemplate). */
export type ManualHubDbRowSnapshot = {
  region?: string;
  department?: string;
  button_text?: string;
  full_name?: string;
  contact_image?: unknown;
  phone_text?: string;
  phone_link?: unknown;
  email_text?: string;
  email_link?: unknown;
  button_link?: unknown;
  show_region?: unknown;
  show_phone?: unknown;
  show_email?: unknown;
  show_social_media?: unknown;
  show_button?: unknown;
  values?: Record<string, unknown>;
  hs_id?: unknown;
  id?: unknown;
  [key: string]: unknown;
};

export type ContactCardStyles = {
  groupCard: CardStyleFieldLibraryType & {
    showCardShadow: BooleanFieldType['default'];
    showCardBorder: BooleanFieldType['default'];
  };
  groupLayout: {
    cardsAlignment: AlignmentFieldType['default'];
    contentAlignment: AlignmentFieldType['default'];
  };
  groupButton: {
    buttonStyleVariant: ButtonStyleType;
    buttonStyleSize: StandardSizeType;
  };
};

export type ContactCardProps = {
  moduleName?: string;
  useHubDB?: BooleanFieldType['default'];
  /** When true, server hubl can fill `manualHubDbRows` from invoicing flag if repeater pickers resolve to nothing. */
  hubdbFallbackInvoicingWhenEmpty?: BooleanFieldType['default'];
  groupContactCards?: ContactCardItem[];
  /** When omitted (e.g. template `{% module %}` overrides), the island uses field defaults. */
  groupStyle?: ContactCardStyles;
  hublData?: {
    manualHubDbRows?: (ManualHubDbRowSnapshot | null)[];
    /** Set when hublDataTemplate used invoicing-only table rows instead of per-slot HubDB pickers. */
    feedFromManualHubDbOnly?: boolean;
    /** Page language slug from content.language.languageTag (en, fi, fr, de). */
    pageLang?: string;
  };
};
