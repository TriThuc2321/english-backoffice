import type { MetaFunction } from 'react-router';

import { ForgotPasswordFlow } from '@/components/auth';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Forgot password', 'Reset your MyEnglish back-office password.');

export default function ForgotPasswordPage() {
  return <ForgotPasswordFlow />;
}
