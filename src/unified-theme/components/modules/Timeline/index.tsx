import { ModuleMeta } from '../../types/modules.js';
import { createComponent } from '../../utils/create-component.js';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { getDataHSToken } from '../../utils/inline-editing.js';
import timelineIconSvg from './assets/timeline.svg';
import styles from './timeline.module.css';
import { TimelineProps } from './types.js';

const swm = staticWithModule(styles);

const TimelineRoot = createComponent('section');
const TimelineCapsule = createComponent('div');
const TimelineEntries = createComponent('div');
const TimelineEntry = createComponent('article');
const TimelineSide = createComponent('div');
const TimelineCenter = createComponent('div');
const TimelineYear = createComponent('span');
const TimelineDot = createComponent('span');
const TimelineCard = createComponent('p');

export const Component = (props: TimelineProps) => {
  const {
    moduleName,
    timelineStartYear,
    timelineEndYear,
    groupTimelineEntries = [],
  } = props;

  return (
    <TimelineRoot className={swm('hs-elevate-timeline')}>
      <TimelineCapsule
        className={swm('hs-elevate-timeline__capsule')}
        data-hs-token={getDataHSToken(moduleName, 'timelineStartYear')}
      >
        {timelineStartYear}
      </TimelineCapsule>

      <TimelineEntries className={swm('hs-elevate-timeline__entries')}>
        {groupTimelineEntries.map((entry, index) => {
          const side = entry.contentSide === 'left' ? 'left' : 'right';

          return (
            <TimelineEntry
              key={index}
              className={cx(
                swm('hs-elevate-timeline__entry'),
                swm(`hs-elevate-timeline__entry--${side}`),
              )}
            >
              <TimelineSide className={cx(swm('hs-elevate-timeline__side'), swm('hs-elevate-timeline__side--left'))}>
                <TimelineYear
                  className={swm('hs-elevate-timeline__year')}
                  data-hs-token={getDataHSToken(moduleName, `groupTimelineEntries[${index}].year`)}
                >
                  {entry.year}
                </TimelineYear>
                <TimelineCard
                  className={swm('hs-elevate-timeline__card')}
                  data-hs-token={getDataHSToken(moduleName, `groupTimelineEntries[${index}].content`)}
                >
                  {entry.content}
                </TimelineCard>
              </TimelineSide>

              <TimelineCenter className={swm('hs-elevate-timeline__center')}>
                <TimelineDot className={swm('hs-elevate-timeline__dot')} aria-hidden={true} />
              </TimelineCenter>

              <TimelineSide className={cx(swm('hs-elevate-timeline__side'), swm('hs-elevate-timeline__side--right'))}>
                <TimelineYear
                  className={swm('hs-elevate-timeline__year')}
                  data-hs-token={getDataHSToken(moduleName, `groupTimelineEntries[${index}].year`)}
                >
                  {entry.year}
                </TimelineYear>
                <TimelineCard
                  className={swm('hs-elevate-timeline__card')}
                  data-hs-token={getDataHSToken(moduleName, `groupTimelineEntries[${index}].content`)}
                >
                  {entry.content}
                </TimelineCard>
              </TimelineSide>
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
