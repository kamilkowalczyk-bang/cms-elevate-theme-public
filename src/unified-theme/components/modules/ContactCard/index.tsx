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
  {% set page_lang = content.language.languageTag|default(html_lang)|default("en")|string|lower|trim|split("-")|first %}
  {% set supported_langs = ["fi", "fr", "de"] %}
  {% set lang_suffix = "" %}
  {% if page_lang in supported_langs %}
    {% set lang_suffix = "_" ~ page_lang %}
  {% endif %}
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
        {% set r_region_loc = none %}
        {% set r_dept_loc = none %}
        {% set r_btn_loc = none %}
        {% if lang_suffix %}
          {% set r_region_loc = dbrow.values["region" ~ lang_suffix] if dbrow.values else none %}
          {% set r_region_loc = r_region_loc if (r_region_loc and r_region_loc|string|trim != "") else dbrow["region" ~ lang_suffix] %}
          {% set r_dept_loc = dbrow.values["department" ~ lang_suffix] if dbrow.values else none %}
          {% set r_dept_loc = r_dept_loc if (r_dept_loc and r_dept_loc|string|trim != "") else dbrow["department" ~ lang_suffix] %}
          {% set r_btn_loc = dbrow.values["button_text" ~ lang_suffix] if dbrow.values else none %}
          {% set r_btn_loc = r_btn_loc if (r_btn_loc and r_btn_loc|string|trim != "") else dbrow["button_text" ~ lang_suffix] %}
        {% endif %}
        {% set t_region = r_region_loc if (r_region_loc and r_region_loc|string|trim != "") else dbrow.region %}
        {% set t_region = t_region if (t_region and t_region|string|trim != "") else (dbrow.values.region if dbrow.values else none) %}
        {% set t_department = r_dept_loc if (r_dept_loc and r_dept_loc|string|trim != "") else dbrow.department %}
        {% set t_department = t_department if (t_department and t_department|string|trim != "") else (dbrow.values.department if dbrow.values else none) %}
        {% set t_button_text = r_btn_loc if (r_btn_loc and r_btn_loc|string|trim != "") else dbrow.button_text %}
        {% set t_button_text = t_button_text if (t_button_text and t_button_text|string|trim != "") else (dbrow.values.button_text if dbrow.values else none) %}
        {% do manualHubDbRows.append({
          "region": t_region,
          "department": t_department,
          "button_text": t_button_text,
          "full_name": dbrow.full_name,
          "contact_image": dbrow.contact_image,
          "phone_text": dbrow.phone_text,
          "phone_link": dbrow.phone_link,
          "email_text": dbrow.email_text,
          "email_link": dbrow.email_link,
          "button_link": dbrow.button_link,
          "show_region": dbrow.show_region,
          "show_phone": dbrow.show_phone,
          "show_email": dbrow.show_email,
          "show_social_media": dbrow.show_social_media,
          "show_button": dbrow.show_button,
          "values": dbrow.values,
          "hs_id": dbrow.hs_id,
          "id": dbrow.id
        }) %}
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
          {% set f_region_loc = none %}
          {% set f_dept_loc = none %}
          {% set f_btn_loc = none %}
          {% if lang_suffix %}
            {% set f_region_loc = inv_row["region" ~ lang_suffix] %}
            {% set f_region_loc = f_region_loc if (f_region_loc and f_region_loc|string|trim != "") else (inv_row.values["region" ~ lang_suffix] if inv_row.values else none) %}
            {% set f_dept_loc = inv_row["department" ~ lang_suffix] %}
            {% set f_dept_loc = f_dept_loc if (f_dept_loc and f_dept_loc|string|trim != "") else (inv_row.values["department" ~ lang_suffix] if inv_row.values else none) %}
            {% set f_btn_loc = inv_row["button_text" ~ lang_suffix] %}
            {% set f_btn_loc = f_btn_loc if (f_btn_loc and f_btn_loc|string|trim != "") else (inv_row.values["button_text" ~ lang_suffix] if inv_row.values else none) %}
          {% endif %}
          {% set f_region = f_region_loc if (f_region_loc and f_region_loc|string|trim != "") else inv_row.region %}
          {% set f_region = f_region if (f_region and f_region|string|trim != "") else (inv_row.values.region if inv_row.values else none) %}
          {% set f_department = f_dept_loc if (f_dept_loc and f_dept_loc|string|trim != "") else inv_row.department %}
          {% set f_department = f_department if (f_department and f_department|string|trim != "") else (inv_row.values.department if inv_row.values else none) %}
          {% set f_button_text = f_btn_loc if (f_btn_loc and f_btn_loc|string|trim != "") else inv_row.button_text %}
          {% set f_button_text = f_button_text if (f_button_text and f_button_text|string|trim != "") else (inv_row.values.button_text if inv_row.values else none) %}
          {% do manualHubDbRows.append({
            "region": f_region,
            "department": f_department,
            "button_text": f_button_text,
            "full_name": inv_row.full_name,
            "contact_image": inv_row.contact_image,
            "phone_text": inv_row.phone_text,
            "phone_link": inv_row.phone_link,
            "email_text": inv_row.email_text,
            "email_link": inv_row.email_link,
            "button_link": inv_row.button_link,
            "show_region": inv_row.show_region,
            "show_phone": inv_row.show_phone,
            "show_email": inv_row.show_email,
            "show_social_media": inv_row.show_social_media,
            "show_button": inv_row.show_button,
            "values": inv_row.values,
            "hs_id": inv_row.hs_id,
            "id": inv_row.id
          }) %}
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endif %}
  {% set hublData = {
      "manualHubDbRows": manualHubDbRows,
      "feedFromManualHubDbOnly": feedFromManualHubDbOnly,
      "pageLang": page_lang
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
