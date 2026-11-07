import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  base64ToFile,
  formatPersonName,
  getDisplayRange,
  getUnitFileName,
  isImageUrl,
} from './common';

describe('getDisplayRange', () => {
  it('shows a full page range', () => {
    expect(
      getDisplayRange({ page: 2, take: 10, total: 35, itemsLength: 10 }),
    ).toBe('Displaying 11 - 20 out of 35');
  });

  it('ends at the total on the last, partial page', () => {
    expect(
      getDisplayRange({ page: 4, take: 10, total: 35, itemsLength: 5 }),
    ).toBe('Displaying 31 - 35 out of 35');
  });

  it('shows 0 - 0 when there are no items', () => {
    expect(getDisplayRange({ total: 0, itemsLength: 0 })).toBe(
      'Displaying 0 - 0 out of 0',
    );
  });

  it('passes the range to the translate function', () => {
    const t = vi.fn((key: string) => key);

    getDisplayRange({ page: 1, take: 10, total: 3, itemsLength: 3 }, t);

    expect(t).toHaveBeenCalledWith('displayingRange', {
      start: 1,
      end: 3,
      total: 3,
    });
  });
});

describe('isImageUrl', () => {
  it.each(['a.png', 'a.JPG', 'path/to/b.webp', 'c.svg'])(
    'accepts %s',
    (url) => {
      expect(isImageUrl(url)).toBe(true);
    },
  );

  it.each(['a.mp3', 'a.png?x=1', 'image'])('rejects %s', (url) => {
    expect(isImageUrl(url)).toBe(false);
  });
});

describe('getUnitFileName', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('appends a timestamp before the extension', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1700000000000);

    expect(getUnitFileName('avatar.png')).toBe('avatar-1700000000000.png');
  });
});

describe('base64ToFile', () => {
  it('decodes the payload and keeps the mime type', async () => {
    const file = base64ToFile('data:text/plain;base64,aGVsbG8=', 'hello.txt');

    expect(file.name).toBe('hello.txt');
    expect(file.type).toBe('text/plain');
    expect(await file.text()).toBe('hello');
  });
});

describe('formatPersonName', () => {
  const base = {
    id: 'u1',
    email: 'lan@x.com',
    firstName: null,
    lastName: null,
  };

  it('joins first and last name', () => {
    expect(
      formatPersonName({ ...base, firstName: 'Lan', lastName: 'Pham' }),
    ).toBe('Lan Pham');
  });

  it('falls back to the email, then the id', () => {
    expect(formatPersonName({ ...base, firstName: ' ' })).toBe('lan@x.com');
    expect(formatPersonName({ ...base, email: null })).toBe('u1');
  });
});
