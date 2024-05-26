'use client';

import Image from 'next/image';
import { useState } from 'react';

import { useChatQuery } from '@/services/chat';
import { ChatWritterType, ChatRoom } from '@/types/chat';
import { RouterMethod } from '@/types/route';
import { formatDiffTime } from '@/utils/date';

import NativeLink from '@/components/NativeLink';
import PetProfile from '@/components/PetProfile';
import { PuppyError } from '@/components/PuppyError';

import { ChatSkelectonUI, TabSkelectonUI } from './chatSkeletionUI';
import { IconUserDefault } from '../../../public/assets/svgs';

export default function Chat() {
  const [selectedRoom, setSelectedRoom] = useState<ChatWritterType>(ChatWritterType.Author);

  // const serverSentEvent = useRef<EventSource | null>(null);

  const { data: chatRooms, isLoading } = useChatQuery(selectedRoom);

  // useEffect(() => {
  //   serverSentEvent.current = new EventSource('http://localhost:8000/chat/sse', {
  //     withCredentials: true,
  //   });

  //   serverSentEvent.current.addEventListener('open', () => {});

  //   serverSentEvent.current.addEventListener('message', e => {
  //     console.log(e);
  //   });
  // }, []);

  return (
    <>
      {isLoading && !chatRooms && (
        <>
          <TabSkelectonUI />
          <ChatSkelectonUI />
          <ChatSkelectonUI />
          <ChatSkelectonUI />
          <ChatSkelectonUI />
        </>
      )}
      {!isLoading && chatRooms && (
        <>
          <ul className='grid grid-cols-2 w-full'>
            <li
              className={`${
                selectedRoom === ChatWritterType.Author ? 'border-b-text-1 text-text-1' : ' border-b-gray-2 text-text-2'
              } border-b`}
            >
              <button
                className='w-full h-12 font-semibold text-xs'
                type='button'
                onClick={() => setSelectedRoom(ChatWritterType.Author)}
              >
                견주
              </button>
            </li>
            <li
              className={`${
                selectedRoom === ChatWritterType.Guest ? 'border-b-text-1 text-text-1' : 'border-b-gray-2 text-text-2'
              } border-b`}
            >
              <button
                type='button'
                className='w-full h-12 font-semibold text-xs'
                onClick={() => setSelectedRoom(ChatWritterType.Guest)}
              >
                펫시터
              </button>
            </li>
          </ul>
          <ul>
            {chatRooms.map(chatRoom => (
              <ChatRoomList key={chatRoom.id} chatRoom={chatRoom} />
            ))}
          </ul>
        </>
      )}
      {!isLoading && chatRooms && chatRooms.length === 0 && (
        <PuppyError.Container>
          <PuppyError.Title title='대화방이 존재 하지 않아요.' />
          <PuppyError.Desc text='산책을 해주는 펫시터와 대화해 보세요.' />
        </PuppyError.Container>
      )}
    </>
  );
}

interface ChatRoomListProps {
  chatRoom: ChatRoom;
}

function ChatRoomList({ chatRoom }: ChatRoomListProps) {
  const { post, user, guest_image, post_id, id, lastMessage } = chatRoom;

  return (
    <li>
      <NativeLink
        className='grid grid-cols-[90px_1fr] p-4'
        href={`/chat/${id}?postId=${post_id}`}
        type={RouterMethod.Push}
      >
        <div className='relative flex justify-end'>
          {guest_image ? (
            <Image
              className='absolute top-[-10px] left-0 rounded-full'
              src={guest_image}
              alt='guest image'
              width={50}
              height={50}
            />
          ) : (
            <div className='absolute top-[-10px] left-0 bg-gray-200 rounded-full h-[50px] w-[50px] flex justify-center items-center'>
              <IconUserDefault alt='default user image' width={40} height={40} />
            </div>
          )}
          <PetProfile pet={post.pet} height={60} width={60} className='z-10 !bg-gray-200 w-[60px]' />
        </div>
        <div className='flex flex-col justify-center pr-2 pl-4'>
          <div className='flex items-center'>
            <p className='mr-1 text-text-1'>{user.name}</p>
            <p className='text-xs text-gray-400 mr-1'>작전동</p>
            {lastMessage && <p className='text-xs text-gray-400'>{formatDiffTime(lastMessage.time)} 전</p>}
          </div>
          <div className='flex relative items-center'>
            <p className='text-sm text-gray-600 text-ellipsis line-clamp-1 min-h-5 pr-4'>
              {lastMessage && lastMessage.text}
            </p>
            {chatRoom.notReadedMessageCount > 0 && (
              <p className='absolute w-[24px] h-[24px] right-0 text-xs flex justify-center items-center bg-main-1 text-white-1 rounded-full'>
                {chatRoom.notReadedMessageCount}
              </p>
            )}
          </div>
        </div>
      </NativeLink>
    </li>
  );
}
