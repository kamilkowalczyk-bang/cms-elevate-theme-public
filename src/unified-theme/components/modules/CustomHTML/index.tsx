import { TextFieldType } from '@hubspot/cms-components/fields';
import { ModuleMeta } from '../../types/modules.js';
import styles from './custom-html.module.css';
import codeIconSvg from './assets/code.svg';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';

const swm = staticWithModule(styles);

type CustomHTMLProps = {
  custom_html?: TextFieldType['default'];
};

const CustomHTMLWrapper = createComponent('div');

export const Component = (props: CustomHTMLProps) => {
  const html = props.custom_html?.trim();

  if (!html) {
    return null;
  }

  return (
    <CustomHTMLWrapper
      className={cx(swm('hs-elevate-custom-html'))}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export { fields } from './fields.js';

export const meta: ModuleMeta = {
  label: 'Custom HTML',
  content_types: [
    'BLOG_LISTING',
    'BLOG_POST',
    'SITE_PAGE',
    'LANDING_PAGE',
    'CASE_STUDY',
  ],
  icon: codeIconSvg,
  categories: ['functionality'],
  is_available_for_new_content: true,
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/custom_html',
  version: 0,
  themeModule: true,
};
