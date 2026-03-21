import { ModuleMeta } from '../../types/modules.js';
import { RichText } from '@hubspot/cms-components';
import { ImageFieldType, ChoiceFieldType, TextFieldType, ColorFieldType } from '@hubspot/cms-components/fields';
import { SectionVariantType } from '../../types/fields.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { SectionStyleFieldLibraryType } from '../../fieldLibrary/SectionStyle/types.js';
import { RichTextContentFieldLibraryType } from '../../fieldLibrary/RichTextContent/types.js';
import HeadingComponent from '../../HeadingComponent/index.js';
import { Card } from '../../CardComponent/index.js';
import styles from './elevated-heading.module.css';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { getDataHSToken } from '../../utils/inline-editing.js';
import { CSSPropertiesMap } from '../../types/components.js';
import headingIconSvg from '../Heading/assets/heading.svg';
import { CardVariantType } from '../../types/fields.js';
import { sectionColorsMap } from '../../utils/section-color-map.js';

const swm = staticWithModule(styles);

type GroupStyle = SectionStyleFieldLibraryType &
  HeadingStyleFieldLibraryType & {
    sectionBackgroundColor: ColorFieldType['default'];
  };

function sectionBackgroundWithOpacity(color: string, opacityPercent?: number): string {
  if (opacityPercent == null) return color;
  if (opacityPercent >= 100) return color;
  if (opacityPercent <= 0) return 'transparent';

  const trimmed = color.trim();
  if (!trimmed.startsWith('#')) return color;

  const hex = trimmed.slice(1);
  const isShort = hex.length === 3;
  const isLong = hex.length === 6;
  if (!isShort && !isLong) return color;

  const expanded = isShort ? hex.split('').map(ch => `${ch}${ch}`).join('') : hex;
  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);

  if ([r, g, b].some(n => Number.isNaN(n))) return color;

  const alpha = opacityPercent / 100;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type CardItem = {
  groupIcon: {
    image: ImageFieldType['default'];
  };
  groupCardText: RichTextContentFieldLibraryType;
};

type ElevatedHeadingProps = {
  moduleName?: string;
  isElevated?: boolean;
  groupHeading: {
    heading: TextFieldType['default'];
    headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };
  groupStyle: GroupStyle;
  groupCards: CardItem[];
};

function generateHeadingColorCssVars(sectionVariantField: SectionVariantType): CSSPropertiesMap {
  return {
    '--hsElevate--heading__textColor': sectionColorsMap[sectionVariantField].textColor,
  };
}

export const Component = (props: ElevatedHeadingProps) => {
  const {
    moduleName,
    isElevated = false,
    groupHeading,
    groupStyle: {
      sectionStyleVariant,
      headingStyleVariant,
      sectionBackgroundColor: sectionBackgroundColorField = { color: '#F0F0F3', opacity: 100 },
    },
    groupCards,
  } = props;
  const cssVarsMap: CSSPropertiesMap = generateHeadingColorCssVars(sectionStyleVariant);
  const sectionBackgroundColor = sectionBackgroundWithOpacity(
    sectionBackgroundColorField?.color ?? '#F0F0F3',
    sectionBackgroundColorField?.opacity,
  );

  const ModuleWrapper = createComponent('div');
  const HeadingWrapper = createComponent('div');
  const Section = createComponent('section');

  return (
    <ModuleWrapper
      className={swm('hs-elevate-elevated-heading__moduleWrapper')}
    >
      <Section
        className={cx(swm('hs-elevate-elevated-heading'), {
          [swm('hs-elevate-elevated-heading__moduleWrapper--is-elevated')]: isElevated,
        })}
        style={{ ...cssVarsMap, backgroundColor: sectionBackgroundColor }}
      >
      <hr className={swm('hs-elevate-elevated-heading__divider')} aria-hidden="true" />

      <HeadingWrapper className={swm('hs-elevate-elevated-heading__heading')}>
        <HeadingComponent
          additionalClassArray={[]}
          headingLevel={groupHeading.headingLevel}
          heading={groupHeading.heading}
          headingStyleVariant={headingStyleVariant}
          moduleName={moduleName}
          fieldPath="groupHeading.heading"
        />
      </HeadingWrapper>

      <div className={swm('hs-elevate-elevated-heading__cards')}>
        {groupCards.map((card, index) => {
          const icon = card.groupIcon?.image;
          const iconLoading = icon.loading !== 'disabled' ? icon.loading : 'eager';

          return (
            <Card
              key={index}
              cardStyleVariant={'card_variant_1' as CardVariantType}
              cardOrientation="column"
              additionalClassArray={[swm('hs-elevate-elevated-heading__card')]}
              inlineStyles={{
                padding: 0,
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {icon?.src && (
                <img
                  className={swm('hs-elevate-elevated-heading__cardIcon')}
                  src={icon.src}
                  alt={icon.alt || ''}
                  loading={iconLoading}
                  width={icon.width}
                  height={icon.height}
                  data-hs-token={getDataHSToken(moduleName, `groupCards[${index}].groupIcon.image`)}
                />
              )}

              <div className={swm('hs-elevate-elevated-heading__cardTitle')}>
                <RichText
                  fieldPath={`groupCards[${index}].groupCardText.richTextContentHTML`}
                  className={swm('hs-elevate-elevated-heading__cardTitle__richText')}
                  data-hs-token={getDataHSToken(moduleName, `groupCards[${index}].groupCardText.richTextContentHTML`)}
                />
              </div>
            </Card>
          );
        })}
      </div>
      </Section>
    </ModuleWrapper>
  );
};

export { fields } from './fields.js';

export const meta: ModuleMeta = {
  label: 'Elevated heading',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: headingIconSvg,
  categories: ['body_content'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/elevated_heading',
  version: 0,
  themeModule: true,
};

