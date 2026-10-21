import { describe, expect, it } from 'vitest';
import {
  constructImageUrl,
  createPlaceholderImage,
  validateImageFile,
} from '../utils/imageUtils';

const decode = (dataUrl) => decodeURIComponent(dataUrl.split(',')[1]);

describe('createPlaceholderImage', () => {
  it('handles any Unicode text', () => {
    expect(() => createPlaceholderImage('حذاء رياضي ✓')).not.toThrow();
    expect(decode(createPlaceholderImage('Café'))).toContain('Café');
  });

  it('escapes markup in the label', () => {
    const svg = decode(createPlaceholderImage('Tom & Jerry <3'));
    expect(svg).toContain('Tom &amp; Jerry &lt;3');
    expect(svg).not.toContain('<3');
  });

  it('uses the requested size', () => {
    expect(decode(createPlaceholderImage('x', 64, 32))).toContain('width="64" height="32"');
  });
});

describe('constructImageUrl', () => {
  const base = 'https://api.example.com';

  it('returns null without a path', () => {
    expect(constructImageUrl('')).toBeNull();
  });

  it('keeps absolute URLs', () => {
    expect(constructImageUrl('https://cdn.example.com/a.png', base)).toBe('https://cdn.example.com/a.png');
  });

  it.each([
    ['/uploads/products/a.png', `${base}/uploads/products/a.png`],
    ['uploads/products/a.png', `${base}/uploads/products/a.png`],
    ['a.png', `${base}/uploads/a.png`],
  ])('resolves %s', (path, expected) => {
    expect(constructImageUrl(path, base)).toBe(expected);
  });
});

describe('validateImageFile', () => {
  const file = (type, size = 1024) => ({ type, size });

  it('accepts common image types under 5 MB', () => {
    expect(validateImageFile(file('image/png')).isValid).toBe(true);
    expect(validateImageFile(file('image/webp')).isValid).toBe(true);
  });

  it('rejects other types, large files and missing files', () => {
    expect(validateImageFile(file('application/pdf')).isValid).toBe(false);
    expect(validateImageFile(file('image/png', 6 * 1024 * 1024)).isValid).toBe(false);
    expect(validateImageFile(null).isValid).toBe(false);
  });
});
