import {
  ModuleFields,
  RepeatedFieldGroup,
  IconField,
  ChoiceField,
  HubDbRowField,
  ImageField,
  BooleanField,
  FieldGroup,
  AdvancedVisibility,
  TextField,
  Visibility,
} from '@hubspot/cms-components/fields';
import {
  HeadingAndText,
  ButtonContent,
  RichTextContent,
} from '../../fieldLibrary/index.js';
import StyleFields from './styleFields.js';
import newsletterImage from './assets/newsletter.png';
import serviceCardBackgroundImage from './assets/service-card.png';

const buttonFieldVisibility: AdvancedVisibility = {
  boolean_operator: 'OR',
  criteria: [{
    controlling_field_path: 'groupCards.groupButton.showButton',
    controlling_value_regex: 'true',
    operator: 'EQUAL',
  }],
} as const;

const captionFieldsVisibility = {
  controlling_field_path: 'groupCards.groupContent.showCaption',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
} as const satisfies Visibility;

const manualEditVisibility = {
  controlling_field_path: 'useHubDBFeed',
  controlling_value_regex: 'false',
  operator: 'EQUAL',
} as const satisfies Visibility;

const hubDBFeedVisibility = {
  controlling_field_path: 'useHubDBFeed',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
} as const satisfies Visibility;

const hideCategoryTabsVisibility = {
  boolean_operator: 'AND',
  criteria: [
    {
      controlling_field_path: 'useHubDBFeed',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
    {
      controlling_field_path: 'showFeaturedCards',
      controlling_value_regex: 'false',
      operator: 'EQUAL',
    },
  ],
} as const satisfies AdvancedVisibility;

/**
 * Manual fields that mirror HubDB columns (title, description, button copy/link, card background)
 * stay hidden in the Design Manager when a HubDB row is selected for this card.
 * `HubDbRowField` may populate `id`, `rowId`, or `row_id` depending on payload — all must be empty.
 */
const manualOnlyWhenNoHubDbRowSelected: AdvancedVisibility = {
  boolean_operator: 'AND',
  criteria: [
    {
      controlling_field_path: 'useHubDBFeed',
      controlling_value_regex: 'false',
      operator: 'EQUAL',
    },
    {
      controlling_field_path: 'groupCards.groupHubdbRow',
      property: 'id',
      operator: 'EMPTY',
    },
    {
      controlling_field_path: 'groupCards.groupHubdbRow',
      property: 'rowId',
      operator: 'EMPTY',
    },
    {
      controlling_field_path: 'groupCards.groupHubdbRow',
      property: 'row_id',
      operator: 'EMPTY',
    },
  ],
} as const satisfies AdvancedVisibility;

const hubDbButtonTextLinkVisibility: AdvancedVisibility = {
  boolean_operator: 'AND',
  criteria: [
    {
      controlling_field_path: 'useHubDBFeed',
      controlling_value_regex: 'false',
      operator: 'EQUAL',
    },
    {
      controlling_field_path: 'groupCards.groupHubdbRow',
      property: 'id',
      operator: 'EMPTY',
    },
    {
      controlling_field_path: 'groupCards.groupHubdbRow',
      property: 'rowId',
      operator: 'EMPTY',
    },
    {
      controlling_field_path: 'groupCards.groupHubdbRow',
      property: 'row_id',
      operator: 'EMPTY',
    },
    {
      controlling_field_path: 'groupCards.groupButton.showButton',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
  ],
} as const satisfies AdvancedVisibility;

export const fields = (
  <ModuleFields>
    <BooleanField
      label='Use HubDB feed'
      name='useHubDBFeed'
      display='toggle'
      default={false}
      helpText='When enabled, cards are rendered from the HubDB services table and manual card fields are hidden.'
    />

    <TextField
      label='Default category filter'
      name='serviceCategory'
      default='show_all_categories'
      required={false}
      visibility={hubDBFeedVisibility}
      helpText="Initial tab when the page loads. Use a Service categories internal name from HubDB (for example: show_all_categories)."
      inlineHelpText='Use a HubDB Service categories internal name (example: show_all_categories).'
    />

    <BooleanField
      label='Featured cards'
      name='showFeaturedCards'
      display='toggle'
      default={false}
      helpText="When enabled, only HubDB cards with the 'Featured' checkbox are shown."
      visibility={hubDBFeedVisibility}
    />

    <BooleanField
      label='Hide category filter bar'
      name='hideCategoryTabs'
      display='toggle'
      default={false}
      helpText="When enabled, hides the category pill filter bar (tag pills)."
      visibilityRules="ADVANCED"
      advancedVisibility={hideCategoryTabsVisibility}
    />

    <ChoiceField
      label='Image or icon'
      name='imageOrIcon'
      choices={[
        ['image', 'Image'],
        ['icon', 'Icon'],
      ]}
      default='icon'
      visibility={manualEditVisibility}
    />
    <RepeatedFieldGroup
      label='Cards'
      name='groupCards'
      id='groupCards'
      visibility={manualEditVisibility}
      occurrence={{
        min: 1,
        max: 4,
        sorting_label_field: 'groupCards.groupContent',
        default: 1,
      }}
      default={[
        {
          groupImage: {
            showRoundImageBorder: false,
            image: {
              src: newsletterImage,
              alt: '',
              loading: 'lazy',
            },
          },
          groupContent: {
            showCaption: false,
            captionText: '',
            headingAndTextHeadingLevel: 'h4',
            headingAndTextHeading: 'Content Creation',
            richTextContentHTML:
              "<p>Stand out with our captivating content creation services, tailored to engage today's digital audience </p>",
          },
          groupButton: {
            showButton: true,
            buttonContentText: 'Explore more',
            buttonContentLink: {
              open_in_new_tab: true,
            },
            buttonContentShowIcon: false,
            buttonContentIcon: {
              name: 'arrow-right',
            },
            buttonContentIconPosition: 'right',
          },
          groupCardBackground: {
            image: {
              src: serviceCardBackgroundImage,
              alt: 'service image background',
              loading: 'lazy',
            },
          },
        },
      ]}
    >
      <HubDbRowField
        label='HubDB row'
        name='groupHubdbRow'
        required={false}
        locked={false}
        tableNameOrId={1756583141}
        columnsToFetch={[
          'hs_id',
          'service_title',
          'service_description',
          'service_link_text',
          'service_link_url',
          'service_bg_img',
          'image',
        ]}
        displayColumns={['service_title']}
        displayFormat='%0'
        helpText='When a row is selected, HubDB data is used for the card. List every HubDB column you need here (including IMAGE columns for the card background — URL is read from the cell’s `.url`). Unknown column names may be ignored. Publish the HubDB table so live pages use the latest row data.'
      />
      <FieldGroup label='Icon' name='groupIcon' display='inline'>
        <IconField
          label='Icon'
          name='icon'
          iconSet='fontawesome-6.4.2'
          visibility={{
            controlling_field: 'imageOrIcon',
            controlling_value_regex: 'icon',
            operator: 'EQUAL',
          }}
        />
      </FieldGroup>
      <FieldGroup label='Image' name='groupImage' display='inline'>
        <ImageField
          label='Image'
          name='image'
          visibility={{
            controlling_field: 'imageOrIcon',
            controlling_value_regex: 'image',
            operator: 'EQUAL',
          }}
          resizable={false}
          responsive={false}
          showLoading={true}
          default={{
            alt: '',
            loading: 'lazy',
            src: newsletterImage,
          }}
          inlineEditable={true}
        />
        <BooleanField
          label='Round border around image'
          name='showRoundImageBorder'
          display='toggle'
          default={false}
          visibility={{
            controlling_field: 'imageOrIcon',
            controlling_value_regex: 'image',
            operator: 'EQUAL',
          }}
        />
      </FieldGroup>
      <FieldGroup label='Content' name='groupContent' display='inline' id='groupContent'>
        <BooleanField label='Show intro label' name='showCaption' display='toggle' default={false} />
        <TextField
          label='Intro label'
          name='captionText'
          visibility={captionFieldsVisibility}
          default=''
          inlineEditable={true}
        />
        <HeadingAndText
          headingTextLabel='Title'
          headingLevelDefault='h3'
          textDefault='Content Creation'
          textVisibility={manualOnlyWhenNoHubDbRowSelected}
        />
        <RichTextContent
          label='Description'
          richTextDefault="<p>Stand out with our captivating content creation services, tailored to engage today's digital audience</p>"
          featureSet='text'
          richTextVisibility={manualOnlyWhenNoHubDbRowSelected}
        />
      </FieldGroup>
      <FieldGroup label='Button' name='groupButton' display='inline'>
        <BooleanField label='Show button' name='showButton' display='toggle' default={false} />
        <ButtonContent
          textDefault='Explore more'
          linkDefault={{
            open_in_new_tab: true,
          }}
          textVisibility={hubDbButtonTextLinkVisibility}
          linkVisibility={hubDbButtonTextLinkVisibility}
          showIconVisibility={buttonFieldVisibility}
        />
      </FieldGroup>
      <FieldGroup label='Card background' name='groupCardBackground' display='inline'>
        <ImageField
          label='Card background image'
          name='image'
          resizable={false}
          responsive={false}
          showLoading={true}
          inlineEditable={true}
          visibilityRules='ADVANCED'
          advancedVisibility={manualOnlyWhenNoHubDbRowSelected}
        />
      </FieldGroup>
    </RepeatedFieldGroup>
    <StyleFields />
  </ModuleFields>
);

