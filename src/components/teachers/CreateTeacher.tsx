import { useNavigate } from 'react-router';

import type { CreateEditTeacherFormData } from '@/schemas/teacher';

import { useCreateTeacher } from '@/hooks/apis/teachers';
import useCreateEditTeacherForm from '@/hooks/forms/useCreateEditTeacher';
import { TeacherStatus } from '@/types/teacher';

import TeacherForm from './TeacherForm';

const CreateTeacher = () => {
  const navigate = useNavigate();
  const { mutateAsync: createTeacher, isPending: isCreating } =
    useCreateTeacher();

  const form = useCreateEditTeacherForm({
    defaultValues: {
      code: '',
      nationality: '',
      status: TeacherStatus.ACTIVE,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: null,
        address: '',
        avatar: '',
      },
      skills: [],
      certificates: [],
    },
  });

  const onSubmit = async (payload: CreateEditTeacherFormData) => {
    try {
      await createTeacher({
        ...payload,
        user: {
          ...payload.user,
          dateOfBirth: payload.user.dateOfBirth || undefined,
        },
      });
      navigate('/teachers');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TeacherForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isCreating}
      onCancel={() => navigate('/teachers')}
    />
  );
};

export default CreateTeacher;
