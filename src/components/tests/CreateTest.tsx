import { useNavigate } from 'react-router';

import type { CreateEditTestFormData } from '@/schemas/test';

import { useCreateTest } from '@/hooks/apis/tests';
import useCreateEditTestForm from '@/hooks/forms/useCreateEditTest';
import { PublishStatus } from '@/types/test';

import TestForm from './TestForm';

const CreateTest = () => {
  const navigate = useNavigate();
  const { mutateAsync: createTest, isPending: isCreating } = useCreateTest();

  const form = useCreateEditTestForm({
    defaultValues: {
      title: '',
      code: '',
      publishStatus: PublishStatus.DRAFT,
    },
  });

  const onSubmit = async (payload: CreateEditTestFormData) => {
    try {
      const created = await createTest(payload);
      navigate(created?.id ? `/tests/${created.id}/edit` : '/tests');
    } catch (error) {
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
