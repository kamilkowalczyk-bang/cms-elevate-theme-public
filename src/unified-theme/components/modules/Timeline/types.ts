import { TextFieldType } from '@hubspot/cms-components/fields';
import { CardStyleFieldLibraryType } from '../../fieldLibrary/CardStyle/types.js';

export type TimelineEntry = {
  year: TextFieldType['default'];
  content: TextFieldType['default'];
  /** Styled card (paragraph) on this side of the dot; opposite side is date-only strip. */
  contentSide: 'left' | 'right';
};

export type TimelineProps = {
  moduleName?: string;
  timelineStartYear: TextFieldType['default'];
  timelineEndYear: TextFieldType['default'];
  groupTimelineEntries: TimelineEntry[];
  groupStyle?: CardStyleFieldLibraryType;
};
