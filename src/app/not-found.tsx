'use client';

import { StackPushRoute } from '@/types/route';

import NativeLink from '@/components/NativeLink';

export default function NotFound() {
  return (
    <section className='flex flex-col justify-center items-center h-screen p-4'>
      <h2 className='font-Jalnan text-text-1 mb-1'>페이지가 존재하지 않습니다.</h2>
      <p className='text-sm text-text-2 text-center mb-3'>불편을 드려 죄송합니다.</p>
      <NativeLink
        href='/'
        webviewPushPage={StackPushRoute.Login}
        className='bg-main-2 text-white text-sm px-6 py-2 rounded-[10px]'
      >
        홈으로 가기
      </NativeLink>
    </section>
  );
}
