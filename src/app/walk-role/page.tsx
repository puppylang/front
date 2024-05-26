'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { usePetQuery } from '@/services/pet';

import Loading from '@/components/Loading';
import { PetCardList } from '@/components/PetCardList';

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
  const [notifications, setNotifications] = useState([]); // TODO

  const router = useRouter();

  const handleClickPetWalk = (petId: number) => {
    router.push(`/pet-walk/${petId}`);
  };

  // TODO
  const handleClickPetSitterWalk = (postId: number) => {
    // onSelectNotification(postId);
    // setWalkRole(WalkRole.PetSitterWalker);
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

            {notifications.length ? (
              // TODO 여기서는 Post Id 혹은 notification Id선택될 예정
              <div>신청 내역에서 선택하는 UI</div>
            ) : (
              <div className='flex flex-col justify-center items-center h-[112px] rounded-[10px] border-2 border-main-5'>
                <Link href='/posts' className=''>
                  <p className='text-center text-sm text-text-2 leading-[20px]'>
                    신청 내역이 없습니다.
                    <br />
                    <span>신청하러 가볼까요?</span>
                  </p>
                </Link>
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
