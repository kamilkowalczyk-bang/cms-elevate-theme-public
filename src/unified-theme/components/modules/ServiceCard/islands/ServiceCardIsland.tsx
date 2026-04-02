import { useEffect, useMemo, useState } from 'react';
import { Icon, RichText } from '@hubspot/cms-components';
import {
  AlignmentFieldType,
  BooleanFieldType,
  IconFieldType,
  ImageFieldType,
  TextFieldType,
} from '@hubspot/cms-components/fields';
import { ButtonStyleType, StandardSizeType } from '../../../types/fields.js';
import { getAlignmentFieldCss } from '../../../utils/style-fields.js';
import { getLinkFieldHref, getLinkFieldRel, getLinkFieldTarget } from '../../../utils/content-fields.js';
import { Card } from '../../../CardComponent/index.js';
import HeadingComponent from '../../../HeadingComponent/index.js';
import styles from '../service-card.module.css';
import { RichTextContentFieldLibraryType } from '../../../fieldLibrary/RichTextContent/types.js';
import { Button } from '../../../ButtonComponent/index.js';
import SanitizedContent from '../../../SanitizeHTML/index.js';
import { ButtonContentType } from '../../../fieldLibrary/ButtonContent/types.js';
import { HeadingStyleFieldLibraryType } from '../../../fieldLibrary/HeadingStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../../fieldLibrary/HeadingAndText/types.js';
import { CardStyleFieldLibraryType } from '../../../fieldLibrary/CardStyle/types.js';
import cx, { staticWithModule } from '../../../utils/classnames.js';
import { createComponent } from '../../../utils/create-component.js';
import { CSSPropertiesMap } from '../../../types/components.js';
import { getDataHSToken } from '../../../utils/inline-editing.js';

const swm = staticWithModule(styles);

// Types

type IconGroup = {
  groupIcon: {
    icon: IconFieldType['default'];
  };
};

type ImageGroup = {
  groupImage: {
    image: ImageFieldType['default'];
    showRoundImageBorder?: BooleanFieldType['default'];
  };
};

type ContentGroup = {
  groupContent: RichTextContentFieldLibraryType &
    HeadingAndTextFieldLibraryType & {
      showCaption?: BooleanFieldType['default'];
      captionText?: TextFieldType['default'];
    };
};

type ButtonGroup = {
  groupButton: ButtonContentType & {
    showButton: BooleanFieldType['default'];
  };
};

type CardBackgroundGroup = {
  groupCardBackground: {
    image: ImageFieldType['default'];
  };
};

type HubDBRowSelection = {
  id?: unknown;
  service_title?: unknown;
  service_description?: unknown;
  service_link_text?: unknown;
  service_link_url?: unknown;
  service_bg_img?: unknown;
  /** HubDB IMAGE column name `image` — cell is `{ url, ... }` in HubL. */
  image?: unknown;
};

type GroupCards = IconGroup & ImageGroup & ContentGroup & ButtonGroup & Partial<CardBackgroundGroup>;
type GroupCardsWithHubdbRow = GroupCards & {
  groupHubdbRow?: HubDBRowSelection;
};

type GroupCardStyles = {
  groupCard: CardStyleFieldLibraryType & {
    cardOrientation: 'row' | 'column';
    showIconBorder?: BooleanFieldType['default'];
    showCardShadow?: BooleanFieldType['default'];
    showCardBorder?: BooleanFieldType['default'];
  };
};

type GroupContentStyles = {
  groupContent: HeadingStyleFieldLibraryType & {
    alignment: AlignmentFieldType['default'];
    headingUppercase?: BooleanFieldType['default'];
  };
};

type GroupButtonStyles = {
  groupButton: {
    buttonStyleSize: StandardSizeType;
    buttonStyleVariant: ButtonStyleType;
  };
};

type GroupLayoutStyles = {
  groupLayout?: {
    cardsAlignment: AlignmentFieldType['default'];
  };
};

type GroupStyle = GroupCardStyles & GroupLayoutStyles & GroupContentStyles & GroupButtonStyles;

type HubDBServiceCard = {
  /** Raw HubDB multi-select value for filtering in React. */
  serviceCategories?: unknown;
  /** HubDB checkbox value for featured cards. */
  isFeatured?: unknown;
  groupCardBackground: {
    image: {
      // In hubDB mode, this can be a URL string or an object containing `src`.
      src?: unknown;
      alt?: string;
      loading?: string;
    };
  };
  groupContent: {
    showCaption?: boolean;
    captionText?: string;
    headingAndTextHeadingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    headingAndTextHeading: string;
    richTextContentHTML: string;
  };
  groupButton: {
    showButton: boolean;
    buttonContentText: string;
    buttonContentLink: any;
    buttonContentShowIcon: boolean;
    buttonContentIconPosition: 'left' | 'right';
  };
  groupImage: {
    showRoundImageBorder: boolean;
    image: {
      src?: unknown;
      alt?: string;
      loading?: string;
      width?: number;
      height?: number;
    };
  };
  // Optional — if empty, icon won't render.
  groupIcon?: {
    icon: {
      name?: string;
    };
  };
};

/** Server-resolved HubDB row for manual card mode (`hubdb_table_row` in hublDataTemplate). */
export type ManualHubDbRowSnapshot = {
  service_title?: string;
  service_description?: string;
  service_link_text?: string;
  service_link_url?: string;
  /**
   * HubL-normalized URL for the card background (see `hublDataTemplate` in `index.tsx`).
   * HubDB IMAGE columns in HubL/API are usually `{ url, width, height, type: "image" }`; we coerce to a string for CSS.
   */
  bgSrc?: string | unknown;
  /** Same column as `bgSrc` if ever emitted separately (raw IMAGE cell); `getHubDbImageUrl` accepts both. */
  service_bg_img?: unknown;
};

type ServiceCardProps = {
  moduleName?: string;
  imageOrIcon: 'icon' | 'image';
  groupCards: GroupCards[];
  groupStyle: GroupStyle;
  useHubDBFeed?: boolean;
  serviceCategory?: string;
  showFeaturedCards?: boolean;
  hideCategoryTabs?: boolean;
  hublData: {
    renderedWithGrids: boolean;
    hubdbCards?: HubDBServiceCard[];
    /** One entry per `groupCards` index when Use HubDB feed is off; from `hubdb_table_row(tableId, rowId)`. */
    manualHubDbRows?: (ManualHubDbRowSnapshot | null)[];
  };
};

// Functions to generate CSS variables

function generateAlignmentCssVars(
  cardsAlignment: AlignmentFieldType['default'],
  contentAlignment: AlignmentFieldType['default'],
): CSSPropertiesMap {
  const cardsAlignmentCss = getAlignmentFieldCss(cardsAlignment);
  const contentAlignmentCss = getAlignmentFieldCss(contentAlignment);
  const textAlignment = contentAlignment.horizontal_align?.toLowerCase() as 'left' | 'right' | 'center';
  return {
    '--hsElevate--card__containerAlignment': cardsAlignmentCss.justifyContent ?? 'center',
    '--hsElevate--card__alignment': contentAlignmentCss.justifyContent,
    '--hsElevate--card__textAlignment': textAlignment,
  };
}

function generateColorCssVars(cardVariantField: string): CSSPropertiesMap {
  const iconColorsMap = {
    card_variant_1: {
      borderRadius: 'var(--hsElevate--card--variant1__iconBorderRadius)',
      fillColor: 'var(--hsElevate--card--variant1__iconColor)',
      backgroundColor: 'var(--hsElevate--card--variant1__iconBackgroundColor)',
    },
    card_variant_2: {
      borderRadius: 'var(--hsElevate--card--variant2__iconBorderRadius)',
      fillColor: 'var(--hsElevate--card--variant2__iconColor)',
      backgroundColor: 'var(--hsElevate--card--variant2__iconBackgroundColor)',
    },
    card_variant_3: {
      borderRadius: 'var(--hsElevate--card--variant3__iconBorderRadius)',
      fillColor: 'var(--hsElevate--card--variant3__iconColor)',
      backgroundColor: 'var(--hsElevate--card--variant3__iconBackgroundColor)',
    },
    card_variant_4: {
      borderRadius: 'var(--hsElevate--card--variant4__iconBorderRadius)',
      fillColor: 'var(--hsElevate--card--variant4__iconColor)',
      backgroundColor: 'var(--hsElevate--card--variant4__iconBackgroundColor)',
    },
  };

  return {
    '--hsElevate--cardIcon__borderRadius': iconColorsMap[cardVariantField].borderRadius,
    '--hsElevate--cardIcon__fillColor': iconColorsMap[cardVariantField].fillColor,
    '--hsElevate--cardIcon__backgroundColor': iconColorsMap[cardVariantField].backgroundColor,
  };
}

// Checks if image path has '-use-background-' in its name to get the card icon's background color applied

function imageShouldUseBackground(imagePath: string): boolean {
  if (!imagePath) {
    return false;
  }
  return /-use-background-/.test(imagePath);
}

function getCardBackgroundImageSrc(image: Partial<ImageFieldType['default']> | { src?: unknown } | undefined): string | undefined {
  if (!image) return undefined;

  const srcCandidate = (image as any)?.src ?? image;

  if (typeof srcCandidate === 'string' && srcCandidate.trim()) {
    return srcCandidate.trim();
  }

  if (srcCandidate && typeof srcCandidate === 'object') {
    const nestedCandidate = (srcCandidate as any).src ?? (srcCandidate as any).url ?? (srcCandidate as any).href;
    if (typeof nestedCandidate === 'string' && nestedCandidate.trim()) {
      return nestedCandidate.trim();
    }
  }

  return undefined;
}

/**
 * HubDB rows expose cells in a `values` map (column name → cell value). Names are case-insensitive in HubL.
 * @see https://developers.hubspot.com/docs/cms/start-building/features/storage/hubdb#getting-rows
 * @see https://developers.hubspot.com/docs/api-reference/legacy/cms/hubdb/guide
 */
function getHubDbValuesObject(row: any): Record<string, unknown> | undefined {
  if (!row || typeof row !== 'object') return undefined;
  const candidates = [
    row.values,
    row.row?.values,
    row.selectedRow?.values,
    row.selectedRow?.row?.values,
    row.data?.values,
    row.hubdbRow?.values,
    row.rowData?.values,
  ];
  for (const bag of candidates) {
    if (bag && typeof bag === 'object' && !Array.isArray(bag)) {
      return bag as Record<string, unknown>;
    }
  }
  return undefined;
}

function lookupColumnInHubDbValues(values: Record<string, unknown>, columnName: string): unknown {
  if (Object.prototype.hasOwnProperty.call(values, columnName)) return values[columnName];
  const lower = columnName.toLowerCase();
  for (const key of Object.keys(values)) {
    if (key.toLowerCase() === lower) return values[key];
  }
  return undefined;
}

/** Some serialized cells wrap the payload in `{ value }` (e.g. rich text in certain shapes). */
function unwrapHubDbCell(cell: unknown): unknown {
  if (cell && typeof cell === 'object' && !Array.isArray(cell) && 'value' in cell) {
    const v = (cell as { value?: unknown }).value;
    if (v !== undefined) return v;
  }
  return cell;
}

function getHubDbRowValue(row: any, columnName: string): unknown {
  if (!row || typeof row !== 'object') return undefined;

  const top = row[columnName];
  if (top !== undefined) return unwrapHubDbCell(top);

  const valuesBag = getHubDbValuesObject(row);
  if (valuesBag) {
    const fromBag = lookupColumnInHubDbValues(valuesBag, columnName);
    if (fromBag !== undefined) return unwrapHubDbCell(fromBag);
  }

  return (
    row?.values?.[columnName] ??
    row?.value?.[columnName] ??
    row?.cells?.[columnName] ??
    row?.row?.values?.[columnName] ??
    row?.data?.values?.[columnName] ??
    row?.row?.[columnName] ??
    unwrapHubDbCell(row?.values?.[columnName] as unknown)
  );
}

function getHubDbRowString(rowValue: unknown): string | undefined {
  if (typeof rowValue === 'string') {
    const trimmed = rowValue.trim();
    return trimmed ? trimmed : undefined;
  }
  if (rowValue && typeof rowValue === 'object') {
    const hrefLike = (rowValue as any).href ?? (rowValue as any).url ?? (rowValue as any).value;
    if (typeof hrefLike === 'string') {
      const trimmed = hrefLike.trim();
      return trimmed ? trimmed : undefined;
    }
  }
  return undefined;
}

/** HubDB LINK column: string or `{ url: { href } }` / `{ url: string }`. */
function getHubDbLinkUrl(rowValue: unknown): string | undefined {
  const flat = getHubDbRowString(rowValue);
  if (flat) return flat;
  if (!rowValue || typeof rowValue !== 'object') return undefined;
  const o = rowValue as Record<string, unknown>;
  const u = o.url;
  if (typeof u === 'string' && u.trim()) return u.trim();
  if (u && typeof u === 'object') {
    const inner = (u as { href?: string }).href;
    if (typeof inner === 'string' && inner.trim()) return inner.trim();
  }
  return undefined;
}

/**
 * HubDB IMAGE / FILE cells are usually `{ url, width, height, type: "image" }` (API) or similar in HubL.
 * HubSpot may also use `full_url`, nested `image.url` / `image.default`, or CMS-style `default` objects.
 * @see https://developers.hubspot.com/docs/api-reference/legacy/cms/hubdb/guide
 */
function getHubDbImageUrl(raw: unknown): string | undefined {
  if (raw == null) return undefined;
  let cell: unknown = raw;
  if (cell && typeof cell === 'object' && 'value' in (cell as object)) {
    const v = (cell as { value?: unknown }).value;
    if (v !== undefined && v !== null) cell = v;
  }
  if (typeof cell === 'string') {
    const t = cell.trim();
    return t ? t : undefined;
  }
  if (typeof cell === 'object') {
    const o = cell as Record<string, unknown>;
    const fileObj = o.file;
    const fromFile =
      fileObj && typeof fileObj === 'object' ? (fileObj as Record<string, unknown>).url : undefined;
    const meta = o.meta && typeof o.meta === 'object' ? (o.meta as Record<string, unknown>) : undefined;
    const direct =
      o.url ??
      o.src ??
      o.href ??
      o.full_url ??
      o.file_url ??
      (typeof fromFile === 'string' ? fromFile : undefined) ??
      (meta?.url as string | undefined);
    if (typeof direct === 'string' && direct.trim()) {
      return direct.trim();
    }
    // CMS image field shape: `{ default: { url | src } }`
    const def = o.default;
    if (def && typeof def === 'object') {
      const fromDef = getHubDbImageUrl(def);
      if (fromDef) return fromDef;
    }
    // HubL / HubDB: `row.image.url` or cell shaped as `{ image: { url } }`
    const nestedImage = o.image;
    if (nestedImage && typeof nestedImage === 'object') {
      const fromNested = getHubDbImageUrl(nestedImage);
      if (fromNested) return fromNested;
    }
    const nested = o.value;
    if (nested && typeof nested === 'object' && nested !== cell) {
      return getHubDbImageUrl(nested);
    }
  }
  return undefined;
}

/** Prefer known names, then any `values` key that looks like a background image column. */
function getHubDbBackgroundImageCell(row: unknown): unknown {
  if (!row) return undefined;
  const preferred = [
    'service_bg_img',
    'image',
    'bg_image',
    'card_bg_image',
    'background_image',
    'card_background_image',
  ] as const;
  for (const col of preferred) {
    const v = getHubDbRowValue(row, col);
    if (v !== undefined && v !== null && v !== '') return v;
  }
  const bag = getHubDbValuesObject(row as any);
  if (bag) {
    for (const key of Object.keys(bag)) {
      if (!/(bg|background|image|img)/i.test(key)) continue;
      const v = unwrapHubDbCell(bag[key]);
      if (v !== undefined && v !== null && v !== '') return v;
    }
  }
  return undefined;
}

/**
 * Resolves a single URL string for `background-image: url("...")`.
 * The module **ImageField** (`groupCardBackground.image`) supplies `{ src: string }` (or nested url/href); HubDB IMAGE cells are objects — we normalize with `getHubDbImageUrl`.
 */
function resolveCardBackgroundImageSrc(
  groupCardBackground: { image?: unknown } | undefined,
  hubdbRow: unknown | undefined,
  preferHubDbRowCell: boolean,
  prefetchedBgSrc?: string | unknown,
): string | undefined {
  // HubL `manualHubDbRows[].bgSrc` may be a string URL or still an IMAGE cell object; do not require `hubdbRow` to use it.
  if (preferHubDbRowCell && prefetchedBgSrc !== undefined && prefetchedBgSrc !== null) {
    const fromPre =
      typeof prefetchedBgSrc === 'string'
        ? prefetchedBgSrc.trim() || undefined
        : getHubDbImageUrl(prefetchedBgSrc);
    if (fromPre) return fromPre;
  }
  if (preferHubDbRowCell && hubdbRow) {
    const raw = getHubDbBackgroundImageCell(hubdbRow);
    const u = getHubDbImageUrl(raw);
    if (u) return u;
  }
  const fromModule = getCardBackgroundImageSrc(groupCardBackground?.image as any);
  if (fromModule) return fromModule;
  const img = groupCardBackground?.image as Record<string, unknown> | undefined;
  if (img?.src != null) {
    const u = getHubDbImageUrl(img.src);
    if (u) return u;
  }
  if (img != null) {
    return getHubDbImageUrl(img);
  }
  return undefined;
}

/** HubDB RICHTEXT / long text: HTML string or `{ html, value }`. */
function getHubDbDescriptionHtml(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') {
    const t = value.trim();
    return t ? t : undefined;
  }
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>;
    const html = o.html ?? o.value;
    if (typeof html === 'string' && html.trim()) {
      return html.trim();
    }
  }
  return undefined;
}

/** HubDbRowField may use `id`, `rowId`, or column `hs_id`. */
function getHubDbRowId(row: unknown): number | undefined {
  if (!row || typeof row !== 'object') return undefined;
  const r = row as Record<string, unknown>;
  const candidates = [
    r.id,
    r.rowId,
    r.row_id,
    r.hs_row_id,
    r.hs_id,
    getHubDbRowValue(row, 'hs_id'),
  ];
  for (const raw of candidates) {
    const n = typeof raw === 'number' ? raw : typeof raw === 'string' ? parseInt(raw, 10) : NaN;
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}

/** True when a HubDB row is selected or column values were fetched (id may be omitted in some payloads). */
function hasHubDbManualRowData(row: unknown): boolean {
  if (getHubDbRowId(row) !== undefined) return true;
  if (!row || typeof row !== 'object') return false;
  const vals = getHubDbValuesObject(row as any);
  if (vals && Object.keys(vals).length > 0) return true;
  const columnKeys = ['service_title', 'service_description', 'service_link_text', 'service_link_url', 'service_bg_img', 'image'];
  for (const k of columnKeys) {
    const v = getHubDbRowValue(row, k);
    if (v !== undefined && v !== null && v !== '') return true;
  }
  return false;
}

function manualSnapshotHasContent(s: ManualHubDbRowSnapshot | null | undefined): boolean {
  if (!s) return false;
  return [s.service_title, s.service_description, s.service_link_text, s.service_link_url, s.bgSrc].some(
    (v) => v !== undefined && v !== null && String(v).trim() !== '',
  );
}

/** Prefer HubL `hubdb_table_row` snapshot over HubDbRowField JSON (picker may omit `values` on publish). */
function preferSnapshotString(snap: string | undefined | null, fromPicker: unknown): unknown {
  if (snap !== undefined && snap !== null && String(snap).trim() !== '') return snap;
  return fromPicker;
}

function hasHubDbManualRowForCard(hubdbRow: unknown, snapshot: ManualHubDbRowSnapshot | null | undefined): boolean {
  if (manualSnapshotHasContent(snapshot)) return true;
  return hasHubDbManualRowData(hubdbRow);
}

function normalizeCategoryLabel(category: string): string {
  return category.trim().toLowerCase();
}

function normalizeHubDbCategories(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          const maybeLabel = (item as any).name ?? (item as any).label ?? (item as any).value;
          return typeof maybeLabel === 'string' ? maybeLabel : [];
        }
        return [];
      })
      .map((v) => (typeof v === 'string' ? normalizeCategoryLabel(v) : ''))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,;]/)
      .map((v) => normalizeCategoryLabel(v))
      .filter(Boolean);
  }

  if (value && typeof value === 'object') {
    const maybeItems = (value as any).items ?? (value as any).values;
    return normalizeHubDbCategories(maybeItems);
  }

  return [];
}

function isShowAllCategory(category: string | undefined): boolean {
  if (!category) return true;
  return normalizeCategoryLabel(category) === 'service_all';
}

// Components

const CardContainer = createComponent('div');
const IconWrapper = createComponent('div');
const ImageWrapper = createComponent('div');
const Image = createComponent('img');
const CardContent = createComponent('div');
const ButtonWrapper = createComponent('div');
const Caption = createComponent('p');

const ServiceCardIsland = (props: ServiceCardProps) => {
  const {
    moduleName,
    imageOrIcon,
    groupCards,
    groupStyle: {
      groupCard: {
        cardStyleVariant,
        cardOrientation,
        showIconBorder = true,
        showCardShadow = false,
        showCardBorder = true,
      },
      groupLayout,
      groupContent: { alignment, headingStyleVariant, headingUppercase = false },
      groupButton: { buttonStyleVariant, buttonStyleSize },
    },
    hublData: { renderedWithGrids = false, hubdbCards = [], manualHubDbRows = [] },
    useHubDBFeed = false,
    serviceCategory,
    showFeaturedCards = false,
    hideCategoryTabs = false,
  } = props;

  const tabOptions = useMemo(
    () => [
      { value: 'service_all', label: 'Show all' },
      { value: 'communication_systems', label: 'Communication systems' },
      { value: 'positioning_tracking_systems', label: 'Positioning & tracking systems' },
      { value: 'manufacturing_technologies', label: 'Manufacturing technologies' },
    ],
    [],
  );

  const [activeCategory, setActiveCategory] = useState(serviceCategory ?? 'service_all');

  useEffect(() => {
    if (!useHubDBFeed) return;
    setActiveCategory(serviceCategory ?? 'service_all');
  }, [serviceCategory, useHubDBFeed]);

  const inlineModuleName = useHubDBFeed ? undefined : moduleName;

  const cardsToRender = useMemo(() => {
    if (!useHubDBFeed) return groupCards;
    if (showFeaturedCards) {
      return hubdbCards.filter(
        (card) =>
          card.isFeatured === true ||
          card.isFeatured === 'true' ||
          card.isFeatured === 'on' ||
          card.isFeatured === 1 ||
          card.isFeatured === '1',
      );
    }
    if (isShowAllCategory(activeCategory)) return hubdbCards;
    const activeCategoryNormalized = normalizeCategoryLabel(activeCategory);
    return hubdbCards.filter((card) => normalizeHubDbCategories(card.serviceCategories).includes(activeCategoryNormalized));
  }, [activeCategory, groupCards, hubdbCards, useHubDBFeed, showFeaturedCards]);

  const isIcon = imageOrIcon === 'icon';
  const isImage = imageOrIcon === 'image';
  const textAlignment = alignment.horizontal_align?.toLowerCase() as 'left' | 'right' | 'center';

  const headingInlineStyles = { textAlign: textAlignment };

  /** When groupLayout is absent (modules saved before this field), match legacy behavior: row followed inner alignment. */
  const cardsAlignmentField = groupLayout?.cardsAlignment ?? alignment;

  const cssVarsMap = {
    ...generateColorCssVars(cardStyleVariant),
    ...generateAlignmentCssVars(cardsAlignmentField, alignment),
  };

  const layoutClass = renderedWithGrids ? 'hs-elevate-service-card-container--grids' : 'hs-elevate-service-card-container--bootstrap';

  return (
    <>
      {useHubDBFeed && !showFeaturedCards && !hideCategoryTabs && (
        <div className={swm('hs-elevate-service-card__category-tabs')} style={cssVarsMap}>
          {tabOptions.map((tab) => {
            const isActive = tab.value === activeCategory;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveCategory(tab.value)}
                aria-pressed={isActive}
                className={swm('hs-elevate-service-card__category-tab')}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
      <CardContainer className={cx(swm('hs-elevate-service-card-container'), styles[layoutClass])} style={cssVarsMap}>
        {cardsToRender.map((card, index) => {
        const {
          groupButton: {
            showButton,
            buttonContentText: text,
            buttonContentLink: link = {},
            buttonContentShowIcon: showIcon,
            buttonContentIconPosition: iconPosition,
          },
        } = card;

        const hubdbRow = (card as GroupCardsWithHubdbRow).groupHubdbRow;
        const hubDbSnapshot = !useHubDBFeed ? manualHubDbRows[index] ?? null : null;
        const isHubdbRowMode = hasHubDbManualRowForCard(hubdbRow, hubDbSnapshot);
        /** HubL appends one snapshot per card when a row id resolves; prefer HubDB bg whenever that exists (not only when picker JSON looks populated). */
        const preferHubDbBackground = !useHubDBFeed && hubDbSnapshot != null;
        const hubDbBackgroundRaw =
          hubDbSnapshot == null
            ? undefined
            : (() => {
                const snap = hubDbSnapshot;
                const fromBg = snap.bgSrc;
                const hasUsableBg =
                  fromBg !== undefined &&
                  fromBg !== null &&
                  (typeof fromBg !== 'string' || fromBg.trim() !== '');
                if (hasUsableBg) return fromBg;
                return snap.service_bg_img ?? fromBg;
              })();

        const derivedTitle = preferSnapshotString(hubDbSnapshot?.service_title, getHubDbRowValue(hubdbRow, 'service_title'));
        const derivedDescriptionRaw = preferSnapshotString(
          hubDbSnapshot?.service_description,
          getHubDbRowValue(hubdbRow, 'service_description'),
        );
        const derivedButtonText = preferSnapshotString(hubDbSnapshot?.service_link_text, getHubDbRowValue(hubdbRow, 'service_link_text'));
        const derivedButtonUrl = preferSnapshotString(hubDbSnapshot?.service_link_url, getHubDbRowValue(hubdbRow, 'service_link_url'));
        const derivedTitleString = getHubDbRowString(derivedTitle);
        const effectiveHeading = derivedTitleString ?? card.groupContent.headingAndTextHeading;

        const derivedDescriptionHTML =
          getHubDbDescriptionHtml(derivedDescriptionRaw) ?? getHubDbRowString(derivedDescriptionRaw);
        const effectiveDescriptionHTML = derivedDescriptionHTML ?? card.groupContent.richTextContentHTML;

        const effectiveButtonText = getHubDbRowString(derivedButtonText) ?? text;

        const derivedButtonUrlHref = getHubDbLinkUrl(derivedButtonUrl);
        const effectiveLink =
          derivedButtonUrlHref
            ? {
                url: { href: derivedButtonUrlHref, type: 'EXTERNAL' },
                open_in_new_tab: true,
              }
            : link;

        // Preserve existing behavior: `groupButton.showButton` controls visibility.
        const effectiveShowButton = showButton;

          const hasValidImageSrc = card?.groupImage?.image?.src;
          const isCardImageWithBackground = hasValidImageSrc && imageShouldUseBackground(card.groupImage.image.src);
          const cardImageUsesBackground = isImage && isCardImageWithBackground;
          const isImageVisible = isImage && hasValidImageSrc;
          const hasValidIconName = card?.groupIcon?.icon?.name;
          const isIconVisible = isIcon && hasValidIconName;

          const cardBackgroundSrc = resolveCardBackgroundImageSrc(
            card.groupCardBackground,
            hubdbRow,
            preferHubDbBackground,
            hubDbBackgroundRaw,
          );
          const hasCardBackgroundImage = Boolean(cardBackgroundSrc);

          const cardClasses = cx('hs-elevate-service-card-container__card', styles[`hs-elevate-service-card-container__card--${cardOrientation}`], {
            [styles['hs-elevate-service-card-container__card--no-button']]: !effectiveShowButton,
            [styles['hs-elevate-service-card-container__card--bg-image']]: hasCardBackgroundImage,
            [styles['hs-elevate-service-card-container__card--drop-shadow']]: showCardShadow,
          });

          const cardSurfaceStyles: CSSPropertiesMap | undefined = (() => {
            const stylesMap: CSSPropertiesMap = {};
            if (hasCardBackgroundImage) {
              stylesMap.backgroundImage = `url(${JSON.stringify(cardBackgroundSrc)})`;
            }
            if (showCardBorder === false) {
              stylesMap.border = 'none';
            }
            return Object.keys(stylesMap).length ? stylesMap : undefined;
          })();

          const showRoundImageBorder = card.groupImage?.showRoundImageBorder === true;

          const imageWrapperClasses = cx(swm('hs-elevate-service-card-container__image-wrapper'), {
            [styles['hs-elevate-service-card-container__image-wrapper--use-background']]: cardImageUsesBackground,
            [styles['hs-elevate-service-card-container__image-wrapper--round-border']]: isImageVisible && showRoundImageBorder,
          });

          return (
            <Card
              additionalClassArray={[cardClasses]}
              key={index}
              cardStyleVariant={cardStyleVariant}
              cardOrientation={cardOrientation}
              inlineStyles={cardSurfaceStyles}
            >
              {isIconVisible && (
                <IconWrapper className={swm('hs-elevate-service-card-container__icon-wrapper')}>
                  <Icon
                    className={cx(swm('hs-elevate-service-card-container__icon'), {
                      [styles['hs-elevate-service-card-container__icon--no-frame']]: !showIconBorder,
                    })}
                    purpose="DECORATIVE"
                    fieldPath={!useHubDBFeed ? `groupCards[${index}].groupIcon.icon` : undefined}
                  />
                </IconWrapper>
              )}
              {isImageVisible && (
                <ImageWrapper className={cx(imageWrapperClasses)}>
                  <Image
                    className={swm('hs-elevate-service-card-container__image')}
                    src={card.groupImage.image.src}
                    alt={card.groupImage.image.alt}
                    width={card.groupImage.image.width}
                    height={card.groupImage.image.height}
                    loading={card.groupImage.image.loading !== 'disabled' ? card.groupImage.image.loading : 'eager'}
                    data-hs-token={getDataHSToken(inlineModuleName, `groupCards[${index}].groupImage.image`)}
                  />
                </ImageWrapper>
              )}
              <CardContent className={swm('hs-elevate-service-card-container__content')}>
                {card.groupContent.showCaption === true && Boolean(card.groupContent.captionText?.trim()) && (
                  <Caption
                    className={swm('hs-elevate-service-card-container__caption')}
                    style={{ textAlign: textAlignment }}
                    data-hs-token={getDataHSToken(inlineModuleName, `groupCards[${index}].groupContent.captionText`)}
                  >
                    {card.groupContent.captionText}
                  </Caption>
                )}
              {effectiveHeading && (
                  <HeadingComponent
                    headingLevel={card.groupContent.headingAndTextHeadingLevel}
                  heading={effectiveHeading}
                    headingStyleVariant={headingStyleVariant}
                    inlineStyles={headingInlineStyles}
                    headingUppercase={headingUppercase}
                    additionalClassArray={[swm('hs-elevate-service-card-container__title')]}
                  moduleName={!useHubDBFeed && !isHubdbRowMode ? inlineModuleName : undefined}
                  fieldPath={!useHubDBFeed && !isHubdbRowMode ? `groupCards[${index}].groupContent.headingAndTextHeading` : undefined}
                  />
                )}
              {useHubDBFeed || isHubdbRowMode ? (
                  <div className={swm('hs-elevate-service-card-container__body')}>
                  <SanitizedContent content={effectiveDescriptionHTML} />
                  </div>
                ) : (
                  <RichText
                    fieldPath={`groupCards[${index}].groupContent.richTextContentHTML`}
                    className={swm('hs-elevate-service-card-container__body')}
                    data-hs-token={getDataHSToken(inlineModuleName, `groupCards[${index}].groupContent.richTextContentHTML`)}
                  />
                )}
              {effectiveShowButton && (
                  <ButtonWrapper className={swm('hs-elevate-service-card-container__button-wrapper')}>
                    <Button
                      buttonSize={buttonStyleSize}
                      buttonStyle={buttonStyleVariant}
                    href={getLinkFieldHref(effectiveLink)}
                    rel={getLinkFieldRel(effectiveLink as any)}
                    target={getLinkFieldTarget(effectiveLink as any)}
                      iconFieldPath={!useHubDBFeed ? `groupCards[${index}].groupButton.buttonContentIcon` : undefined}
                      showIcon={showIcon}
                      iconPosition={iconPosition}
                      additionalClassArray={['hs-elevate-service-card-container__button']}
                      moduleName={inlineModuleName}
                    textFieldPath={!useHubDBFeed && !isHubdbRowMode ? `groupCards[${index}].groupButton.buttonContentText` : undefined}
                    >
                    {effectiveButtonText}
                    </Button>
                  </ButtonWrapper>
                )}
              </CardContent>
            </Card>
          );
        })}
      </CardContainer>
    </>
  );
};

export default ServiceCardIsland;

