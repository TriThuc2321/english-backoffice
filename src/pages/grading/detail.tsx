import { type MetaFunction } from 'react-router';

import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Grade Section', 'Grade an IELTS Writing or Speaking section.');

export default function GradeSectionPage() {
  return null;
}
