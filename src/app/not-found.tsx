'use client';

import { StackPushRoute } from '@/types/route';

import NativeLink from '@/components/NativeLink';

export default function NotFound() {
  return (
    <section className='flex flex-col justify-center items-center h-screen p-4'>
      <h2 className='font-Jalnan text-text-1 mb-2'>요청하신 페이지를 찾을 수 없습니다.</h2>
      <p className='text-text-2 text-sm'>페이지의 주소가 잘못되었습니다.</p>
      <p className='text-text-2 text-sm mb-4'>입력하신 주소가 정확한지 다시 한번 확인해 주세요.</p>
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
