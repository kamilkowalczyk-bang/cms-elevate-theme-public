import { ModuleMeta } from '../../types/modules.js';
import { RichText } from '@hubspot/cms-components';
import { AlignmentFieldType, TextAlignmentFieldType } from '@hubspot/cms-components/fields';
import { SectionVariantType } from '../../types/fields.js';
import HeadingComponent from '../../HeadingComponent/index.js';
import { Button } from '../../ButtonComponent/index.js';
import { getLinkFieldHref, getLinkFieldRel, getLinkFieldTarget } from '../../utils/content-fields.js';
import { getDataHSToken } from '../../utils/inline-editing.js';
import { sectionColorsMap } from '../../utils/section-color-map.js';
import cx, { staticWithModule } from '../../utils/classnames.js';
import { createComponent } from '../../utils/create-component.js';
import { CSSPropertiesMap } from '../../types/components.js';
import caseStudyIconSvg from './assets/case-study.svg';
import styles from './case-study.module.css';
import { CaseStudyProps } from './types.js';

const swm = staticWithModule(styles);

function generateColorCssVars(sectionVariantField: SectionVariantType): CSSPropertiesMap {
  const c = sectionColorsMap[sectionVariantField];
  return {
    '--hsElevate--heading__textColor': c.textColor,
    '--hsElevate--caseStudy__textColor': c.textColor,
    '--hsElevate--caseStudy__sectionCaptionColor': c.sectionCaptionColor,
    '--hsElevate--caseStudy__linkColor': c.linkColor,
    '--hsElevate--caseStudy__linkTextDecoration': c.textDecoration,
    '--hsElevate--caseStudy__linkTextDecorationColor': c.textDecorationColor,
    '--hsElevate--caseStudy__linkHoverColor': c.linkHoverColor,
    '--hsElevate--caseStudy__linkHoverTextDecoration': c.linkHoverTextDecoration,
    '--hsElevate--caseStudy__linkHoverTextDecorationColor': c.linkHoverTextDecorationColor,
    '--hsElevate--blockquote__textColor': c.blockquoteTextColor,
    '--hsElevate--blockquote__backgroundColor': c.blockquoteBackgroundColor,
    '--hsElevate--blockquote__accentColor': c.blockquoteAccentColor,
  };
}

function colorWithOpacity(color: string, opacityPercent?: number): string {
  if (opacityPercent == null) return color;
  if (opacityPercent >= 100) return color;
  if (opacityPercent <= 0) return 'transparent';

  const trimmed = color.trim();
  if (!trimmed.startsWith('#')) return color;

  const hex = trimmed.slice(1);
  const isShort = hex.length === 3;
  const isLong = hex.length === 6;
  if (!isShort && !isLong) return color;

  const expanded = isShort ? hex.split('').map((ch) => `${ch}${ch}`).join('') : hex;
  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);

  if ([r, g, b].some((n) => Number.isNaN(n))) return color;

  const alpha = opacityPercent / 100;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getHorizontalAlignmentClass(
  alignment: AlignmentFieldType['default'] | undefined,
  element: 'divider' | 'caption',
): string {
  const horizontal = alignment?.horizontal_align || 'LEFT';
  const prefix =
    element === 'divider' ? 'hs-elevate-case-study__divider--align-' : 'hs-elevate-case-study__caption--align-';
  if (horizontal === 'CENTER') {
    return swm(`${prefix}center`);
  }
  if (horizontal === 'RIGHT') {
    return swm(`${prefix}right`);
  }
  return swm(`${prefix}left`);
}

function textAlignFromField(field: TextAlignmentFieldType['default'] | undefined): 'left' | 'center' | 'right' | 'justify' {
  const align = field?.text_align ?? 'LEFT';
  switch (align) {
    case 'CENTER':
      return 'center';
    case 'RIGHT':
      return 'right';
    case 'JUSTIFY':
      return 'justify';
    default:
      return 'left';
  }
}

function getButtonRowClass(alignment: AlignmentFieldType['default'] | undefined): string {
  const horizontal = alignment?.horizontal_align || 'LEFT';
  if (horizontal === 'CENTER') {
    return swm('hs-elevate-case-study__button-row--justify-center');
  }
  if (horizontal === 'RIGHT') {
    return swm('hs-elevate-case-study__button-row--justify-end');
  }
  return swm('hs-elevate-case-study__button-row--justify-start');
}

const CaseStudySection = createComponent('section');
const InnerContainer = createComponent('div');
const DividerRule = createComponent('hr');
const Caption = createComponent('p');
const HeadingWrap = createComponent('div');
const RichTextWrap = createComponent('div');
const ButtonRow = createComponent('div');

export const Component = (props: CaseStudyProps) => {
  const {
    moduleName,
    groupContent: {
      showDivider = false,
      showCaption = false,
      captionText = '',
      headingAndTextHeadingLevel,
      headingAndTextHeading,
      richTextContentHTML,
    },
    groupButton: {
      showButton = false,
      buttonContentText: text,
      buttonContentLink: link,
      buttonContentShowIcon: showIcon,
      buttonContentIconPosition: iconPosition,
    },
    groupStyle: {
      groupContent: {
        sectionStyleVariant,
        headingStyleVariant,
        headingUppercase = false,
        headingTextAlignment,
        richTextTextAlignment,
        captionColor: captionColorField = { color: '#FFFFFF', opacity: 0 },
        dividerHorizontalAlignment,
        captionHorizontalAlignment,
      },
      groupButton: { buttonStyleSize, buttonStyleVariant, buttonHorizontalAlignment },
    },
  } = props;

  const buttonHref = getLinkFieldHref(link);
  const buttonRel = getLinkFieldRel(link);
  const buttonTarget = getLinkFieldTarget(link);

  const hasCaptionBlock = showCaption === true && Boolean(captionText?.trim());
  const captionUsesThemeCaptionColor = captionColorField?.opacity == null || captionColorField.opacity <= 0;

  const cssVarsMap: CSSPropertiesMap = {
    ...generateColorCssVars(sectionStyleVariant),
    ...(!captionUsesThemeCaptionColor
      ? {
          '--hsElevate--caseStudy__captionColor': colorWithOpacity(
            captionColorField?.color ?? '#FFFFFF',
            captionColorField?.opacity,
          ),
        }
      : {}),
  };

  const richTextAlign = textAlignFromField(richTextTextAlignment);

  return (
    <CaseStudySection className={swm('hs-elevate-case-study')} style={cssVarsMap}>
      <InnerContainer className={swm('hs-elevate-case-study__inner')}>
        {showDivider === true && (
          <DividerRule
            className={cx(swm('hs-elevate-case-study__divider'), getHorizontalAlignmentClass(dividerHorizontalAlignment, 'divider'))}
            aria-hidden={true}
          />
        )}
        {hasCaptionBlock && (
          <Caption
            className={cx(swm('hs-elevate-case-study__caption'), getHorizontalAlignmentClass(captionHorizontalAlignment, 'caption'))}
            data-hs-token={getDataHSToken(moduleName, 'groupContent.captionText')}
          >
            {captionText}
          </Caption>
        )}
        {headingAndTextHeading && (
          <HeadingWrap className={swm('hs-elevate-case-study__heading-wrap')}>
            <HeadingComponent
              additionalClassArray={['hs-elevate-case-study__title']}
              headingLevel={headingAndTextHeadingLevel}
              headingStyleVariant={headingStyleVariant}
              heading={headingAndTextHeading}
              headingUppercase={headingUppercase === true}
              alignment={headingTextAlignment}
              moduleName={moduleName}
              fieldPath="groupContent.headingAndTextHeading"
            />
          </HeadingWrap>
        )}
        {richTextContentHTML && (
          <RichTextWrap
            className={swm('hs-elevate-case-study__rich-text-wrap')}
            style={{ textAlign: richTextAlign }}
          >
            <RichText
              fieldPath="groupContent.richTextContentHTML"
              className="hs-elevate-case-study__body"
              data-hs-token={getDataHSToken(moduleName, 'groupContent.richTextContentHTML')}
            />
          </RichTextWrap>
        )}
        {showButton === true && (
          <ButtonRow
            className={cx(swm('hs-elevate-case-study__button-row'), getButtonRowClass(buttonHorizontalAlignment))}
          >
            <Button
              additionalClassArray={['hs-elevate-case-study__button']}
              buttonSize={buttonStyleSize}
              buttonStyle={buttonStyleVariant}
              href={buttonHref}
              rel={buttonRel}
              target={buttonTarget}
              showIcon={showIcon}
              iconFieldPath="groupButton.buttonContentIcon"
              iconPosition={iconPosition}
              moduleName={moduleName}
              textFieldPath="groupButton.buttonContentText"
            >
              {text}
            </Button>
          </ButtonRow>
        )}
      </InnerContainer>
    </CaseStudySection>
  );
};

export { fields } from './fields.js';

export const meta: ModuleMeta = {
  label: 'Case study',
  content_types: ['SITE_PAGE', 'LANDING_PAGE', 'CASE_STUDY', 'BLOG_POST', 'BLOG_LISTING'],
  icon: caseStudyIconSvg,
  categories: ['text'],
};

export const defaultModuleConfig = {
  moduleName: 'elevate/components/modules/case_study',
  version: 0,
  themeModule: true,
};
