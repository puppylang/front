import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';

import { POST_KEY } from '@/services/post';
import { RESUMES_KEY } from '@/services/resume';
import { USER_QUERY_KEY } from '@/services/user';
import { fetcherWithSSRToken } from '@/utils/request';

import PostDetail from './PostDetail';

export default async function PostDetailLayout({ params: { id } }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  await queryClient.prefetchQuery({
    queryKey: [USER_QUERY_KEY, token?.value],
    queryFn: () => fetcherWithSSRToken(USER_QUERY_KEY, token?.value),
  });

  await queryClient.prefetchQuery({
    queryKey: [RESUMES_KEY, token?.value, id],
    queryFn: () => fetcherWithSSRToken(`${RESUMES_KEY}?postId=${id}`, token?.value),
  });

  await queryClient.prefetchQuery({
    queryKey: [POST_KEY, id, token?.value],
    queryFn: () => fetcherWithSSRToken(`${POST_KEY}/${id}`, token?.value),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetail id={id} />
    </HydrationBoundary>
  );
}
