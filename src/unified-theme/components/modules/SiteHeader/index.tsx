// import { dummyTranslations } from '../../LanguageSwitcherComponent/dummyData.js';
import { ModuleMeta } from '../../types/modules.js';
// @ts-expect-error -- ?island not typed
import MenuComponent from '../../MenuComponent/index.js?island';
import SiteHeaderSVG from './assets/Header.svg';
import { Button } from '../../ButtonComponent/index.js';
import styles from './site-header.module.css';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
// @ts-expect-error -- ?island not typed
import MobileMenuIsland from './islands/MobileMenuIsland.js?island';
// @ts-expect-error -- ?island not typed
import MobileLogoBackButton from './islands/MobileLogoBackButton.js?island';
import { Island } from '@hubspot/cms-components';
import { SharedIslandState, useLanguageVariants } from '@hubspot/cms-components';
import { getLinkFieldHref, getLinkFieldRel, getLinkFieldTarget } from '../../utils/content-fields.js';
import { MenuModulePropTypes } from './types.js';
import { PlaceholderEmptyContent } from '../../PlaceholderComponent/PlaceholderEmptyContent.js';
// @ts-expect-error -- ?island not typed
import LanguageSwitcherIsland from '../../LanguageSwitcherComponent/index.js?island';
import { CSSPropertiesMap } from '../../types/components.js';

const swm = staticWithModule(styles);

// Functions to generate CSS variables

type ColorProps = {
  menuTextColor: string;
  menuTextHoverColor: string;
  menuBackgroundColor: string;
  menuAccentColor: string;
};

function withOpacity(color: string, opacityPercent?: number): string {
  if (opacityPercent == null) return color;
  if (opacityPercent >= 100) return color;
  if (opacityPercent <= 0) return 'transparent';

  const trimmed = color.trim();
  if (!trimmed.startsWith('#')) return color;

  const hex = trimmed.slice(1);
  const isShort = hex.length === 3;
  const isLong = hex.length === 6;
  if (!isShort && !isLong) return color;

  const expanded = isShort ? hex.split('').map(ch => `${ch}${ch}`).join('') : hex;
  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);

  if ([r, g, b].some(n => Number.isNaN(n))) return color;

  const alpha = opacityPercent / 100;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function generateColorCssVars(props: ColorProps): CSSPropertiesMap {
  const { menuTextColor, menuTextHoverColor, menuBackgroundColor, menuAccentColor } = props;

  return {
    '--hsElevate--siteHeader__menuTextColor': menuTextColor,
    '--hsElevate--siteHeader__hover--menuTextColor': menuTextHoverColor,
    '--hsElevate--siteHeader__menuBackgroundColor': menuBackgroundColor,
    '--hsElevate--siteHeader__menuAccentColor': menuAccentColor,
  };
}

// Components

const SiteHeader = createComponent('div');
const SiteHeaderContainer = createComponent('div');
const LogoButtonContainer = createComponent('div');
const MainNav = createComponent('div');
const LanguageSwitcherContainer = createComponent('div');
const ButtonContainer = createComponent('div');
const MobileMenuContainer = createComponent('div');

export const Component = (props: MenuModulePropTypes) => {
  const {
    moduleName,
    hublData: {
      navigation: { children: navDataArray = [] },
      companyName,
      defaultLogo,
      logoLink: brandLogoLinkHref,
      isInEditor,
    },
    groupLogo: { logo: logoField, overrideLogoLink, logoLinkOverride },
    defaultContent: {
      logoLinkAriaText,
      languageSwitcherSelectText,
      placeholderTitle,
      placeholderDescription,
      logoPlaceholderTitle,
      logoPlaceholderDescription,
    },
    groupButton,
    styles: groupStyles,
  } = props;

  const isEditorMode = isInEditor ?? false;

  const {
    showButton,
    buttonContentText: buttonText,
    buttonContentLink: buttonLink,
    buttonContentShowIcon: showIcon,
    buttonContentIconPosition: iconPosition,
  } = groupButton;

  // Temporary until logoField is fixed
  defaultLogo.suppress_company_name = logoField.suppress_company_name;
  const logoToUse = logoField.override_inherited_src ? logoField : defaultLogo;

  const logoLinkToUse = overrideLogoLink && logoLinkOverride?.url?.href ? logoLinkOverride.url.href : brandLogoLinkHref;

  const {
    groupMenu: {
      menuAlignment,
      menuBackgroundColor: { color: menuBackgroundColor, opacity: menuBackgroundOpacity } = { color: '#ffffff', opacity: 100 },
      menuAccentColor: { color: menuAccentColor } = { color: '#D3DAE4' },
      menuTextColor: { color: menuTextColor } = { color: '#09152B' },
      menuTextHoverColor: { color: menuTextHoverColor } = { color: '#F7F9FC' },
    },
    groupButton: { buttonStyleVariant, buttonStyleSize },
  } = groupStyles;

  const translations = useLanguageVariants();
  const showLanguageSwitcher = translations?.length > 1;
  const langSwitcherIconFieldPath = 'globe_icon';

  const menuBackgroundColorWithOpacity = withOpacity(menuBackgroundColor, menuBackgroundOpacity);
  const cssVarsMap = { ...generateColorCssVars({ menuTextColor, menuTextHoverColor, menuBackgroundColor: menuBackgroundColorWithOpacity, menuAccentColor }) };

  const siteHeaderClassNames = cx(swm('hs-elevate-site-header'), { [styles['hs-elevate-site-header--has-language-switcher']]: showLanguageSwitcher });

  return (
    <SiteHeader className={siteHeaderClassNames} style={cssVarsMap}>
      <SharedIslandState value={[]}>
        {/* Controls back button when mobile nav is open */}
        <SiteHeaderContainer className={swm('hs-elevate-site-header__header-container')}>
          <LogoButtonContainer className={swm('hs-elevate-site-header__logo-container')}>
            <Island
              module={MobileLogoBackButton}
              logoField={logoToUse}
              companyName={companyName}
              logoLinkAriaText={logoLinkAriaText}
              logoLink={logoLinkToUse}
              isInEditor={isEditorMode}
              logoPlaceholderTitle={logoPlaceholderTitle}
              logoPlaceholderDescription={logoPlaceholderDescription}
            />
          </LogoButtonContainer>
          {navDataArray.length === 0 && isEditorMode ? (
            <PlaceholderEmptyContent title={placeholderTitle} description={placeholderDescription} />
          ) : (
            <MainNav className={swm('hs-elevate-site-header__main-nav')}>
              <Island
                module={MenuComponent}
                menuDataArray={navDataArray}
                flow="horizontal"
                menuAlignment={menuAlignment}
                maxDepth={3}
                navigationAriaLabel="Main navigation"
                flyouts={true}
                wrapperStyle={{ flex: '1 0 100%' }}
                additionalClassArray={['hs-elevate-site-header__main-nav-menu']}
              />
            </MainNav>
          )}
          {showLanguageSwitcher && (
            <LanguageSwitcherContainer className={swm('hs-elevate-site-header__language-switcher-container')}>
              <Island
                module={LanguageSwitcherIsland}
                menuBackgroundColor={menuBackgroundColorWithOpacity}
                menuBackgroundColorHover={menuAccentColor}
                textColor={menuTextColor}
                textColorHover={menuTextHoverColor}
                languageSwitcherSelectText={languageSwitcherSelectText}
                langSwitcherIconFieldPath={langSwitcherIconFieldPath}
              />
            </LanguageSwitcherContainer>
          )}

          {showButton && (
            <ButtonContainer className={swm('hs-elevate-site-header__button-container')}>
              <Button
                href={getLinkFieldHref(buttonLink)}
                buttonStyle={buttonStyleVariant}
                buttonSize={buttonStyleSize}
                target={getLinkFieldTarget(buttonLink)}
                rel={getLinkFieldRel(buttonLink)}
                showIcon={showIcon}
                iconFieldPath="groupButton.buttonContentIcon"
                iconPosition={iconPosition}
                additionalClassArray={['hs-elevate-site-header__button']}
                moduleName={moduleName}
                textFieldPath="groupButton.buttonContentText"
              >
                {buttonText}
              </Button>
            </ButtonContainer>
          )}

          <MobileMenuContainer className={swm('hs-elevate-site-header__mobile-menu-container')}>
            <Island
              module={MobileMenuIsland}
              moduleName={moduleName}
              menuDataArray={navDataArray}
              flow="horizontal"
              maxDepth={3}
              menuAlignment={menuAlignment}
              navigationAriaLabel="Main mobile navigation"
              flyouts={true}
              menuBackgroundColor={menuBackgroundColorWithOpacity}
              menuAccentColor={menuAccentColor}
              menuTextColor={menuTextColor}
              menuTextHoverColor={menuTextHoverColor}
              buttonStyleVariant={buttonStyleVariant}
              buttonStyleSize={buttonStyleSize}
              groupButton={groupButton}
              hublData={props.hublData}
              myAvailableTranslations={translations}
              languageSwitcherSelectText={languageSwitcherSelectText}
              langSwitcherIconFieldPath={langSwitcherIconFieldPath}
            />
          </MobileMenuContainer>
        </SiteHeaderContainer>
      </SharedIslandState>
    </SiteHeader>
  );
};

export { fields } from './fields.js';

export const hublDataTemplate = `
  {% set hublData = {
      "navigation": menu(module.groupNavigation.menu, "site_root"),
      "companyName": branding_company_name,
      "logoLink": brand_settings.logo.link,
      "defaultLogo": {
        "src": brand_settings.logo.src,
        "alt": brand_settings.logo.alt,
        "width": brand_settings.logo.width,
        "height": brand_settings.logo.height
      },
      "isInEditor": is_in_editor
    }
  %}
`;

export const meta: ModuleMeta = {
  label: 'Site header',
  content_types: ['BLOG_LISTING', 'BLOG_POST', 'SITE_PAGE', 'LANDING_PAGE'],
  icon: SiteHeaderSVG,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/site_header',
  version: 0,
  themeModule: true,
};
