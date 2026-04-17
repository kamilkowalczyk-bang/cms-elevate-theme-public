import { ModuleMeta } from '../../types/modules.js';
import { Island } from '@hubspot/cms-components';
import logoGridIconSvg from './assets/card-icon-grid.svg';
// @ts-expect-error -- ?island not typed
import LogoGridSliderIsland from './islands/LogoGridSliderIsland.js?island';
import { LogoGridSliderProps } from './types.js';
import { HUBDB_TABLE_NAMES } from '../../utils/hubdb-table-names.js';

export const Component = (props: LogoGridSliderProps) => {
  const {
    groupContent: { headingAndTextHeading, headingAndTextHeadingLevel, description, slidesPerPage = 6 },
    groupStyle,
    hublData: { renderedWithGrids = false, logoRows = [] },
  } = props;

  return (
    <Island
      hydrateOn="load"
      module={LogoGridSliderIsland}
      heading={headingAndTextHeading}
      headingLevel={headingAndTextHeadingLevel}
      description={description}
      slidesPerPage={slidesPerPage}
      groupStyle={groupStyle}
      renderedWithGrids={renderedWithGrids}
      logoRows={logoRows}
      clientOnly={true}
    />
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
      {% set row = hubdb_table_row("${HUBDB_TABLE_NAMES.logoGrid}", rid|int) %}
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
  label: 'Logo Grid Slider HubDB',
  content_types: ['SITE_PAGE', 'LANDING_PAGE', 'BLOG_LISTING', 'BLOG_POST'],
  icon: logoGridIconSvg,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/logo_grid_slider',
  version: 0,
  themeModule: true,
};
