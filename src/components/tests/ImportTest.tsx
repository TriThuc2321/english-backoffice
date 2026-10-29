import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle,
  Button,
  Label,
  TextArea,
  TextField,
  toast,
} from '@heroui/react';
import { useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPaperclip } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { ImportTestPayload, ImportTestResult } from '@/types/test';

import { useImportTest } from '@/hooks/apis/tests';

const parseJson = (text: string) => {
  try {
    return { value: JSON.parse(text) as ImportTestPayload };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

const toMessages = (error: unknown): string[] => {
  const message = (error as { message?: string | string[] })?.message;
  if (Array.isArray(message)) return message;
  return message ? [message] : [];
};

const ImportTest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: importTest, isPending } = useImportTest();

  const [text, setText] = useState('');
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [result, setResult] = useState<ImportTestResult>();

  const parsed = text.trim() ? parseJson(text) : undefined;

  const changeText = (value: string) => {
    setText(value);
    setServerErrors([]);
    setResult(undefined);
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) changeText(await file.text());
  };

  const onSubmit = async () => {
    if (!parsed?.value) return;
    try {
      const res = await importTest(parsed.value);
      toast.success(t('tests.toast.importSuccess'));
      if (res.warnings.length) setResult(res);
      else navigate(`/tests/${res.test.id}/edit`);
    } catch (error) {
      const messages = toMessages(error);
      setServerErrors(
        messages.length ? messages : [t('tests.toast.importError')],
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted text-sm">{t('tests.import.description')}</p>

      <div className="flex items-end justify-between gap-2">
        <Label>{t('tests.import.jsonLabel')}</Label>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onFileChange}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onPress={() => inputRef.current?.click()}
        >
          <LuPaperclip className="size-4" />
          {t('tests.import.chooseFile')}
        </Button>
      </div>

      <TextField
        fullWidth
        value={text}
        onChange={changeText}
        isInvalid={!!parsed?.error}
        aria-label={t('tests.import.jsonLabel')}
      >
        <TextArea
          rows={20}
          className="font-mono text-xs"
          placeholder={t('tests.import.placeholder')}
          spellCheck={false}
        />
      </TextField>

      {parsed?.error && (
        <p className="text-danger text-sm">
          {t('tests.import.invalidJson', { message: parsed.error })}
        </p>
      )}

      {serverErrors.length > 0 && (
        <Alert status="danger" className="w-full">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>{t('tests.import.errorsTitle')}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc space-y-1 pl-4 font-mono text-xs">
                {serverErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}

      {result && (
        <Alert status="warning" className="w-full">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>
              {t('tests.import.warningsTitle', {
                count: result.warnings.length,
              })}
            </AlertTitle>
            <AlertDescription>
              <ul className="list-disc space-y-1 pl-4 text-xs">
                {result.warnings.map((w) => (
                  <li key={`${w.path}:${w.message}`}>
                    <span className="font-mono">{w.path}</span>: {w.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onPress={() => navigate('/tests')}>
          {t('common.cancel')}
        </Button>
        {result ? (
          <Button
            variant="primary"
            onPress={() => navigate(`/tests/${result.test.id}/edit`)}
          >
            {t('tests.import.openTest')}
          </Button>
        ) : (
          <Button
            variant="primary"
            isPending={isPending}
            isDisabled={!parsed?.value}
            onPress={onSubmit}
          >
            {t('tests.import.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportTest;
