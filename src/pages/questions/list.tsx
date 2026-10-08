import { type MetaFunction } from 'react-router';

import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta(
    'Questions',
    'Manage question banks, groups, and assessment items in MyEnglish.',
  );

export default function QuestionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Questions</h1>
      <p className="text-default-500 mt-2">Placeholder page.</p>
    </div>
  );
}
