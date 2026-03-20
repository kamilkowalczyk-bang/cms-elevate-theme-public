import { ModuleMeta } from '../../types/modules.js';
import { RichText } from '@hubspot/cms-components';
import { ImageFieldType, RichTextFieldType, ChoiceFieldType } from '@hubspot/cms-components/fields';
import { SectionVariantType } from '../../types/fields.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { SectionStyleFieldLibraryType } from '../../fieldLibrary/SectionStyle/types.js';
import { RichTextContentFieldLibraryType } from '../../fieldLibrary/RichTextContent/types.js';
import HeadingComponent from '../../HeadingComponent/index.js';
import { Card } from '../../CardComponent/index.js';
import styles from './elevated-heading.module.css';
import { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { getDataHSToken } from '../../utils/inline-editing.js';
import { CSSPropertiesMap } from '../../types/components.js';
import headingIconSvg from '../Heading/assets/heading.svg';
import { CardVariantType } from '../../types/fields.js';
import { sectionColorsMap } from '../../utils/section-color-map.js';

const swm = staticWithModule(styles);

type GroupHeading = {
  groupHeading: {
    richTextContentHTML: RichTextFieldType['default'];
    headingLevel: ChoiceFieldType['default'];
  };
};

type GroupStyle = SectionStyleFieldLibraryType & HeadingStyleFieldLibraryType;

type CardItem = {
  groupIcon: {
    image: ImageFieldType['default'];
  };
  groupCardText: RichTextContentFieldLibraryType;
};

type ElevatedHeadingProps = {
  moduleName?: string;
  groupHeading: {
    richTextContentHTML: RichTextFieldType['default'];
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
  const { moduleName, groupHeading, groupStyle: { sectionStyleVariant, headingStyleVariant }, groupCards } = props;
  const cssVarsMap: CSSPropertiesMap = generateHeadingColorCssVars(sectionStyleVariant);

  const HeadingWrapper = createComponent('div');
  const Section = createComponent('section');

  return (
    <Section className={swm('hs-elevate-elevated-heading')} style={cssVarsMap}>
      <HeadingWrapper className={swm('hs-elevate-elevated-heading__heading')}>
        <HeadingComponent
          additionalClassArray={[]}
          headingLevel={groupHeading.headingLevel}
          heading={groupHeading.richTextContentHTML}
          headingStyleVariant={headingStyleVariant}
          moduleName={moduleName}
          fieldPath="groupHeading.richTextContentHTML"
        />
      </HeadingWrapper>

      <hr className={swm('hs-elevate-elevated-heading__divider')} aria-hidden="true" />

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
                justifyContent: 'center',
                alignItems: 'flex-start',
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

