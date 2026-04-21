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
  groupContactCards: ContactCardItem[];
  groupStyle: ContactCardStyles;
  hublData?: {
    manualHubDbRows?: (Record<string, unknown> | null)[];
  };
};
