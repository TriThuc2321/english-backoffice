import { Modal, cn } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuAudioLines } from 'react-icons/lu';

import type { Media } from '@/types/media';

import { MediaKind } from '@/types/test';
import { formatDuration, mediaFileName } from '@/utils/media';

type MediaPreviewProps = {
  media: Pick<Media, 'kind' | 'url' | 'storageKey' | 'durationMs'>;
  size?: 'thumb' | 'full';
  className?: string;
};

type ImagePreviewProps = {
  url: string;
  name: string;
  size: 'thumb' | 'full';
  className?: string;
};

// Click to open the image at full size in a popup
const ImagePreview = ({ url, name, size, className }: ImagePreviewProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={t('media.viewImage')}
        className="w-fit cursor-zoom-in"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={url}
          alt={name}
          loading="lazy"
          className={cn(
            'rounded-field border object-contain',
            size === 'thumb' ? 'size-12 object-cover' : 'max-h-40 w-fit',
            className,
          )}
        />
      </button>

      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container size="cover">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="truncate font-mono text-sm">
                {name}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex items-center justify-center">
              <img
                src={url}
                alt={name}
                className="h-[75vh] w-full object-contain"
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};

const MediaPreview = ({
  media,
  size = 'full',
  className,
}: MediaPreviewProps) => {
  if (media.kind === MediaKind.IMAGE) {
    return (
      <ImagePreview
        url={media.url}
        name={mediaFileName(media.storageKey)}
        size={size}
        className={className}
      />
    );
  }

  // A row of audio players is heavy, so the thumbnail is just an icon
  if (size === 'thumb') {
    return (
      <div
        className={cn(
          'bg-accent-soft text-accent-soft-foreground rounded-field flex size-12 flex-col items-center justify-center text-[10px]',
          className,
        )}
      >
        <LuAudioLines className="size-5" />
        {media.durationMs != null && formatDuration(media.durationMs)}
      </div>
    );
  }

  return (
    <audio
      controls
      preload="none"
      src={media.url}
      className={cn('w-full', className)}
    >
      <track kind="captions" />
    </audio>
  );
};

export default MediaPreview;
