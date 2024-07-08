import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';

import { USER_QUERY_KEY } from '@/services/user';
import { fetcherWithSSRToken } from '@/utils/request';

import UserEdit from './userEdit';

export default async function UserEditSSR() {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  await queryClient.prefetchQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => fetcherWithSSRToken(USER_QUERY_KEY, token?.value),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserEdit />
    </HydrationBoundary>
  );
}
