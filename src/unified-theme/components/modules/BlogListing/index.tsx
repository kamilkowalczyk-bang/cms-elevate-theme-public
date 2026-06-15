import { ModuleMeta } from '../../types/modules.js';
import blogSVG from './assets/blog.svg';
import { withUrlPath, Island } from '@hubspot/cms-components';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { CardStyleFieldLibraryType } from '../../fieldLibrary/CardStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../fieldLibrary/HeadingAndText/types.js';
import fetchGatedPosts from '../../utils/ServerSideProps/fetchGatedBlogPosts.js';
// @ts-expect-error -- ?island modules are resolved at build time
import BlogListingIsland from './islands/BlogListingIsland.js?island';

type BlogTag = {
  name: string;
  slug: string | null;
  url: string;
};

type BlogListingProps = HeadingAndTextFieldLibraryType & {
  readArticleLabel?: string;
  hublData: {
    blogPosts: {
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
    }[];
    currentPageNumber: number;
    nextPageNumber: number;
    totalPageCount: number;
    contentsTotalCount?: number;
    use_featured_image_in_summary: boolean;
    allTags: BlogTag[];
    activeTagSlug: string | null;
    blogListingUrl: string;
    firstPageLink: string;
    currentPath?: string;
    blogGroupId: number;
    searchPageSize: number;
  };
  serverSideProps: {
    gatedContentIds: number[];
  };
  groupStyle: CardStyleFieldLibraryType & HeadingStyleFieldLibraryType;
  defaultContent: {
    nextPage: string;
    previousPage: string;
  };
};

export const Component = (props: BlogListingProps) => {
  return <Island hydrateOn="load" module={BlogListingIsland} {...props} />;
};

export { fields } from './fields.js';

export { default as hublDataTemplate } from './hubl_data.hubl.html?raw';

export const getServerSideProps = withUrlPath(fetchGatedPosts);

export const meta: ModuleMeta = {
  label: 'Blog listing',
  content_types: ['BLOG_LISTING'],
  icon: blogSVG,
  categories: ['blog'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/blog_listing',
  version: 0,
  themeModule: true,
};
