'use client';

import { useQuery } from '@tanstack/react-query';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';

import Report from '@/app/report/page';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { getMessages, useChatDetailQuery } from '@/services/chat';
import { MESSAGE_POST_KEY, getPostPetDetail } from '@/services/post';
import { useCancelBlockMutation, useCreateBlockMutation } from '@/services/report';
import { useUserQuery } from '@/services/user';
import { Message as MessageType, OBJECTIONABLE_TEXT, SocketData } from '@/types/chat';
import { Post } from '@/types/post';
import { formatAge } from '@/utils/date';

import Alert from '@/components/Alert';
import { BottomSheet, BottomSheetButton } from '@/components/BottomSheet';
import { HeaderNavigation } from '@/components/HeaderNavigation';
import NativeLink from '@/components/NativeLink';
import { Popup } from '@/components/Popup';
import PostStatusBadge from '@/components/PostStatusBadge';
import { Profile } from '@/components/Profile';
import Toast, { ToastStatus } from '@/components/Toast';

interface ChatRoomProps {
  id: string;
  postId: string;
}

interface MessageData {
  showsLastMessage: boolean;
  showsFirstMessage: boolean;
  messages: MessageType[];
}

export default function ChatRoom({ id, postId }: ChatRoomProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReceivedSocketData, setIsReceivedSocketData] = useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [toastDetail, setToastDetail] = useState({
    isOpen: false,
    status: '',
    description: '',
  });
  const [messagesData, setMessagesData] = useState<MessageData>({
    showsFirstMessage: false,
    showsLastMessage: false,
    messages: [],
  });

  const webSocket = useRef<WebSocket | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const topMessageRef = useRef<HTMLDivElement>(null);

  const isInTopMessageView = useIntersectionObserver(topMessageRef);
  const createBlockMutation = useCreateBlockMutation();
  const cancelBlockMutation = useCancelBlockMutation();

  const { data: post } = useQuery<Post>({
    queryKey: [MESSAGE_POST_KEY, postId],
    queryFn: () => getPostPetDetail(postId),
  });
  const { data: chat } = useChatDetailQuery(id);
  const { data: user } = useUserQuery();

  const otherUser = chat && chat.is_author ? chat.guest_id : chat?.author_id;
  const firstNotReadedMessage = messagesData.messages.find(message => message.user_id !== user?.id && !message.is_read);
  const isBlockedUser = user && Boolean(user.blocker.find(blockedUser => blockedUser.blocked_id === otherUser));

  const onSubmitChat = (event: FormEvent) => {
    event.preventDefault();
    if (!text) return;
    if (!webSocket.current) return;
    const objectionableText = OBJECTIONABLE_TEXT.find(content => text.includes(content));
    if (objectionableText) {
      setToastDetail({
        isOpen: true,
        description: '불쾌감을 주는 언어가 포함되어 있습니다.',
        status: 'error',
      });
      return;
    }

    if (isBlockedUser) {
      setToastDetail({
        isOpen: true,
        description: '차단한 유저에게 메시지를 보낼 수 없어요.',
        status: 'error',
      });
      return;
    }

    webSocket.current.send(
      JSON.stringify({
        type: 'MESSAGE',
        data: { text, chat_id: id, user, other_user_id: otherUser },
      }),
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

  const onClickAlertBlockBtn = () => {
    if (!user || !otherUser) return;

    createBlockMutation.mutate({
      blockerId: user.id,
      blockedId: otherUser,
    });

    setToastDetail({
      isOpen: true,
      description: '사용자가 차단되었어요.',
      status: 'success',
    });
    setIsOpenAlert(false);
  };

  const onClickBottomSheetBlockBtn = () => {
    if (!user || !otherUser) return;

    setIsOpenBottomSheet(false);

    if (isBlockedUser) {
      cancelBlockMutation.mutate({
        blockerId: user.id,
        blockedId: otherUser,
      });

      setToastDetail({
        isOpen: true,
        description: '사용자가 차단이 해제되었어요.',
        status: 'success',
      });

      return;
    }

    setIsOpenAlert(true);
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

    if (messagesData.messages.length > 20) return;
    if (lastOtherMessage) return;
    messageRef.current?.scrollTo({
      top: messageRef.current?.scrollHeight,
    });
  }, [messagesData.messages, user]);

  const filteredBlockedMessage = messagesData.messages.filter(
    message => message.user_id === user?.id || !message.is_blocked_other,
  );

  return (
    <div className='relative h-screen flex flex-col'>
      <HeaderNavigation.Container className='!bg-bg-blue'>
        <HeaderNavigation.Title text='채팅방' />
        <HeaderNavigation.DotBtn onClick={() => setIsOpenBottomSheet(true)} />
      </HeaderNavigation.Container>

      <NativeLink href={`/posts/${post?.id}`} className='flex px-4 py-3 border-b-[1px]'>
        <div className='flex-[1_0_50px]'>
          {post && post.pet && <Profile.Pet className='!bg-bg-blue' pet={post.pet} width={50} height={50} />}
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
          {filteredBlockedMessage.map((message, index) => {
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
                image={message.user_id === chat?.guest_id ? chat.guest.image : chat?.user.image}
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

      <form className='fixed bottom-0 w-full p-2 px-3 pb-7 flex bg-bg-blue' onSubmit={onSubmitChat}>
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

      <BottomSheet isOpen={isOpenBottomSheet} onClose={() => setIsOpenBottomSheet(false)}>
        <NativeLink
          href={`/report?id=${chat?.author_id === user?.id ? chat?.guest_id : chat?.author_id}`}
          className='py-[10px] text-main-1 border-b-[1px] text-center'
        >
          신고하기
        </NativeLink>
        <BottomSheetButton onClick={onClickBottomSheetBlockBtn}>
          {isBlockedUser ? '차단 해체하기' : '차단하기'}
        </BottomSheetButton>
        <BottomSheetButton onClick={() => console.log(123)}>채팅방 나가기</BottomSheetButton>
      </BottomSheet>

      <Alert
        buttonText='차단하기'
        message='차단시 서로의 게시글 확인하거나 채팅을 할 수 없어요. 정말 차단하실래요?'
        isOpen={isOpenAlert}
        onClose={() => setIsOpenAlert(false)}
        onClick={onClickAlertBlockBtn}
      />

      <Toast
        status={toastDetail.status as ToastStatus}
        onClose={() => setToastDetail(prev => ({ ...prev, isOpen: false }))}
        isInvisible={toastDetail.isOpen}
        position='CENTER'
        description={toastDetail.description}
      />

      <Popup.Container isOpen={isOpenPopup}>
        <Popup.CloseButton onClose={() => setIsOpenPopup(false)} className='border-b-0 text-center justify-center'>
          <p className='text-center font-bold'>신고하기</p>
        </Popup.CloseButton>

        <Report />
      </Popup.Container>
    </div>
  );
}

interface MessageProps {
  isMyChat: boolean;
  message: MessageType;
  image?: string | null;
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
    image,
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
          <span className='my-4 m-auto flex justify-center text-xs bg-gray-200 text-text-3 w-[130px] py-1 rounded-lg'>
            여기까지 읽었습니다.
          </span>
        )}
        {!isSameDate && <p className='text-xs text-text-2 text-center mb-4'>{getFullYear(message.time)}</p>}
        <div className={`flex w-full mb-6 ${isMyChat && 'flex-row-reverse'}`} ref={messageRef}>
          <Profile.User
            image={image || ''}
            alt={message.user_id}
            imageClassName='!w-[50px] !h-[50px]'
            defaultUserDivClassName='!w-[50px] !h-[50px]'
          />
          <div className='flex self-end relative'>
            {isMyChat && !isSameMinutes && isSameUserLastChat && (
              <p className='text-[10px] self-end text-text-2'>{getCurrentTime(message.time)}</p>
            )}
            <div className={`relative `}>
              <p
                className={`p-[6px_12px] h-auto rounded-xl text-sm self-start max-w-[200px] mx-2 ${
                  isMyChat ? 'bg-main-2 text-white-1' : 'bg-white-1'
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
