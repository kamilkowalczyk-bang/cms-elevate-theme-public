export type BlogSearchResultPost = {
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

type BlogSearchApiResult = {
  id: number;
  url: string;
  title: string;
  featuredImageUrl?: string;
  authorFullName?: string;
  tags?: string[];
  publishedDate?: number;
};

export type BlogSearchResponse = {
  total: number;
  offset: number;
  limit: number;
  results: BlogSearchResultPost[];
  searchTerm: string;
};

function stripHighlightHtml(html: string): string {
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent ?? '';
}

function mapSearchResult(result: BlogSearchApiResult): BlogSearchResultPost {
  return {
    id: result.id,
    absoluteUrl: result.url,
    title: stripHighlightHtml(result.title),
    featuredImage: result.featuredImageUrl ?? '',
    featuredImageAltText: '',
    featuredImageWidth: 0,
    featuredImageHeight: 0,
    topicNames: result.tags ?? [],
    authorName: result.authorFullName,
    publishDate: result.publishedDate ? new Date(result.publishedDate).toISOString() : undefined,
    readTimeMinutes: 1,
  };
}

export type FetchBlogSearchParams = {
  term: string;
  blogGroupId: number;
  limit: number;
  offset?: number;
};

export async function fetchBlogSearchResults({
  term,
  blogGroupId,
  limit,
  offset = 0,
}: FetchBlogSearchParams): Promise<BlogSearchResponse> {
  const params = new URLSearchParams();
  params.set('term', term);
  params.set('type', 'BLOG_POST');
  params.set('groupId', String(blogGroupId));
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  params.set('analytics', 'true');

  const response = await fetch(`/_hcms/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Search request failed with status ${response.status}`);
  }

  const data = await response.json();

  return {
    total: data.total ?? 0,
    offset: data.offset ?? offset,
    limit: data.limit ?? limit,
    searchTerm: data.searchTerm ?? term,
    results: (data.results ?? []).map(mapSearchResult),
  };
}
