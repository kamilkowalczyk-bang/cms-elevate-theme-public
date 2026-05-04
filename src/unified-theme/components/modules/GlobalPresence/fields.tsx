import {
  ModuleFields,
  FieldGroup,
  TextField,
  RichTextField,
  ChoiceField,
  ColorField,
  BooleanField,
  NumberField,
} from '@hubspot/cms-components/fields';
import { SectionStyle, HeadingStyle } from '../../fieldLibrary/index.js';
import { limitedColorDefaults } from '../../utils/theme-color-sets.js';
import { COUNTRY_CHOICES } from './assets/country-codes.js';

const headingLevelChoices: Array<[string, string]> = [
  ['h1', 'Heading 1'],
  ['h2', 'Heading 2'],
  ['h3', 'Heading 3'],
  ['h4', 'Heading 4'],
  ['h5', 'Heading 5'],
  ['h6', 'Heading 6'],
];

const limitedOptionsThemeColorsSet = limitedColorDefaults.themeColors;
const limitedOptionsTextColorsSet = limitedColorDefaults.themeSectionTextColors;
const limitedOptionsBackgroundColorsSet = limitedColorDefaults.themeSectionBackgroundColors;
const limitedOptionsAccentAndBackgroundColorsSet = [...limitedOptionsThemeColorsSet, ...limitedOptionsBackgroundColorsSet];
const limitedOptionsTextAndAccentColorsSet = [...limitedOptionsThemeColorsSet, ...limitedOptionsTextColorsSet];

const themeGroupSectionsPath = 'theme.group_foundation.group_colors.group_more_settings.group_sections';
const section3AccentColor = `${themeGroupSectionsPath}.group_light_section_3.group_fonts.accent_color.color`;

const inlineHelpText = '<a href="$theme_link">Edit</a>';
const themeLink = {
  type: 'THEME_EDITOR' as const,
  name: 'theme_link',
  params: {
    theme_path: '@hubspot/elevate',
    theme_field_path: themeGroupSectionsPath,
  },
};

const defaultHighlightedCountries = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'IT',
  'LT',
  'NL',
  'NO',
  'SI',
  'ES',
  'SE',
  'CH',
  'GB',
  'CA',
  'US',
  'IN',
  'IL',
  'VN',
  'AU',
  'PL',
  'HU',
  'IE',
];

export const fields = (
  <ModuleFields>
    <FieldGroup label="Heading" name="groupHeading" display="inline">
      <TextField label="Heading" name="heading" default="GLOBAL PRESENCE" inlineEditable={true} />
      <RichTextField
        label="Subheading"
        name="subheading"
        default="<p>We serve customers all around the world</p>"
        inlineEditable={true}
      />
      <ChoiceField
        label="Semantic heading level"
        name="headingLevel"
        display="select"
        choices={headingLevelChoices}
        default="h2"
        required={true}
        helpText="This affects screen readers and how search engines understand your content."
      />
      <BooleanField
        label="Hide divider"
        name="hideDivider"
        display="toggle"
        default={false}
        helpText="When on, the decorative line above the heading is hidden."
      />
    </FieldGroup>
    <FieldGroup label="Globe" name="groupGlobe" display="inline">
      <FieldGroup label="Highlighted countries" name="groupHighlightedCountries" display="accordion" expanded={false}>
        <ChoiceField
          label="Highlighted countries"
          name="highlightedCountries"
          choices={COUNTRY_CHOICES}
          multiple={true}
          display="checkbox"
          reorderingEnabled={false}
          default={defaultHighlightedCountries}
        />
      </FieldGroup>
      <ColorField
        label="Highlight color"
        name="highlightColor"
        inlineHelpText={inlineHelpText}
        links={[themeLink]}
        inheritedValuePropertyValuePaths={{
          color: section3AccentColor,
        }}
        limitedOptions={limitedOptionsAccentAndBackgroundColorsSet}
        default={{
          color: '#52BAD1',
          opacity: 100,
        }}
      />
      <ColorField
        label="Base country color"
        name="baseCountryColor"
        limitedOptions={limitedOptionsBackgroundColorsSet}
        default={{
          color: '#E3E3E3',
          opacity: 100,
        }}
      />
      <ColorField
        label="Ocean color"
        name="oceanColor"
        limitedOptions={limitedOptionsBackgroundColorsSet}
        default={{
          color: '#FFFFFF',
          opacity: 100,
        }}
      />
      <BooleanField label="Manual rotation (drag)" name="manualRotation" display="toggle" default={true} />
      <NumberField
        label="Auto rotation speed"
        name="autoRotationSpeed"
        display="slider"
        min={0}
        max={20}
        step={0.5}
        suffix="°/s"
        default={3}
      />
      <NumberField
        label="Globe height"
        name="height"
        display="slider"
        min={300}
        max={800}
        step={10}
        suffix="px"
        default={500}
      />
    </FieldGroup>
    <FieldGroup label="Styles" name="groupStyle" tab="STYLE">
      <SectionStyle sectionStyleDefault="section_variant_1" />
      <HeadingStyle headingStyleAsDefault="display_2" />
    </FieldGroup>
  </ModuleFields>
);
