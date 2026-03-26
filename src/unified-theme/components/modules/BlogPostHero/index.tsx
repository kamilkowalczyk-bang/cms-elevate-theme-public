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
  showSubtext?: boolean;
  subtext?: string;
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
  };
};

const BlogPostHero = createComponent('div');
const SplitGrid = createComponent('div');
const SplitText = createComponent('div');
const SplitImage = createComponent('div');

export const Component = (props: BlogPostHeroProps) => {
  const {
    moduleName,
    eyebrow,
    showSubtext = false,
    subtext,
    groupLayout,
    groupStyle: { sectionStyleVariant, headingStyleVariant, alignment, headingUppercase = false },
    headingAndTextHeading,
    headingAndTextHeadingLevel,
    image,
  } = props;

  const layoutType = groupLayout?.layoutType || 'split';

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
            {showSubtext && subtext ? (
              <p
                className={swm('hs-elevate-blog-post-hero__subtext')}
                style={{ color: sectionColorsMap[sectionStyleVariant]?.textColor }}
              >
                {subtext}
              </p>
            ) : null}
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
          {showSubtext && subtext ? (
            <p
              className={swm('hs-elevate-blog-post-hero__subtext')}
              style={{ color: sectionColorsMap[sectionStyleVariant]?.textColor }}
            >
              {subtext}
            </p>
          ) : null}
        </SplitText>

        <SplitImage className={swm('hs-elevate-blog-post-hero-split__image')}>
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
        </SplitImage>
      </SplitGrid>
    </BlogPostHero>
  );
};

export { fields } from './fields.js';

export const hublDataTemplate = `
  {% set hublData = {
    "renderedWithGrids": rendered_with_grids,
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

