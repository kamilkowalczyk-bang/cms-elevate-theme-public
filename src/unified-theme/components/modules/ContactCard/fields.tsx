import {
  ModuleFields,
  RepeatedFieldGroup,
  FieldGroup,
  BooleanField,
  HubDbRowField,
  TextField,
  ImageField,
  LinkField,
  IconField,
  AdvancedVisibility,
  Visibility,
} from '@hubspot/cms-components/fields';
import { ButtonContent } from '../../fieldLibrary/index.js';
import StyleFields from './styleFields.js';
import teamMemberUseBackgroundMed1 from '../../../images/team-member-use-background-med-1.png';
import { HUBDB_TABLE_NAMES } from '../../utils/hubdb-table-names.js';

const buttonFieldVisibility: AdvancedVisibility = {
  boolean_operator: 'OR',
  criteria: [{
    controlling_field_path: 'groupContactCards.groupButton.showButton',
    controlling_value_regex: 'true',
    operator: 'EQUAL',
  }],
} as const;

const socialFieldVisibility: AdvancedVisibility = {
  boolean_operator: 'OR',
  criteria: [{
    controlling_field_path: 'groupContactCards.groupSocial.showSocialMedia',
    controlling_value_regex: 'true',
    operator: 'EQUAL',
  }],
} as const;

const manualCardFieldVisibility = {
  controlling_field_path: 'useHubDB',
  controlling_value_regex: 'false',
  operator: 'EQUAL',
} as const satisfies Visibility;

const hubDbPickerVisibility = {
  controlling_field_path: 'useHubDB',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
} as const satisfies Visibility;

export const fields = (
  <ModuleFields>
    <BooleanField
      label='Use HubDB'
      name='useHubDB'
      display='toggle'
      default={false}
      helpText='When enabled, each card can be populated from the contact_cards HubDB table.'
    />

    <RepeatedFieldGroup
      label='Contact cards'
      name='groupContactCards'
      occurrence={{
        min: 1,
        max: 40,
        default: 4,
      }}
      default={[
        {
          groupRegion: {
            showRegion: true,
            region: 'USA & Canada',
          },
          groupIdentity: {
            contactImage: {
              src: teamMemberUseBackgroundMed1,
              alt: 'Team member portrait',
              loading: 'lazy',
            },
            fullName: 'Name Surname',
            department: 'Sales',
          },
          groupPhone: {
            showPhone: true,
            phoneText: '+358 50 123 4567',
            phoneLink: {
              url: {
                type: 'PHONE_NUMBER',
                content_id: 0,
                href: '+358501234567',
              },
            },
          },
          groupEmail: {
            showEmail: true,
            emailText: 'firstname.lastname@radientum.fi',
            emailLink: {
              url: {
                type: 'EMAIL_ADDRESS',
                content_id: 0,
                href: 'firstname.lastname@radientum.fi',
              },
            },
          },
          groupSocial: {
            showSocialMedia: false,
            groupSocialLinks: [
              {
                socialIcon: {
                  name: 'linkedin',
                },
                socialLabel: 'LinkedIn',
                socialLink: {
                  url: {
                    type: 'EXTERNAL',
                    content_id: 0,
                    href: 'https://www.linkedin.com',
                  },
                  open_in_new_tab: true,
                },
              },
            ],
          },
          groupButton: {
            showButton: true,
            buttonContentText: 'Book a meeting with me',
            buttonContentLink: {
              url: {
                type: 'EXTERNAL',
                content_id: 0,
                href: '#',
              },
            },
            buttonContentShowIcon: false,
            buttonContentIcon: {
              name: 'arrow-right',
            },
            buttonContentIconPosition: 'right',
          },
        },
        {
          groupRegion: {
            showRegion: true,
            region: 'USA & Canada',
          },
          groupIdentity: {
            contactImage: {
              src: teamMemberUseBackgroundMed1,
              alt: 'Team member portrait',
              loading: 'lazy',
            },
            fullName: 'Name Surname',
            department: 'Sales',
          },
          groupPhone: {
            showPhone: true,
            phoneText: '+358 50 123 4567',
            phoneLink: {
              url: {
                type: 'PHONE_NUMBER',
                content_id: 0,
                href: '+358501234567',
              },
            },
          },
          groupEmail: {
            showEmail: true,
            emailText: 'firstname.lastname@radientum.fi',
            emailLink: {
              url: {
                type: 'EMAIL_ADDRESS',
                content_id: 0,
                href: 'firstname.lastname@radientum.fi',
              },
            },
          },
          groupSocial: {
            showSocialMedia: false,
            groupSocialLinks: [
              {
                socialIcon: {
                  name: 'linkedin',
                },
                socialLabel: 'LinkedIn',
                socialLink: {
                  url: {
                    type: 'EXTERNAL',
                    content_id: 0,
                    href: 'https://www.linkedin.com',
                  },
                  open_in_new_tab: true,
                },
              },
            ],
          },
          groupButton: {
            showButton: true,
            buttonContentText: 'Book a meeting with me',
            buttonContentLink: {
              url: {
                type: 'EXTERNAL',
                content_id: 0,
                href: '#',
              },
            },
            buttonContentShowIcon: false,
            buttonContentIcon: {
              name: 'arrow-right',
            },
            buttonContentIconPosition: 'right',
          },
        },
        {
          groupRegion: {
            showRegion: true,
            region: 'USA & Canada',
          },
          groupIdentity: {
            contactImage: {
              src: teamMemberUseBackgroundMed1,
              alt: 'Team member portrait',
              loading: 'lazy',
            },
            fullName: 'Name Surname',
            department: 'Sales',
          },
          groupPhone: {
            showPhone: true,
            phoneText: '+358 50 123 4567',
            phoneLink: {
              url: {
                type: 'PHONE_NUMBER',
                content_id: 0,
                href: '+358501234567',
              },
            },
          },
          groupEmail: {
            showEmail: true,
            emailText: 'firstname.lastname@radientum.fi',
            emailLink: {
              url: {
                type: 'EMAIL_ADDRESS',
                content_id: 0,
                href: 'firstname.lastname@radientum.fi',
              },
            },
          },
          groupSocial: {
            showSocialMedia: false,
            groupSocialLinks: [
              {
                socialIcon: {
                  name: 'linkedin',
                },
                socialLabel: 'LinkedIn',
                socialLink: {
                  url: {
                    type: 'EXTERNAL',
                    content_id: 0,
                    href: 'https://www.linkedin.com',
                  },
                  open_in_new_tab: true,
                },
              },
            ],
          },
          groupButton: {
            showButton: true,
            buttonContentText: 'Book a meeting with me',
            buttonContentLink: {
              url: {
                type: 'EXTERNAL',
                content_id: 0,
                href: '#',
              },
            },
            buttonContentShowIcon: false,
            buttonContentIcon: {
              name: 'arrow-right',
            },
            buttonContentIconPosition: 'right',
          },
        },
        {
          groupRegion: {
            showRegion: true,
            region: 'USA & Canada',
          },
          groupIdentity: {
            contactImage: {
              src: teamMemberUseBackgroundMed1,
              alt: 'Team member portrait',
              loading: 'lazy',
            },
            fullName: 'Name Surname',
            department: 'Sales',
          },
          groupPhone: {
            showPhone: true,
            phoneText: '+358 50 123 4567',
            phoneLink: {
              url: {
                type: 'PHONE_NUMBER',
                content_id: 0,
                href: '+358501234567',
              },
            },
          },
          groupEmail: {
            showEmail: true,
            emailText: 'firstname.lastname@radientum.fi',
            emailLink: {
              url: {
                type: 'EMAIL_ADDRESS',
                content_id: 0,
                href: 'firstname.lastname@radientum.fi',
              },
            },
          },
          groupSocial: {
            showSocialMedia: false,
            groupSocialLinks: [
              {
                socialIcon: {
                  name: 'linkedin',
                },
                socialLabel: 'LinkedIn',
                socialLink: {
                  url: {
                    type: 'EXTERNAL',
                    content_id: 0,
                    href: 'https://www.linkedin.com',
                  },
                  open_in_new_tab: true,
                },
              },
            ],
          },
          groupButton: {
            showButton: true,
            buttonContentText: 'Book a meeting with me',
            buttonContentLink: {
              url: {
                type: 'EXTERNAL',
                content_id: 0,
                href: '#',
              },
            },
            buttonContentShowIcon: false,
            buttonContentIcon: {
              name: 'arrow-right',
            },
            buttonContentIconPosition: 'right',
          },
        },
      ]}
    >
      <HubDbRowField
        label='Choose from HubDB'
        name='groupHubdbRow'
        tableNameOrId={HUBDB_TABLE_NAMES.contactCard}
        required={false}
        locked={false}
        columnsToFetch={[
          'hs_id',
          'full_name',
          'department',
          'region',
          'sales_region',
          'default_sales_rep',
          'meeting_embed_url',
          'invoicing_and_purchasing',
          'phone',
          'phone_text',
          'email',
          'email_text',
          'phone_link',
          'email_link',
          'button_text',
          'button_link',
          'contact_image',
          'show_phone',
          'show_email',
          'show_region',
          'show_social_media',
          'show_button',
        ]}
        displayColumns={['full_name']}
        displayFormat='%0'
        visibility={hubDbPickerVisibility}
        helpText='Select a row from contact_cards. The selected row will populate this card.'
      />

      <FieldGroup label='Region' name='groupRegion' display='inline' visibility={manualCardFieldVisibility}>
        <BooleanField label='Show region' name='showRegion' display='toggle' default={true} />
        <TextField label='Region' name='region' default='USA & Canada' inlineEditable={true} />
      </FieldGroup>

      <FieldGroup label='Identity' name='groupIdentity' display='inline' visibility={manualCardFieldVisibility}>
        <ImageField
          label='Contact image'
          name='contactImage'
          resizable={false}
          responsive={false}
          showLoading={true}
          default={{
            src: teamMemberUseBackgroundMed1,
            alt: 'Team member portrait',
            loading: 'lazy',
          }}
          inlineEditable={true}
        />
        <TextField label='Name' name='fullName' default='Name Surname' inlineEditable={true} />
        <TextField label='Department' name='department' default='Sales' inlineEditable={true} />
      </FieldGroup>

      <FieldGroup label='Phone' name='groupPhone' display='inline' visibility={manualCardFieldVisibility}>
        <BooleanField label='Show phone' name='showPhone' display='toggle' default={true} />
        <TextField label='Contact phone' name='phoneText' default='+358 50 123 4567' inlineEditable={true} />
        <LinkField
          label='Phone link (optional)'
          name='phoneLink'
          supportedTypes={['PHONE_NUMBER', 'EXTERNAL']}
          default={{
            url: {
              type: 'PHONE_NUMBER',
              content_id: 0,
              href: '+358501234567',
            },
          }}
        />
      </FieldGroup>

      <FieldGroup label='Email' name='groupEmail' display='inline' visibility={manualCardFieldVisibility}>
        <BooleanField label='Show email' name='showEmail' display='toggle' default={true} />
        <TextField
          label='Contact email'
          name='emailText'
          default='firstname.lastname@radientum.fi'
          inlineEditable={true}
        />
        <LinkField
          label='Email link (optional)'
          name='emailLink'
          supportedTypes={['EMAIL_ADDRESS', 'EXTERNAL']}
          default={{
            url: {
              type: 'EMAIL_ADDRESS',
              content_id: 0,
              href: 'firstname.lastname@radientum.fi',
            },
          }}
        />
      </FieldGroup>

      <FieldGroup label='Social media' name='groupSocial' display='inline' visibility={manualCardFieldVisibility}>
        <BooleanField label='Show social media' name='showSocialMedia' display='toggle' default={false} />
        <RepeatedFieldGroup
          label='Social links'
          name='groupSocialLinks'
          visibilityRules='ADVANCED'
          advancedVisibility={socialFieldVisibility}
          occurrence={{
            min: 1,
            max: 6,
            default: 1,
          }}
          default={[
            {
              socialIcon: {
                name: 'linkedin',
              },
              socialLabel: 'LinkedIn',
              socialLink: {
                url: {
                  type: 'EXTERNAL',
                  content_id: 0,
                  href: 'https://www.linkedin.com',
                },
                open_in_new_tab: true,
              },
            },
          ]}
        >
          <IconField label='Social icon' name='socialIcon' iconSet='fontawesome-6.4.2' default={{ name: 'linkedin' }} />
          <TextField label='Social text' name='socialLabel' default='LinkedIn' inlineEditable={true} />
          <LinkField
            label='Social link'
            name='socialLink'
            default={{
              url: {
                type: 'EXTERNAL',
                content_id: 0,
                href: 'https://www.linkedin.com',
              },
              open_in_new_tab: true,
            }}
          />
        </RepeatedFieldGroup>
      </FieldGroup>

      <FieldGroup label='Button' name='groupButton' display='inline' visibility={manualCardFieldVisibility}>
        <BooleanField label='Show button' name='showButton' display='toggle' default={true} />
        <ButtonContent
          textDefault='Book a meeting with me'
          linkDefault={{
            url: {
              type: 'EXTERNAL',
              content_id: 0,
              href: '#',
            },
          }}
          textVisibility={buttonFieldVisibility}
          linkVisibility={buttonFieldVisibility}
          showIconVisibility={buttonFieldVisibility}
        />
      </FieldGroup>
    </RepeatedFieldGroup>
    <StyleFields />
  </ModuleFields>
);
