import { Splide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import styles from '../recent-blog-posts-slider.module.css';
import cx, { staticWithModule } from '../../../utils/classnames.js';
import { createComponent } from '../../../utils/create-component.js';
import { RecentBlogPostsSliderIslandProps } from '../types.js';
import { Card } from '../../../CardComponent/index.js';
import blogCardStyles from '../../../BlogCardComponent/blog-card.module.css';
import HeadingComponent from '../../../HeadingComponent/index.js';
import { TagComponent } from '../../../TagComponent/index.js';
import SanitizedContent from '../../../SanitizeHTML/index.js';
import { CSSPropertiesMap } from '../../../types/components.js';
import { PlaceholderEmptyContent } from '../../../PlaceholderComponent/PlaceholderEmptyContent.js';
import cardIconSvg from '../assets/card-icon-temp.svg';

const swm = staticWithModule(styles);
const blogCardSwm = staticWithModule(blogCardStyles);

const Root = createComponent('div');
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

function generatePaginationColorCssVar(cardStyleVariant: string): CSSPropertiesMap {
  const iconColorsMap = {
    card_variant_1: 'var(--hsElevate--card--variant1__iconColor)',
    card_variant_2: 'var(--hsElevate--card--variant2__iconColor)',
    card_variant_3: 'var(--hsElevate--card--variant3__iconColor)',
    card_variant_4: 'var(--hsElevate--card--variant4__iconColor)',
  };

  const color =
    iconColorsMap[cardStyleVariant as keyof typeof iconColorsMap] || iconColorsMap.card_variant_1;

  return { '--hsElevate--recentBlogSlider__paginationColor': color };
}

export default function RecentBlogPostsSliderIsland(props: RecentBlogPostsSliderIslandProps) {
  const {
    posts,
    isInEditor,
    headingAndTextHeadingLevel,
    cardStyleVariant,
    placeholderTitle,
    placeholderDescription,
    readArticleLabel,
    gatedContentIds,
    showNavigationArrows,
  } = props;

  const postsToUse = posts || [];
  const cardColorCssVars = generateCardColorCssVars(cardStyleVariant);
  const gatedSet = new Set((gatedContentIds || []).map(id => String(id)));
  const enableAutoplay = postsToUse.length > 1;
  const showPagination = postsToUse.length > 1;
  const showArrows = showNavigationArrows && postsToUse.length > 1;
  const rootStyle = generatePaginationColorCssVar(cardStyleVariant);

  if (postsToUse.length === 0 && isInEditor) {
    return (
      <Root className={cx(swm('hs-elevate-recent-blog-posts-slider'), swm('hs-elevate-recent-blog-posts-slider__placeholder-wrap'))}>
        <PlaceholderEmptyContent title={placeholderTitle} description={placeholderDescription} icon={cardIconSvg} />
      </Root>
    );
  }

  if (postsToUse.length === 0) {
    return <Root className={swm('hs-elevate-recent-blog-posts-slider')} />;
  }

  return (
    <Root
      className={cx(swm('hs-elevate-recent-blog-posts-slider'), {
        [swm('hs-elevate-recent-blog-posts-slider--arrows')]: showArrows,
      })}
      style={rootStyle}
    >
      <Splide
        className={cx('splide', swm('hs-elevate-recent-blog-posts-slider__splide'))}
        style={rootStyle}
        hasTrack={false}
        options={{
          type: 'slide',
          rewind: true,
          perPage: 3,
          perMove: 1,
          gap: 32,
          arrows: showArrows,
          pagination: showPagination,
          autoplay: enableAutoplay,
          interval: 5000,
          pauseOnHover: true,
          pauseOnFocus: true,
          speed: 600,
          breakpoints: {
            1000: {
              perPage: 2,
              gap: 24,
            },
            640: {
              perPage: 1,
              gap: 16,
            },
          },
          i18n: {
            carousel: 'Recent blog posts',
            slide: 'Blog post',
            slideX: 'Go to slide %s',
            select: 'Select a slide to show',
          },
        }}
        aria-label="Recent blog posts"
      >
        <div className={cx('splide__track', swm('hs-elevate-recent-blog-posts-slider__track'))}>
          <ul className={cx('splide__list', swm('hs-elevate-recent-blog-posts-slider__list'))}>
            {postsToUse.map(post => (
              <li className={cx('splide__slide', swm('hs-elevate-recent-blog-posts-slider__slide'))} key={post.id}>
                <div className={swm('hs-elevate-recent-blog-posts-slider__slide-inner')}>
                  <CardWrapper
                    style={cardColorCssVars}
                    className={cx(blogCardSwm('hs-elevate-card--blog__card-wrapper'), swm('hs-elevate-recent-blog-posts-slider__blog-card'))}
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
                          <CardContentTop className={swm('hs-elevate-recent-blog-posts-slider__content-top')}>
                            <ReadTime className={swm('hs-elevate-recent-blog-posts-slider__read-time')}>
                              Read time {post.readTimeMinutes || 1} min
                            </ReadTime>
                            <CardHeadingContainer>
                              <HeadingComponent
                                heading={post.title}
                                headingLevel={headingAndTextHeadingLevel}
                                headingStyleVariant="h5"
                                additionalClassArray={[blogCardSwm('hs-elevate-card--blog__heading'), swm('hs-elevate-recent-blog-posts-slider__title')]}
                              />
                              {gatedSet.has(String(post.id)) && (
                                <GateIconImage className={blogCardSwm('hs-elevate-card--blog__gate-icon')} aria-label="Gated content" role="presentation" />
                              )}
                            </CardHeadingContainer>
                            <BlogMeta className={swm('hs-elevate-recent-blog-posts-slider__meta')}>
                              {formatBlogMeta(post.publishDate, post.authorName)}
                            </BlogMeta>
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
                          <ReadMoreText className={swm('hs-elevate-recent-blog-posts-slider__read-link')}>
                            {readArticleLabel || 'Read the article'}
                          </ReadMoreText>
                        </CardContentContainer>
                      </CardLink>
                    </Card>
                  </CardWrapper>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Splide>
    </Root>
  );
}
