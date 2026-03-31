import { HeadingLevelType } from '../../types/fields.js';
import { CardStyleFieldLibraryType } from '../../fieldLibrary/CardStyle/types.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';

export type RecentBlogPostSlide = {
  id: number;
  title: string;
  featuredImage: string;
  featuredImageAltText: string;
  featuredImageWidth: number;
  featuredImageHeight: number;
  topicNames: string[];
  absoluteUrl: string;
  publishDate?: string;
  authorName?: string;
  readTimeMinutes?: number;
};

export type RecentBlogPostsSliderProps = {
  hublData: {
    posts: RecentBlogPostSlide[];
    isInEditor: boolean;
    renderedWithGrids: boolean;
  };
  fieldValues: {
    excludeCurrentPost: boolean;
    postLimit: number;
    headingAndTextHeadingLevel: HeadingLevelType;
    groupStyle: CardStyleFieldLibraryType & HeadingStyleFieldLibraryType;
    groupPlaceholderText: {
      placeholderTitle: string;
      placeholderDescription: string;
    };
    readArticleLabel: string;
  };
  serverSideProps?: {
    gatedContentIds: number[];
  };
};

export type RecentBlogPostsSliderIslandProps = {
  posts: RecentBlogPostSlide[];
  isInEditor: boolean;
  headingAndTextHeadingLevel: HeadingLevelType;
  cardStyleVariant: CardStyleFieldLibraryType['cardStyleVariant'];
  placeholderTitle: string;
  placeholderDescription: string;
  readArticleLabel: string;
  gatedContentIds: number[];
};
