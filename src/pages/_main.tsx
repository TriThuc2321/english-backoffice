import { Outlet, redirect } from 'react-router';

import MainLayout from '@/components/layouts/mainLayout';
import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { readShowFullMenuFromStorage } from '@/constants/storage';
import { useGetProfile } from '@/hooks/apis/users';
import { AccessProvider, getQueryClient } from '@/providers';
import { userApi } from '@/services/apis';

export async function clientLoader() {
  try {
    const queryClient = getQueryClient();
    const profile = await queryClient.fetchQuery({
      queryKey: [REACT_QUERY_KEYS.USER.PROFILE],
      queryFn: userApi.getProfile,
    });
    return { profile };
  } catch {
    return redirect('/login');
  }
}

export default function MainLayoutRoute() {
  const { data } = useGetProfile();

  return (
    <AccessProvider profile={data}>
      <MainLayout initialShowFullMenu={readShowFullMenuFromStorage(true)}>
        <Outlet />
      </MainLayout>
    </AccessProvider>
  );
}
