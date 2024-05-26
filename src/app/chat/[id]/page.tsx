import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';

import { MESSAGE_POST_KEY, getPostPetDetail } from '@/services/post';

import ChatRoom from './chatRoom';

interface DynamicRouteParams {
  searchParams: { postId: string };
  params: {
    id: string;
  };
}

export default async function ChatRoomPage({ searchParams: { postId }, params: { id } }: DynamicRouteParams) {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  await queryClient.prefetchQuery({
    queryKey: [MESSAGE_POST_KEY, postId],
    queryFn: () => getPostPetDetail(postId, token?.value),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatRoom postId={postId} id={id} />
    </HydrationBoundary>
  );
}
