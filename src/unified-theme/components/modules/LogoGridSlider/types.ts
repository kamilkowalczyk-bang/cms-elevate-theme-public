import { TextFieldType } from '@hubspot/cms-components/fields';
import { SectionStyleFieldLibraryType } from '../../fieldLibrary/SectionStyle/types.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../fieldLibrary/HeadingAndText/types.js';
import { HeadingLevelType } from '../../types/fields.js';

export type LogoSliderItem = {
  id: number;
  name?: string;
  logo: {
    src?: string;
    alt?: string;
    loading?: string;
    width?: number;
    height?: number;
  };
};

export type LogoGridSliderGroupContent = HeadingAndTextFieldLibraryType & {
  description?: TextFieldType['default'];
};

export type LogoGridSliderGroupLayout = {
  logoMaxHeight?: number;
};

export type LogoGridSliderGroupStyle = SectionStyleFieldLibraryType &
  HeadingStyleFieldLibraryType & {
    groupLayout?: LogoGridSliderGroupLayout;
  };

export type LogoGridSliderProps = {
  moduleName?: string;
  groupContent: LogoGridSliderGroupContent;
  slidesPerPage?: number;
  groupStyle: LogoGridSliderGroupStyle;
  hublData: {
    renderedWithGrids: boolean;
    logoRows?: LogoSliderItem[];
  };
};

export type LogoGridSliderIslandProps = {
  heading?: string;
  headingLevel?: HeadingLevelType;
  description?: TextFieldType['default'];
  slidesPerPage?: number;
  groupStyle: LogoGridSliderGroupStyle;
  renderedWithGrids?: boolean;
  logoRows?: LogoSliderItem[];
};
