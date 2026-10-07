import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import type { CreateEditStudentFormData } from '@/schemas/student';

import { useEditStudent, useGetStudentById } from '@/hooks/apis/students';
import useCreateEditStudentForm from '@/hooks/forms/useCreateEditStudent';
import { StudentSegment, StudentStatus } from '@/types/student';

import StudentSkeleton from './Skeleton';
import StudentForm from './StudentForm';

type EditStudentProps = {
  id: string;
};

const EditStudent = ({ id }: EditStudentProps) => {
  const navigate = useNavigate();
  const { mutateAsync: editStudent, isPending: isEditing } = useEditStudent();
  const { data: studentData, isLoading } = useGetStudentById(id);

  const form = useCreateEditStudentForm({
    defaultValues: {
      studentCode: '',
      firstName: '',
      lastName: '',
      segment: StudentSegment.KIDS,
      status: StudentStatus.ACTIVE,
      dob: '',
      gender: null,
      phone: '',
      email: '',
      entryLevelCode: '',
      note: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      parentRelationship: null,
    },
  });

  useEffect(() => {
    if (!studentData) return;
    form.reset({
      studentCode: studentData.studentCode ?? '',
      firstName: studentData.user.firstName ?? '',
      lastName: studentData.user.lastName ?? '',
      segment: studentData.segment,
      status: studentData.status,
      dob: studentData.user.dateOfBirth ?? '',
      gender: studentData.user.gender ?? null,
      phone: studentData.user.phone ?? '',
      email: studentData.user.email ?? '',
      entryLevelCode: studentData.entryLevelCode ?? '',
      note: studentData.note ?? '',
      parentName: studentData.parentName ?? '',
      parentPhone: studentData.parentPhone ?? '',
      parentEmail: studentData.parentEmail ?? '',
      parentRelationship: studentData.parentRelationship ?? null,
    });
  }, [studentData, form]);

  const onSubmit = async (payload: CreateEditStudentFormData) => {
    try {
      await editStudent({
        id,
        ...payload,
        studentCode: payload.studentCode || undefined,
        dob: payload.dob || undefined,
        phone: payload.phone || undefined,
        email: payload.email || undefined,
        entryLevelCode: payload.entryLevelCode || undefined,
        parentName: payload.parentName || undefined,
        parentPhone: payload.parentPhone || undefined,
        parentEmail: payload.parentEmail || undefined,
        note: payload.note || undefined,
      });
      navigate('/students');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <StudentSkeleton />;

  return (
    <StudentForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isEditing}
      isEdit
      onCancel={() => navigate('/students')}
    />
  );
};

export default EditStudent;
