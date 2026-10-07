import type { ICookieStore } from '@/types/auth';
import type { IGetDisplayRange } from '@/types/common';

export const convertObjectToCookies = (obj: ICookieStore[]) => {
  return obj.map((item) => `${item.name}=${item.value}`).join('; ');
};

export const getImageSize = (
  url: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = (err) => {
      reject(new Error(`Failed to load image from URL: ${url}. Error: ${err}`));
    };
    img.src = url;
  });
};

export const getUnitFileName = (fileName: string): string => {
  const split = fileName.split('.');
  const extension = split.pop();

  return `${split.join('')}-${Date.now()}.${extension}`;
};

export const reloadImg = async (url: string) => {
  await fetch(url, { cache: 'reload', mode: 'no-cors' });
  document.body
    .querySelectorAll(`img[src='${url}']`)
    .forEach((img: Element) => {
      const imageElement = img as HTMLImageElement;
      imageElement.src = url;
    });
};

export const isImageUrl = (url: string) => {
  const imageRegex = /\.(jpeg|jpg|gif|png|svg|webp|bmp)$/i;

  return imageRegex.test(url);
};

export const base64ToFile = (base64String: string, fileName: string) => {
  const [header, base64Data] = base64String.split(',');

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  const mimeType = header.match(/:(.*?);/)?.[1];

  return new File([byteArray], fileName, { type: mimeType });
};

export const getDisplayRange = (
  props: IGetDisplayRange,
  t?: (key: string, values?: Record<string, number>) => string,
): string => {
  const { page = 1, total, itemsLength, take = 10 } = props;
  let start = 0;
  let end = 0;

  if (total > 0) {
    start = (page - 1) * take + 1;
    end = itemsLength < take ? total : page * take;
  }

  if (t) {
    return t('displayingRange', { start, end, total });
  }

  return `Displaying ${start} - ${end} out of ${total}`;
};
