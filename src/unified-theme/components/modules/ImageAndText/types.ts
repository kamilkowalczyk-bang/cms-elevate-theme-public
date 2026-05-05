import {
  ImageFieldType,
  BooleanFieldType,
  AlignmentFieldType,
  ColorFieldType,
  IconFieldType,
  TextFieldType,
} from '@hubspot/cms-components/fields';
import { ElementPositionType } from '../../types/fields.js';
import { ButtonContentType } from '../../fieldLibrary/ButtonContent/types.js';
import { ButtonStyleFieldLibraryType } from '../../fieldLibrary/ButtonStyle/types.js';
import { SectionStyleFieldLibraryType } from '../../fieldLibrary/SectionStyle/types.js';
import { RichTextContentFieldLibraryType } from '../../fieldLibrary/RichTextContent/types.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../fieldLibrary/HeadingAndText/types.js';

// Image group types
export interface GroupImage {
  image?: ImageFieldType['default'];
  imagePosition: ElementPositionType;
  containerBackgroundImage?: ImageFieldType['default'];
}

// Button group types
export interface GroupButton extends ButtonContentType {
  showButton: BooleanFieldType['default'];
}

export type GroupButtonStyle = ButtonStyleFieldLibraryType;

export type GroupContentListItem = {
  groupListContent: {
    listItemContent: TextFieldType['default'];
  };
};

// Content group types
export type GroupContent = RichTextContentFieldLibraryType &
  HeadingAndTextFieldLibraryType & {
    showCaption?: BooleanFieldType['default'];
    captionText?: TextFieldType['default'];
    showList?: BooleanFieldType['default'];
    listIcon?: IconFieldType['default'];
    groupListItems?: GroupContentListItem[];
  };

export type GroupContentStyle = SectionStyleFieldLibraryType &
  HeadingStyleFieldLibraryType & {
    verticalAlignment: AlignmentFieldType['default'];
    contentBackgroundColor?: ColorFieldType['default'];
    captionColor?: ColorFieldType['default'];
    headingUppercase?: BooleanFieldType['default'];
    showContentDivider?: BooleanFieldType['default'];
    dividerHorizontalAlignment?: AlignmentFieldType['default'];
    /** Description vs list visual order when both are present. Omitted = body first (legacy). */
    bodyListOrder?: 'body_first' | 'list_first';
  };

export interface GroupModuleStyle {
  showDropShadow?: BooleanFieldType['default'];
  showRoundedCorners?: BooleanFieldType['default'];
}

// Style group types
export interface GroupStyle {
  groupContent: GroupContentStyle;
  groupButton: GroupButtonStyle;
  groupModule?: GroupModuleStyle;
}

// Main component props
export interface ImageAndTextProps {
  moduleName?: string;
  groupImage: GroupImage;
  groupContent: GroupContent;
  groupButton: GroupButton;
  groupStyle: GroupStyle;
}

// Utility types for stories and testing
export interface ImageConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading: 'lazy' | 'eager';
}

export interface ImageAndTextOptions {
  imagePosition?: ElementPositionType;
  showButton?: boolean;
  headingLevel?: GroupContent['headingAndTextHeadingLevel'];
  buttonText?: string;
  imageConfig?: Partial<ImageConfig>;
  styleOverrides?: {
    groupContent?: Partial<GroupContentStyle>;
    groupButton?: Partial<GroupButtonStyle>;
    groupModule?: Partial<GroupModuleStyle>;
  };
}
