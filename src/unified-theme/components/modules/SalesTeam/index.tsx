import { Island } from '@hubspot/cms-components';
import { ModuleMeta } from '../../types/modules.js';
import cardIconSvg from '../Card/assets/card-icon-temp.svg';
import { HUBDB_TABLE_NAMES } from '../../utils/hubdb-table-names.js';
import { SalesTeamProps } from './types.js';
// @ts-expect-error -- ?island not typed
import SalesTeamIsland from './islands/SalesTeamIsland.js?island';

export const Component = (props: SalesTeamProps) => {
  return <Island hydrateOn="load" module={SalesTeamIsland} {...props} />;
};

export { fields } from './fields.js';

export const hublDataTemplate = `
  {% set manualHubDbRowsRegional = [] %}
  {% for slot in module.groupRegionalCards %}
    {% set picker = slot.groupHubdbRow %}
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
      {% do manualHubDbRowsRegional.append(hubdb_table_row("${HUBDB_TABLE_NAMES.contactCard}", rid|int)) %}
    {% else %}
      {% do manualHubDbRowsRegional.append(none) %}
    {% endif %}
  {% endfor %}

  {# When template/module instance passes no usable HubDB row picks (common with {% module %} + dynamic repeater),
     build the regional list from published contact_cards rows so the grid can render. #}
  {% set resolvedMarkers = [] %}
  {% for _rr in manualHubDbRowsRegional %}
    {% if _rr %}
      {% do resolvedMarkers.append(1) %}
    {% endif %}
  {% endfor %}
  {% if resolvedMarkers|length == 0 %}
    {% set manualHubDbRowsRegional = [] %}
    {% set allContactRows = hubdb_table_rows("${HUBDB_TABLE_NAMES.contactCard}") %}
    {% for row in allContactRows %}
      {% set inv = row.invoicing_and_purchasing %}
      {% if inv is none and row.values %}
        {% set inv = row.values.invoicing_and_purchasing %}
      {% endif %}
      {% if not inv %}
        {% do manualHubDbRowsRegional.append(row) %}
      {% endif %}
    {% endfor %}
    {% if manualHubDbRowsRegional|length == 0 %}
      {% for row in allContactRows %}
        {% do manualHubDbRowsRegional.append(row) %}
      {% endfor %}
    {% endif %}
  {% endif %}

  {% set featuredHubDbRow = none %}
  {% set featuredRowId = none %}
  {% if not module.bookDemo %}
    {% set featuredCandidates = [] %}
    {% for row in hubdb_table_rows("${HUBDB_TABLE_NAMES.contactCard}") %}
      {% set isDefaultRep = row.default_sales_rep or (row.values.default_sales_rep if row.values else false) %}
      {% if isDefaultRep %}
        {% do featuredCandidates.append(row) %}
      {% endif %}
    {% endfor %}
    {% set featuredHubDbRow = featuredCandidates[0] if featuredCandidates|length > 0 else none %}
    {% set featuredRowId = none %}
    {% if featuredHubDbRow %}
      {% if featuredHubDbRow.hs_id is not none %}
        {% set featuredRowId = featuredHubDbRow.hs_id %}
      {% elif featuredHubDbRow.values and featuredHubDbRow.values.hs_id is not none %}
        {% set featuredRowId = featuredHubDbRow.values.hs_id %}
      {% endif %}
    {% endif %}
  {% endif %}

  {% set hublData = {
      "manualHubDbRowsRegional": manualHubDbRowsRegional,
      "featuredHubDbRow": featuredHubDbRow,
      "featuredRowId": featuredRowId
    }
  %}
`;

export const meta: ModuleMeta = {
  label: 'Sales team',
  content_types: ['SITE_PAGE', 'LANDING_PAGE', 'CASE_STUDY'],
  icon: cardIconSvg,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/sales_team',
  version: 0,
  themeModule: true,
};
