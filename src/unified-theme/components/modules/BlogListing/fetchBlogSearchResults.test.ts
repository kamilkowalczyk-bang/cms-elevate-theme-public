import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchBlogSearchResults } from './fetchBlogSearchResults.js';

describe('fetchBlogSearchResults', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls /_hcms/search with BLOG_POST and groupId params', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        total: 1,
        offset: 0,
        limit: 12,
        searchTerm: 'nfc',
        results: [
          {
            id: 123,
            url: 'https://example.com/blog/nfc',
            title: 'NFC <span class="hs-search-highlight">guide</span>',
            featuredImageUrl: 'https://example.com/image.jpg',
            authorFullName: 'Author',
            tags: ['Tech'],
            publishedDate: 1704067200000,
          },
        ],
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const response = await fetchBlogSearchResults({
      term: 'nfc',
      blogGroupId: 456,
      limit: 12,
      offset: 0,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/_hcms/search?term=nfc&type=BLOG_POST&groupId=456&limit=12&offset=0&analytics=true',
    );
    expect(response.total).toBe(1);
    expect(response.results[0]).toMatchObject({
      id: 123,
      absoluteUrl: 'https://example.com/blog/nfc',
      title: 'NFC guide',
      featuredImage: 'https://example.com/image.jpg',
      topicNames: ['Tech'],
      authorName: 'Author',
      readTimeMinutes: 1,
    });
  });

  it('throws when the search request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(
      fetchBlogSearchResults({
        term: 'nfc',
        blogGroupId: 456,
        limit: 12,
      }),
    ).rejects.toThrow('Search request failed with status 500');
  });
});
