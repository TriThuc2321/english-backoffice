import { useNavigate } from 'react-router';

import type { CreateEditStudentFormData } from '@/schemas/student';

import { useCreateStudent } from '@/hooks/apis/students';
import useCreateEditStudentForm from '@/hooks/forms/useCreateEditStudent';
import { StudentSegment, StudentStatus } from '@/types/student';

import StudentForm from './StudentForm';

const CreateStudent = () => {
  const navigate = useNavigate();
  const { mutateAsync: createStudent, isPending: isCreating } =
    useCreateStudent();

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

  const onSubmit = async (payload: CreateEditStudentFormData) => {
    try {
      await createStudent({
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

  return (
    <StudentForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isCreating}
      onCancel={() => navigate('/students')}
    />
  );
};

export default CreateStudent;
