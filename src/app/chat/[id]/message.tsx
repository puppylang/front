import React, { useEffect, useRef } from 'react';

import { Message as MessageType } from '@/types/chat';

import NativeLink from '@/components/NativeLink';
import { Profile } from '@/components/Profile';

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

function Messasge({
  message,
  isMyChat,
  updateReadMessage,
  isSameDate,
  image,
  isSameMinutes,
  isSameUserLastChat,
  isNotReadedFirstMessage,
}: MessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = (currentTime: string) => {
    const date = new Date(currentTime);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    return `${hour >= 12 ? `오후 ${hour - 12 === 0 ? '12' : hour - 12}` : `오전 ${hour}`}:${
      minutes <= 9 ? `0${minutes}` : minutes
    }`;
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
        <NativeLink href={`/user/${message.user_id}`}>
          <Profile.User
            image={image || ''}
            alt={message.user_id}
            imageClassName='!w-[50px] !h-[50px]'
            defaultUserDivClassName='!w-[50px] !h-[50px]'
          />
        </NativeLink>
        <div className='flex self-end relative'>
          {isMyChat && !isSameMinutes && isSameUserLastChat && (
            <p className='text-[10px] self-end text-text-2'>{getCurrentTime(message.time)}</p>
          )}
          <div className={`relative `}>
            <p
              className={`p-[6px_12px] h-auto rounded-[10px] text-sm self-start max-w-[200px] mx-2 ${
                isMyChat ? 'bg-main-2 text-white' : 'bg-white-1 text-text-1'
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
}

export default React.memo(Messasge);
