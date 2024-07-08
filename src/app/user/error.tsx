'use client';

import { useEffect } from 'react';
import { FallbackProps } from 'react-error-boundary';

import { RouterMethod, StackPushRoute } from '@/types/route';

import NativeLink from '@/components/NativeLink';

import { StackPushRoute } from '../../types/route';

export default function ApiErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    // eslint-disable-next-line
    console.error(error);
  }, [error]);

  return (
    <section className='flex flex-col justify-center items-center gap-y-4 h-screen p-4'>
      <h3 className='text-lg text-text-1 text-center'>서비스에 접속할 수 없습니다.</h3>

      <p className='text-sm text-text-2 text-center mb-2'>
        불편을 드려 죄송합니다.
        <br />
        일시적인 서버 오류로 접속이 되지 않습니다. <br />
        네트워크를 확인해 주세요.
      </p>
      <div className='flex items-center gap-x-2'>
        <button
          type='button'
          onClick={resetErrorBoundary}
          className='py-2 w-[120px] text-sm border border-main-1 text-main-1 rounded-[10px]'
        >
          다시 시도하기
        </button>
        <NativeLink
          href='/'
          webviewPushPage={StackPushRoute.Login}
          type={RouterMethod.Replace}
          className='py-2 w-[120px] text-sm text-white  border border-main-1 bg-main-1 text-center rounded-[10px]'
        >
          홈으로 가기
        </NativeLink>
      </div>
    </section>
  );
}
