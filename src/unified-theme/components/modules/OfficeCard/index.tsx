import { Island } from '@hubspot/cms-components';
import { ModuleMeta } from '../../types/modules.js';
import cardIconSvg from '../Card/assets/card-icon-temp.svg';
import { HUBDB_TABLE_NAMES } from '../../utils/hubdb-table-names.js';
import { OfficeCardProps } from './types.js';
// @ts-expect-error -- ?island not typed
import OfficeCardIsland from './islands/OfficeCardIsland.js?island';

export const Component = (props: OfficeCardProps) => {
  return <Island hydrateOn="load" module={OfficeCardIsland} {...props} />;
};

export { fields } from './fields.js';

export const hublDataTemplate = `
  {% set manualHubDbRows = [] %}
  {% if module.useHubDB %}
    {% for officeCard in module.groupOfficeCards %}
      {% set picker = officeCard.groupHubdbRow %}
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
        {% set dbrow = hubdb_table_row("${HUBDB_TABLE_NAMES.officeCard}", rid|int) %}
        {% do manualHubDbRows.append(dbrow) %}
      {% else %}
        {% do manualHubDbRows.append(none) %}
      {% endif %}
    {% endfor %}
  {% endif %}
  {% set hublData = {
      "manualHubDbRows": manualHubDbRows
    }
  %}
`;

export const meta: ModuleMeta = {
  label: 'Office card',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: cardIconSvg,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/office_card',
  version: 0,
  themeModule: true,
};
