import {
  FieldGroup,
  ChoiceField,
  AlignmentField,
  BooleanField,
} from '@hubspot/cms-components/fields';
import {
  CardStyle,
  HeadingStyle,
  ButtonStyle,
} from '../../fieldLibrary/index.js';

export default function StyleFields() {
  return (
    <FieldGroup
      label='Styles'
      name='groupStyle'
      tab='STYLE'
    >
      <FieldGroup
        label='Card'
        name='groupCard'
        display='inline'
      >
        <ChoiceField
          label='Card orientation'
          name='cardOrientation'
          choices={[
            ['column', 'Column'],
            ['row', 'Row'],
          ]}
          display='radio'
          default='column'
        />
        <BooleanField
          label='Show icon border and background'
          name='showIconBorder'
          display='toggle'
          default={true}
          helpText='When off, the card icon has no border and a transparent background so full-card or image backgrounds show through.'
          visibility={{
            controlling_field: 'imageOrIcon',
            controlling_value_regex: 'icon',
            operator: 'EQUAL',
          }}
        />
        <BooleanField
          label='Show card drop shadow'
          name='showCardShadow'
          display='toggle'
          default={false}
          helpText='Adds a soft drop shadow around each card.'
        />
        <BooleanField
          label='Show card border'
          name='showCardBorder'
          display='toggle'
          default={true}
          helpText='When off, hides the outer card border. Border color, width, and radius still follow the selected card style variant in theme settings when this is on.'
        />
        <CardStyle cardStyleDefault='card_variant_1' />
      </FieldGroup>
      <FieldGroup
        label='Content'
        name='groupContent'
        display='inline'
      >
        <HeadingStyle headingStyleAsDefault='h3' />
        <AlignmentField
          label='Horizontal alignment'
          name='alignment'
          alignmentDirection='HORIZONTAL'
          default={{
            horizontal_align: 'LEFT',
          }}
        />
        <BooleanField
          label='Uppercase card heading'
          name='headingUppercase'
          display='toggle'
          default={false}
        />
      </FieldGroup>
      <FieldGroup
        label='Button'
        name='groupButton'
        display='inline'
      >
        <ButtonStyle
          buttonStyleDefault='primary'
          buttonSizeDefault='medium'
        />
      </FieldGroup>
    </FieldGroup>
  );
}

