'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import useNativeRouter from '@/hooks/useNativeRouter';
import { usePetQuery } from '@/services/pet';
import { useMatchedPosts } from '@/services/post';
import { useUserQuery } from '@/services/user';

import Loading from '@/components/Loading';
import NativeLink from '@/components/NativeLink';
import { PetCardList } from '@/components/PetCardList';
import { PostSection } from '@/components/Post';

import ApiErrorFallback from '../user/error';

export default function WalkRolePickerComponent() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={ApiErrorFallback} onReset={reset}>
          <Suspense fallback={<Loading />}>
            <WalkRolePicker />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function WalkRolePicker() {
  const { data: pets } = usePetQuery();
  const { data: user } = useUserQuery();
  const { data: walkablePosts } = useMatchedPosts(user?.id);

  const router = useNativeRouter();

  const handleClickPetWalk = (petId: number) => {
    router.push(`/pet-walk/${petId}`);
  };

  const handleClickPetSitterWalk = (index: number) => {
    if (!walkablePosts) return;

    const selectedPostId = walkablePosts[index].id;
    router.push(`/pet-sitter-walk/${selectedPostId}`);
  };

  return (
    <section id='walk-role-picker' className='flex justify-center items-center'>
      <div className='container flex flex-col items-center p-4 min-h-[100vh] w-full'>
        <h2 className='text-center text-lg font-medium text-text-1 mt-8 mb-[64px]'>역할을 선택해 주세요!</h2>

        <div className='walk-pick-container w-full flex flex-col items-center gap-y-[64px]'>
          <div className='walk-pick flex-1 max-w-[400px] w-[100%]'>
            <p className='text-sm text-text-1 text-center mb-4'>
              <NumberIcon number={1} />
              나의 반려견으로 산책을 기록하고 싶어요!
            </p>

            <PetCardList pets={pets} type='select' onClick={handleClickPetWalk} />
          </div>

          <div className='pet-sitter-walk-pick flex-1 max-w-[400px] w-[100%]'>
            <p className='text-sm text-text-1 text-center mb-4'>
              <NumberIcon number={2} />
              펫시터로 산책 기록하고 싶어요!
            </p>

            {walkablePosts?.length ? (
              <PostSection.Slide posts={walkablePosts} type='BUTTON' onClick={handleClickPetSitterWalk} />
            ) : (
              <div className='flex flex-col justify-center items-center h-[112px] rounded-[10px] border-2 border-main-5'>
                <NativeLink href='/posts' webviewPushPage='home' className=''>
                  <p className='text-center text-sm text-text-2 leading-[20px]'>
                    신청 내역이 없습니다.
                    <br />
                    <span>신청하러 가볼까요?</span>
                  </p>
                </NativeLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface NumberIconProps {
  number: number;
}

function NumberIcon({ number }: NumberIconProps) {
  return (
    <span className='inline-block text-center leading-[22px] text-white font-xs w-6 h-6 rounded-full bg-main-1 mr-2'>
      {number}
    </span>
  );
}
