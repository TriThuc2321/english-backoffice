import { useNavigate } from 'react-router';

import type { CreateTestFormData } from '@/schemas/test';
import type { Message } from '@/types/common';
import type { CreateTestPayload } from '@/types/test';

import { useCreateTest } from '@/hooks/apis/tests';
import { useCreateTestForm } from '@/hooks/forms';
import { ExamType } from '@/types/test';

import { getSectionDefaults } from './constants';
import TestForm from './TestForm';

const toPayload = (data: CreateTestFormData): CreateTestPayload => ({
  examType: data.examType,
  title: data.title,
  slug: data.slug || undefined,
  source: data.source.trim() || undefined,
  durationMinutes: data.durationMinutes,
  sections: data.sections
    .filter((section) => section.enabled)
    .map(({ skill, durationMinutes }) => ({ skill, durationMinutes })),
});

const CreateTest = () => {
  const navigate = useNavigate();
  const { mutateAsync: createTest, isPending: isCreating } = useCreateTest();

  const form = useCreateTestForm({
    defaultValues: {
      examType: ExamType.IELTS_ACADEMIC,
      title: '',
      slug: '',
      source: '',
      sections: getSectionDefaults(ExamType.IELTS_ACADEMIC),
    },
  });

  const onSubmit = async (data: CreateTestFormData) => {
    try {
      const test = await createTest(toPayload(data));
      navigate(test?.id ? `/tests/${test.id}/edit` : '/tests');
    } catch (error) {
      const { statusCode, message } = error as Message;
      if (statusCode === 409) form.setError('slug', { message });
      console.error(error);
    }
  };

  return (
    <TestForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isCreating}
      onCancel={() => navigate('/tests')}
    />
  );
};

export default CreateTest;
