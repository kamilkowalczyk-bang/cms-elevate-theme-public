import { ModuleMeta } from '../../types/modules.js';
import styles from './blog-post-hero.module.css';
import { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { ChoiceFieldType, ImageFieldType, BooleanFieldType, TextAlignmentFieldType } from '@hubspot/cms-components/fields';
import HeadingComponent from '../../HeadingComponent/index.js';
import { HeadingAndTextFieldLibraryType } from '../../fieldLibrary/HeadingAndText/types.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { SectionStyleFieldLibraryType } from '../../fieldLibrary/SectionStyle/types.js';
import { sectionColorsMap } from '../../utils/section-color-map.js';
import { CSSPropertiesMap } from '../../types/components.js';

import blogSVG from '../BlogListing/assets/blog.svg';

const swm = staticWithModule(styles);

type BlogPostHeroProps = HeadingAndTextFieldLibraryType & {
  moduleName?: string;
  eyebrow?: string;
  groupLayout?: {
    layoutType?: ChoiceFieldType['default'];
  };
  groupStyle: SectionStyleFieldLibraryType &
    HeadingStyleFieldLibraryType & {
      alignment?: TextAlignmentFieldType['default'];
      headingUppercase?: BooleanFieldType['default'];
    };
  image: ImageFieldType['default'];
  hublData: {
    renderedWithGrids: boolean;
    authorDisplayName: string;
    publishDate: string;
    topics: { name: string; url: string }[];
  };
};

type BlogPostTopic = { name: string; url: string };

function BlogPostHeroTags({ topics }: { topics: BlogPostTopic[] }) {
  if (topics.length === 0) {
    return null;
  }

  return (
    <div className={swm('hs-elevate-blog-post-hero__tags')}>
      {topics.map(topic => (
        <a key={topic.url} href={topic.url} className="hs-elevate-tag">
          {topic.name}
        </a>
      ))}
    </div>
  );
}

const BlogPostHero = createComponent('div');
const SplitGrid = createComponent('div');
const SplitText = createComponent('div');
const SplitImage = createComponent('div');

function backgroundImageStyleFromField(src: string | undefined): CSSPropertiesMap | undefined {
  if (typeof src !== 'string' || !src.trim()) {
    return undefined;
  }
  return { backgroundImage: `url(${src})` };
}

export const Component = (props: BlogPostHeroProps) => {
  const {
    moduleName,
    eyebrow,
    groupLayout,
    groupStyle: { sectionStyleVariant, headingStyleVariant, alignment, headingUppercase = false },
    headingAndTextHeading,
    headingAndTextHeadingLevel,
    image,
    hublData: { authorDisplayName, publishDate, topics = [] },
  } = props;

  const layoutType = groupLayout?.layoutType || 'split';
  const imageBackgroundStyle = backgroundImageStyleFromField(image?.src);
  const imageAltText = image?.alt || '';

  const cssVarsMap = {
    '--hsElevate--hero__accentColor': sectionColorsMap[sectionStyleVariant]?.accentColor,
  } as CSSPropertiesMap;

  if (!image?.src && !headingAndTextHeading) {
    return null;
  }

  if (layoutType === 'overlay') {
    return (
      <BlogPostHero className={swm('hs-elevate-blog-post-hero')} style={cssVarsMap}>
        <div className={swm('hs-elevate-blog-post-hero__image-container')}>
          {image?.src ? (
            <img
              src={image.src}
              alt={image.alt || ''}
              width={image.width}
              height={image.height}
              loading={image.loading !== 'disabled' ? image.loading : 'eager'}
              data-hs-token={moduleName ? `${moduleName}.__hero_image` : undefined}
            />
          ) : null}
        </div>

        <div className={swm('hs-elevate-blog-post-hero__overlay')}>
          <div className={swm('hs-elevate-blog-post-hero__overlay-inner')}>
            {eyebrow ? <p className={swm('hs-elevate-blog-post-hero__eyebrow')}>{eyebrow}</p> : null}
            <HeadingComponent
              heading={headingAndTextHeading}
              headingLevel={headingAndTextHeadingLevel}
              headingStyleVariant={headingStyleVariant}
              headingUppercase={headingUppercase}
              alignment={alignment}
              moduleName={moduleName}
              fieldPath="headingAndTextHeading"
              additionalClassArray={[]}
              inlineStyles={{
                color: sectionColorsMap[sectionStyleVariant]?.textColor,
              }}
            />
            {(authorDisplayName || publishDate) ? (
              <p className={swm('hs-elevate-blog-post-hero__meta')}>
                {authorDisplayName}
                {authorDisplayName && publishDate ? ' / ' : ''}
                {publishDate}
              </p>
            ) : null}
            <BlogPostHeroTags topics={topics} />
          </div>
        </div>
      </BlogPostHero>
    );
  }

  return (
    <BlogPostHero className={swm('hs-elevate-blog-post-hero-split')} style={cssVarsMap}>
      <SplitGrid className={swm('hs-elevate-blog-post-hero-split__grid')}>
        <SplitText className={swm('hs-elevate-blog-post-hero-split__text')}>
          {eyebrow ? <p className={swm('hs-elevate-blog-post-hero__eyebrow')}>{eyebrow}</p> : null}
          <HeadingComponent
            heading={headingAndTextHeading}
            headingLevel={headingAndTextHeadingLevel}
            headingStyleVariant={headingStyleVariant}
            headingUppercase={headingUppercase}
            alignment={alignment}
            moduleName={moduleName}
            fieldPath="headingAndTextHeading"
            additionalClassArray={[]}
            inlineStyles={{
              color: sectionColorsMap[sectionStyleVariant]?.textColor,
            }}
          />
          {(authorDisplayName || publishDate) ? (
            <p className={swm('hs-elevate-blog-post-hero__meta')}>
              {authorDisplayName}
              {authorDisplayName && publishDate ? ' / ' : ''}
              {publishDate}
            </p>
          ) : null}
          <BlogPostHeroTags topics={topics} />
        </SplitText>

        <SplitImage className={swm('hs-elevate-blog-post-hero-split__image')}>
          <div
            className={swm('hs-elevate-blog-post-hero-split__image-background')}
            style={imageBackgroundStyle}
            role={imageAltText ? 'img' : undefined}
            aria-label={imageAltText || undefined}
            data-hs-token={moduleName ? `${moduleName}.__hero_image` : undefined}
          />
        </SplitImage>
      </SplitGrid>
    </BlogPostHero>
  );
};

export { fields } from './fields.js';

export const hublDataTemplate = `
  {% set author_display_name = "" %}
  {% if content.blog_post_author and content.blog_post_author.display_name %}
    {% set author_display_name = content.blog_post_author.display_name %}
  {% elif content.blog_author and content.blog_author.display_name %}
    {% set author_display_name = content.blog_author.display_name %}
  {% elif content.blog_author_list and content.blog_author_list|length > 0 and content.blog_author_list[0].display_name %}
    {% set author_display_name = content.blog_author_list[0].display_name %}
  {% elif content.author_name %}
    {% set author_display_name = content.author_name %}
  {% endif %}

  {% set publish_date = content.publish_date ? content.publish_date|format_date('long') : "" %}
  {% set topics = [] %}
  {% if content.topic_list and content.topic_list|length > 0 %}
    {% for topic in content.topic_list %}
      {% if loop.index <= 3 %}
        {% do topics.append({
          "name": topic.name,
          "url": blog_tag_url(group.id, topic.slug)|escape_url
        }) %}
      {% endif %}
    {% endfor %}
  {% endif %}

  {% set hublData = {
    "renderedWithGrids": rendered_with_grids,
    "authorDisplayName": author_display_name,
    "publishDate": publish_date,
    "topics": topics,
  } %}
`;

export const meta: ModuleMeta = {
  label: 'Blog post hero',
  content_types: ['BLOG_POST'],
  icon: blogSVG,
  categories: ['text'],
  is_available_for_new_content: true,
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/blog_post_hero',
  version: 0,
  themeModule: true,
};

