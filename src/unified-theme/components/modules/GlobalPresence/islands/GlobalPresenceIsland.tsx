import { useEffect, useMemo, useRef, useState } from 'react';
import { feature } from 'topojson-client';
import type { FeatureCollection, Feature, GeoJsonProperties, Geometry } from 'geojson';
import { drag } from 'd3-drag';
import { geoGraticule, geoOrthographic, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { timer } from 'd3-timer';
import countries110m from '../assets/countries-110m.json';
import numericToAlpha2 from '../assets/numeric-to-alpha2.json';
import { COUNTRY_CHOICES } from '../assets/country-codes.js';
import { GlobalPresenceProps } from '../types.js';
import styles from '../global-presence.module.css';
import cx, { staticWithModule } from '../../../utils/classnames.js';
import { createComponent } from '../../../utils/create-component.js';
import { colorFieldToCss } from '../color-to-css.js';

const swm = staticWithModule(styles);

const NUMERIC_TO_ALPHA2 = numericToAlpha2 as Record<string, string>;

const GlobeWrap = createComponent('div');
const GlobeInner = createComponent('div');
const HoverTooltip = createComponent('div');

type SphereDatum = { type: 'Sphere' };

const sphere: SphereDatum = { type: 'Sphere' };

function useLandFeatures(): FeatureCollection<Geometry, GeoJsonProperties> {
  return useMemo(() => {
    const topo = countries110m as unknown as Parameters<typeof feature>[0];
    return feature(topo, topo.objects.countries as never) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;
  }, []);
}

function featureIdToAlpha2(id: string | number | undefined): string | undefined {
  if (id === undefined || id === null) return undefined;
  const raw = String(id);
  const normalized = String(Number.parseInt(raw, 10));
  return NUMERIC_TO_ALPHA2[raw] ?? NUMERIC_TO_ALPHA2[normalized];
}

export default function GlobalPresenceIsland(props: GlobalPresenceProps) {
  const countriesFromNestedGroup = props.groupGlobe.groupHighlightedCountries?.highlightedCountries ?? [];
  const countriesFromLegacyField = (props.groupGlobe as { highlightedCountries?: string[] }).highlightedCountries ?? [];
  const highlightedCountries = countriesFromNestedGroup.length > 0 ? countriesFromNestedGroup : countriesFromLegacyField;

  const {
    groupGlobe: {
      highlightColor,
      baseCountryColor,
      oceanColor,
      manualRotation,
      autoRotationSpeed,
      height,
    },
  } = props;

  const land = useLandFeatures();
  const highlightSet = useMemo(() => new Set(highlightedCountries ?? []), [highlightedCountries]);

  const nameByCode = useMemo(() => new Map(COUNTRY_CHOICES), []);
  const highlightedRows = useMemo(
    () => (highlightedCountries ?? []).map(code => ({ code, name: nameByCode.get(code) ?? code })),
    [highlightedCountries, nameByCode]
  );

  const oceanFill = colorFieldToCss(oceanColor);
  const baseFill = colorFieldToCss(baseCountryColor);
  const highlightFill = colorFieldToCss(highlightColor);

  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const projectionRef = useRef<ReturnType<typeof geoOrthographic> | null>(null);
  const isDraggingRef = useRef(false);
  const prevElapsedRef = useRef<number | null>(null);

  const [size, setSize] = useState({ width: 640, height: 400 });
  const [rotation, setRotation] = useState<[number, number, number]>([-12, -35, 0]);
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; x: number; y: number } | null>(null);

  const width = Math.max(1, size.width);
  const heightPx = Math.max(1, size.height);

  const projection = useMemo(() => {
    const pad = 16;
    return geoOrthographic()
      .fitExtent(
        [
          [pad, pad],
          [width - pad, heightPx - pad],
        ],
        sphere
      )
      .rotate(rotation);
  }, [width, heightPx, rotation]);

  projectionRef.current = projection;

  const pathGen = useMemo(() => geoPath(projection), [projection]);
  const graticule = useMemo(() => geoGraticule()(), []);

  const spherePath = pathGen(sphere) ?? '';
  const graticulePath = pathGen(graticule) ?? '';

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w > 0 && h > 0) setSize({ width: w, height: h });
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  useEffect(() => {
    if (!manualRotation) return;
    const svg = svgRef.current;
    if (!svg) return;

    const dragBehavior = drag<SVGSVGElement, unknown>()
      .on('start', () => {
        isDraggingRef.current = true;
      })
      .on('drag', event => {
        const scale = projectionRef.current?.scale() ?? 200;
        const k = 75 / scale;
        setRotation(([lon, lat, roll]) => [lon + event.dx * k, lat - event.dy * k, roll]);
      })
      .on('end', () => {
        isDraggingRef.current = false;
      });

    select(svg).call(dragBehavior);

    return () => {
      select(svg).on('.drag', null);
    };
  }, [manualRotation, width, heightPx]);

  useEffect(() => {
    const speed = autoRotationSpeed ?? 0;
    if (speed <= 0) return;

    prevElapsedRef.current = null;
    const t = timer(elapsed => {
      if (isDraggingRef.current) return;
      const prev = prevElapsedRef.current;
      prevElapsedRef.current = elapsed;
      if (prev === null) return;
      const dt = (elapsed - prev) / 1000;
      setRotation(([lon, lat, roll]) => [lon + speed * dt, lat, roll]);
    });

    return () => {
      t.stop();
    };
  }, [autoRotationSpeed]);

  const ariaLabel =
    "Interactive globe highlighting Radientum's countries of operation. Drag to rotate the globe.";

  return (
    <GlobeWrap className={swm('hs-elevate-global-presence__globe-wrap')}>
      <GlobeInner ref={wrapRef} className={swm('hs-elevate-global-presence__globe-inner')}>
        <ul className={swm('hs-elevate-global-presence__visually-hidden')}>
          {highlightedRows.map(({ code, name }) => (
            <li key={code}>
              {name}
            </li>
          ))}
        </ul>
        <svg
          ref={svgRef}
          className={cx(swm('hs-elevate-global-presence__svg'), !manualRotation && swm('hs-elevate-global-presence__svg--no-drag'))}
          width={width}
          height={heightPx}
          viewBox={`0 0 ${width} ${heightPx}`}
          role="img"
          aria-label={ariaLabel}
          tabIndex={0}
        >
          <path d={spherePath} fill={oceanFill} stroke="rgba(0,0,0,0.08)" strokeWidth={0.5} />
          <path d={graticulePath} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={0.5} />
          {land.features.map((f: Feature<Geometry, GeoJsonProperties>, i: number) => {
            const alpha2 = featureIdToAlpha2(f.id as string | number | undefined);
            const isHi = Boolean(alpha2 && highlightSet.has(alpha2));
            const d = pathGen(f) ?? '';
            const key = String(f.id ?? i);
            const countryName = f.properties?.name || (alpha2 ? nameByCode.get(alpha2) : undefined) || key;
            return (
              <path
                key={key}
                className={swm('hs-elevate-global-presence__land')}
                d={d}
                fill={isHi ? highlightFill : baseFill}
                onMouseMove={event => {
                  const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (!rect) return;
                  setHoveredCountry({
                    name: countryName,
                    x: event.clientX - rect.left + 12,
                    y: event.clientY - rect.top - 12,
                  });
                }}
                onMouseLeave={() => setHoveredCountry(null)}
              />
            );
          })}
        </svg>
        {hoveredCountry && (
          <HoverTooltip
            className={swm('hs-elevate-global-presence__tooltip')}
            style={{ left: `${hoveredCountry.x}px`, top: `${hoveredCountry.y}px` }}
            aria-hidden="true"
          >
            {hoveredCountry.name}
          </HoverTooltip>
        )}
      </GlobeInner>
    </GlobeWrap>
  );
}
