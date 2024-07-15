'use client';

import { StackPushRoute } from '@/types/route';

import NativeLink from '@/components/NativeLink';

interface ErrorComponentProps {
  error: Error & { digest?: string } & { response: Response } & { status: number };
  reset: () => void;
}

export default function ErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <section className='flex flex-col justify-center items-center h-screen p-4'>
      {error.status === 401 && (
        <>
          <h3 className='text-lg font-semibold text-text-1 text-center mb-3'>서비스에 접속할 수 없습니다</h3>
          <p className='text-sm text-text-2 text-center '>유저 권한이 확인되지 않습니다.</p>
          <p className='text-sm text-text-2 text-center '>불편을 드려 죄송합니다.</p>
          <p className='text-sm text-text-2 text-center mb-6'>로그인을 다시 진행해주세요.</p>
          <div className='flex items-center gap-x-2'>
            <button
              type='button'
              onClick={() => reset()}
              className='py-2 w-[120px] text-sm border border-main-1 text-main-1 rounded-[10px]'
            >
              다시 시도
            </button>
            <NativeLink
              href='/'
              webviewPushPage={StackPushRoute.Login}
              className='py-2 w-[120px] text-sm text-white  border border-main-1 bg-main-1 text-center rounded-[10px]'
            >
              홈으로 가기
            </NativeLink>
          </div>
        </>
      )}
      {error.status === 500 && (
        <>
          <h3 className='text-lg font-semibold text-text-1 text-center mb-3'>서비스에 접속할 수 없습니다.</h3>
          <p className='text-sm text-text-2 text-center'>네트워크에 접속할 수 없습니다.</p>
          <p className='text-sm text-text-2 text-center'>불편을 드려 죄송합니다.</p>
          <p className='text-sm text-text-2 text-center mb-6'>잠시 후 다시 이용해주세요.</p>
          <div className='flex items-center gap-x-2'>
            <NativeLink
              href='/'
              webviewPushPage={StackPushRoute.Login}
              className='py-2 w-[120px] text-sm text-white  border border-main-1 bg-main-1 text-center rounded-[10px]'
            >
              홈으로 가기
            </NativeLink>
          </div>
        </>
      )}
      {error.status === 400 && (
        <>
          <h3 className='text-lg font-semibold text-text-1 text-center mb-3'>서비스에 접속할 수 없습니다.</h3>
          <p className='text-sm text-text-2 text-center'>요청에 에러가 있습니다.</p>
          <p className='text-sm text-text-2 text-center'>불편을 드려 죄송합니다.</p>
          <p className='text-sm text-text-2 text-center mb-6'>잠시 후 다시 이용해주세요.</p>
          <div className='flex items-center gap-x-2'>
            <NativeLink
              href='/'
              webviewPushPage={StackPushRoute.Login}
              className='py-2 w-[120px] text-sm text-white  border border-main-1 bg-main-1 text-center rounded-[10px]'
            >
              홈으로 가기
            </NativeLink>
          </div>
        </>
      )}
    </section>
  );
}
