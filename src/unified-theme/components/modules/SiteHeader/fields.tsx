import {
  ModuleFields,
  MenuField,
  FieldGroup,
  AlignmentField,
  ColorField,
  LogoField,
  TextField,
  BooleanField,
  AdvancedVisibility,
  IconField,
  LinkField,
  Visibility,
} from '@hubspot/cms-components/fields';
import { ButtonContent, ButtonStyle } from '../../fieldLibrary/index.js';
import { limitedColorDefaults } from '../../utils/theme-color-sets.js';

const buttonFieldVisibility: AdvancedVisibility = {
  boolean_operator: 'OR',
  criteria: [
    {
      controlling_field_path: 'groupButton.showButton',
      controlling_value_regex: 'true',
      operator: 'EQUAL',
    },
  ],
} as const;

const limitedOptionsColorsSet = [...limitedColorDefaults.themeSectionTextColors, ...limitedColorDefaults.themeColors];

const logoLinkVisibility: Visibility = {
  controlling_field: 'overrideLogoLink',
  controlling_value_regex: 'true',
  operator: 'EQUAL',
  hidden_subfields: {
    open_in_new_tab: true,
    no_follow: true,
  },
};

export const fields = (
  <ModuleFields>
    <FieldGroup label="Branding" name="groupLogo" display="inline">
      <LogoField label="Logo" name="logo" showLoading={false} />
      <BooleanField
        id="overrideLogoLink"
        label="Override logo link"
        name="overrideLogoLink"
        display="toggle"
        default={false}
        helpText="Override the default logo link set in brand settings."
      />
      <LinkField
        label="Logo link"
        name="logoLinkOverride"
        visibility={logoLinkVisibility}
        supportedTypes={['EXTERNAL', 'CONTENT']}
        showAdvancedRelOptions={false}
        default={{ url: { href: '', type: 'EXTERNAL', content_id: null } }}
      />
    </FieldGroup>
    <FieldGroup label="Navigation" name="groupNavigation" display="inline">
      <MenuField
        label="Menu"
        name="menu"
        default={207886880356}
      />
    </FieldGroup>
    <FieldGroup label="Button" name="groupButton" display="inline">
      <BooleanField label="Show button" name="showButton" display="toggle" default={true} />
      <ButtonContent
        textDefault="Book a free demo"
        linkDefault={{ open_in_new_tab: false }}
        iconPositionDefault="right"
        textVisibility={buttonFieldVisibility}
        linkVisibility={buttonFieldVisibility}
        showIconVisibility={buttonFieldVisibility}
      />
    </FieldGroup>
    <FieldGroup label="Default content" name="defaultContent" locked={true}>
      <TextField label="Logo link aria text" name="logoLinkAriaText" default="Homepage" locked={true} />
      <TextField label="Lang switcher select text" name="languageSwitcherSelectText" default="Select a language" locked={true} />
      <TextField label="Menu placeholder title" name="placeholderTitle" default="No menu selected" />
      <TextField
        label="Menu placeholder description"
        name="placeholderDescription"
        default="Click to add a navigation menu. After you publish, it appears here."
      />
      <TextField label="Logo placeholder title" name="logoPlaceholderTitle" default="No logo" />
      <TextField label="Logo placeholder description" name="logoPlaceholderDescription" default="Click to add a logo" />
    </FieldGroup>
    <IconField
      label="Language switcher icon"
      name="globe_icon"
      iconSet="fontawesome-6.4.2"
      default={{ name: 'earth-americas' }}
      required={true}
      locked={true}
    />
    <FieldGroup label="Styles" name="styles" tab="STYLE">
      <FieldGroup label="Menu" name="groupMenu" display="inline">
        <ColorField
          label="Text color (default)"
          name="menuTextColor"
          helpText="Controls the color of text in the navigation bar. Also controls the color of the hamburger menu."
          visibility={{ hidden_subfields: { opacity: true } }}
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#FFFFFF' }}
        />
        <ColorField
          label="Text color (hover)"
          name="menuTextHoverColor"
          visibility={{ hidden_subfields: { opacity: true } }}
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#52BAD1' }}
        />
        <ColorField
          label="Text color (default, top level items)"
          name="menuTopLevelTextColor"
          helpText="Top level items: primary desktop navigation row only (not flyout submenu links)."
          visibility={{ hidden_subfields: { opacity: true } }}
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#FFFFFF' }}
        />
        <ColorField
          label="Text color (hover, top level items)"
          name="menuTopLevelTextHoverColor"
          helpText="Hover for top-level desktop navigation items only."
          visibility={{ hidden_subfields: { opacity: true } }}
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#52BAD1' }}
        />
        <BooleanField
          label="Top level nav underline (desktop)"
          name="menuTopLevelUnderlineEnabled"
          display="toggle"
          default={true}
          helpText="underline on hover for top-level menu items."
        />
        <ColorField
          label="Underline color (top level items)"
          name="menuTopLevelUnderlineColor"
          visibility={{
            controlling_field_path: 'styles.groupMenu.menuTopLevelUnderlineEnabled',
            controlling_value_regex: 'true',
            operator: 'EQUAL',
            hidden_subfields: { opacity: true },
          }}
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#52BAD1' }}
        />
        <ColorField
          label="Arrow icon fill"
          name="menuArrowIconFill"
          visibility={{ hidden_subfields: { opacity: true } }}
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#52BAD1' }}
        />
        <ColorField
          label="Arrow icon fill (hover)"
          name="menuArrowIconFillHover"
          visibility={{ hidden_subfields: { opacity: true } }}
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#FFFFFF' }}
        />
        <ColorField
          label="Accent color"
          name="menuAccentColor"
          helpText="Controls the color of menu item background hover states and the border color of flyout menus."
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#161C26', opacity: 50 }}
        />
        <ColorField
          label="Background color"
          name="menuBackgroundColor"
          helpText="Adjust opacity to make the header background transparent."
          limitedOptions={limitedColorDefaults.themeSectionBackgroundColors}
          default={{ color: '#161C26', opacity: 0 }}
        />
        <BooleanField
          label="Use accent color on flyout hover"
          name="menuFlyoutUseAccentOnHover"
          display="toggle"
          default={false}
          helpText="When enabled, flyout menu items use the Accent color as their hover background. When disabled, they keep the background color on hover."
        />
        <AlignmentField
          label="Horizontal alignment"
          name="menuAlignment"
          required={true}
          alignmentDirection="HORIZONTAL"
          default={{ horizontal_align: 'CENTER' }}
        />
        <BooleanField
          label="Sticky navigation (desktop)"
          name="stickyNavigation"
          display="toggle"
          default={false}
          helpText="On wide screens only, keeps this header bar at the top while scrolling. Mobile and tablet (hamburger menu) layout is unchanged. The header can still overlap the hero below."
        />
      </FieldGroup>
      <FieldGroup label="Mobile menu" name="groupMobileMenu" display="inline">
        <ColorField
          label="Text color (mobile)"
          name="mobileMenuTextColor"
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#FFFFFF' }}
        />
        <ColorField
          label="Text color (hover, mobile)"
          name="mobileMenuTextHoverColor"
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#52BAD1' }}
        />
        <ColorField
          label="Accent color (mobile)"
          name="mobileMenuAccentColor"
          helpText="Controls hover background and separators in the mobile menu. Adjust opacity for a softer highlight."
          limitedOptions={limitedOptionsColorsSet}
          default={{ color: '#161C26', opacity: 0 }}
        />
        <ColorField
          label="Background color (mobile)"
          name="mobileMenuBackgroundColor"
          helpText="Adjust opacity to make the mobile menu background transparent."
          limitedOptions={limitedColorDefaults.themeSectionBackgroundColors}
          default={{ color: '#161C26', opacity: 100 }}
        />
      </FieldGroup>
      <FieldGroup label="Button" name="groupButton" display="inline">
        <ButtonStyle
          buttonStyleDefault="secondary"
          buttonSizeDefault="small"
          buttonSizeVisibility={buttonFieldVisibility}
          buttonStyleVisibility={buttonFieldVisibility}
        />
      </FieldGroup>
    </FieldGroup>
  </ModuleFields>
);
