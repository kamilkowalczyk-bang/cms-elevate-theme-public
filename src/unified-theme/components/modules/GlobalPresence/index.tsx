import { ModuleMeta } from '../../types/modules.js';
import { Island } from '@hubspot/cms-components';
// @ts-expect-error -- ?island not typed
import GlobalPresenceIsland from './islands/GlobalPresenceIsland.js?island';
import { GlobalPresenceProps } from './types.js';
import { SectionVariantType } from '../../types/fields.js';
import { sectionColorsMap } from '../../utils/section-color-map.js';
import { HeadingStyleVariant } from '../../fieldLibrary/HeadingStyle/types.js';
import { CSSPropertiesMap } from '../../types/components.js';
import { getDataHSToken } from '../../utils/inline-editing.js';
import styles from './global-presence.module.css';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import globeIconSvg from './assets/globe.svg';
import { colorFieldToCss } from './color-to-css.js';

const swm = staticWithModule(styles);

const headingClasses: Record<HeadingStyleVariant, string> = {
  display_1: 'hs-elevate-display-1',
  display_2: 'hs-elevate-display-2',
  display_title: 'hs-elevate-display-title',
  h1: 'hs-elevate-h1',
  h2: 'hs-elevate-h2',
  h3: 'hs-elevate-h3',
  h4: 'hs-elevate-h4',
  h5: 'hs-elevate-h5',
  h6: 'hs-elevate-h6',
};

function generateSectionCssVars(sectionVariantField: SectionVariantType): CSSPropertiesMap {
  return {
    '--hsElevate--globalPresence__textColor': sectionColorsMap[sectionVariantField].textColor,
    '--hsElevate--globalPresence__accentColor': sectionColorsMap[sectionVariantField].accentColor,
  };
}

const Section = createComponent('section');
const SubheadingBlock = createComponent('div');

export const Component = (props: GlobalPresenceProps) => {
  const {
    moduleName,
    groupHeading: { heading, subheading, headingLevel },
    groupGlobe,
    groupStyle: { sectionStyleVariant, headingStyleVariant },
  } = props;

  const headingLevelStr = typeof headingLevel === 'string' ? headingLevel : 'h2';
  const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
  const HeadingTag = (headingLevels.includes(headingLevelStr as (typeof headingLevels)[number])
    ? headingLevelStr
    : 'h2') as keyof JSX.IntrinsicElements;
  const headingClass = headingStyleVariant ? headingClasses[headingStyleVariant] : '';

  const highlightCss = colorFieldToCss(groupGlobe.highlightColor);

  const cssVarsMap: CSSPropertiesMap = {
    ...generateSectionCssVars(sectionStyleVariant),
    '--hsElevate--globalPresence__highlightColor': highlightCss,
    '--hsElevate--globalPresence__maxHeight': `${groupGlobe.height ?? 500}px`,
  };

  return (
    <Section className={cx(swm('hs-elevate-global-presence'), 'hs-elevate-global-presence')} style={cssVarsMap}>
      <HeadingTag
        className={cx('hs-elevate-global-presence__heading', headingClass, swm('hs-elevate-global-presence__heading'))}
        data-hs-token={getDataHSToken(moduleName, 'groupHeading.heading')}
      >
        {heading}
      </HeadingTag>
      <SubheadingBlock
        className={cx('hs-elevate-global-presence__subheading-block', swm('hs-elevate-global-presence__subheading-block'))}
      >
        <p
          className={cx('hs-elevate-global-presence__subheading', swm('hs-elevate-global-presence__subheading'))}
          data-hs-token={getDataHSToken(moduleName, 'groupHeading.subheading')}
        >
          {subheading}
        </p>
        <div className={swm('hs-elevate-global-presence__subheading-divider')} aria-hidden="true" />
      </SubheadingBlock>
      <Island hydrateOn="visible" module={GlobalPresenceIsland} {...props} />
    </Section>
  );
};

export { fields } from './fields.js';

export const meta: ModuleMeta = {
  label: 'Global presence',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: globeIconSvg,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/global_presence',
  version: 0,
  themeModule: true,
};
