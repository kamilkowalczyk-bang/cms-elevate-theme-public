import {
  BooleanFieldType,
  ChoiceFieldType,
  ColorFieldType,
  NumberFieldType,
  TextFieldType,
} from '@hubspot/cms-components/fields';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { SectionStyleFieldLibraryType } from '../../fieldLibrary/SectionStyle/types.js';

export type GroupStyle = SectionStyleFieldLibraryType & HeadingStyleFieldLibraryType;

export type GlobeConfig = {
  highlightedCountries: string[];
  highlightColor: ColorFieldType['default'];
  baseCountryColor: ColorFieldType['default'];
  oceanColor: ColorFieldType['default'];
  manualRotation: BooleanFieldType['default'];
  autoRotationSpeed: NumberFieldType['default'];
  height: NumberFieldType['default'];
};

export type GlobalPresenceProps = {
  moduleName?: string;
  groupHeading: {
    heading: TextFieldType['default'];
    subheading: TextFieldType['default'];
    headingLevel: ChoiceFieldType['default'];
  };
  groupGlobe: GlobeConfig;
  groupStyle: GroupStyle;
};
