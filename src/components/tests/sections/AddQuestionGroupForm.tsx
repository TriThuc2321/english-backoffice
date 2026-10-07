import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateQuestionGroup } from '@/hooks/apis/questionGroups';
import { QuestionType } from '@/types/test';

const QUESTION_TYPE_ITEMS = Object.values(QuestionType).map((v) => ({
  label: v.replace(/_/g, ' '),
  value: v,
}));

type AddQuestionGroupFormProps = {
  testSectionId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const AddQuestionGroupForm = ({
  testSectionId,
  onSuccess,
  onCancel,
}: AddQuestionGroupFormProps) => {
  const { t } = useTranslation();
  const [questionType, setQuestionType] = useState<QuestionType | null>(null);
  const [guideline, setGuideline] = useState('');
  const [touched, setTouched] = useState(false);

  const { mutate: createGroup, isPending } = useCreateQuestionGroup();

  const isQuestionTypeInvalid = touched && !questionType;
  const isGuidelineInvalid = touched && !guideline.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!questionType || !guideline.trim()) return;
    createGroup(
      { testSectionId, questionType, guideline: guideline.trim() },
      { onSuccess },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-default-50 mt-2 flex flex-col gap-3 rounded-xl border p-4"
    >
      <Select
        fullWidth
        placeholder={t('tests.sections.questionGroups.questionType')}
        selectedKey={questionType}
        onSelectionChange={(key) => setQuestionType(key as QuestionType)}
        isInvalid={isQuestionTypeInvalid}
      >
        <Label>{t('tests.sections.questionGroups.questionType')}</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {QUESTION_TYPE_ITEMS.map((item) => (
              <ListBox.Item
                key={item.value}
                id={item.value}
                textValue={item.label}
              >
                {item.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
        {isQuestionTypeInvalid && (
          <FieldError>
            {t('tests.sections.questionGroups.questionType')} is required
          </FieldError>
        )}
      </Select>

      <TextField
        fullWidth
        value={guideline}
        onChange={setGuideline}
        isInvalid={isGuidelineInvalid}
      >
        <Label>{t('tests.sections.questionGroups.guideline')}</Label>
        <Input placeholder={t('tests.sections.questionGroups.guideline')} />
        {isGuidelineInvalid && (
          <FieldError>
            {t('tests.sections.questionGroups.guideline')} is required
          </FieldError>
        )}
      </TextField>

      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="outline" onPress={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" size="sm" variant="primary" isPending={isPending}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default AddQuestionGroupForm;
