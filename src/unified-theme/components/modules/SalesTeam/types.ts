import { AlignmentFieldType, BooleanFieldType, LinkFieldType, TextFieldType } from '@hubspot/cms-components/fields';
import { ButtonStyleType, StandardSizeType } from '../../types/fields.js';
import { CardStyleFieldLibraryType } from '../../fieldLibrary/CardStyle/types.js';

export type SalesTeamRegionalSlot = {
  groupHubdbRow?: {
    id?: unknown;
    rowId?: unknown;
    row_id?: unknown;
    values?: Record<string, unknown>;
    [key: string]: unknown;
  };
};

export type SalesTeamStyles = {
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

export type SalesTeamProps = {
  moduleName?: string;
  bookDemo: BooleanFieldType['default'];
  groupBookDemoCta?: {
    prefaceText: TextFieldType['default'];
    linkText: TextFieldType['default'];
    link: LinkFieldType['default'];
  };
  groupRegionalCards: SalesTeamRegionalSlot[];
  groupStyle: SalesTeamStyles;
  hublData?: {
    manualHubDbRowsRegional?: (Record<string, unknown> | null | undefined)[];
    featuredHubDbRow?: Record<string, unknown> | null;
    featuredRowId?: number | null;
  };
};
