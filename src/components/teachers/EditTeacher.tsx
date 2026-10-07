import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import type { CreateEditTeacherFormData } from '@/schemas/teacher';

import { useEditTeacher, useGetTeacherById } from '@/hooks/apis/teachers';
import useCreateEditTeacherForm from '@/hooks/forms/useCreateEditTeacher';
import { TeacherStatus } from '@/types/teacher';

import TeacherSkeleton from './Skeleton';
import TeacherForm from './TeacherForm';

type EditTeacherProps = {
  id: string;
};

const EditTeacher = ({ id }: EditTeacherProps) => {
  const navigate = useNavigate();
  const { mutateAsync: editTeacher, isPending: isEditing } = useEditTeacher();
  const { data: teacherData, isLoading } = useGetTeacherById(id);

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

  useEffect(() => {
    if (!teacherData) return;
    form.reset({
      code: teacherData.code ?? '',
      nationality: teacherData.nationality ?? '',
      status: teacherData.status,
      user: {
        firstName: teacherData.user?.firstName ?? '',
        lastName: teacherData.user?.lastName ?? '',
        email: teacherData.user?.email ?? '',
        phone: teacherData.user?.phone ?? '',
        dateOfBirth: teacherData.user?.dateOfBirth ?? '',
        gender: teacherData.user?.gender ?? undefined,
        address: teacherData.user?.address ?? '',
        avatar: teacherData.user?.avatar ?? '',
      },
      skills:
        teacherData.skills?.map((s) => ({
          targetAudience: s.targetAudience ?? undefined,
          skillArea: s.skillArea ?? undefined,
          level: s.level,
        })) ?? [],
      certificates:
        teacherData.certificates?.map((c) => ({
          name: c.name ?? '',
          issuer: c.issuer ?? '',
          issueDate: c.issueDate ?? '',
          expiryDate: c.expiryDate ?? '',
          score: c.score ?? '',
          fileUrl: c.fileUrl ?? '',
        })) ?? [],
    });
  }, [teacherData, form]);

  const onSubmit = async (payload: CreateEditTeacherFormData) => {
    try {
      await editTeacher({
        id,
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

  if (isLoading) return <TeacherSkeleton />;

  return (
    <TeacherForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isEditing}
      isEdit
      onCancel={() => navigate('/teachers')}
    />
  );
};

export default EditTeacher;
