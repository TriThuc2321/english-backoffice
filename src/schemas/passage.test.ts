import { describe, expect, it } from 'vitest';

import { MarkedBy } from '@/types/common';
import { PassageStatus } from '@/types/passage';

import { VALIDATION_MESSAGE } from './message';
import { createEditPassageSchema } from './passage';

const base = {
  title: 'The Nile',
  subtitle: '',
  markedBy: MarkedBy.ALPHABET,
  paragraphs: [{ content: 'First paragraph' }],
};

describe('createEditPassageSchema', () => {
  it('accepts a minimal passage', async () => {
    await expect(createEditPassageSchema.isValid(base)).resolves.toBe(true);
  });

  it('accepts a passage without paragraphs', async () => {
    await expect(
      createEditPassageSchema.isValid({ ...base, paragraphs: [] }),
    ).resolves.toBe(true);
  });

  it('requires a title', async () => {
    await expect(
      createEditPassageSchema.validate({ ...base, title: '' }),
    ).rejects.toThrow(VALIDATION_MESSAGE.REQUIRED);
  });

  it('requires subtitle to be defined', async () => {
    await expect(
      createEditPassageSchema.isValid({ ...base, subtitle: undefined }),
    ).resolves.toBe(false);
  });

  it('defaults markedBy to NONE', async () => {
    const value = await createEditPassageSchema.validate({
      ...base,
      markedBy: undefined,
    });

    expect(value.markedBy).toBe(MarkedBy.NONE);
  });

  it('rejects an unknown markedBy', async () => {
    await expect(
      createEditPassageSchema.isValid({ ...base, markedBy: 'ROMAN' }),
    ).resolves.toBe(false);
  });

  it.each([PassageStatus.PUBLISHED, PassageStatus.DRAFT])(
    'accepts status %s',
    async (status) => {
      await expect(
        createEditPassageSchema.isValid({ ...base, status }),
      ).resolves.toBe(true);
    },
  );

  it('rejects the DELETED status', async () => {
    await expect(
      createEditPassageSchema.isValid({
        ...base,
        status: PassageStatus.DELETED,
      }),
    ).resolves.toBe(false);
  });

  it('rejects a paragraph without content', async () => {
    await expect(
      createEditPassageSchema.validate({
        ...base,
        paragraphs: [{ content: 'ok' }, { content: '' }],
      }),
    ).rejects.toThrow(VALIDATION_MESSAGE.REQUIRED);
  });
});
