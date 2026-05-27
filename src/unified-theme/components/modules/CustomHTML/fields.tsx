import { ModuleFields, TextField } from '@hubspot/cms-components/fields';

export const fields = (
  <ModuleFields>
    <TextField
      name="custom_html"
      label="Custom HTML"
      helpText="Paste raw HTML here. Security: Only trusted users should paste HTML (scripts, iframes, etc. will run as written)."
      default=""
      allowNewLine={true}
    />
  </ModuleFields>
);
