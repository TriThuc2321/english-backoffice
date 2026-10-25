import { Button, Label, ListBox, Select } from '@heroui/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LuUpload, LuX } from 'react-icons/lu';

import type { Media } from '@/types/media';

import { useCan } from '@/configs/casl/can.config';
import { MEDIA_CONTENT_TYPES } from '@/constants/media';
import {
  useGetMediaById,
  useGetMediaList,
  useUploadMedia,
} from '@/hooks/apis/media';
import { PermissionAction, SubjectName } from '@/types/auth';
import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';

const NO_MEDIA = '__none__';

const formatDuration = (ms: number) => {
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

const mediaLabel = (media: Media) => {
  const name = media.storageKey.split('/').pop() ?? media.storageKey;
  const duration =
    media.durationMs != null ? ` · ${formatDuration(media.durationMs)}` : '';
  return `#${media.id} · ${name}${duration}`;
};

type MediaPickerProps = {
  testId: number;
  kind: MediaKind;
  label: string;
  value: number | undefined | null;
  onChange: (value: number | undefined) => void;
  error?: string;
  isDisabled?: boolean;
  className?: string;
};

const MediaPicker = ({
  testId,
  kind,
  label,
  value,
  onChange,
  error,
  isDisabled,
  className,
}: MediaPickerProps) => {
  const { t } = useTranslation();
  const ability = useCan();
  const inputRef = useRef<HTMLInputElement>(null);
  const owner = { scope: MediaScope.TEST, ownerId: String(testId) };
  const { data } = useGetMediaList({ ...owner, kind, take: 100 });
  const { data: selected } = useGetMediaById(value ?? undefined);
  const { mutateAsync: upload, isPending: isUploading } = useUploadMedia();

  const list = data?.data ?? [];
  // The selected file may sit beyond the first page of the list
  const options =
    selected && !list.some((m) => m.id === selected.id)
      ? [selected, ...list]
      : list;
  const canUpload =
    !isDisabled && ability.can(PermissionAction.Create, SubjectName.Media);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const media = await upload({ ...owner, kind, file });
      onChange(media.id);
    } catch (err) {
      console.error(err);
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <div className="flex items-end gap-2">
        <Select
          fullWidth
          isDisabled={isDisabled}
          isInvalid={!!error}
          placeholder={t('tests.editor.media.select')}
          selectedKey={value != null ? String(value) : NO_MEDIA}
          onSelectionChange={(key) =>
            onChange(key == null || key === NO_MEDIA ? undefined : Number(key))
          }
        >
          <Label>{label}</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {[
                { id: NO_MEDIA, label: t('tests.editor.media.none') },
                ...options.map((m) => ({
                  id: String(m.id),
                  label: mediaLabel(m),
                })),
              ].map((option) => (
                <ListBox.Item
                  key={option.id}
                  id={option.id}
                  textValue={option.label}
                >
                  {option.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        {!isDisabled && value != null && (
          <Button
            isIconOnly
            variant="ghost"
            aria-label={t('tests.editor.media.clear')}
            onPress={() => onChange(undefined)}
          >
            <LuX className="size-4" />
          </Button>
        )}
        {canUpload && (
          <>
            <Button
              variant="outline"
              isPending={isUploading}
              onPress={() => inputRef.current?.click()}
            >
              <LuUpload className="size-4" />
              {isUploading
                ? t('tests.editor.media.uploading')
                : t('tests.editor.media.upload')}
            </Button>
            <input
              ref={inputRef}
              hidden
              type="file"
              accept={MEDIA_CONTENT_TYPES[kind].join(',')}
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </>
        )}
      </div>

      {error && <p className="text-danger text-xs">{error}</p>}

      {selected &&
        selected.id === value &&
        (kind === MediaKind.AUDIO ? (
          <audio controls preload="none" src={selected.url} className="w-full">
            <track kind="captions" />
          </audio>
        ) : (
          <img
            src={selected.url}
            alt={mediaLabel(selected)}
            className="rounded-field max-h-40 w-fit border object-contain"
          />
        ))}
    </div>
  );
};

export default MediaPicker;
