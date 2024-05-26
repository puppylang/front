'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';

import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { getMessages } from '@/services/chat';
import { MESSAGE_POST_KEY, getPostPetDetail } from '@/services/post';
import { useUserQuery } from '@/services/user';
import { Message, Message as MessageType, SocketData } from '@/types/chat';
import { Post } from '@/types/post';
import { formatAge } from '@/utils/date';

import NativeLink from '@/components/NativeLink';
import PetProfile from '@/components/PetProfile';
import PostStatusBadge from '@/components/PostStatusBadge';

import { IconUserDefault } from '../../../../public/assets/svgs';

interface ChatRoomProps {
  id: string;
  postId: string;
}

interface MessageData {
  showsLastMessage: boolean;
  showsFirstMessage: boolean;
  messages: Message[];
}

export default function ChatRoom({ id, postId }: ChatRoomProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReceivedSocketData, setIsReceivedSocketData] = useState(false);
  const [messagesData, setMessagesData] = useState<MessageData>({
    showsFirstMessage: false,
    showsLastMessage: false,
    messages: [],
  });

  const webSocket = useRef<WebSocket | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const topMessageRef = useRef<HTMLDivElement>(null);

  const isInTopMessageView = useIntersectionObserver(topMessageRef);

  const { data: post } = useQuery<Post>({
    queryKey: [MESSAGE_POST_KEY, postId],
    queryFn: () => getPostPetDetail(postId),
  });
  const { data: user } = useUserQuery();

  const firstNotReadedMessage = messagesData.messages.find(message => message.user_id !== user?.id && !message.is_read);

  const onSubmitChat = (event: FormEvent) => {
    event.preventDefault();
    if (!text) return;
    if (!webSocket.current) return;
    webSocket.current.send(
      JSON.stringify({ type: 'MESSAGE', data: { text, chat_id: id, user_id: user?.id, user_image: user?.image } }),
    );

    setText('');
  };

  const isSameDay = (time: string, previousTime: string) => {
    const currentDate = new Date(time);
    const previousDate = new Date(previousTime);

    return (
      previousDate.getFullYear() === currentDate.getFullYear() &&
      previousDate.getMonth() === currentDate.getMonth() &&
      previousDate.getDate() === currentDate.getDate()
    );
  };

  const isSameMinutes = (time: string, previousTime: string) => {
    const currentDate = new Date(time);
    const previousDate = new Date(previousTime);

    return previousDate.getHours() === currentDate.getHours() && previousDate.getMinutes() === currentDate.getMinutes();
  };

  const updateReadMessage = (messageId: number) => {
    webSocket.current?.send(JSON.stringify({ type: 'READ', data: { id: messageId, chat_id: id, user_id: user?.id } }));
  };

  useEffect(() => {
    webSocket.current = new WebSocket('ws://localhost:8000/chat/ws');
    if (!webSocket || !user) return;
    webSocket.current.onopen = () => {
      if (webSocket.current?.readyState === 1) {
        webSocket.current?.send(
          JSON.stringify({ type: 'OPEN', data: { chat_id: id, user_id: user.id, date: new Date() } }),
        );
      }
    };

    webSocket.current.onmessage = (event: MessageEvent) => {
      setIsReceivedSocketData(true);
      const socketData = JSON.parse(event.data) as SocketData;
      if (socketData.type === 'READ') {
        const messageId = Number(socketData.data.id);
        setMessagesData(prev => ({
          ...prev,
          messages: prev.messages.map(message => (message.id === messageId ? { ...message, is_read: true } : message)),
        }));
        return;
      }

      const newMessage = socketData.data as MessageType;
      setMessagesData(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
    };
  }, [user]);

  useEffect(() => {
    if (!isLoading && isInTopMessageView && !messagesData.showsFirstMessage) {
      setIsLoading(true);
      (async () => {
        const messages = await getMessages(id, messagesData.messages[0].id, 'PREVIOUS');
        setMessagesData(prev => ({
          ...prev,
          showsFirstMessage: messages.length !== 20,
          messages: [...messages, ...prev.messages],
        }));
        setIsLoading(false);
      })();
    }
  }, [isInTopMessageView]);

  useEffect(() => {
    (async () => {
      const messages = await getMessages(id);
      setMessagesData(prev => ({ ...prev, showsLastMessage: messages.length < 20, messages }));
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    const lastOtherMessage = messagesData.messages.findLast(
      message => message.user_id !== user?.id && !message.is_read,
    );

    if (lastOtherMessage) return;
    messageRef.current?.scrollTo({
      top: messageRef.current?.scrollHeight,
    });
  }, [messagesData.messages, user]);

  return (
    <div className='relative h-screen flex flex-col'>
      <NativeLink href={`/posts/${post?.id}`} className='flex px-4 py-3 border-b-[1px]'>
        <div className='flex-[1_0_50px]'>
          {post && post.pet && <PetProfile className='!bg-gray-200' pet={post.pet} width={50} height={50} />}
        </div>
        <div className='flex pl-4 w-full items-center'>
          <div className='w-full'>
            <p className='text-base text-[#222222]'>{post?.title}</p>
            <p className='text-sm text-[#666666] font-light'>
              {post?.pet?.breed} | {post?.pet?.gender === 'Male' ? '수컷' : '암컷'} |
              {post?.pet?.birthday ? formatAge(post.pet.birthday) : 0}
            </p>
          </div>
          {post && <PostStatusBadge status={post?.status} className='text-sm flex-[1_0_80px]' />}
        </div>
      </NativeLink>
      <div className='p-4 pb-[60px] bg-bg-blue overflow-y-scroll' ref={messageRef}>
        <div ref={topMessageRef} />

        <div>
          {messagesData.messages.map((message, index) => {
            const previousChatting = messagesData.messages[index - 1];
            const isMyChat = user?.id === message.user_id;
            const nextChatting = messagesData.messages[index + 1];
            const isSameUserLastChat = nextChatting
              ? nextChatting.user_id !== message.user_id || !isSameMinutes(message.time, nextChatting.time)
              : true;

            return (
              <Message
                key={message.id}
                updateReadMessage={updateReadMessage}
                message={message}
                isSameUserLastChat={isSameUserLastChat}
                isSameDate={previousChatting ? isSameDay(message.time, previousChatting.time) : false}
                isSameMinutes={
                  Boolean(nextChatting) && nextChatting && nextChatting.user_id === message.user_id
                    ? isSameDay(message.time, nextChatting.time) && isSameMinutes(message.time, nextChatting.time)
                    : false
                }
                isNotReadedFirstMessage={
                  firstNotReadedMessage && !isReceivedSocketData ? firstNotReadedMessage.id === message.id : false
                }
                isMyChat={isMyChat}
              />
            );
          })}
        </div>
      </div>
      <form className='fixed bottom-0 w-full p-2 h-[60px] py-3 flex bg-bg-blue' onSubmit={onSubmitChat}>
        <input
          type='text'
          placeholder='메시지 보내기'
          className='w-full ml-1 py-2 px-3 rounded-xl text-sm'
          value={text}
          onChange={({ target }) => setText(target.value)}
        />
        <button className='w-[30px] flex justify-center items-center' type='submit'>
          <MdSend className={`w-[20px] h-[20px] ${text ? 'text-text-3' : 'opacity-20'}`} />
        </button>
      </form>
    </div>
  );
}

interface MessageProps {
  isMyChat: boolean;
  message: Message;
  isSameDate: boolean;
  isSameMinutes: boolean;
  isSameUserLastChat: boolean;
  isNotReadedFirstMessage: boolean;
  updateReadMessage: (chatId: number) => void;
}

const KOREAN_DAY = ['일', '월', '화', '수', '목', '금', '토'];

const Message = React.memo(
  ({
    message,
    isMyChat,
    updateReadMessage,
    isSameDate,
    isSameMinutes,
    isSameUserLastChat,
    isNotReadedFirstMessage,
  }: MessageProps) => {
    const messageRef = useRef<HTMLDivElement>(null);

    const getCurrentTime = (currentTime: string) => {
      const date = new Date(currentTime);
      const hour = date.getHours();
      const minutes = date.getMinutes();
      return `${hour >= 12 ? `오후 ${hour - 12}` : `오전 ${hour}`}:${minutes <= 9 ? `0${minutes}` : minutes}`;
    };

    const getFullYear = (time: string) => {
      const chattingDate = new Date(time);
      const year = chattingDate.getFullYear();
      const month = chattingDate.getMonth() + 1;
      const date = chattingDate.getDate();
      const day = chattingDate.getDay();

      return `${year}년 ${month}월 ${date}일 ${KOREAN_DAY[day]}요일`;
    };

    useEffect(() => {
      if (!messageRef || !messageRef.current || message.is_read || isMyChat) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !message.is_read) {
          (async () => {
            updateReadMessage(message.id);
          })();
        }
      });

      observer.observe(messageRef.current);

      return () => {
        if (!messageRef || !messageRef.current) return;
        observer.unobserve(messageRef.current);
      };
    }, []);

    useEffect(() => {
      if (!isNotReadedFirstMessage) return;
      messageRef.current?.scrollIntoView({ block: 'center' });
    }, []);

    return (
      <>
        {isNotReadedFirstMessage && (
          <span className='my-4 m-auto flex justify-center text-xs bg-gray-200 text-text-3  w-[130px] py-1 rounded-lg'>
            여기까지 읽었습니다.
          </span>
        )}
        {!isSameDate && <p className='text-xs text-text-2 text-center'>{getFullYear(message.time)}</p>}
        <div className={`flex w-full mb-3 ${isMyChat && 'flex-row-reverse'}`} ref={messageRef}>
          {message.user_image ? (
            <Image width={50} height={50} src={message.user_image} alt='example' className='rounded-full self-start' />
          ) : (
            <div className='bg-gray-200 rounded-full w-[50px] h-[50px] flex justify-center items-center'>
              <IconUserDefault className='w-[40px] h-[40px]' />
            </div>
          )}
          <div className='flex self-end relative'>
            {isMyChat && !isSameMinutes && isSameUserLastChat && (
              <p className='text-[10px] self-end text-text-2'>{getCurrentTime(message.time)}</p>
            )}
            <div className={`relative `}>
              <p
                className={`p-2 h-auto rounded-xl text-sm self-start max-w-[200px] ${
                  isMyChat ? 'bg-main-2 text-white-1 mr-3 ml-1' : 'bg-white-1 ml-3 mr-1'
                }`}
              >
                {message.text}
              </p>
              {!message.is_read && (
                <p className={`text-[10px] text-text-3 absolute ${isMyChat ? ' left-[-5px]' : 'right-[-5px]'} top-0`}>
                  1
                </p>
              )}
            </div>
            {!isMyChat && !isSameMinutes && isSameUserLastChat && (
              <p className='text-[10px] self-end text-text-2'>{getCurrentTime(message.time)}</p>
            )}
          </div>
        </div>
      </>
    );
  },
);

Message.displayName = 'Message';
