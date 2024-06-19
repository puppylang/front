'use client';

import { useState } from 'react';

import { useChatsQuery } from '@/services/chat';
import { ChatWritterType, ChatRoom } from '@/types/chat';
import { BOTTOM_NAVIGATION_HEIGHT } from '@/types/post';
import { RouterMethod } from '@/types/route';
import { formatDiffTime } from '@/utils/date';

import NativeLink from '@/components/NativeLink';
import { Profile } from '@/components/Profile';
import { PuppyError } from '@/components/PuppyError';

import { ChatSkelectonUI } from './chatSkeletionUI';

export default function Chat() {
  const [selectedType, setSelectedType] = useState<ChatWritterType>(ChatWritterType.Author);

  const { data: chatRooms, isLoading } = useChatsQuery(selectedType);

  return (
    <>
      <section className='container'>
        <ul className='grid grid-cols-2 w-full'>
          <li
            className={`${
              selectedType === ChatWritterType.Author ? 'border-b-text-1 text-text-1' : ' border-b-gray-2 text-text-2'
            } border-b`}
          >
            <button
              className='w-full h-12 font-semibold text-xs'
              type='button'
              onClick={() => setSelectedType(ChatWritterType.Author)}
            >
              견주
            </button>
          </li>
          <li
            className={`${
              selectedType === ChatWritterType.Guest ? 'border-b-text-1 text-text-1' : 'border-b-gray-2 text-text-2'
            } border-b`}
          >
            <button
              type='button'
              className='w-full h-12 font-semibold text-xs'
              onClick={() => setSelectedType(ChatWritterType.Guest)}
            >
              펫시터
            </button>
          </li>
        </ul>
        {chatRooms && !isLoading && (
          <ul className={`pb-[${BOTTOM_NAVIGATION_HEIGHT}px]`}>
            {chatRooms.map(chatRoom => (
              <ChatRoomList key={chatRoom.id} chatRoom={chatRoom} type={selectedType} />
            ))}
          </ul>
        )}
        {isLoading && !chatRooms && (
          <>
            <ChatSkelectonUI />
            <ChatSkelectonUI />
            <ChatSkelectonUI />
            <ChatSkelectonUI />
          </>
        )}
      </section>
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
  type: ChatWritterType;
}

function ChatRoomList({ chatRoom, type }: ChatRoomListProps) {
  const { post, user, guest, post_id, id, lastMessage } = chatRoom;

  const userImage = type === 'AUTHOR' ? guest.image : user.image;

  return (
    <li>
      <NativeLink
        className='grid grid-cols-[90px_1fr] p-4'
        href={`/chat/${id}?postId=${post_id}`}
        type={RouterMethod.Push}
      >
        <div className='relative flex justify-end'>
          <Profile.User
            image={userImage || ''}
            imageClassName='absolute top-[-10px] left-0'
            defaultUserDivClassName='absolute top-[-10px] left-0'
          />
          <Profile.Pet pet={post.pet} height={60} width={60} className='z-10 !bg-gray-200 w-[60px]' />
        </div>
        <div className='flex flex-col justify-center pr-2 pl-4'>
          <div className='flex items-center'>
            <p className='mr-1 text-text-1'>{type === ChatWritterType.Author ? guest.name : user.name}</p>
            <p className='text-xs text-gray-400 mr-1'>{post.preferred_walk_location}</p>
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
