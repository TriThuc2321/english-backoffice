import { type MetaFunction } from 'react-router';

import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Dashboard', 'Overview of your MyEnglish management workspace.');

export default function DashboardPage() {
  return (
    <div className="bg-surface">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}
