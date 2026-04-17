import {
  ModuleFields,
  ImageField,
  BooleanField,
  TextField,
  AlignmentField,
  ColorField,
  FieldGroup,
  Visibility,
  ChoiceField,
  AdvancedVisibility,
} from '@hubspot/cms-components/fields';

const captionVisibility = {
  controlling_field_path: 'addCaption',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
} as const satisfies Visibility;

const advancedImageEditingVisibility: AdvancedVisibility = {
  boolean_operator: 'AND',
  criteria: [
    {
      controlling_field_path: 'useAdvancedImageEditing',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
  ],
} as const;

const imageFocalPointVisibility: AdvancedVisibility = {
  boolean_operator: 'AND',
  criteria: [
    {
      controlling_field_path: 'useAdvancedImageEditing',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
    {
      controlling_field_path: 'imageObjectFitCover',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
  ],
} as const;

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
    <BooleanField
      label='Advanced editing'
      name='useAdvancedImageEditing'
      display='toggle'
      default={false}
    />
    <ChoiceField
      label='Aspect ratio'
      name='imageAspectRatio'
      display='select'
      helpText='Original keeps the uploaded image proportions. Other ratios crop inside a fixed frame when using cover.'
      choices={[
        ['original', 'Original (uploaded)'],
        ['ratio_16_9', '16∶9'],
        ['ratio_4_3', '4∶3'],
        ['ratio_3_2', '3∶2'],
      ]}
      default='original'
      visibilityRules='ADVANCED'
      advancedVisibility={advancedImageEditingVisibility}
    />
    <BooleanField
      label='Fill frame (cover)'
      name='imageObjectFitCover'
      display='toggle'
      helpText='When on, the image fills the frame and may be cropped. Use image position to choose the focal point.'
      default={false}
      visibilityRules='ADVANCED'
      advancedVisibility={advancedImageEditingVisibility}
    />
    <AlignmentField
      label='Image position (focal point)'
      name='imageObjectPosition'
      alignmentDirection='BOTH'
      helpText='Only applies with Fill frame (cover) on. Controls which part of the image stays visible when cropped.'
      default={{
        horizontal_align: 'CENTER',
        vertical_align: 'MIDDLE',
      }}
      visibilityRules='ADVANCED'
      advancedVisibility={imageFocalPointVisibility}
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
