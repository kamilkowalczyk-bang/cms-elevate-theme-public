import { ModuleMeta } from '../../types/modules.js';
import { Island } from '@hubspot/cms-components';
// @ts-expect-error -- ?island not typed
import RecentBlogPostsSliderIsland from './islands/RecentBlogPostsSliderIsland.js?island';
import { RecentBlogPostsSliderProps } from './types.js';
import fetchGatedPosts from '../../utils/ServerSideProps/fetchGatedBlogPosts.js';
import { withUrlPath } from '@hubspot/cms-components';
import cardIconSvg from './assets/card-icon-temp.svg';

export const Component = (props: RecentBlogPostsSliderProps) => {
  const {
    hublData: { posts, isInEditor },
    fieldValues: {
      headingAndTextHeadingLevel,
      groupStyle: { cardStyleVariant },
      groupPlaceholderText: { placeholderTitle, placeholderDescription },
      readArticleLabel,
    },
    serverSideProps,
  } = props;

  const gatedContentIds = serverSideProps?.gatedContentIds ?? [];

  return (
    <Island
      hydrateOn="load"
      module={RecentBlogPostsSliderIsland}
      posts={posts || []}
      isInEditor={isInEditor}
      headingAndTextHeadingLevel={headingAndTextHeadingLevel}
      cardStyleVariant={cardStyleVariant}
      placeholderTitle={placeholderTitle}
      placeholderDescription={placeholderDescription}
      readArticleLabel={readArticleLabel}
      gatedContentIds={gatedContentIds}
      clientOnly={true}
    />
  );
};

export { fields } from './fields.js';

export const hublDataTemplate = `
  {% if module.blog is number %}
    {% set blog = module.blog %}
  {% else %}
    {% set blog = 'default' %}
  {% endif %}

  {% set blog_post_ids = [] %}
  {% set blog_posts = [] %}
  {% set post_limit = module.postLimit or 3 %}
  {% set fetch_limit = module.excludeCurrentPost and content and content.id ? post_limit + 1 : post_limit %}

  {# Check if tag filter is enabled and a tag is selected #}
  {% if module.filterByTag and module.tag %}
    {% set posts = blog_recent_tag_posts(blog, module.tag, fetch_limit) %}
  {% else %}
    {% set posts = blog_recent_posts(blog, fetch_limit) %}
  {% endif %}

  {% for post in posts %}
    {% if not (module.excludeCurrentPost and content and content.id and post.id == content.id) and blog_posts|length < post_limit %}
      {% do blog_post_ids.append(post.id) %}

      {% set temp_post = {
          id: post.id,
          absoluteUrl: post.absoluteUrl|escape_url,
          featuredImage: post.featuredImage,
          featuredImageAltText: post.featuredImageAltText,
          featuredImageWidth: post.featuredImageWidth,
          featuredImageHeight: post.featuredImageHeight,
          title: post.label,
          topicNames: post.topicNames,
          publishDate: post.publishDate or post.publish_date,
          authorName: post.blog_post_author.display_name or post.blog_author.display_name,
          readTimeMinutes: (((post.post_body or '')|wordcount / 265)|round) or 1
        }
      %}
      {% do blog_posts.append(temp_post) %}
    {% endif %}
  {% endfor %}

  {% set hublData = {
    'posts': blog_posts,
    'blogPostIds': blog_post_ids,
    'isInEditor': is_in_editor,
    'renderedWithGrids': rendered_with_grids
    }
  %}
`;

export const getServerSideProps = withUrlPath(fetchGatedPosts);

export const meta: ModuleMeta = {
  label: 'Recent blog posts slider',
  content_types: ['BLOG_LISTING', 'BLOG_POST', 'SITE_PAGE', 'LANDING_PAGE'],
  icon: cardIconSvg,
  categories: ['blog'],
  is_available_for_new_content: true,
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/recent_blog_posts_slider',
  version: 0,
  themeModule: true,
};
