import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';

import { CHATS_QUERY_KEY } from '@/services/chat';
import { ChatWritterType } from '@/types/chat';
import { fetcherWithSSRToken } from '@/utils/request';

import Chat from './chat';

export default async function ChatSSR() {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  await queryClient.prefetchQuery({
    queryKey: [CHATS_QUERY_KEY, ChatWritterType.Author],
    queryFn: () => fetcherWithSSRToken(`${CHATS_QUERY_KEY}?type=${ChatWritterType.Author}`, token?.value),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Chat />
    </HydrationBoundary>
  );
}
