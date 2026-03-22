import {
  AlignmentFieldType,
  BooleanFieldType,
  ColorFieldType,
  TextAlignmentFieldType,
  TextFieldType,
} from '@hubspot/cms-components/fields';
import { ButtonContentType } from '../../fieldLibrary/ButtonContent/types.js';
import { ButtonStyleFieldLibraryType } from '../../fieldLibrary/ButtonStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../fieldLibrary/HeadingAndText/types.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { RichTextContentFieldLibraryType } from '../../fieldLibrary/RichTextContent/types.js';
import { SectionStyleFieldLibraryType } from '../../fieldLibrary/SectionStyle/types.js';

export type CaseStudyGroupContent = RichTextContentFieldLibraryType &
  HeadingAndTextFieldLibraryType & {
    showDivider?: BooleanFieldType['default'];
    showCaption?: BooleanFieldType['default'];
    captionText?: TextFieldType['default'];
  };

export type CaseStudyGroupButton = ButtonContentType & {
  showButton?: BooleanFieldType['default'];
};

export type CaseStudyGroupContentStyle = SectionStyleFieldLibraryType &
  HeadingStyleFieldLibraryType & {
    headingUppercase?: BooleanFieldType['default'];
    headingTextAlignment?: TextAlignmentFieldType['default'];
    richTextTextAlignment?: TextAlignmentFieldType['default'];
    captionColor?: ColorFieldType['default'];
    dividerHorizontalAlignment?: AlignmentFieldType['default'];
    captionHorizontalAlignment?: AlignmentFieldType['default'];
  };

export type CaseStudyGroupStyle = {
  groupContent: CaseStudyGroupContentStyle;
  groupButton: ButtonStyleFieldLibraryType & {
    buttonHorizontalAlignment?: AlignmentFieldType['default'];
  };
};

export type CaseStudyProps = {
  moduleName?: string;
  groupContent: CaseStudyGroupContent;
  groupButton: CaseStudyGroupButton;
  groupStyle: CaseStudyGroupStyle;
};
