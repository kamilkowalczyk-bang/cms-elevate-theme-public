import { describe, test, expect } from 'vitest';
import {
  normalizePageLang,
  pickLocalizedContactField,
} from './hubdb-contact-card-i18n.js';

describe('normalizePageLang', () => {
  test('returns en for empty or null', () => {
    expect(normalizePageLang(null)).toBe('en');
    expect(normalizePageLang(undefined)).toBe('en');
    expect(normalizePageLang('')).toBe('en');
  });

  test('strips region subtag from BCP 47 tag', () => {
    expect(normalizePageLang('fi-FI')).toBe('fi');
    expect(normalizePageLang('fr-CA')).toBe('fr');
  });

  test('lowercases and trims', () => {
    expect(normalizePageLang('  FI  ')).toBe('fi');
  });
});

describe('pickLocalizedContactField', () => {
  const rowWithBoth = {
    department: 'Sales',
    department_fi: 'Myynti',
    values: {
      department: 'Sales',
      department_fi: 'Myynti',
    },
  };

  test('prefers localized column when page language is fi', () => {
    expect(pickLocalizedContactField(rowWithBoth, 'department', 'fi')).toBe('Myynti');
  });

  test('falls back to EN base when localized cell is empty', () => {
    const rowEnOnly = { department: 'Sales', department_fi: '', values: { department: 'Sales', department_fi: '' } };
    expect(pickLocalizedContactField(rowEnOnly, 'department', 'fi')).toBe('Sales');
  });

  test('uses EN base for unknown language', () => {
    expect(pickLocalizedContactField(rowWithBoth, 'department', 'es')).toBe('Sales');
  });

  test('uses EN base for en page language', () => {
    expect(pickLocalizedContactField(rowWithBoth, 'department', 'en')).toBe('Sales');
  });
});
