'use client';

import Image from 'next/image';
import { MouseEvent, useEffect, useRef } from 'react';

import AppleLoginLogo from '../../public/apple_login_logo.png';
import KakaoLoginLogo from '../../public/kakao_login_logo.png';
import LoginLogo from '../../public/login_logo.png';
import NaverLoginLogo from '../../public/naver_login_logo.png';

export default function Home() {
  const onClickKakaoBtn = () => {
    const { Kakao } = window;
    Kakao.Auth.authorize({
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    });
  };

  return (
    <section className="h-screen font-['Open-Sans']">
      <div className='h-screen flex flex-col bg-main-5'>
        <div className='flex flex-col items-center h-64 relative'>
          <Image src={LoginLogo} alt='login puppy' width={167} className='z-10 absolute bottom-[-97px]' />
        </div>
        <div
          className='text-center w-100 bg-white-1 rounded-t-[15px] h-full pt-16'
          style={{ borderTop: '2px solid #6B4A42' }}
        >
          <div className='text-text-3 font-semibold pb-16 text-[16px]'>
            <p>퍼피랑과 함께</p>
            <p>즐거운 산책을 시작해 볼까요?</p>
          </div>
          <div className='w-full flex flex-col items-center'>
            <button
              type='button'
              onClick={onClickKakaoBtn}
              className='px-5 w-[311px] h-[45px] flex items-center justify-center rounded-[15px] mb-5 bg-[#FEE600] relative'
            >
              <Image src={KakaoLoginLogo} alt='kakao login logo' className='absolute left-5 w-[16px] h-[16px]' />
              <p className='text-center text-[12px]'>카카오톡으로 계속하기</p>
            </button>
            <NaverLoginButton />
            <AppleLoginButtn />
          </div>
        </div>
      </div>
    </section>
  );
}

function NaverLoginButton() {
  const naverLoginBtnRef = useRef<HTMLDivElement>(null);
  const onClickNaverBtn = () => {
    if (naverLoginBtnRef && naverLoginBtnRef.current && naverLoginBtnRef.current.children[0].tagName === 'A') {
      (naverLoginBtnRef.current.children[0] as HTMLAnchorElement).click();
    }
  };

  useEffect(() => {
    if (!window.naver) return;
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      callbackUrl: process.env.NEXT_PUBLIC_REDIRECT_URI,
      isPopup: false,
      loginButton: {
        color: 'green',
        type: 3,
        height: 50,
      },
    });
    if (!naverLogin) return;
    naverLogin.init();
  }, []);

  return (
    <>
      <div id='naverIdLogin' className='hidden' ref={naverLoginBtnRef} />
      <button
        type='button'
        className='px-5 w-[311px] h-[45px] flex items-center justify-center rounded-[15px] mb-5 bg-[#02C759] relative'
        onClick={onClickNaverBtn}
      >
        <Image src={NaverLoginLogo} alt='kakao login logo' className='absolute left-5 w-[16px] h-[16px]' />
        <p className='text-center text-white-1 text-[12px]'>네이버로 계속하기</p>
      </button>
    </>
  );
}

function AppleLoginButtn() {
  const onClickAppleBtn = (event: MouseEvent) => {
    event.preventDefault();
    const CLIENT_ID = process.env.NODE_ENV === 'development' ? 'com.test.puppylang' : 'com.puppylang';
    window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&response_mode=fragment&response_type=code id_token`;
  };

  return (
    <button
      type='button'
      onClick={onClickAppleBtn}
      className='px-5 w-[311px] h-[45px] flex items-center justify-center rounded-[15px] mb-5 bg-text-1 relative'
    >
      <Image src={AppleLoginLogo} alt='apple login logo' className='absolute left-5 w-[16px]' />
      <p className='text-white-1 text-center text-[12px]'>애플로 계속하기</p>
    </button>
  );
}
