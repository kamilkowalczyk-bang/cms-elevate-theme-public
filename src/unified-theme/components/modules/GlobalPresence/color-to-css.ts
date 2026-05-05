import { ColorFieldType } from '@hubspot/cms-components/fields';

export function colorFieldToCss(colorField?: ColorFieldType['default'] | null): string {
  const color = colorField?.color?.trim();
  if (!color) return 'transparent';

  const opacityPercent = colorField?.opacity;
  if (opacityPercent == null || opacityPercent >= 100) return color;
  if (opacityPercent <= 0) return 'transparent';

  if (!color.startsWith('#')) return color;

  const hex = color.slice(1);
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
