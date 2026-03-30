import { useMemo, useState } from 'react';
import styles from '../blog-listing.module.css';
import { staticWithModule } from '../../../utils/classnames.js';
import { createComponent } from '../../../utils/create-component.js';
import BlogCardComponent from '../../../BlogCardComponent/index.js';
import Pagination from '../pagination.js';
import { HeadingStyleFieldLibraryType } from '../../../fieldLibrary/HeadingStyle/types.js';
import { CardStyleFieldLibraryType } from '../../../fieldLibrary/CardStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../../fieldLibrary/HeadingAndText/types.js';

const swm = staticWithModule(styles);

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
    use_featured_image_in_summary: boolean;
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

const BlogListingRoot = createComponent('div');
const BlogCardsContainer = createComponent('div');
const TagFilterBar = createComponent('div');
const TagFilterButton = createComponent<'button'>('button');

const normalizeTag = (tag: string): string => tag.trim().toLowerCase();

function BlogListingIsland(props: BlogListingProps) {
  if (!props?.hublData?.blogPosts) {
    return null;
  }

  const {
    hublData: { blogPosts, currentPageNumber, nextPageNumber, totalPageCount },
    serverSideProps: { gatedContentIds = [] },
    groupStyle: { headingStyleVariant, cardStyleVariant } = {},
    headingAndTextHeadingLevel,
    defaultContent,
    readArticleLabel,
  } = props;

  const [activeTag, setActiveTag] = useState<'__all__' | string>('__all__');

  const tagOptions = useMemo(() => {
    const seen = new Map<string, string>();

    blogPosts.forEach(post => {
      (post.topicNames || []).forEach(rawTag => {
        const key = normalizeTag(rawTag);
        if (key && !seen.has(key)) {
          seen.set(key, rawTag);
        }
      });
    });

    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    if (activeTag === '__all__') {
      return blogPosts;
    }

    return blogPosts.filter(post =>
      (post.topicNames || []).some(tag => normalizeTag(tag) === activeTag),
    );
  }, [activeTag, blogPosts]);

  const blogListingClasses = swm('hs-elevate-blog-listing');

  return (
    <BlogListingRoot className={blogListingClasses}>
      {tagOptions.length > 0 && (
        <TagFilterBar className={swm('hs-elevate-blog-listing__tag-tabs')}>
          <TagFilterButton
            type="button"
            className={swm('hs-elevate-blog-listing__tag-tab')}
            aria-pressed={activeTag === '__all__'}
            onClick={() => setActiveTag('__all__')}
          >
            Show all
          </TagFilterButton>
          {tagOptions.map(option => (
            <TagFilterButton
              key={option.value}
              type="button"
              className={swm('hs-elevate-blog-listing__tag-tab')}
              aria-pressed={activeTag === option.value}
              onClick={() => setActiveTag(option.value)}
            >
              {option.label}
            </TagFilterButton>
          ))}
        </TagFilterBar>
      )}

      <BlogCardsContainer className={swm('hs-elevate-blog-listing__blog-card-container')}>
        {filteredPosts.map(post => (
          <BlogCardComponent
            key={post.id}
            post={{
              ...post,
              id: post.id.toString(),
            }}
            headingAndTextHeadingLevel={headingAndTextHeadingLevel}
            headingStyleVariant={headingStyleVariant}
            cardStyleVariant={cardStyleVariant}
            gatedContentIds={gatedContentIds.map(id => id.toString())}
            additionalClassArray={[swm('hs-elevate-blog-listing__blog-card')]}
            readArticleLabel={readArticleLabel}
          />
        ))}
      </BlogCardsContainer>

      <Pagination
        currentPageNumber={currentPageNumber}
        nextPageNumber={nextPageNumber}
        totalPageCount={totalPageCount}
        defaultContent={defaultContent}
      />
    </BlogListingRoot>
  );
}

export default BlogListingIsland;

