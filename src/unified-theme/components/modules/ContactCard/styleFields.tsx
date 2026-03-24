import { AlignmentField, BooleanField, FieldGroup } from '@hubspot/cms-components/fields';
import { ButtonStyle, CardStyle } from '../../fieldLibrary/index.js';

export default function StyleFields() {
  return (
    <FieldGroup label='Styles' name='groupStyle' tab='STYLE'>
      <FieldGroup label='Card' name='groupCard' display='inline'>
        <BooleanField
          label='Show card drop shadow'
          name='showCardShadow'
          display='toggle'
          default={true}
        />
        <BooleanField
          label='Show card border'
          name='showCardBorder'
          display='toggle'
          default={true}
        />
        <CardStyle cardStyleDefault='card_variant_3' />
      </FieldGroup>
      <FieldGroup label='Layout' name='groupLayout' display='inline'>
        <AlignmentField
          label='Card alignment in container'
          name='cardsAlignment'
          alignmentDirection='HORIZONTAL'
          default={{ horizontal_align: 'CENTER' }}
        />
        <AlignmentField
          label='Inner content alignment'
          name='contentAlignment'
          alignmentDirection='HORIZONTAL'
          default={{ horizontal_align: 'CENTER' }}
        />
      </FieldGroup>
      <FieldGroup label='Button' name='groupButton' display='inline'>
        <ButtonStyle buttonStyleDefault='primary' buttonSizeDefault='small' />
      </FieldGroup>
    </FieldGroup>
  );
}
