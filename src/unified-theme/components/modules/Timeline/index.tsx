import { ModuleMeta } from '../../types/modules.js';
import { createComponent } from '../../utils/create-component.js';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { getDataHSToken } from '../../utils/inline-editing.js';
import { getCardVariantClassName } from '../../utils/card-variants.js';
import { CardVariantType } from '../../types/fields.js';
import { CSSPropertiesMap } from '../../types/components.js';
import timelineIconSvg from './assets/timeline.svg';
import styles from './timeline.module.css';
import { TimelineProps } from './types.js';

const swm = staticWithModule(styles);

function cardVariantIndex(variant: CardVariantType): 1 | 2 | 3 | 4 {
  if (variant === 'card_variant_2') return 2;
  if (variant === 'card_variant_3') return 3;
  if (variant === 'card_variant_4') return 4;
  return 1;
}

function timelineSectionCssVars(variant: CardVariantType): CSSPropertiesMap {
  const n = cardVariantIndex(variant);
  return {
    '--hsElevate--timeline__stripText': `var(--hsElevate--card--variant${n}__textColor)`,
  };
}

function timelineNotchCssVars(variant: CardVariantType): CSSPropertiesMap {
  const n = cardVariantIndex(variant);
  return {
    '--hsElevate--timeline__notchBg': `var(--hsElevate--card--variant${n}__backgroundColor)`,
    '--hsElevate--timeline__notchBorder': `var(--hsElevate--card--variant${n}__borderColor)`,
  };
}

const TimelineRoot = createComponent('section');
const TimelineCapsule = createComponent('div');
const TimelineEntries = createComponent('div');
const TimelineEntry = createComponent('article');
const TimelineTrack = createComponent('div');
const TimelineCenter = createComponent('div');
const TimelineDot = createComponent('span');
const TimelineDateStrip = createComponent('span');
const TimelineCardBody = createComponent('p');
const TimelineCardSurface = createComponent('div');

export const Component = (props: TimelineProps) => {
  const { moduleName, timelineStartYear, timelineEndYear, groupTimelineEntries = [], groupStyle } = props;
  const cardStyleVariant = groupStyle?.cardStyleVariant ?? 'card_variant_1';

  const sectionStyle = timelineSectionCssVars(cardStyleVariant);
  const notchStyle = timelineNotchCssVars(cardStyleVariant);
  const variantClass = getCardVariantClassName({ cardVariant: cardStyleVariant, fallbackCardVariant: 'card_variant_1' });

  return (
    <TimelineRoot className={swm('hs-elevate-timeline')} style={sectionStyle}>
      <TimelineCapsule
        className={swm('hs-elevate-timeline__capsule')}
        data-hs-token={getDataHSToken(moduleName, 'timelineStartYear')}
      >
        {timelineStartYear}
      </TimelineCapsule>

      <TimelineEntries className={swm('hs-elevate-timeline__entries')}>
        {groupTimelineEntries.map((entry, index) => {
          const cardOnRight = entry.contentSide === 'right';

          return (
            <TimelineEntry
              key={index}
              className={cx(
                swm('hs-elevate-timeline__entry'),
                cardOnRight ? swm('hs-elevate-timeline__entry--right') : swm('hs-elevate-timeline__entry--left'),
              )}
            >
              <TimelineTrack className={swm('hs-elevate-timeline__track-a')}>
                {cardOnRight ? (
                  <TimelineDateStrip
                    className={swm('hs-elevate-timeline__dateStrip')}
                    data-hs-token={getDataHSToken(moduleName, `groupTimelineEntries[${index}].year`)}
                  >
                    {entry.year}
                  </TimelineDateStrip>
                ) : (
                  <TimelineCardSurface
                    className={cx(variantClass, swm('hs-elevate-timeline__cardSurface'), swm('hs-elevate-timeline__cardSurface--notchRight'))}
                    style={notchStyle}
                  >
                    <TimelineCardBody
                      className={swm('hs-elevate-timeline__cardBody')}
                      data-hs-token={getDataHSToken(moduleName, `groupTimelineEntries[${index}].content`)}
                    >
                      {entry.content}
                    </TimelineCardBody>
                  </TimelineCardSurface>
                )}
              </TimelineTrack>

              <TimelineCenter className={swm('hs-elevate-timeline__center')}>
                <TimelineDot className={swm('hs-elevate-timeline__dot')} aria-hidden={true} />
              </TimelineCenter>

              <TimelineTrack className={swm('hs-elevate-timeline__track-b')}>
                {cardOnRight ? (
                  <TimelineCardSurface
                    className={cx(variantClass, swm('hs-elevate-timeline__cardSurface'), swm('hs-elevate-timeline__cardSurface--notchLeft'))}
                    style={notchStyle}
                  >
                    <TimelineCardBody
                      className={swm('hs-elevate-timeline__cardBody')}
                      data-hs-token={getDataHSToken(moduleName, `groupTimelineEntries[${index}].content`)}
                    >
                      {entry.content}
                    </TimelineCardBody>
                  </TimelineCardSurface>
                ) : (
                  <TimelineDateStrip
                    className={swm('hs-elevate-timeline__dateStrip')}
                    data-hs-token={getDataHSToken(moduleName, `groupTimelineEntries[${index}].year`)}
                  >
                    {entry.year}
                  </TimelineDateStrip>
                )}
              </TimelineTrack>
            </TimelineEntry>
          );
        })}
      </TimelineEntries>

      <TimelineCapsule
        className={swm('hs-elevate-timeline__capsule')}
        data-hs-token={getDataHSToken(moduleName, 'timelineEndYear')}
      >
        {timelineEndYear}
      </TimelineCapsule>
    </TimelineRoot>
  );
};

export { fields } from './fields.js';

export const meta: ModuleMeta = {
  label: 'Timeline',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: timelineIconSvg,
  categories: ['design'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/timeline',
  version: 0,
  themeModule: true,
};
