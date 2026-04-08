import { Splide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import styles from '../logo-grid-slider.module.css';
import cx, { staticWithModule } from '../../../utils/classnames.js';
import { createComponent } from '../../../utils/create-component.js';
import HeadingComponent from '../../../HeadingComponent/index.js';
import { sectionColorsMap } from '../../../utils/section-color-map.js';
import { CSSPropertiesMap } from '../../../types/components.js';
import { SectionVariantType } from '../../../types/fields.js';
import { LogoGridSliderIslandProps } from '../types.js';

const swm = staticWithModule(styles);

function generateColorCssVars(sectionVariantField: SectionVariantType): CSSPropertiesMap {
  const { textColor, accentColor } = sectionColorsMap[sectionVariantField] || sectionColorsMap.section_variant_1;

  return {
    '--hsElevate--logoGridSlider__textColor': textColor,
    '--hsElevate--logoGridSlider__paginationColor': accentColor,
  };
}

function generateLayoutCssVars(logoMaxHeight?: number): CSSPropertiesMap {
  const clampedLogoMaxHeight =
    typeof logoMaxHeight === 'number'
      ? Math.min(150, Math.max(50, logoMaxHeight))
      : 72;

  return {
    '--hsElevate--logoGridSlider__logoMaxHeight': `${clampedLogoMaxHeight}px`,
  };
}

const Root = createComponent('section');
const Inner = createComponent('div');
const Header = createComponent('header');
const Description = createComponent('p');
const Item = createComponent('div');
const Image = createComponent<'img'>('img');

export default function LogoGridSliderIsland(props: LogoGridSliderIslandProps) {
  const {
    heading,
    headingLevel = 'h2',
    description,
    slidesPerPage = 6,
    groupStyle,
    logoRows = [],
  } = props;

  const normalizedSlidesPerPage =
    typeof slidesPerPage === 'number'
      ? Math.min(6, Math.max(1, slidesPerPage))
      : 6;

  const cssVarsMap: CSSPropertiesMap = {
    ...generateColorCssVars(groupStyle.sectionStyleVariant),
    ...generateLayoutCssVars(groupStyle.groupLayout?.logoMaxHeight),
  };

  const hasHeading = Boolean(heading);
  const hasDescription = Boolean(description);
  const showPagination = logoRows.length > 1;

  return (
    <Root className={swm('hs-elevate-logo-grid-slider-react')} style={cssVarsMap}>
      <Inner className={swm('hs-elevate-logo-grid-slider-react__inner')}>
        {(hasHeading || hasDescription) && (
          <Header className={swm('hs-elevate-logo-grid-slider-react__header')}>
            {hasHeading && (
              <HeadingComponent
                headingLevel={headingLevel}
                heading={heading}
                headingStyleVariant={groupStyle.headingStyleVariant}
                additionalClassArray={[swm('hs-elevate-logo-grid-slider-react__title')]}
              />
            )}
            {hasDescription && (
              <Description className={swm('hs-elevate-logo-grid-slider-react__description')}>
                {description}
              </Description>
            )}
          </Header>
        )}

        <Splide
          className={cx('splide', swm('hs-elevate-logo-grid-slider-react__splide'))}
          hasTrack={false}
          options={{
            type: 'slide',
            rewind: true,
            perPage: normalizedSlidesPerPage,
            perMove: 1,
            gap: 24,
            arrows: false,
            pagination: showPagination,
            autoplay: true,
            interval: 3500,
            pauseOnHover: true,
            pauseOnFocus: true,
            speed: 600,
            breakpoints: {
              1200: {
                perPage: Math.min(normalizedSlidesPerPage, 4),
                gap: 20,
              },
              900: {
                perPage: Math.min(normalizedSlidesPerPage, 3),
                gap: 16,
              },
              640: {
                perPage: Math.min(normalizedSlidesPerPage, 2),
                gap: 12,
              },
            },
            i18n: {
              carousel: 'Logo slider',
              slide: 'Logo',
              slideX: 'Go to slide %s',
              select: 'Select a slide to show',
            },
          }}
          aria-label="Logo slider"
        >
          <div className={cx('splide__track', swm('hs-elevate-logo-grid-slider-react__track'))}>
            <ul className={cx('splide__list', swm('hs-elevate-logo-grid-slider-react__list'))}>
              {logoRows.map(item => {
                const alt = item.logo.alt || item.name || '';
                const loading: 'eager' | 'lazy' = item.logo.loading === 'eager' ? 'eager' : 'lazy';

                return (
                  <li className={cx('splide__slide', swm('hs-elevate-logo-grid-slider-react__slide'))} key={item.id}>
                    <Item className={swm('hs-elevate-logo-grid-slider-react__item')}>
                      <Image
                        className={swm('hs-elevate-logo-grid-slider-react__logo')}
                        src={item.logo.src}
                        alt={alt}
                        loading={loading}
                        width={item.logo.width}
                        height={item.logo.height}
                      />
                    </Item>
                  </li>
                );
              })}
            </ul>
          </div>
        </Splide>
      </Inner>
    </Root>
  );
}
