import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';

import { ACTIVED_REGION_QUERY_KEY, USER_REGION_QUERY_KEY } from '@/services/region';
import { fetcherWithSSRToken } from '@/utils/request';

import Region from './region';

export default async function RegionSSR() {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  await queryClient.prefetchQuery({
    queryKey: [USER_REGION_QUERY_KEY],
    queryFn: () => fetcherWithSSRToken(USER_REGION_QUERY_KEY, token?.value),
  });

  await queryClient.prefetchQuery({
    queryKey: [ACTIVED_REGION_QUERY_KEY],
    queryFn: () => fetcherWithSSRToken(ACTIVED_REGION_QUERY_KEY, token?.value),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Region />
    </HydrationBoundary>
  );
}
