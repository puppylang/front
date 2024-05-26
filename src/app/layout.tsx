'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';

import ReactQueryProvider from '@/components/ReactQueryProvider/ReactQueryProvider';
import './styles';

const KAKAO_MAP_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&libraries=services,clusterer,drawing&autoload=false`;

/* eslint-disable */
declare global {
  interface Window {
    kakao: any;
    Kakao: any;
    naver: any;
    ReactNativeWebView: any;
  }
}
/* eslint-enable */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
    }
  }, []);

  return (
    <html lang='ko'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <script
          src='https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js'
          integrity='sha384-6MFdIr0zOira1CHQkedUqJVql0YtcZA1P0nbPrQYJXVJZUkTk/oX4U9GhUIs3/z8'
          crossOrigin='anonymous'
          async
        />
        <script type='text/javascript' src='https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js' async />
      </head>
      <body>
        <RecoilRoot>
          <ReactQueryProvider>
            <main className='font-Pretendard bg-bg-blue min-h-[100vh]'>{children}</main>
            <div id='portal-root' />
            <div id='toast-root' />
            <Script src={KAKAO_MAP_URL} strategy='beforeInteractive' />
          </ReactQueryProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
