/**
 * Localized contact_cards columns (region, department, button_text, button_link, meeting_embed_url + *_fi/_fr/_de).
 * EN uses base columns; matches ServiceCard / hubdb-services suffix pattern.
 */

export const CONTACT_CARD_LOCALIZED_LANGS = ['fi', 'fr', 'de'] as const;
export type ContactCardLocalizedLang = (typeof CONTACT_CARD_LOCALIZED_LANGS)[number];

export const CONTACT_CARD_LOCALIZED_FIELD_BASES = [
  'region',
  'department',
  'button_text',
  'button_link',
  'meeting_embed_url',
] as const;
export type ContactCardLocalizedFieldBase = (typeof CONTACT_CARD_LOCALIZED_FIELD_BASES)[number];

/** HubDbRowField columnsToFetch entries for FI/FR/DE label siblings. */
export const CONTACT_CARD_LOCALIZED_COLUMNS_TO_FETCH = CONTACT_CARD_LOCALIZED_LANGS.flatMap((lang) =>
  CONTACT_CARD_LOCALIZED_FIELD_BASES.map((base) => `${base}_${lang}`),
);

function getHubDbValuesObject(row: unknown): Record<string, unknown> | undefined {
  if (!row || typeof row !== 'object') return undefined;

  const candidateValues = [
    (row as Record<string, unknown>).values,
    (row as Record<string, unknown>).row,
    (row as Record<string, unknown>).selectedRow,
  ];

  for (const candidate of candidateValues) {
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      if ('values' in candidate && (candidate as Record<string, unknown>).values) {
        const nested = (candidate as Record<string, unknown>).values;
        if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
          return nested as Record<string, unknown>;
        }
      }
    }
  }

  if ((row as Record<string, unknown>).values && typeof (row as Record<string, unknown>).values === 'object') {
    return (row as Record<string, unknown>).values as Record<string, unknown>;
  }

  return undefined;
}

function getHubDbRowValue(row: unknown, key: string): unknown {
  if (!row || typeof row !== 'object') return undefined;
  const rowObject = row as Record<string, unknown>;
  const values = getHubDbValuesObject(row);

  if (rowObject[key] !== undefined) return rowObject[key];
  if (values && Object.prototype.hasOwnProperty.call(values, key)) {
    return values[key];
  }
  if (values) {
    const loweredKey = key.toLowerCase();
    for (const valuesKey of Object.keys(values)) {
      if (valuesKey.toLowerCase() === loweredKey) {
        return values[valuesKey];
      }
    }
  }

  return undefined;
}

function coerceHubDbString(raw: unknown): string | undefined {
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    return trimmed || undefined;
  }

  if (raw && typeof raw === 'object') {
    const record = raw as Record<string, unknown>;
    const nested = record.href ?? record.url ?? record.value ?? record.label;
    if (typeof nested === 'string') {
      const trimmed = nested.trim();
      return trimmed || undefined;
    }
  }

  return undefined;
}

/** Normalize HubSpot content.language.languageTag (or hublData pageLang) to a short slug. */
export function normalizePageLang(tag: unknown): string {
  if (tag == null) return 'en';
  const first = String(tag).toLowerCase().trim().split('-')[0];
  return first || 'en';
}

export function isLocalizedContactLang(pageLang: string): pageLang is ContactCardLocalizedLang {
  return (CONTACT_CARD_LOCALIZED_LANGS as readonly string[]).includes(pageLang);
}

/**
 * Pick a localized contact_cards text field: `field_fi` etc. when pageLang is fi/fr/de and non-empty,
 * otherwise fall back to the EN base column (`field`).
 */
export function pickLocalizedContactField(
  row: unknown,
  baseKey: ContactCardLocalizedFieldBase,
  pageLang: unknown,
): string | undefined {
  const lang = normalizePageLang(pageLang);

  if (isLocalizedContactLang(lang)) {
    const localizedKey = `${baseKey}_${lang}`;
    const localized = coerceHubDbString(getHubDbRowValue(row, localizedKey));
    if (localized) return localized;
  }

  return coerceHubDbString(getHubDbRowValue(row, baseKey));
}
