import { useQuery } from '@tanstack/react-query';

import { ChatRoom, ChatWritterType, CreateChatType, Message } from '@/types/chat';
import { fetcherWithToken } from '@/utils/request';

const CHAT_QUERY_KEY = '/chat';
const MESSAGE_QUERY_KEY = '/chat/message';
const POST_QUERY_KEY = '/chat/post';

export const useChatQuery = (type: ChatWritterType) => {
  return useQuery({
    queryKey: [CHAT_QUERY_KEY, type],
    queryFn: () => fetcherWithToken<ChatRoom[]>(`${CHAT_QUERY_KEY}?type=${type}`),
  });
};

export const usePostFromChatRommId = (chatId: number) => {
  return useQuery({
    queryKey: [`${POST_QUERY_KEY}/${chatId}`],
    queryFn: () => fetcherWithToken<Message[]>(`${POST_QUERY_KEY}/${chatId}`),
  });
};

export const createChatRoom = (data: CreateChatType) => {
  return fetcherWithToken<{ id: number }>(CHAT_QUERY_KEY, {
    method: 'POST',
    data,
  });
};

export const updateReadMesssage = (id: number) => {
  return fetcherWithToken(`${MESSAGE_QUERY_KEY}/read`, {
    method: 'PATCH',
    data: { id },
  });
};

export const getMessages = (id: string, offset?: number, direction?: 'NEXT' | 'PREVIOUS') => {
  const getDirection = direction ? `?direction=${direction}` : '';
  const getOffset = offset ? `&offset=${offset}` : '';

  return fetcherWithToken<Message[]>(`/chat/message/${id}${getDirection}${getOffset}`);
};
