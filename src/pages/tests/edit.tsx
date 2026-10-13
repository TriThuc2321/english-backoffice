import { useParams, type MetaFunction } from 'react-router';

import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Edit Test', 'Edit IELTS test details.');

export default function EditTestPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <p>EditTestPage</p>;
}
