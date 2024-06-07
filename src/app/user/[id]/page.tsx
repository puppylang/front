import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';

import { PET_QUERY_KEY } from '@/services/pet';
import { USER_QUERY_KEY } from '@/services/user';
import { fetcherWithSSRToken } from '@/utils/request';

import UserProfile from './UserProfile';

export default async function UserIdSSR({ params: { id } }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  await queryClient.prefetchQuery({
    queryKey: [USER_QUERY_KEY, id, token?.value],
    queryFn: () => fetcherWithSSRToken(`${USER_QUERY_KEY}?id=${id}`, token?.value),
  });

  await queryClient.prefetchQuery({
    queryKey: [PET_QUERY_KEY, id, token?.value],
    queryFn: () => fetcherWithSSRToken(`${PET_QUERY_KEY}?user_id=${id}`, token?.value),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfile id={id} />
    </HydrationBoundary>
  );
}
