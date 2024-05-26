'use client';

import { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';

import useNativeRouter from '@/hooks/useNativeRouter';
import { getKakaoAuth, getNaverAuth } from '@/services/user';
import { LoggedFrom } from '@/types/user';
import { saveToken } from '@/utils/token';

import { LoddingJSON } from '../../../../public/assets/json';

export default function LoginSuccess() {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>();
  const router = useNativeRouter();

  const getUser = async (code: string, social: LoggedFrom) => {
    const { token, is_first_login } = social === LoggedFrom.Kakao ? await getKakaoAuth(code) : await getNaverAuth(code);
    saveToken(token);

    setIsFirstLogin(is_first_login);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const isKakaoLogin = Boolean(code);

    if (isKakaoLogin && code) {
      getUser(code, LoggedFrom.Kakao);
      return;
    }
    const url = new URL(window.location.href);
    const accessToken = url.hash.split('&')[0].split('=')[1];
    const isNaverLogin = Boolean(accessToken);
    if (isNaverLogin && accessToken) {
      getUser(accessToken, LoggedFrom.Naver);
    }
  }, []);

  useEffect(() => {
    if (isFirstLogin === undefined) return;
    if (isFirstLogin) {
      router.replace('/pets/new/login');
      return;
    }
    router.replace('/posts');
  }, [isFirstLogin, router]);

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <Lottie loop animationData={LoddingJSON} play className='w-36' />
    </div>
  );
}
