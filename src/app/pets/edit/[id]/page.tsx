import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';

import { PET_QUERY_KEY } from '@/services/pet';
import { USER_QUERY_KEY } from '@/services/user';
import { fetcherWithSSRToken } from '@/utils/request';

import PetEdit from './petEdit';

export default async function PetEditSSR({ params: { id } }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  await queryClient.prefetchQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => fetcherWithSSRToken(USER_QUERY_KEY, token?.value),
  });

  await queryClient.prefetchQuery({
    queryKey: [PET_QUERY_KEY],
    queryFn: () => fetcherWithSSRToken(PET_QUERY_KEY, token?.value),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PetEdit id={id} />
    </HydrationBoundary>
  );
}
