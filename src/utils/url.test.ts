import { describe, expect, it } from 'vitest';

import UrlHelper from './url';

describe('UrlHelper.convertTitleToSlug', () => {
  it('strips Vietnamese diacritics and đ', () => {
    expect(UrlHelper.convertTitleToSlug('Đề thi Tiếng Anh đầu vào')).toBe(
      'de-thi-tieng-anh-dau-vao',
    );
  });

  it('removes punctuation and collapses spaces and hyphens', () => {
    expect(
      UrlHelper.convertTitleToSlug("  What's new? (Part 1) -- A&B  "),
    ).toBe('whats-new-part-1-ab');
  });

  it('returns an empty string for an empty title', () => {
    expect(UrlHelper.convertTitleToSlug('')).toBe('');
  });
});

describe('UrlHelper.convertUrlToId', () => {
  it('extracts the trailing UUID from a slug', () => {
    expect(
      UrlHelper.convertUrlToId('my-title-123e4567-e89b-12d3-a456-426614174000'),
    ).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('returns an empty string when the query is missing', () => {
    expect(UrlHelper.convertUrlToId()).toBe('');
  });
});
