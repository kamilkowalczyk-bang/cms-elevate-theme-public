import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '../blog-listing.module.css';
import paginationStyles from '../pagination.module.css';
import cx, { staticWithModule } from '../../../utils/classnames.js';
import { createComponent } from '../../../utils/create-component.js';
import BlogCardComponent from '../../../BlogCardComponent/index.js';
import Pagination from '../pagination.js';
import { HeadingStyleFieldLibraryType } from '../../../fieldLibrary/HeadingStyle/types.js';
import { CardStyleFieldLibraryType } from '../../../fieldLibrary/CardStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../../fieldLibrary/HeadingAndText/types.js';
import {
  fetchBlogSearchResults,
  type BlogSearchResultPost,
} from '../fetchBlogSearchResults.js';

const swm = staticWithModule(styles);
const swmPagination = staticWithModule(paginationStyles);

const SEARCH_DEBOUNCE_MS = 300;

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

const BlogListingRoot = createComponent('div');
const FiltersRow = createComponent('div');
const TagFilterBar = createComponent('div');
const TagFilterButton = createComponent<'button'>('button');
const SearchContainer = createComponent('div');
const SearchInput = createComponent<'input'>('input');
const BlogCardsContainer = createComponent('div');
const SearchStatus = createComponent('p');
const SearchPaginationContainer = createComponent('nav');
const SearchPaginationButton = createComponent<'button'>('button');

const normalizeSlug = (slug: string | null | undefined): string => String(slug ?? '').trim().toLowerCase();

function normalizePathname(pathname: string | null | undefined): string {
  return String(pathname ?? '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '');
}

function resolveActiveTagSlug(
  activeTagSlug: string | null | undefined,
  allTags: BlogTag[],
  pathname: string | null | undefined,
): string {
  const fromHubl = normalizeSlug(activeTagSlug);
  if (fromHubl) {
    return fromHubl;
  }

  const normalizedPath = normalizePathname(pathname);
  if (!normalizedPath) {
    return '';
  }

  const matchingTag = allTags.find(tag => {
    if (!tag?.url) {
      return false;
    }

    try {
      return normalizePathname(new URL(tag.url).pathname) === normalizedPath;
    } catch {
      return false;
    }
  });

  return matchingTag ? normalizeSlug(matchingTag.slug) : '';
}

function navigateToListingUrl(url: string) {
  const target = new URL(url, window.location.origin);
  target.searchParams.set('hsCacheBuster', 'true');
  window.location.assign(target.toString());
}

function BlogListingIsland(props: BlogListingProps) {
  if (!props?.hublData?.blogPosts) {
    return null;
  }

  const {
    hublData: {
      blogPosts,
      currentPageNumber,
      nextPageNumber,
      totalPageCount,
      allTags = [],
      activeTagSlug,
      blogListingUrl,
      firstPageLink,
      currentPath = '',
      blogGroupId,
      searchPageSize,
    },
    serverSideProps: { gatedContentIds = [] },
    groupStyle: { headingStyleVariant, cardStyleVariant } = {},
    headingAndTextHeadingLevel,
    defaultContent,
    readArticleLabel,
  } = props;

  const resolvedActiveTagSlug = useMemo(
    () => resolveActiveTagSlug(activeTagSlug, allTags, currentPath),
    [activeTagSlug, allTags, currentPath],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('hsCacheBuster')) {
      return;
    }

    url.searchParams.delete('hsCacheBuster');
    const cleanedUrl = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, '', cleanedUrl);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BlogSearchResultPost[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchOffset, setSearchOffset] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const trimmedQuery = searchQuery.trim();
  const isSearchActive = trimmedQuery.length > 0;

  const runSearch = useCallback(
    async (term: string, offset: number) => {
      if (!term) {
        setSearchResults([]);
        setSearchTotal(0);
        setSearchOffset(0);
        setSearchError(null);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await fetchBlogSearchResults({
          term,
          blogGroupId,
          limit: searchPageSize,
          offset,
        });

        setSearchResults(response.results);
        setSearchTotal(response.total);
        setSearchOffset(response.offset);
      } catch {
        setSearchResults([]);
        setSearchTotal(0);
        setSearchError('Search is temporarily unavailable. Please try again.');
      } finally {
        setIsSearching(false);
      }
    },
    [blogGroupId, searchPageSize],
  );

  useEffect(() => {
    if (!isSearchActive) {
      setSearchResults([]);
      setSearchTotal(0);
      setSearchOffset(0);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      runSearch(trimmedQuery, 0);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [trimmedQuery, isSearchActive, runSearch]);

  const handleSearchOffsetChange = (nextOffset: number) => {
    if (!isSearchActive || nextOffset < 0) {
      return;
    }

    runSearch(trimmedQuery, nextOffset);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const postsToRender = isSearchActive ? searchResults : blogPosts;
  const gatedContentIdStrings = gatedContentIds.map(id => id.toString());
  const hasNextSearchPage = searchOffset + searchPageSize < searchTotal;
  const hasPreviousSearchPage = searchOffset > 0;

  const blogListingClasses = swm('hs-elevate-blog-listing');
  const isShowAllActive = !resolvedActiveTagSlug;

  return (
    <BlogListingRoot className={blogListingClasses}>
      <FiltersRow className={swm('hs-elevate-blog-listing__filters')}>
        {allTags.length > 0 && (
          <TagFilterBar className={swm('hs-elevate-blog-listing__tag-tabs')}>
            <TagFilterButton
              type="button"
              className={swm('hs-elevate-blog-listing__tag-tab')}
              aria-pressed={isShowAllActive}
              onClick={() => {
                navigateToListingUrl(blogListingUrl);
              }}
            >
              Show all
            </TagFilterButton>
            {allTags.map(tag => (
              <TagFilterButton
                key={normalizeSlug(tag.slug) || tag.url || tag.name}
                type="button"
                className={swm('hs-elevate-blog-listing__tag-tab')}
                aria-pressed={resolvedActiveTagSlug === normalizeSlug(tag.slug)}
                onClick={() => {
                  if (tag.url) {
                    navigateToListingUrl(tag.url);
                  }
                }}
              >
                {tag.name}
              </TagFilterButton>
            ))}
          </TagFilterBar>
        )}

        <SearchContainer className={swm('hs-elevate-blog-listing__search')}>
          <SearchInput
            id="hs-elevate-blog-listing-search"
            type="search"
            className={swm('hs-elevate-blog-listing__search-input')}
            placeholder="Find…"
            aria-label="Find blog posts"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
          />
        </SearchContainer>
      </FiltersRow>

      {isSearchActive && isSearching && (
        <SearchStatus className={swm('hs-elevate-blog-listing__search-status')} role="status">
          Searching…
        </SearchStatus>
      )}

      {isSearchActive && !isSearching && searchError && (
        <SearchStatus className={swm('hs-elevate-blog-listing__search-status')} role="alert">
          {searchError}
        </SearchStatus>
      )}

      {isSearchActive && !isSearching && !searchError && searchTotal === 0 && (
        <SearchStatus className={swm('hs-elevate-blog-listing__search-status')} role="status">
          No results for &ldquo;{trimmedQuery}&rdquo;.
        </SearchStatus>
      )}

      <BlogCardsContainer className={swm('hs-elevate-blog-listing__blog-card-container')}>
        {postsToRender.map(post => (
          <BlogCardComponent
            key={post.id}
            post={{
              ...post,
              id: post.id.toString(),
            }}
            headingAndTextHeadingLevel={headingAndTextHeadingLevel}
            headingStyleVariant={headingStyleVariant}
            cardStyleVariant={cardStyleVariant}
            gatedContentIds={gatedContentIdStrings}
            additionalClassArray={[swm('hs-elevate-blog-listing__blog-card')]}
            readArticleLabel={readArticleLabel}
          />
        ))}
      </BlogCardsContainer>

      {isSearchActive && !isSearching && searchTotal > searchPageSize && (
        <SearchPaginationContainer className={swmPagination('hs-elevate-blog-listing__pagination-container')}>
          <SearchPaginationButton
            type="button"
            className={cx(swmPagination('hs-elevate-blog-listing__nav-link'), {
              [paginationStyles['hs-elevate-blog-listing__nav-link--disabled']]: !hasPreviousSearchPage,
            })}
            disabled={!hasPreviousSearchPage}
            onClick={() => handleSearchOffsetChange(searchOffset - searchPageSize)}
          >
            {defaultContent.previousPage}
          </SearchPaginationButton>
          <SearchPaginationButton
            type="button"
            className={cx(swmPagination('hs-elevate-blog-listing__nav-link'), {
              [paginationStyles['hs-elevate-blog-listing__nav-link--disabled']]: !hasNextSearchPage,
            })}
            disabled={!hasNextSearchPage}
            onClick={() => handleSearchOffsetChange(searchOffset + searchPageSize)}
          >
            {defaultContent.nextPage}
          </SearchPaginationButton>
        </SearchPaginationContainer>
      )}

      {!isSearchActive && (
        <Pagination
          currentPageNumber={currentPageNumber}
          nextPageNumber={nextPageNumber}
          totalPageCount={totalPageCount}
          firstPageLink={firstPageLink}
          defaultContent={defaultContent}
        />
      )}
    </BlogListingRoot>
  );
}

export default BlogListingIsland;
