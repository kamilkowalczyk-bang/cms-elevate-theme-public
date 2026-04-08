import { ModuleMeta } from '../../types/modules.js';
import { TextFieldType } from '@hubspot/cms-components/fields';
import logoGridIconSvg from './assets/card-icon-grid.svg';
import styles from './logo-grid.module.css';
import { SectionVariantType } from '../../types/fields.js';
import { SectionStyleFieldLibraryType } from '../../fieldLibrary/SectionStyle/types.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../fieldLibrary/HeadingAndText/types.js';
import HeadingComponent from '../../HeadingComponent/index.js';
import { sectionColorsMap } from '../../utils/section-color-map.js';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { CSSPropertiesMap } from '../../types/components.js';

const swm = staticWithModule(styles);

type LogoItem = {
  id: number;
  name?: string;
  logo: {
    src?: string;
    alt?: string;
    loading?: string;
    width?: number;
    height?: number;
  };
};

type GroupContent = HeadingAndTextFieldLibraryType & {
  description?: TextFieldType['default'];
};

type GroupStyle = SectionStyleFieldLibraryType &
  HeadingStyleFieldLibraryType & {
    columnsDesktop?: number;
    columnsTablet?: number;
    columnsMobile?: number;
    logoMaxHeight?: number;
  };

type LogoGridProps = {
  moduleName?: string;
  groupContent: GroupContent;
  groupStyle: GroupStyle;
  hublData: {
    renderedWithGrids: boolean;
    logoRows?: LogoItem[];
  };
};

function generateColorCssVars(sectionVariantField: SectionVariantType): CSSPropertiesMap {
  const { textColor, accentColor } = sectionColorsMap[sectionVariantField] || sectionColorsMap['section_variant_1'];

  return {
    '--hsElevate--logoGrid__textColor': textColor,
    '--hsElevate--logoGrid__accentColor': accentColor,
  };
}

function generateLayoutCssVars(groupStyle: GroupStyle): CSSPropertiesMap {
  const {
    columnsDesktop = 5,
    columnsTablet = 4,
    columnsMobile = 2,
    logoMaxHeight,
  } = groupStyle;

  const clampedLogoMaxHeight =
    typeof logoMaxHeight === 'number'
      ? Math.min(150, Math.max(50, logoMaxHeight))
      : 72;

  return {
    '--hsElevate--logoGrid__columnsDesktop': `${columnsDesktop}`,
    '--hsElevate--logoGrid__columnsTablet': `${columnsTablet}`,
    '--hsElevate--logoGrid__columnsMobile': `${columnsMobile}`,
    '--hsElevate--logoGrid__logoMaxHeight': `${clampedLogoMaxHeight}px`,
  };
}

const LogoGridRoot = createComponent('section');
const LogoGridInner = createComponent('div');
const LogoGridHeader = createComponent('header');
const LogoGridDescription = createComponent('p');
const LogoGridList = createComponent('div');
const LogoGridItem = createComponent('div');
const LogoGridImage = createComponent<'img'>('img');

export const Component = (props: LogoGridProps) => {
  const {
    groupContent: { headingAndTextHeading, headingAndTextHeadingLevel, description },
    groupStyle,
    hublData: { renderedWithGrids = false, logoRows = [] },
  } = props;

  const cssVarsMap: CSSPropertiesMap = {
    ...generateColorCssVars(groupStyle.sectionStyleVariant),
    ...generateLayoutCssVars(groupStyle),
  };

  const layoutClass = renderedWithGrids
    ? 'hs-elevate-logo-grid-react--grids'
    : 'hs-elevate-logo-grid-react--bootstrap';

  const hasHeading = Boolean(headingAndTextHeading);
  const hasDescription = Boolean(description);

  return (
    <LogoGridRoot className={cx(swm('hs-elevate-logo-grid-react'), styles[layoutClass])} style={cssVarsMap}>
      <LogoGridInner className={swm('hs-elevate-logo-grid-react__inner')}>
        {(hasHeading || hasDescription) && (
          <LogoGridHeader className={swm('hs-elevate-logo-grid-react__header')}>
            {hasHeading && (
              <HeadingComponent
                headingLevel={headingAndTextHeadingLevel}
                heading={headingAndTextHeading}
                headingStyleVariant={groupStyle.headingStyleVariant}
                additionalClassArray={[swm('hs-elevate-logo-grid-react__title')]}
              />
            )}
            {hasDescription && (
              <LogoGridDescription className={swm('hs-elevate-logo-grid-react__description')}>
                {description}
              </LogoGridDescription>
            )}
          </LogoGridHeader>
        )}

        <LogoGridList className={swm('hs-elevate-logo-grid-react__grid')}>
          {logoRows.map((item) => {
            const alt = item.logo.alt || item.name || '';
            const loading: 'eager' | 'lazy' = item.logo.loading === 'eager' ? 'eager' : 'lazy';
            const img = (
              <LogoGridImage
                className={swm('hs-elevate-logo-grid-react__logo')}
                src={item.logo.src}
                alt={alt}
                loading={loading}
                width={item.logo.width}
                height={item.logo.height}
              />
            );

            return (
              <LogoGridItem key={item.id} className={swm('hs-elevate-logo-grid-react__item')}>
                {img}
              </LogoGridItem>
            );
          })}
        </LogoGridList>
      </LogoGridInner>
    </LogoGridRoot>
  );
};

export { fields } from './fields.js';

export const hublDataTemplate = `
  {% set logoRows = [] %}
  {% for logoCard in module.groupContent.groupLogos %}
    {% set picker = logoCard.groupHubdbRow %}
    {% set rid = none %}
    {% if picker %}
      {% if picker.id is not none %}
        {% set rid = picker.id %}
      {% elif picker.rowId is not none %}
        {% set rid = picker.rowId %}
      {% elif picker.row_id is not none %}
        {% set rid = picker.row_id %}
      {% elif picker.values and picker.values.hs_id is not none %}
        {% set rid = picker.values.hs_id %}
      {% endif %}
    {% endif %}
    {% if rid %}
      {% set row = hubdb_table_row(231586389, rid|int) %}
      {% set logoRaw = row.logo %}
      {% if logoRaw %}
        {% if logoRaw.url %}
          {% set logoSrc = logoRaw.url %}
        {% elif logoRaw.full_url %}
          {% set logoSrc = logoRaw.full_url %}
        {% elif logoRaw.image and logoRaw.image.url %}
          {% set logoSrc = logoRaw.image.url %}
        {% elif logoRaw.image and logoRaw.image.default and logoRaw.image.default.url %}
          {% set logoSrc = logoRaw.image.default.url %}
        {% elif logoRaw.default and logoRaw.default.url %}
          {% set logoSrc = logoRaw.default.url %}
        {% elif logoRaw.src %}
          {% set logoSrc = logoRaw.src %}
        {% elif logoRaw.href %}
          {% set logoSrc = logoRaw.href %}
        {% elif logoRaw.file_url %}
          {% set logoSrc = logoRaw.file_url %}
        {% else %}
          {% set logoSrc = logoRaw %}
        {% endif %}
      {% else %}
        {% set logoSrc = "" %}
      {% endif %}
      {% set companyName = row.company_name %}
      {% if logoRaw and logoRaw.alt %}
        {% set logoAlt = logoRaw.alt %}
      {% else %}
        {% set logoAlt = companyName %}
      {% endif %}
      {% if logoSrc %}
        {% do logoRows.append({
          "id": rid|int,
          "name": companyName,
          "logo": {
            "src": logoSrc,
            "alt": logoAlt or "",
            "loading": "lazy"
          }
        }) %}
      {% endif %}
    {% endif %}
  {% endfor %}

  {% set hublData = {
      "renderedWithGrids": rendered_with_grids,
      "logoRows": logoRows
    }
  %}
`;

export const meta: ModuleMeta = {
  label: 'Logo Grid HubDB',
  content_types: ['SITE_PAGE', 'LANDING_PAGE', 'BLOG_LISTING', 'BLOG_POST'],
  icon: logoGridIconSvg,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/logo_grid',
  version: 0,
  themeModule: true,
};

