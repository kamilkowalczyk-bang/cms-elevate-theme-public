import { FieldGroup, BooleanField, NumberField } from '@hubspot/cms-components/fields';
import { CardStyle } from '../../fieldLibrary/index.js';

export default function StyleFields() {
  return (
    <FieldGroup label="Styles" name="groupStyle" tab="STYLE">
      <BooleanField
        label="Show card shadow"
        name="showTestimonialDropShadow"
        display="toggle"
        default={false}
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'testimonial',
          operator: 'EQUAL',
        }}
      />
      <BooleanField
        label="Bold uppercase quotation"
        name="showTestimonialQuoteBoldUppercase"
        display="toggle"
        default={false}
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'testimonial',
          operator: 'EQUAL',
        }}
      />
      <NumberField
        label="Featured image max width"
        name="testimonialFeaturedImageMaxWidth"
        display="slider"
        min={120}
        max={1200}
        step={10}
        suffix="px"
        default={400}
        helpText="Caps the wide testimonial image (not the author photo) on desktop. Info layout ignores this."
        visibility={{
          controlling_field_path: 'groupLayout.layoutType',
          controlling_value_regex: 'testimonial',
          operator: 'EQUAL',
        }}
      />
      <CardStyle cardStyleDefault="card_variant_1" />
    </FieldGroup>
  );
}
