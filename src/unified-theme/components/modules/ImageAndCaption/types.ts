import {
  ImageFieldType,
  BooleanFieldType,
  TextFieldType,
  AlignmentFieldType,
  ColorFieldType,
} from '@hubspot/cms-components/fields';

export interface GroupStyle {
  captionBackgroundColor?: ColorFieldType['default'];
  captionTextColor?: ColorFieldType['default'];
}

export interface ImageAndCaptionProps {
  moduleName?: string;
  image?: ImageFieldType['default'];
  addCaption?: BooleanFieldType['default'];
  img_caption?: TextFieldType['default'];
  captionAlignment?: AlignmentFieldType['default'];
  groupStyle?: GroupStyle;
}
