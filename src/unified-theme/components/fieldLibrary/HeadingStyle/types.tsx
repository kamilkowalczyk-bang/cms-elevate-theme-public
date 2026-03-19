import { HeadingLevelType } from '../../types/fields.js';

export type HeadingStyleVariant = HeadingLevelType | 'display_1' | 'display_2' | 'display_title';
export type HeadingStyleFieldLibraryType = {
  headingStyleVariant: HeadingStyleVariant;
};
