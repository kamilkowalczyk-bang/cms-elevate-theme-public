import { Island } from '@hubspot/cms-components';
import { ModuleMeta } from '../../types/modules.js';
import cardIconSvg from '../Card/assets/card-icon-temp.svg';
import { ContactCardProps } from './types.js';
// @ts-expect-error -- ?island not typed
import ContactCardIsland from './islands/ContactCardIsland.js?island';

export const Component = (props: ContactCardProps) => {
  return <Island hydrateOn="load" module={ContactCardIsland} {...props} />;
};

export { fields } from './fields.js';

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
