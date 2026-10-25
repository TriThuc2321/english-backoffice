import { Avatar, Button } from '@heroui/react';
import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LuTrash2, LuUpload } from 'react-icons/lu';

import { AVATAR_CONTENT_TYPES } from '@/constants/media';

type AvatarUploadProps = {
  src?: string | null;
  alt: string;
  fallback: string;
  // null removes the current avatar
  onChange: (file: File | null) => void;
  isPending?: boolean;
  // Rendered between the avatar and the actions
  children?: ReactNode;
};

const AvatarUpload = ({
  src,
  alt,
  fallback,
  onChange,
  isPending,
  children,
}: AvatarUploadProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-1 items-center gap-4">
      <Avatar
        className="rounded-field size-14 shrink-0 text-lg"
        color="accent"
        variant="soft"
      >
        <Avatar.Image alt={alt} src={src ?? undefined} />
        <Avatar.Fallback className="rounded-field text-lg font-semibold">
          {fallback}
        </Avatar.Fallback>
      </Avatar>
      {children}
      <div className="ml-auto flex gap-1">
        <Button
          size="sm"
          variant="outline"
          isPending={isPending}
          onPress={() => inputRef.current?.click()}
        >
          <LuUpload className="size-4" />
          {t('avatar.change')}
        </Button>
        {src && (
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={t('avatar.remove')}
            isDisabled={isPending}
            onPress={() => onChange(null)}
          >
            <LuTrash2 className="size-4" />
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept={AVATAR_CONTENT_TYPES.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export default AvatarUpload;
