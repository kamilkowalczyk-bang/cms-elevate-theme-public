import {
  ModuleFields,
  ImageField,
  BooleanField,
  TextField,
  AlignmentField,
  ColorField,
  FieldGroup,
  Visibility,
} from '@hubspot/cms-components/fields';

const captionVisibility = {
  controlling_field_path: 'addCaption',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
} as const satisfies Visibility;

export const fields = (
  <ModuleFields>
    <ImageField
      label='Image'
      name='image'
      locked={false}
      responsive={true}
      resizable={true}
      showLoading={false}
      default={{
        size_type: 'exact',
        src: '',
        alt: 'image-alt-text',
        loading: 'lazy',
        width: 128,
        height: 128,
        max_width: 128,
        max_height: 128,
      }}
      inlineEditable={true}
    />
    <BooleanField
      label='Add caption'
      name='addCaption'
      display='toggle'
      default={false}
    />
    <TextField
      label='Image caption'
      name='img_caption'
      default='Image caption'
      allowNewLine={true}
      visibility={captionVisibility}
      inlineEditable={true}
    />
    <AlignmentField
      label='Align caption text'
      name='captionAlignment'
      visibility={captionVisibility}
      alignmentDirection='HORIZONTAL'
      default={{
        horizontal_align: 'LEFT',
      }}
    />
    <FieldGroup
      label='Styles'
      name='groupStyle'
      tab='STYLE'
      display='inline'
    >
      <ColorField
        label='Caption background color'
        name='captionBackgroundColor'
        default={{
          color: '#FFFFFF',
          opacity: 100,
        }}
      />
      <ColorField
        label='Caption text color'
        name='captionTextColor'
        default={{
          color: '#2B2D3A',
          opacity: 100,
        }}
      />
    </FieldGroup>
  </ModuleFields>
);
