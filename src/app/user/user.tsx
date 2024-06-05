'use client';

import { QueryErrorResetBoundary, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FaUserCircle } from 'react-icons/fa';
import { MdArrowForwardIos } from 'react-icons/md';

import useNativeRouter from '@/hooks/useNativeRouter';
import { usePetQuery } from '@/services/pet';
import { deleteUser, logoutUser, useUserQuery } from '@/services/user';

import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import NativeLink from '@/components/NativeLink';
import { PetCardList } from '@/components/PetCardList';

import ApiErrorFallback from './error';
import EditProfile from '../../../public/edit_profile.png';

export default function UserComponent() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={ApiErrorFallback} onReset={reset}>
          <Suspense fallback={<Loading />}>
            <User />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function User() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: pets } = usePetQuery();
  const { data: user } = useUserQuery();

  const router = useNativeRouter();
  const queryClient = useQueryClient();

  const onClickLogoutBtn = async () => {
    if (!user) return;
    const status = await logoutUser(user.id, user.logged_from);

    if (status === 201) {
      queryClient.clear();
      router.replace('/');
    }
  };

  const onClickPetCard = (id: number) => {
    router.push(`/pets/edit/${id}`);
  };

  const onClickAlertBtn = async () => {
    if (!user) return;
    const status = await deleteUser(user.id, user.logged_from);
    if (status === 201) {
      queryClient.clear();
      router.replace('/');
    }
  };

  return (
    <>
      <section className='flex flex-col items-center'>
        <div className='container bg-white'>
          <div className='flex w-full items-center justify-between p-4'>
            <div className='flex items-center gap-x-4'>
              <div className='image-container'>
                {user && user.image ? (
                  <Image
                    className='w-[70px] h-[70px] rounded-full'
                    src={user.image}
                    alt='profile'
                    width={70}
                    height={70}
                  />
                ) : (
                  <FaUserCircle color='#dee1e4' className='w-[70px] h-[70px]' />
                )}
              </div>
              <div className='font-semibold'>
                <h2 className='text-base text-text-2'>
                  <strong className='text-main-3 font-Jalnan'>{user ? user.name : ''}</strong>님,
                  <br />
                  반가워요 :)
                </h2>
              </div>
            </div>

            <div className='link-btn-container'>
              <NativeLink
                href='/user/edit'
                webviewPushPage='detail'
                className='flex items-center border border-gray-2 text-text-2 text-[12px] px-4 py-2 rounded-xl'
              >
                <Image src={EditProfile} alt='edit profile' className='w-[16px] h-[16px]' />
                <p className='pl-1'>프로필 수정</p>
              </NativeLink>
            </div>
          </div>
        </div>
      </section>

      <section className='flex flex-col items-center border-t border-t-1 border-gray-3 w-full'>
        <div className='container bg-white p-4 flex flex-col gap-y-4'>
          <p className='font-semibold text-text-2'>나의 반려견 🐾</p>
          <PetCardList showsAddCard pets={pets} type='slide' onClick={onClickPetCard} />
        </div>
      </section>

      <section className='flex flex-col items-center mt-4'>
        <div className='container bg-white p-4'>
          <h3 className='text-text-2 font-semibold text-sm pb-3'>나의 활동</h3>
          <ul className='text-text-1'>
            <ProfileLinkList text='내 게시글' href='/user/posts' />
            <ProfileLinkList text='좋아요 목록' href='/user/liked-posts' />
            <ProfileLinkList text='산책 신청목록' href='/' />
            <ProfileLinkList text='산책 일지' href='/user/record-walks' border='none' />
          </ul>
        </div>
      </section>

      <section className='flex flex-col items-center mt-4'>
        <div className='container bg-white p-4'>
          <h3 className='text-text-2 font-semibold text-sm pb-3'>기타</h3>
          <ul className='text-text-1'>
            <ProfileLinkList text='내 동네 설정' href='/user/region' />
            <li className='border-b border-b-gray-3 text-sm '>
              <button type='button' className='text-left py-3 w-full' onClick={onClickLogoutBtn}>
                로그아웃
              </button>
            </li>
            <li className='text-sm'>
              <button type='button' className='text-left py-3 w-full' onClick={() => setIsOpen(true)}>
                회원탈퇴
              </button>
            </li>
            <Alert
              title='정말 탈퇴하시겠어요?'
              message='계정은 삭제되며 복구되지 않습니다.'
              isOpen={isOpen}
              buttonText='탈퇴'
              onClick={onClickAlertBtn}
              onClose={() => setIsOpen(false)}
            />
          </ul>
        </div>
      </section>
    </>
  );
}

interface ProfileLinkListProps {
  text: string;
  href: string;
  border?: string;
}

function ProfileLinkList({ text, href, border }: ProfileLinkListProps) {
  return (
    <li>
      <NativeLink
        href={href}
        className={`flex w-full justify-between items-center ${
          border === 'none' ? '' : 'border-b border-b-gray-3'
        } text-sm py-3`}
      >
        {text}
        <MdArrowForwardIos />
      </NativeLink>
    </li>
  );
}
