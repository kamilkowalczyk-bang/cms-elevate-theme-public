/**
 * HubDB `MULTISELECT` / `SELECT` option shapes from HubL (`hubdb_table_column` → `options`)
 * and row cells (`service_categories` on each row).
 * @see https://developers.hubspot.com/docs/cms/start-building/features/storage/hubdb#getting-column-metadata
 * @see https://developers.hubspot.com/docs/api-reference/legacy/cms/hubdb/guide
 */

export type HubDbCategoryTab = { value: string; label: string };

/** Default category key expected in HubDB `service_categories` options. */
const DEFAULT_CATEGORY_VALUE = 'show_all_categories';

function readOptionString(o: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return undefined;
}

/** Normalized token used for filtering (must match `normalizeHubDbCategories` output on row cells). */
export function normalizeCategoryLabel(category: string): string {
  return category.trim().toLowerCase();
}

export function normalizeHubDbCategories(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          const o = item as Record<string, unknown>;
          const maybe =
            readOptionString(o, 'name', 'label', 'value') ??
            (o.id !== undefined && o.id !== null ? String(o.id) : undefined);
          return typeof maybe === 'string' ? maybe : [];
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
    const maybeItems = (value as { items?: unknown; values?: unknown }).items ?? (value as { values?: unknown }).values;
    return normalizeHubDbCategories(maybeItems);
  }

  return [];
}

type HubDbColumnOptionInput = {
  id?: unknown;
  name?: unknown;
  label?: unknown;
};

function parseHubDbCategoryColumnOptionsRaw(raw: unknown): HubDbColumnOptionInput[] {
  if (raw == null) return [];

  if (Array.isArray(raw)) {
    return raw.filter((x): x is HubDbColumnOptionInput => x != null && typeof x === 'object');
  }

  if (typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>).map(([idKey, opt]) => {
      if (opt && typeof opt === 'object') {
        return { ...(opt as HubDbColumnOptionInput), id: (opt as HubDbColumnOptionInput).id ?? idKey };
      }
      return { id: idKey };
    });
  }

  return [];
}

function filterKeyForColumnOption(opt: HubDbColumnOptionInput): string {
  const o = opt as Record<string, unknown>;
  const name = readOptionString(o, 'name');
  const label = readOptionString(o, 'label');
  const idStr = opt.id !== undefined && opt.id !== null ? String(opt.id).trim() : '';
  const raw = name ?? label ?? idStr;
  return raw ? normalizeCategoryLabel(raw) : '';
}

function displayLabelForColumnOption(opt: HubDbColumnOptionInput): string {
  const o = opt as Record<string, unknown>;
  const label = readOptionString(o, 'label');
  const name = readOptionString(o, 'name');
  const idStr = opt.id !== undefined && opt.id !== null ? String(opt.id).trim() : '';
  return label ?? name ?? idStr ?? '';
}

/** When column metadata is missing, derive tabs from values present on loaded rows (labels for display). */
function categoryTabsFromHubDbCards(hubdbCards: { serviceCategories?: unknown }[]): HubDbCategoryTab[] {
  const byKey = new Map<string, string>();

  for (const card of hubdbCards) {
    const raw = card.serviceCategories;
    if (!raw) continue;

    const visitItem = (item: unknown) => {
      if (typeof item === 'string') {
        const k = normalizeCategoryLabel(item);
        if (k) byKey.set(k, item.trim());
        return;
      }
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        const name = readOptionString(o, 'name');
        const label = readOptionString(o, 'label');
        const value = readOptionString(o, 'value');
        const idStr = o.id !== undefined && o.id !== null ? String(o.id).trim() : '';
        const keySource = name ?? label ?? value ?? idStr;
        const k = keySource ? normalizeCategoryLabel(keySource) : '';
        if (!k) return;
        const display = label ?? name ?? value ?? idStr ?? k;
        if (!byKey.has(k)) byKey.set(k, display);
      }
    };

    if (Array.isArray(raw)) {
      raw.forEach(visitItem);
    } else {
      normalizeHubDbCategories(raw).forEach((k) => {
        if (!byKey.has(k)) byKey.set(k, k);
      });
    }
  }

  return [...byKey.entries()]
    .sort((a, b) => a[1].localeCompare(b[1], undefined, { sensitivity: 'base' }))
    .map(([value, label]) => ({ value, label }));
}

/**
 * Builds pill tabs for HubDB feed mode from `service_categories` options,
 * falling back to union of categories on `hubdbCards` if metadata is empty.
 */
export function buildHubDbCategoryTabList(
  hubdbCategoryTabOptions: unknown,
  hubdbCards: { serviceCategories?: unknown }[],
): HubDbCategoryTab[] {
  const parsed = parseHubDbCategoryColumnOptionsRaw(hubdbCategoryTabOptions);
  const fromColumn: HubDbCategoryTab[] = [];
  const seen = new Set<string>();

  for (const opt of parsed) {
    const value = filterKeyForColumnOption(opt);
    if (!value || seen.has(value)) continue;
    const label = displayLabelForColumnOption(opt) || value;
    seen.add(value);
    fromColumn.push({ value, label });
  }

  return fromColumn.length > 0 ? fromColumn : categoryTabsFromHubDbCards(hubdbCards);
}

export function resolveActiveServiceCategory(
  preferred: string | undefined,
  tabs: HubDbCategoryTab[],
): string {
  const valid = new Set(tabs.map((t) => t.value));
  const raw = (preferred ?? '').trim();
  const p = raw === '' ? DEFAULT_CATEGORY_VALUE : raw;
  if (valid.has(p)) return p;
  const np = normalizeCategoryLabel(p);
  if (valid.has(np)) return np;
  if (valid.has(DEFAULT_CATEGORY_VALUE)) return DEFAULT_CATEGORY_VALUE;
  return tabs[0]?.value ?? DEFAULT_CATEGORY_VALUE;
}
