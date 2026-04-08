import { TextFieldType } from '@hubspot/cms-components/fields';
import { SectionStyleFieldLibraryType } from '../../fieldLibrary/SectionStyle/types.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../fieldLibrary/HeadingAndText/types.js';

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
  groupStyle: LogoGridSliderGroupStyle;
  hublData: {
    renderedWithGrids: boolean;
    logoRows?: LogoSliderItem[];
  };
};

export type LogoGridSliderIslandProps = {
  heading?: string;
  headingLevel?: string;
  description?: TextFieldType['default'];
  groupStyle: LogoGridSliderGroupStyle;
  renderedWithGrids?: boolean;
  logoRows?: LogoSliderItem[];
};
