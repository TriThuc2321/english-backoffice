import { useParams, type MetaFunction } from 'react-router';

import { TestBuilder } from '@/components/tests/builder';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Edit Test', 'Edit IELTS test details.');

export default function EditTestPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <TestBuilder id={id} />;
}
