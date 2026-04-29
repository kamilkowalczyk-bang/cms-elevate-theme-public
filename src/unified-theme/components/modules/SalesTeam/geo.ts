/**
 * Client-side geo helpers for SalesTeam featured rep auto-selection.
 * Maps ISO 3166-1 alpha-2 country codes to HubDB `sales_region` option names.
 */

export type SalesRegionOptionName = 'usa_canada' | 'dach_eastern_europe' | 'nordic_baltic' | 'rest_of_europe';

export const VALID_SALES_REGION_NAMES = new Set<string>([
  'usa_canada',
  'dach_eastern_europe',
  'nordic_baltic',
  'rest_of_europe',
]);

const CACHE_KEY = 'hsRadientumGeoRegion';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type GeoCachePayload = {
  region: string | null;
  ts: number;
};

/** ISO 3166-1 alpha-2 → HubDB sales_region option `name` */
const COUNTRY_TO_REGION: Record<string, SalesRegionOptionName> = {
  // usa_canada
  US: 'usa_canada',
  CA: 'usa_canada',
  // nordic_baltic
  FI: 'nordic_baltic',
  SE: 'nordic_baltic',
  NO: 'nordic_baltic',
  DK: 'nordic_baltic',
  IS: 'nordic_baltic',
  EE: 'nordic_baltic',
  LV: 'nordic_baltic',
  LT: 'nordic_baltic',
  // dach_eastern_europe
  DE: 'dach_eastern_europe',
  AT: 'dach_eastern_europe',
  CH: 'dach_eastern_europe',
  PL: 'dach_eastern_europe',
  CZ: 'dach_eastern_europe',
  SK: 'dach_eastern_europe',
  HU: 'dach_eastern_europe',
  RO: 'dach_eastern_europe',
  BG: 'dach_eastern_europe',
  SI: 'dach_eastern_europe',
  HR: 'dach_eastern_europe',
  RS: 'dach_eastern_europe',
  BA: 'dach_eastern_europe',
  MK: 'dach_eastern_europe',
  AL: 'dach_eastern_europe',
  ME: 'dach_eastern_europe',
  XK: 'dach_eastern_europe',
  MD: 'dach_eastern_europe',
  UA: 'dach_eastern_europe',
  BY: 'dach_eastern_europe',
  // rest_of_europe
  GB: 'rest_of_europe',
  IE: 'rest_of_europe',
  FR: 'rest_of_europe',
  IT: 'rest_of_europe',
  ES: 'rest_of_europe',
  PT: 'rest_of_europe',
  NL: 'rest_of_europe',
  BE: 'rest_of_europe',
  LU: 'rest_of_europe',
  MC: 'rest_of_europe',
  MT: 'rest_of_europe',
  GR: 'rest_of_europe',
  CY: 'rest_of_europe',
  AD: 'rest_of_europe',
  SM: 'rest_of_europe',
  VA: 'rest_of_europe',
  LI: 'rest_of_europe',
  FO: 'rest_of_europe',
  GI: 'rest_of_europe',
  IM: 'rest_of_europe',
  JE: 'rest_of_europe',
  GG: 'rest_of_europe',
};

/**
 * Map a two-letter country code to HubDB `sales_region` option name, or null if unmapped.
 */
export function countryToRegion(countryCode: unknown): string | null {
  if (typeof countryCode !== 'string' || countryCode.length !== 2) return null;
  const upper = countryCode.trim().toUpperCase();
  if (upper.length !== 2) return null;
  return COUNTRY_TO_REGION[upper] ?? null;
}

/**
 * Read `?region=<sales_region>` from the current URL. Returns a valid option name or null.
 */
export function getRegionFromUrl(): string | null {
  if (typeof window === 'undefined' || !window.location?.search) return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('region');
    if (!raw) return null;
    const normalized = raw.trim().toLowerCase();
    return VALID_SALES_REGION_NAMES.has(normalized) ? normalized : null;
  } catch {
    return null;
  }
}

function canUseSessionStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Read cached resolved region.
 * - `undefined`: no cache or expired → caller may run IP lookup.
 * - `null`: cache says geo ran with no applicable region → do not refetch for TTL.
 * - `string`: use this HubDB region name.
 */
export function readCachedRegion(): string | null | undefined {
  if (!canUseSessionStorage()) return undefined;
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (raw == null || raw === '') return undefined;
    const parsed = JSON.parse(raw) as GeoCachePayload;
    if (!parsed || typeof parsed.ts !== 'number') return undefined;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return undefined;
    if (parsed.region !== null && parsed.region !== undefined && !VALID_SALES_REGION_NAMES.has(parsed.region)) {
      return undefined;
    }
    return parsed.region ?? null;
  } catch {
    return undefined;
  }
}

/**
 * Persist geo result so we do not refetch on every navigation. Use `null` when IP resolved but country did not map.
 */
export function writeCachedRegion(region: string | null): void {
  if (!canUseSessionStorage()) return;
  try {
    const payload: GeoCachePayload = { region, ts: Date.now() };
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private mode
  }
}

export const GEO_IPAPI_URL = 'https://ipapi.co/json/';
