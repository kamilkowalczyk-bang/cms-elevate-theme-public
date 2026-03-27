import { ModuleMeta } from '../../types/modules.js';
import styles from './recent-blog-posts.module.css';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { withUrlPath } from '@hubspot/cms-components';
import cardIconSvg from './assets/card-icon-temp.svg';
import fetchGatedPosts from '../../utils/ServerSideProps/fetchGatedBlogPosts.js';
import { HeadingLevelType } from '../../types/fields.js';
import { CardStyleFieldLibraryType } from '../../fieldLibrary/CardStyle/types.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { PlaceholderEmptyContent } from '../../PlaceholderComponent/PlaceholderEmptyContent.js';
import { Card } from '../../CardComponent/index.js';
import blogCardStyles from '../../BlogCardComponent/blog-card.module.css';
import HeadingComponent from '../../HeadingComponent/index.js';
import { TagComponent } from '../../TagComponent/index.js';
import SanitizedContent from '../../SanitizeHTML/index.js';
import { CSSPropertiesMap } from '../../types/components.js';

const swm = staticWithModule(styles);
const blogCardSwm = staticWithModule(blogCardStyles);

// Types

type RecentBlogPostsProps = {
  hublData: {
    posts: {
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
    isInEditor: boolean;
    renderedWithGrids: boolean;
  };
  fieldValues: {
    excludeCurrentPost: boolean;
    headingAndTextHeadingLevel: HeadingLevelType;
    groupStyle: CardStyleFieldLibraryType & HeadingStyleFieldLibraryType;
    groupPlaceholderText: {
      placeholderTitle: string;
      placeholderDescription: string;
    };
    readArticleLabel: string;
  };
  serverSideProps: {
    gatedContentIds: number[];
  };
};

// Components

const RecentBlogPosts = createComponent('div');
const BlogCardsContainer = createComponent('div');
const CardWrapper = createComponent('div');
const CardLink = createComponent('a');
const ImageContainer = createComponent('div');
const Image = createComponent('img');
const CardContentContainer = createComponent('div');
const CardContentTop = createComponent('div');
const BlogMeta = createComponent('p');
const ReadTime = createComponent('p');
const TagContainer = createComponent('div');
const ReadMoreText = createComponent('span');
const CardHeadingContainer = createComponent('div');
const GateIconImage = createComponent('div');

const formatBlogMeta = (publishDate?: string, authorName?: string): string => {
  const fallbackDate = publishDate || '';
  let formattedDate = fallbackDate;

  if (publishDate) {
    const date = new Date(publishDate);
    if (!Number.isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }

  if (formattedDate && authorName) {
    return `${formattedDate} / ${authorName}`;
  }

  return formattedDate || authorName || '';
};

function generateCardColorCssVars(cardStyleVariant: string): CSSPropertiesMap {
  const cardColorsMap = {
    card_variant_1: {
      textColor: 'var(--hsElevate--card--variant1__textColor)',
      iconBackgroundColor: 'var(--hsElevate--card--variant1__iconBackgroundColor)',
    },
    card_variant_2: {
      textColor: 'var(--hsElevate--card--variant2__textColor)',
      iconBackgroundColor: 'var(--hsElevate--card--variant2__iconBackgroundColor)',
    },
    card_variant_3: {
      textColor: 'var(--hsElevate--card--variant3__textColor)',
      iconBackgroundColor: 'var(--hsElevate--card--variant3__iconBackgroundColor)',
    },
    card_variant_4: {
      textColor: 'var(--hsElevate--card--variant4__textColor)',
      iconBackgroundColor: 'var(--hsElevate--card--variant4__iconBackgroundColor)',
    },
  };

  const colors = cardColorsMap[cardStyleVariant as keyof typeof cardColorsMap] || cardColorsMap.card_variant_1;

  return {
    '--hsElevate--blogCard__textColor': colors.textColor,
    '--hsElevate--blogCardIcon__backgroundColor': colors.iconBackgroundColor,
  };
}

export const Component = (props: RecentBlogPostsProps) => {
  const {
    hublData: { posts, isInEditor, renderedWithGrids = false },
    fieldValues: {
      headingAndTextHeadingLevel,
      groupStyle: { cardStyleVariant },
      groupPlaceholderText: { placeholderTitle, placeholderDescription },
      readArticleLabel,
    },
    serverSideProps: { gatedContentIds },
  } = props;

  const postsToUse = posts || [];
  const cardColorCssVars = generateCardColorCssVars(cardStyleVariant);

  const layoutClass = renderedWithGrids ? 'hs-elevate-recent-blog-posts--grids' : 'hs-elevate-recent-blog-posts--bootstrap';

  return (
    <RecentBlogPosts className={cx(swm('hs-elevate-recent-blog-posts'), styles[layoutClass])}>
      <BlogCardsContainer className={swm('hs-elevate-recent-blog-posts__blog-card-container')}>
        {postsToUse.length === 0 && isInEditor ? (
          <PlaceholderEmptyContent title={placeholderTitle} description={placeholderDescription} icon={cardIconSvg} />
        ) : (
          postsToUse.map(post => (
            <CardWrapper
              key={post.id}
              style={cardColorCssVars}
              className={cx(blogCardSwm('hs-elevate-card--blog__card-wrapper'), swm('hs-elevate-recent-blog-posts__blog-card'))}
            >
              <Card cardOrientation="column" cardStyleVariant={cardStyleVariant} additionalClassArray={[blogCardSwm('hs-elevate-card--blog')]}>
                <CardLink className={blogCardSwm('hs-elevate-card--blog__link')} href={post.absoluteUrl}>
                  <ImageContainer className={blogCardSwm('hs-elevate-card--blog__image-container')}>
                    {post.featuredImage && (
                      <Image
                        className={blogCardSwm('hs-elevate-card--blog__image')}
                        src={post.featuredImage}
                        alt={post.featuredImageAltText || ''}
                        width={post.featuredImageWidth}
                        height={post.featuredImageHeight}
                      />
                    )}
                  </ImageContainer>
                  <CardContentContainer className={blogCardSwm('hs-elevate-card--blog__content-container')}>
                    <CardContentTop className={swm('hs-elevate-recent-blog-posts__content-top')}>
                      <ReadTime className={swm('hs-elevate-recent-blog-posts__read-time')}>Read time {post.readTimeMinutes || 1} min</ReadTime>
                      <CardHeadingContainer>
                        <HeadingComponent
                          heading={post.title}
                          headingLevel={headingAndTextHeadingLevel}
                          headingStyleVariant="h5"
                          additionalClassArray={[blogCardSwm('hs-elevate-card--blog__heading'), swm('hs-elevate-recent-blog-posts__title')]}
                        />
                        {gatedContentIds.map(id => id.toString()).includes(post.id.toString()) && (
                          <GateIconImage className={blogCardSwm('hs-elevate-card--blog__gate-icon')} aria-label="Gated content" role="presentation" />
                        )}
                      </CardHeadingContainer>
                      <BlogMeta className={swm('hs-elevate-recent-blog-posts__meta')}>{formatBlogMeta(post.publishDate, post.authorName)}</BlogMeta>
                      {(post.topicNames || []).length > 0 && (
                        <TagContainer className={blogCardSwm('hs-elevate-card--blog__tag-container')}>
                          {(post.topicNames || []).map((tag: string, index: number) => (
                            <TagComponent key={index}>
                              <SanitizedContent content={tag} />
                            </TagComponent>
                          ))}
                        </TagContainer>
                      )}
                    </CardContentTop>
                    <ReadMoreText className={swm('hs-elevate-recent-blog-posts__read-link')}>
                      {readArticleLabel || 'Read the article'}
                    </ReadMoreText>
                  </CardContentContainer>
                </CardLink>
              </Card>
            </CardWrapper>
          ))
        )}
      </BlogCardsContainer>
    </RecentBlogPosts>
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
  {% set post_limit = 3 %}
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
  label: 'Recent blog posts',
  content_types: ['BLOG_LISTING', 'BLOG_POST', 'SITE_PAGE', 'LANDING_PAGE'],
  icon: cardIconSvg,
  categories: ['blog'],
  is_available_for_new_content: true,
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/recent_blog_posts',
  version: 0,
  themeModule: true,
};
