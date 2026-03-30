import { TextFieldType } from '@hubspot/cms-components/fields';

export type TimelineEntry = {
  year: TextFieldType['default'];
  content: TextFieldType['default'];
  contentSide: 'left' | 'right';
};

export type TimelineProps = {
  moduleName?: string;
  timelineStartYear: TextFieldType['default'];
  timelineEndYear: TextFieldType['default'];
  groupTimelineEntries: TimelineEntry[];
};
