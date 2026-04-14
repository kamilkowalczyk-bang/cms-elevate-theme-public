import {
  ModuleFields,
  ImageField,
  ChoiceField,
  BooleanField,
  ColorField,
  FieldGroup,
  AlignmentField,
  AdvancedVisibility,
  IconField,
  RepeatedFieldGroup,
  TextField,
  Visibility,
} from '@hubspot/cms-components/fields';
import {
  ButtonContent,
  ButtonStyle,
  HeadingAndText,
  HeadingStyle,
  RichTextContent,
  SectionStyle,
} from '../../fieldLibrary/index.js';
import engagementImage from './assets/engagement.png';

const buttonFieldVisibility: AdvancedVisibility = {
  boolean_operator: 'OR',
  criteria: [{
    controlling_field_path: 'groupButton.showButton',
    controlling_value_regex: 'true',
    operator: 'EQUAL',
  }]
} as const;

const imageColumnVisibility: AdvancedVisibility = {
  boolean_operator: 'OR',
  criteria: [
    {
      controlling_field_path: 'groupImage.image',
      property: 'src',
      operator: 'NOT_EMPTY',
    },
    {
      controlling_field_path: 'groupImage.containerBackgroundImage',
      property: 'src',
      operator: 'NOT_EMPTY',
    },
  ],
} as const;

const listItemDefault = 'Add a list item here.';
const groupListContentDefault = {
  groupListContent: {
    listItemContent: listItemDefault,
  },
};

const dividerOrCaptionHorizontalAlignmentVisibility: AdvancedVisibility = {
  boolean_operator: 'OR',
  criteria: [
    {
      controlling_field_path: 'groupStyle.groupContent.showContentDivider',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
    {
      controlling_field_path: 'groupContent.showCaption',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
  ],
} as const;

const captionFieldsVisibility = {
  controlling_field_path: 'groupContent.showCaption',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
} as const satisfies Visibility;

const listFieldsVisibility = {
  controlling_field_path: 'groupContent.showList',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
} as const satisfies Visibility;

export const fields = (
  <ModuleFields>
    <FieldGroup
      label='Image'
      name='groupImage'
      display='inline'
    >
      <ImageField
        label='Image'
        name='image'
        resizable={false}
        responsive={false}
        showLoading={true}
        default={{
          alt: '',
          loading: 'lazy',
          src: engagementImage,
        }}
        inlineEditable={true}
      />
      <ImageField
        label='Container background image'
        name='containerBackgroundImage'
        resizable={false}
        responsive={false}
        showLoading={true}
        default={{
          alt: '',
          loading: 'lazy',
          src: '',
        }}
        inlineEditable={true}
      />
      <ChoiceField
        label='Image position'
        name='imagePosition'
        visibility={imageColumnVisibility as unknown as Visibility}
        display='radio'
        choices={[
          ['left', 'Left'],
          ['right', 'Right'],
        ]}
        required={true}
        default='left'
      />
    </FieldGroup>
    <FieldGroup
      label='Content'
      name='groupContent'
      display='inline'
    >
      <HeadingAndText
        headingTextLabel='Title'
        headingLevelDefault='h2'
        textDefault='Increase reach and engagement'
      />
      <RichTextContent
        label='Description'
        richTextDefault='<p>Write a description highlighting the functionality, benefits, and uniqueness of your feature. A couple of sentences here is just right.</p>'
        featureSet='text'
      />
      <BooleanField
        label='Show intro label'
        name='showCaption'
        display='toggle'
        default={false}
      />
      <TextField
        label='Intro label'
        name='captionText'
        visibility={captionFieldsVisibility}
        default=''
        inlineEditable={true}
      />
      <BooleanField
        label='Show list'
        name='showList'
        display='toggle'
        default={false}
      />
      <IconField
        label='List icon'
        name='listIcon'
        iconSet='fontawesome-6.4.2'
        visibility={listFieldsVisibility}
        default={{
          name: 'check',
        }}
      />
      <RepeatedFieldGroup
        label='List items'
        name='groupListItems'
        id='imageAndTextGroupListItems'
        visibility={listFieldsVisibility}
        occurrence={{
          min: 1,
          max: 20,
          default: 4,
        }}
        default={[
          groupListContentDefault,
          groupListContentDefault,
          groupListContentDefault,
          groupListContentDefault,
        ]}
      >
        <FieldGroup label='List items' name='groupListContent' display='inline'>
          <TextField label='Item' name='listItemContent' default={listItemDefault} inlineEditable={true} />
        </FieldGroup>
      </RepeatedFieldGroup>
    </FieldGroup>
    <FieldGroup
      label='Button'
      name='groupButton'
      display='inline'
    >
      <BooleanField
        label='Show button'
        name='showButton'
        display='toggle'
        default={true}
      />
      <ButtonContent
        textDefault='Explore more'
        textVisibility={buttonFieldVisibility}
        linkVisibility={buttonFieldVisibility}
        showIconVisibility={buttonFieldVisibility}
      />
    </FieldGroup>
    <FieldGroup
      label='Styles'
      name='groupStyle'
      tab='STYLE'
    >
      <FieldGroup
        label='Content'
        name='groupContent'
        display='inline'
      >
        <SectionStyle sectionStyleDefault='section_variant_1' />
        <ColorField
          label='Content background'
          name='contentBackgroundColor'
          helpText='Background color and opacity for the text column only.'
          default={{ color: '#FFFFFF', opacity: 0 }}
        />
        <HeadingStyle headingStyleAsDefault='h3' />
        <BooleanField
          label='Uppercase heading'
          name='headingUppercase'
          display='toggle'
          default={false}
        />
        <AlignmentField
          label='Vertical alignment'
          name='verticalAlignment'
          alignmentDirection='VERTICAL'
          default={{
            vertical_align: 'MIDDLE',
          }}
        />
        <BooleanField
          label='Show divider'
          name='showContentDivider'
          display='toggle'
          default={false}
        />
        <AlignmentField
          label='Divider and intro label alignment'
          name='dividerHorizontalAlignment'
          visibility={dividerOrCaptionHorizontalAlignmentVisibility as unknown as Visibility}
          alignmentDirection='HORIZONTAL'
          default={{
            horizontal_align: 'LEFT',
          }}
        />
        <ColorField
          label='Intro label color'
          name='captionColor'
          visibility={captionFieldsVisibility}
          helpText='Uses theme caption color for the selected text color (section) when opacity is 0%. Increase opacity to use a custom color.'
          default={{ color: '#FFFFFF', opacity: 0 }}
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
          buttonSizeVisibility={buttonFieldVisibility}
          buttonStyleVisibility={buttonFieldVisibility}
        />
      </FieldGroup>
      <FieldGroup
        label='Module'
        name='groupModule'
        display='inline'
      >
        <BooleanField
          label='Drop shadow'
          name='showDropShadow'
          display='toggle'
          default={false}
        />
        <BooleanField
          label='Rounded corners'
          name='showRoundedCorners'
          display='toggle'
          default={false}
        />
      </FieldGroup>
    </FieldGroup>
  </ModuleFields>
);
