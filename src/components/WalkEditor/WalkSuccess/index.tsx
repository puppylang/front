'use client';

import useNativeRouter from '@/hooks/useNativeRouter';
import { StackPushRoute } from '@/types/route';
import { WalkForm, WalkRole } from '@/types/walk';
import { formatDate } from '@/utils/date';

import NativeLink from '@/components/NativeLink';

import WalkSuccessContainer from './WalkSuccessContainer';
import WalkSuccessSkeletonUI from './WalkSuccessSkeletonUI';
import { IconClose, IconInfo } from '../../../../public/assets/svgs';

interface WalkSuccessProps {
  type: WalkRole;
  data: WalkForm | undefined;
}

function WalkSuccess({ type, data }: WalkSuccessProps) {
  const router = useNativeRouter();

  const handleGoTO = () => router.push('/posts', { webviewPushPage: StackPushRoute.Posts });

  return (
    <section id='walkSuccessForm' className='flex flex-col items-center bg-white w-full'>
      <div className='container p-4  min-h-[100vh]'>
        <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>산책 기록 완료 페이지</h1>

        {data ? (
          <>
            <div className='record-info flex flex-col gap-y-2'>
              <div className='date flex justify-between items-center'>
                {data.created_at && (
                  <span className='text-[10px] text-text-2 font-light'>{formatDate(data.created_at)}</span>
                )}

                <button type='button' onClick={handleGoTO}>
                  <IconClose />
                </button>
              </div>
              <h2 className='text-text-1 text-base font-semibold'>오늘 하루도 추억을 쌓으셨네요!</h2>
            </div>

            <WalkSuccessContainer walkData={data} title={`${data.pet?.name}와(과) 산책을 완료했어요.`} type={type} />

            <div className='next-info mt-8'>
              <p className='flex gap-x-1 items-center text-[12px] text-text-1 '>
                <span>
                  <IconInfo />
                </span>
                {type === WalkRole.PetOwner
                  ? '다른 반려동물과도 산책을 기록해보세요!'
                  : '나의 반려동물을 등록하고 산책을 기록해보세요!'}
              </p>

              <NativeLink
                href='/posts'
                webviewPushPage={StackPushRoute.Posts}
                className='block w-full mt-4 bg-main-2 text-sm text-white text-center h-[45px] leading-[45px] rounded-[10px]'
              >
                둘러보러 가기
              </NativeLink>
            </div>
          </>
        ) : (
          <WalkSuccessSkeletonUI>
            <div className='flex justify-between'>
              <div className='animate-pulse bg-bg-blue w-[65px] h-[25px] rounded-[10px]' />
              <div className='animate-pulse bg-bg-blue w-[25px] h-[25px] rounded-[10px]' />
            </div>

            <div className='animate-pulse bg-bg-blue h-[35px] rounded-[10px] mt-2' />
          </WalkSuccessSkeletonUI>
        )}
      </div>
    </section>
  );
}

export default WalkSuccess;
