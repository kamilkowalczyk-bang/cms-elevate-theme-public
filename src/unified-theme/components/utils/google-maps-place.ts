export type GoogleMapsUrlKind = 'embed' | 'place' | 'search' | 'shortlink' | 'generic' | 'unknown';

export type ParsedGoogleMapsUrl = {
  kind: GoogleMapsUrlKind;
  embedUrl?: string;
  placeName?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  placeId?: string;
  query?: string;
  canonicalUrl?: string;
};

export type ResolveOfficeMapUrlsInput = {
  hubMapsUrl?: string;
  hubEmbedUrl?: string;
  hubPlaceId?: string;
  configuredMapsHref?: string;
  officeName?: string;
  placeQueryFromAddress?: string;
  mapLocationPlaceQuery?: string;
  lat?: number;
  lng?: number;
  zoom: number;
  useHubDB: boolean;
};

export type ResolvedOfficeMapUrls = {
  embedUrl?: string;
  mapHref?: string;
};

function clampZoom(zoom: number): number {
  return Math.min(21, Math.max(1, Math.round(zoom)));
}

function toCoordinate(value: string): number | undefined {
  const n = parseFloat(value.replace(',', '.').trim());
  return Number.isFinite(n) ? n : undefined;
}

function isGenericGoogleMapsUrl(urlString: string | undefined): boolean {
  if (!urlString) return false;
  const normalized = urlString.trim().replace(/\/+$/, '');
  return normalized === 'https://www.google.com/maps' || normalized === 'https://maps.google.com';
}

function isGoogleMapsShortLink(urlString: string): boolean {
  try {
    const host = new URL(urlString).hostname.toLowerCase();
    return host === 'maps.app.goo.gl' || host === 'goo.gl' || host === 'g.co';
  } catch {
    return false;
  }
}

function extractPlaceIdFromDataParam(dataParam: string): string | undefined {
  const chijMatch = dataParam.match(/!1s(ChIJ[\w-]+)/i);
  if (chijMatch?.[1]) return chijMatch[1];

  const hexMatch = dataParam.match(/!1s(0x[a-f0-9]+(?::0x[a-f0-9]+)?)/i);
  if (hexMatch?.[1]) return decodeURIComponent(hexMatch[1]);

  return undefined;
}

function extractPlaceIdFromEmbedPb(pb: string): string | undefined {
  const decoded = decodeURIComponent(pb);
  return extractPlaceIdFromDataParam(decoded) ?? extractPlaceIdFromDataParam(`!${decoded}`);
}

export function parseGoogleMapsUrl(urlString: string | undefined): ParsedGoogleMapsUrl | undefined {
  if (!urlString?.trim()) return undefined;

  const trimmed = urlString.trim();

  if (isGenericGoogleMapsUrl(trimmed)) {
    return { kind: 'generic', canonicalUrl: trimmed };
  }

  if (isGoogleMapsShortLink(trimmed)) {
    return { kind: 'shortlink', canonicalUrl: trimmed };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { kind: 'unknown', canonicalUrl: trimmed };
  }

  const pathname = parsed.pathname;

  if (pathname.includes('/maps/embed')) {
    const pb = parsed.searchParams.get('pb');
    if (pb) {
      return {
        kind: 'embed',
        embedUrl: trimmed,
        placeId: extractPlaceIdFromEmbedPb(pb),
        canonicalUrl: trimmed,
      };
    }
  }

  if (pathname.includes('/maps/place/')) {
    const placePathMatch = pathname.match(/\/maps\/place\/([^/]+)/);
    const placeName = placePathMatch?.[1]
      ? decodeURIComponent(placePathMatch[1].replace(/\+/g, ' '))
      : undefined;

    const atMatch = trimmed.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?)z/i);
    const lat = atMatch?.[1] ? toCoordinate(atMatch[1]) : undefined;
    const lng = atMatch?.[2] ? toCoordinate(atMatch[2]) : undefined;
    const zoom = atMatch?.[3] ? clampZoom(parseFloat(atMatch[3])) : undefined;

    const dataIdx = trimmed.indexOf('/data=');
    const dataParam = dataIdx >= 0 ? trimmed.slice(dataIdx + 6).split('?')[0] : '';
    const placeId = extractPlaceIdFromDataParam(dataParam);

    return {
      kind: 'place',
      placeName,
      lat,
      lng,
      zoom,
      placeId,
      canonicalUrl: trimmed.split('?')[0],
    };
  }

  const searchQuery = parsed.searchParams.get('query') ?? parsed.searchParams.get('q');
  if (pathname.includes('/maps/search') || searchQuery) {
    if (searchQuery?.trim()) {
      return { kind: 'search', query: searchQuery.trim(), canonicalUrl: trimmed };
    }
  }

  if (parsed.hostname.includes('google') && parsed.hostname.includes('map')) {
    return { kind: 'unknown', canonicalUrl: trimmed };
  }

  return { kind: 'unknown', canonicalUrl: trimmed };
}

function extractPlaceQueryFromUrl(urlString: string | undefined): string | undefined {
  const parsed = parseGoogleMapsUrl(urlString);
  if (parsed?.kind === 'search' && parsed.query) return parsed.query;
  return undefined;
}

function buildGoogleMapsEmbedUrl(lat: number, lng: number, zoom: number): string {
  const z = clampZoom(zoom);
  return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=${z}&hl=en&output=embed`;
}

function buildGoogleMapsSearchUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

function buildGoogleMapsEmbedUrlFromPlaceQuery(placeQuery: string, zoom: number): string {
  const z = clampZoom(zoom);
  return `https://maps.google.com/maps?q=${encodeURIComponent(placeQuery)}&z=${z}&hl=en&output=embed`;
}

function buildGoogleMapsSearchUrlFromQuery(placeQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeQuery)}`;
}

function buildGoogleMapsEmbedUrlFromPlaceId(placeId: string, zoom: number): string {
  const z = clampZoom(zoom);
  return `https://maps.google.com/maps?q=${encodeURIComponent(`place_id:${placeId}`)}&z=${z}&hl=en&output=embed`;
}

function buildGoogleMapsEmbedUrlFromPlace(
  placeName: string | undefined,
  lat: number | undefined,
  lng: number | undefined,
  zoom: number,
  placeId?: string,
): string | undefined {
  if (placeId) {
    return buildGoogleMapsEmbedUrlFromPlaceId(placeId, zoom);
  }

  if (placeName && lat !== undefined && lng !== undefined) {
    const z = clampZoom(zoom);
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&ll=${lat},${lng}&z=${z}&hl=en&output=embed`;
  }

  if (placeName) {
    return buildGoogleMapsEmbedUrlFromPlaceQuery(placeName, zoom);
  }

  if (lat !== undefined && lng !== undefined) {
    return buildGoogleMapsEmbedUrl(lat, lng, zoom);
  }

  return undefined;
}

function isValidEmbedUrl(url: string | undefined): boolean {
  if (!url?.trim()) return false;
  const parsed = parseGoogleMapsUrl(url);
  return parsed?.kind === 'embed' && Boolean(parsed.embedUrl);
}

function resolveEmbedFromParsed(parsed: ParsedGoogleMapsUrl | undefined, zoom: number): string | undefined {
  if (!parsed) return undefined;

  if (parsed.kind === 'embed' && parsed.embedUrl) {
    return parsed.embedUrl;
  }

  if (parsed.kind === 'place') {
    return buildGoogleMapsEmbedUrlFromPlace(parsed.placeName, parsed.lat, parsed.lng, parsed.zoom ?? zoom, parsed.placeId);
  }

  if (parsed.kind === 'search' && parsed.query) {
    return buildGoogleMapsEmbedUrlFromPlaceQuery(parsed.query, zoom);
  }

  return undefined;
}

export function resolveOfficeMapUrls(input: ResolveOfficeMapUrlsInput): ResolvedOfficeMapUrls {
  const {
    hubMapsUrl,
    hubEmbedUrl,
    hubPlaceId,
    configuredMapsHref,
    officeName,
    placeQueryFromAddress,
    mapLocationPlaceQuery,
    lat,
    lng,
    zoom,
    useHubDB,
  } = input;

  const hasCoords = lat !== undefined && lng !== undefined;
  const parsedHub = parseGoogleMapsUrl(hubMapsUrl);
  const parsedConfigured = parseGoogleMapsUrl(configuredMapsHref);

  let embedUrl: string | undefined;

  if (isValidEmbedUrl(hubEmbedUrl)) {
    embedUrl = hubEmbedUrl;
  }

  if (!embedUrl) {
    embedUrl = resolveEmbedFromParsed(parsedHub, zoom);
  }

  if (!embedUrl) {
    embedUrl = resolveEmbedFromParsed(parsedConfigured, zoom);
  }

  if (!embedUrl && hubPlaceId) {
    embedUrl = buildGoogleMapsEmbedUrlFromPlaceId(hubPlaceId, zoom);
  }

  if (!embedUrl) {
    const extractedHubQuery = extractPlaceQueryFromUrl(hubMapsUrl);
    const extractedConfiguredQuery = extractPlaceQueryFromUrl(configuredMapsHref);
    const placeQuery = useHubDB
      ? (extractedHubQuery ?? placeQueryFromAddress ?? mapLocationPlaceQuery ?? extractedConfiguredQuery ?? officeName)
      : (placeQueryFromAddress || mapLocationPlaceQuery || extractedHubQuery || extractedConfiguredQuery || officeName);

    if (placeQuery) {
      embedUrl = buildGoogleMapsEmbedUrlFromPlaceQuery(placeQuery, zoom);
    } else if (hasCoords) {
      embedUrl = buildGoogleMapsEmbedUrl(lat, lng, zoom);
    }
  }

  let mapHref: string | undefined;

  if (parsedHub?.kind === 'place' && parsedHub.canonicalUrl) {
    mapHref = hubMapsUrl;
  } else if (parsedHub?.kind === 'shortlink' && parsedHub.canonicalUrl) {
    mapHref = parsedHub.canonicalUrl;
  } else if (hubMapsUrl) {
    mapHref = hubMapsUrl;
  } else if (configuredMapsHref && !isGenericGoogleMapsUrl(configuredMapsHref)) {
    mapHref = configuredMapsHref;
  } else {
    const extractedHubQuery = extractPlaceQueryFromUrl(hubMapsUrl);
    const extractedConfiguredQuery = extractPlaceQueryFromUrl(configuredMapsHref);
    const placeQuery = useHubDB
      ? (extractedHubQuery ?? placeQueryFromAddress ?? mapLocationPlaceQuery ?? extractedConfiguredQuery ?? officeName)
      : (placeQueryFromAddress || mapLocationPlaceQuery || extractedHubQuery || extractedConfiguredQuery || officeName);

    if (placeQuery) {
      mapHref = buildGoogleMapsSearchUrlFromQuery(placeQuery);
    } else if (hasCoords) {
      mapHref = buildGoogleMapsSearchUrl(lat, lng);
    }
  }

  return { embedUrl, mapHref };
}

export function isGenericGoogleMapsLink(urlString: string | undefined): boolean {
  return isGenericGoogleMapsUrl(urlString);
}
