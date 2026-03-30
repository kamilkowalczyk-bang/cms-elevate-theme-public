import { FieldGroup, NumberField } from '@hubspot/cms-components/fields';
import { HeadingStyle, SectionStyle } from '../../fieldLibrary/index.js';

export default function StyleFields() {
  return (
    <FieldGroup
      label="Styles"
      name="groupStyle"
      tab="STYLE"
    >
      <FieldGroup
        label="Layout"
        name="groupLayout"
        display="inline"
        expanded={true}
      >
        <NumberField
          label="Logos per row (desktop)"
          name="columnsDesktop"
          min={1}
          max={8}
          step={1}
          default={5}
          display="text"
        />
        <NumberField
          label="Logos per row (tablet)"
          name="columnsTablet"
          min={1}
          max={6}
          step={1}
          default={4}
          display="text"
        />
        <NumberField
          label="Logos per row (mobile)"
          name="columnsMobile"
          min={1}
          max={4}
          step={1}
          default={2}
          display="text"
        />
      </FieldGroup>
      <SectionStyle sectionStyleDefault="section_variant_1" />
      <HeadingStyle headingStyleAsDefault="h2" />
    </FieldGroup>
  );
}
