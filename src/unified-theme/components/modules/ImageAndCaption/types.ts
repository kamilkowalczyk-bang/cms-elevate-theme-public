import {
  ImageFieldType,
  BooleanFieldType,
  TextFieldType,
  AlignmentFieldType,
  ColorFieldType,
} from '@hubspot/cms-components/fields';

export type ImageAspectRatioChoice = 'original' | 'ratio_16_9' | 'ratio_4_3' | 'ratio_3_2';

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
  useAdvancedImageEditing?: BooleanFieldType['default'];
  imageAspectRatio?: ImageAspectRatioChoice;
  imageObjectFitCover?: BooleanFieldType['default'];
  imageObjectPosition?: AlignmentFieldType['default'];
  groupStyle?: GroupStyle;
}
