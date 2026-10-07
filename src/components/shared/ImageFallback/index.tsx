import { useState, type ImgHTMLAttributes } from 'react';

const FALLBACK_DATA_URI =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="#e5e7eb" width="32" height="32"/><circle cx="16" cy="12" r="5" fill="#9ca3af"/><path fill="#9ca3af" d="M8 26c2-5 14-5 16 0H8z"/></svg>',
  );

type ImageFallbackProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'width' | 'height'
> & {
  width?: number;
  height?: number;
};

export default function ImageFallback({
  src,
  width = 32,
  height = 32,
  className,
  alt,
  loading,
  referrerPolicy,
  ...rest
}: ImageFallbackProps) {
  const [failed, setFailed] = useState(false);

  const raw = typeof src === 'string' ? src.trim() : '';
  const effectiveSrc = !raw
    ? FALLBACK_DATA_URI
    : failed
      ? FALLBACK_DATA_URI
      : raw;

  return (
    <img
      {...rest}
      alt={alt ?? ''}
      className={className}
      height={height}
      loading={loading}
      referrerPolicy={referrerPolicy}
      src={effectiveSrc}
      width={width}
      onError={() => setFailed(true)}
    />
  );
}
