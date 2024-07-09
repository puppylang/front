'use client';

import { useState } from 'react';

import { useChatsQuery } from '@/services/chat';
import { ChatWritterType, ChatRoom } from '@/types/chat';
import { BOTTOM_NAVIGATION_HEIGHT } from '@/types/post';
import { WebviewActionType } from '@/types/route';
import { formatDiffTime } from '@/utils/date';

import NativeLink from '@/components/NativeLink';
import { Profile } from '@/components/Profile';
import { PuppyError } from '@/components/PuppyError';

import { ChatSkelectonUI } from './chatSkeletionUI';

export default function Chat() {
  const [selectedType, setSelectedType] = useState<ChatWritterType>(ChatWritterType.Author);

  const { data: chatRooms, isLoading } = useChatsQuery(selectedType);

  return (
    <section className='flex flex-col items-center'>
      <div className='container'>
        <ul className='tab grid grid-cols-2 w-full bg-white'>
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
          <ul className={`pb-[${BOTTOM_NAVIGATION_HEIGHT}px] mt-2`}>
            {chatRooms.map(chatRoom => (
              <ChatRoomList key={chatRoom.id} chatRoom={chatRoom} type={selectedType} />
            ))}
          </ul>
        )}

        {isLoading && !chatRooms && (
          <div className='pt-2'>
            <ChatSkelectonUI />
            <ChatSkelectonUI />
            <ChatSkelectonUI />
            <ChatSkelectonUI />
          </div>
        )}

        {!isLoading && chatRooms && chatRooms.length === 0 && (
          <PuppyError.Container className='min-h-[calc(100vh-68px)]'>
            <PuppyError.Title title='대화방이 존재 하지 않아요.' className='text-text-2' />
            <PuppyError.Desc text='산책을 해주는 펫시터와 대화해 보세요!' />
          </PuppyError.Container>
        )}
      </div>
    </section>
  );
}

interface ChatRoomListProps {
  chatRoom: ChatRoom;
  type: ChatWritterType;
}

function ChatRoomList({ chatRoom, type }: ChatRoomListProps) {
  const { post, user, guest, post_id, id, lastMessage } = chatRoom;

  const userImage = type === ChatWritterType.Author ? guest.image : user.image;

  return (
    <li>
      <NativeLink
        className='flex flex-row gap-x-4 p-4'
        href={`/chat/${id}?postId=${post_id}`}
        type={WebviewActionType.Push}
      >
        <div className='w-[50px]'>
          <Profile.User
            image={userImage || ''}
            imageClassName='!w-[50px] !h-[50px]'
            defaultUserDivClassName='!w-[50px] !h-[50px]'
          />
        </div>

        <div className='flex flex-col justify-center w-[calc(100%-76px)]'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex gap-x-1 items-center'>
              <p className='text-text-1 text-sm'>{type === ChatWritterType.Author ? guest.name : user.name}</p>
              <p className='text-[12px] text-text-2'>{post.preferred_walk_location}</p>
            </div>
            {lastMessage && <p className='text-[12px] text-text-2'>{formatDiffTime(lastMessage.time)} 전</p>}
          </div>

          <div className='flex relative items-center w-full justify-between'>
            <p className='text-[12px] text-text-2 font-medium text-ellipsis line-clamp-1 w-[calc(100%-36px)] min-h-5'>
              {lastMessage && lastMessage.text}
            </p>

            {chatRoom.notReadedMessageCount > 0 && (
              <p className='w-[20px] h-[20px] text-xs flex justify-center items-center bg-main-1 text-white-1 rounded-full'>
                {chatRoom.notReadedMessageCount}
              </p>
            )}
          </div>
        </div>
      </NativeLink>
    </li>
  );
}
