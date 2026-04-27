import { Island } from '@hubspot/cms-components';
import { ModuleMeta } from '../../types/modules.js';
import cardIconSvg from '../Card/assets/card-icon-temp.svg';
import { ContactCardProps } from './types.js';
import { HUBDB_TABLE_NAMES } from '../../utils/hubdb-table-names.js';
// @ts-expect-error -- ?island not typed
import ContactCardIsland from './islands/ContactCardIsland.js?island';

export const Component = (props: ContactCardProps) => {
  return <Island hydrateOn="load" module={ContactCardIsland} {...props} />;
};

export { fields } from './fields.js';

export const hublDataTemplate = `
  {% set manualHubDbRows = [] %}
  {% set feedFromManualHubDbOnly = false %}
  {% if module.useHubDB %}
    {% for card in module.groupContactCards %}
      {% set picker = card.groupHubdbRow %}
      {% set rid = none %}
      {% if picker %}
        {% if picker.id is not none %}
          {% set rid = picker.id %}
        {% elif picker.rowId is not none %}
          {% set rid = picker.rowId %}
        {% elif picker.row_id is not none %}
          {% set rid = picker.row_id %}
        {% elif picker.hs_id is not none %}
          {% set rid = picker.hs_id %}
        {% elif picker.values and picker.values.hs_id is not none %}
          {% set rid = picker.values.hs_id %}
        {% endif %}
      {% endif %}
      {% if rid %}
        {% set dbrow = hubdb_table_row("${HUBDB_TABLE_NAMES.contactCard}", rid|int) %}
        {% do manualHubDbRows.append(dbrow) %}
      {% else %}
        {% do manualHubDbRows.append(none) %}
      {% endif %}
    {% endfor %}
    {% set resolvedHubDbMarkers = [] %}
    {% for _r in manualHubDbRows %}
      {% if _r %}
        {% do resolvedHubDbMarkers.append(1) %}
      {% endif %}
    {% endfor %}
    {% if module.hubdbFallbackInvoicingWhenEmpty and resolvedHubDbMarkers|length == 0 %}
      {% set feedFromManualHubDbOnly = true %}
      {% set manualHubDbRows = [] %}
      {% for inv_row in hubdb_table_rows("${HUBDB_TABLE_NAMES.contactCard}") %}
        {% set inv_raw = inv_row.invoicing_and_purchasing|default(inv_row.values.invoicing_and_purchasing if inv_row.values else none) %}
        {% set inv_candidate = inv_raw %}
        {% if inv_candidate and inv_candidate.value is defined %}
          {% set inv_candidate = inv_candidate.value %}
        {% elif inv_candidate and inv_candidate.checked is defined %}
          {% set inv_candidate = inv_candidate.checked %}
        {% elif inv_candidate and inv_candidate.selected is defined %}
          {% set inv_candidate = inv_candidate.selected %}
        {% endif %}
        {% set inv_norm = inv_candidate|string|lower|trim %}
        {% set is_invoicing = (inv_norm == "1" or inv_norm == "true" or inv_norm == "yes" or inv_norm == "on") %}
        {% if is_invoicing %}
          {% do manualHubDbRows.append(inv_row) %}
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endif %}
  {% set hublData = {
      "manualHubDbRows": manualHubDbRows,
      "feedFromManualHubDbOnly": feedFromManualHubDbOnly
    }
  %}
`;

export const meta: ModuleMeta = {
  label: 'Contact card',
  content_types: ['SITE_PAGE', 'LANDING_PAGE', 'CASE_STUDY'],
  icon: cardIconSvg,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/contact_card',
  version: 0,
  themeModule: true,
};
