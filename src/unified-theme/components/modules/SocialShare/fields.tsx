import { ModuleFields, TextField, ChoiceField, IconField, FieldGroup, RepeatedFieldGroup, ImageField } from '@hubspot/cms-components/fields';
import StyleFields from './styleFields.js';

export const fields = (
  <ModuleFields>
    <ChoiceField
      name='platforms'
      label='Included platforms'
      choices={[
        ['facebook', 'Facebook'],
        ['twitter', 'Twitter'],
        ['linkedin', 'LinkedIn'],
        ['pinterest', 'Pinterest'],
        ['email', 'Email'],
      ]}
      multiple={true}
      display='checkbox'
      default={['facebook', 'twitter', 'linkedin', 'pinterest', 'email']}
      reorderingEnabled={false}
    />
    <FieldGroup
      label='Default icons'
      name='groupDefaultIcons'
      locked={true}
    >
      <IconField
        label='Facebook Icon'
        name='facebook'
        iconSet='fontawesome-6.4.2'
        default={{
          name: 'Facebook F',
        }}
      />
      <IconField
        label='X Icon'
        name='twitter'
        iconSet='fontawesome-6.4.2'
        default={{
          name: 'X Twitter',
        }}
      />
      <IconField
        label='Email Icon'
        name='envelope'
        iconSet='fontawesome-6.4.2'
        default={{
          name: 'envelope',
        }}
      />
      <IconField
        label='LinkedIn Icon'
        name='linkedin'
        iconSet='fontawesome-6.4.2'
        default={{
          name: 'linkedin',
        }}
      />
      <IconField
        label='Pinterest Icon'
        name='pinterest'
        iconSet='fontawesome-6.4.2'
        default={{
          name: 'pinterest',
        }}
      />
    </FieldGroup>
    <FieldGroup
      label='Default text'
      name='groupDefaultText'
      locked={true}
    >
      <TextField
        label='X link aria label'
        name='twitterLinkAriaLabel'
        default='Share on X'
      />
      <TextField
        label='Facebook link aria label'
        name='facebookLinkAriaLabel'
        default='Share on Facebook'
      />
      <TextField
        label='LinkedIn link aria label'
        name='linkedinLinkAriaLabel'
        default='Share on LinkedIn'
      />
      <TextField
        label='Pinterest link aria label'
        name='pinterestLinkAriaLabel'
        default='Share on Pinterest'
      />
      <TextField
        label='Email link aria label'
        name='emailLinkAriaLabel'
        default='Share us via email'
      />
    </FieldGroup>

    <RepeatedFieldGroup
      name='customPlatforms'
      label='Custom platforms'
      occurrence={{
        min: 0,
        max: 10,
        default: 0,
      }}
      default={[]}
    >
      <TextField
        name='platformLabel'
        label='Label'
        default='Custom'
        helpText='Used for aria-label and as a fallback when aria label is empty.'
      />
      <TextField
        name='urlTemplate'
        label='URL template or full URL'
        default=''
        helpText='Use {{url}} as placeholder for current page URL, e.g. https://example.com/share?u={{url}}'
      />
      <TextField
        name='ariaLabel'
        label='Aria label'
        default=''
        helpText='Optional. If empty, defaults to "Share on <Label>".'
      />
      <ChoiceField
        name='iconSource'
        label='Icon source'
        display='radio'
        choices={[
          ['icon', 'FontAwesome icon'],
          ['image', 'Image/SVG'],
        ]}
        default='icon'
      />
      <IconField
        name='icon'
        label='Icon'
        iconSet='fontawesome-6.4.2'
        default={{
          name: 'share-nodes',
        }}
        visibility={{
          controlling_field_path: 'customPlatforms.iconSource',
          controlling_value_regex: 'icon',
          operator: 'EQUAL',
        }}
      />
      <ImageField
        name='image'
        label='Image/SVG'
        resizable={false}
        responsive={false}
        showLoading={false}
        default={{
          src: '',
          alt: '',
          loading: 'lazy',
        }}
        visibility={{
          controlling_field_path: 'customPlatforms.iconSource',
          controlling_value_regex: 'image',
          operator: 'EQUAL',
        }}
      />
    </RepeatedFieldGroup>
    <StyleFields />
  </ModuleFields>
);
