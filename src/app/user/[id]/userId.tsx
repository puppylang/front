'use client';

import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';

import { usePetQuery } from '@/services/pet';

import NativeLink from '@/components/NativeLink';
import { PetCardList } from '@/components/PetCardList';
import UserPostList from '@/components/UserPostList';

import ErrorImage from '../../../../public/empty_chat.png';
import { useOthersQuery } from '../../../services/user';

interface UserId {
  id: string;
}

export default function UserId({ id }: UserId) {
  const { data: user } = useOthersQuery(id);
  const { data: pets } = usePetQuery(id);

  return user ? (
    <>
      <section>
        <div className='container bg-white'>
          <div className='flex w-full items-center justify-between p-4'>
            <div className='grid grid-cols-[70px_1fr] items-center gap-x-4'>
              <div>
                {user && user.image ? (
                  <Image className='rounded-full' src={user.image} alt='profile' width={70} height={70} />
                ) : (
                  <FaUserCircle color='#dee1e4' className='w-[70px] h-[70px]' />
                )}
              </div>
              <div className='font-semibold pr-4'>
                <h2 className='text-base text-text-1'>
                  <strong className='text-main-3 font-Jalnan'>{user ? user.name : ''}</strong>님
                </h2>
                <p className='text-xs text-text-1 line-clamp-3'>{user.character}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='flex flex-col items-center border-t border-t-1 border-gray-3 w-full'>
        <div className='container bg-white p-4 flex flex-col gap-y-1'>
          <p className='font-bold text-text-2'>반려견 정보🐾</p>
          <PetCardList pets={pets} type='slide' />
        </div>
      </section>

      <section className='border-t border-t-1 border-gray-3 '>
        <h3 className='pb-2 bg-white p-3 font-bold text-text-2'>나의 글</h3>
        <UserPostList authorId={id} />
      </section>
    </>
  ) : (
    <section className='container flex flex-col items-center justify-center font-bold h-screen'>
      <Image src={ErrorImage} width={130} height={130} alt='error' />
      <p className='text-lg mt-1 mb-5'>해당 유저가 존재하지 않아요.</p>
      <NativeLink href='/posts' className='bg-main-1 text-white-1 px-10 py-2 rounded-md'>
        홈으로 가기
      </NativeLink>
    </section>
  );
}
