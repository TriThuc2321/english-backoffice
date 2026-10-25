import { Button, Modal } from '@heroui/react';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuPaperclip, LuUpload } from 'react-icons/lu';

import type { UploadMediaFormData } from '@/schemas/media';

import FilterSelect from '@/components/shared/FilterSelect';
import { MEDIA_CONTENT_TYPES, MEDIA_MAX_BYTES } from '@/constants/media';
import { useUploadMedia } from '@/hooks/apis/media';
import { useUploadMediaForm } from '@/hooks/forms';
import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';

// Uploads from the media page are shared library media, without an owner
const SCOPE = MediaScope.LIBRARY;

const DEFAULT_VALUES = {
  kind: MediaKind.AUDIO,
  file: undefined,
};

type UploadMediaModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const UploadMediaModal = ({ isOpen, onOpenChange }: UploadMediaModalProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: upload, isPending } = useUploadMedia();
  const {
    control,
    handleSubmit,
    reset,
    resetField,
    setValue,
    watch,
    formState: { errors },
  } = useUploadMediaForm({ defaultValues: DEFAULT_VALUES });

  const kind = watch('kind');
  const file = watch('file');
  const maxBytes = MEDIA_MAX_BYTES[SCOPE][kind];

  const close = (open: boolean) => {
    if (open) return onOpenChange(true);
    reset(DEFAULT_VALUES);
    onOpenChange(false);
  };

  const onSubmit = async (data: UploadMediaFormData) => {
    try {
      await upload({ ...data, scope: SCOPE });
      close(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={close}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <LuUpload className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{t('media.uploadTitle')}</Modal.Heading>
          </Modal.Header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="flex flex-col gap-4">
              <Controller
                name="kind"
                control={control}
                render={({ field }) => (
                  <FilterSelect
                    className="w-full"
                    label={t('media.field.kind')}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value as MediaKind);
                      resetField('file');
                    }}
                    options={Object.values(MediaKind).map((v) => ({
                      id: v,
                      label: t(`media.kind.${v}`),
                    }))}
                  />
                )}
              />

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  {t('media.field.file')}
                </span>
                <Button
                  variant="outline"
                  className="justify-start"
                  onPress={() => inputRef.current?.click()}
                >
                  <LuPaperclip className="size-4 shrink-0" />
                  <span className="truncate">
                    {file?.name ?? t('media.selectFile')}
                  </span>
                </Button>
                <input
                  ref={inputRef}
                  hidden
                  type="file"
                  accept={MEDIA_CONTENT_TYPES[kind].join(',')}
                  onChange={(e) => {
                    const picked = e.target.files?.[0];
                    if (picked) {
                      setValue('file', picked, { shouldValidate: true });
                    }
                    e.target.value = '';
                  }}
                />
                {maxBytes && (
                  <p className="text-muted text-xs">
                    {t('media.maxSize', {
                      size: maxBytes / 1024 / 1024,
                      types: MEDIA_CONTENT_TYPES[kind]
                        .map((type) => type.split('/')[1])
                        .join(', '),
                    })}
                  </p>
                )}
                {errors.file && (
                  <p className="text-danger text-xs">{errors.file.message}</p>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="tertiary">
                {t('common.cancel')}
              </Button>
              <Button type="submit" isPending={isPending}>
                {isPending ? t('media.uploading') : t('media.uploadButton')}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};

export default UploadMediaModal;
