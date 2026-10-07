import { Outlet, redirect } from 'react-router';

import AuthLayout from '@/components/layouts/authLayout';
import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { getQueryClient } from '@/providers';
import { userApi } from '@/services/apis';

export async function clientLoader() {
  try {
    const queryClient = getQueryClient();
    await queryClient.fetchQuery({
      queryKey: [REACT_QUERY_KEYS.USER.PROFILE],
      queryFn: userApi.getProfile,
    });

    return redirect('/');
  } catch {
    return null;
  }
}

export default function AuthLayoutRoute() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
