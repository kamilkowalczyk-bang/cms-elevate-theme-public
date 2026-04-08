import { FieldGroup, NumberField } from '@hubspot/cms-components/fields';
import { HeadingStyle, SectionStyle } from '../../fieldLibrary/index.js';

export default function StyleFields() {
  return (
    <FieldGroup label="Styles" name="groupStyle" tab="STYLE">
      <FieldGroup label="Layout" name="groupLayout" display="inline" expanded={true}>
        <NumberField
          label="Logo max height (px)"
          name="logoMaxHeight"
          min={50}
          max={150}
          step={1}
          default={72}
          display="slider"
          helpText="Controls the maximum height of each logo in the slider."
        />
      </FieldGroup>
      <SectionStyle sectionStyleDefault="section_variant_1" />
      <HeadingStyle headingStyleAsDefault="h2" />
    </FieldGroup>
  );
}
