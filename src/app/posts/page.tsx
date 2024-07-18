'use client';

import * as Sentry from '@sentry/nextjs';
import { QueryErrorResetBoundary, useMutation, useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';

import PostListSkeletonUI from '@/components/SkeletonUI/PostListSkeletonUI';
import useNativeRouter from '@/hooks/useNativeRouter';
import { usePetQuery } from '@/services/pet';
import {
  ACTIVED_REGION_QUERY_KEY,
  updateActivedRegion,
  useActiveRegionQuery,
  useUserRegionQuery,
} from '@/services/region';
import { useUserQuery } from '@/services/user';
import { BOTTOM_NAVIGATION_HEIGHT, PostAlertConfig } from '@/types/post';
import { formatRegionTitle } from '@/utils/region';

import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import NativeLink from '@/components/NativeLink';
import { PetCardList } from '@/components/PetCardList';
import { Section } from '@/components/Section';

import PostList from './PostList';
import UserActivedRegionSheet from './UserActivedRegionSheet';

export default function PostComponent() {
  return (
    <QueryErrorResetBoundary>
      <Suspense fallback={<Loading />}>
        <Post />
      </Suspense>
    </QueryErrorResetBoundary>
  );
}

function Post() {
  const router = useNativeRouter();
  const queryClient = useQueryClient();

  const { data: user } = useUserQuery();
  const { data: pets } = usePetQuery();
  const { data: regions } = useUserRegionQuery();
  const { data: activedRegion, isLoading: isActivedRegionLoading } = useActiveRegionQuery();

  const [alertConfig, setAlertConfig] = useState<PostAlertConfig>({
    type: null,
    isOpen: false,
    title: '',
    message: '',
  });
  const [isEditingActiveRegion, setIsEditingActiveRegion] = useState(false);
  const [isTopSheetOpen, setIsTopSheetOpen] = useState(false);

  const updateActivedRegionMutation = useMutation({
    mutationFn: (regionId: number) => updateActivedRegion(regionId),
    mutationKey: [ACTIVED_REGION_QUERY_KEY],
    onSuccess: data => {
      setIsEditingActiveRegion(false);
      queryClient.setQueryData([ACTIVED_REGION_QUERY_KEY], () => {
        return data;
      });
    },
  });

  const userActivedRegion = useMemo(() => activedRegion || null, [activedRegion]);

  const userRegions = useMemo(() => {
    if (!regions || regions.length < 1) return [];

    const sortedRegion = regions.sort((a, b) => {
      if (!userActivedRegion) {
        return 0;
      }
      if (a.id === userActivedRegion?.region_id) {
        return -1;
      }
      if (b.id === userActivedRegion?.region_id) {
        return 1;
      }
      return 0;
    });

    return sortedRegion;
  }, [regions, userActivedRegion]);

  const currentActivedRegion =
    userActivedRegion && userRegions.find(region => region.id === userActivedRegion.region_id);

  const handleClickWrite = () => {
    if (!userActivedRegion) {
      return setAlertConfig({
        type: 'REGION',
        isOpen: true,
        title: '아직 등록된 대표동네가 없습니다.',
        message: '등록하러 가보실까요?',
      });
    }

    if (!pets?.length) {
      return setAlertConfig({
        type: 'PET',
        isOpen: true,
        title: '아직 등록된 반려견이 없습니다.',
        message: '등록하러 가보실까요?',
      });
    }

    router.push('/posts/write');
  };

  const handleTopSheet = () => setIsTopSheetOpen(prev => !prev);

  const handleUpdateActivedRegion = (id: number) => {
    updateActivedRegionMutation.mutate(id);
    handleTopSheet();
    setIsEditingActiveRegion(true);
  };

  useEffect(() => {
    if (!user) return;
    Sentry.setUser({
      Name: user.name,
      ID: user.id,
    });
  }, [user]);

  return (
    <>
      <section className='flex flex-col items-center'>
        <Section.Container className='pt-[0px] pb-[0px]'>
          <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>
            퍼피랑 홈 및 구인 게시글 페이지
          </h1>

          <div className='head flex justify-between items-center py-[24px]'>
            <h2 className='logo font-Jalnan text-xl text-main-3'>퍼피랑</h2>

            {user && !isActivedRegionLoading && !isEditingActiveRegion ? (
              <button
                type='button'
                className='text-sm bg-main-1 text-white w-[80px] py-2 rounded-[10px]'
                onClick={handleTopSheet}
              >
                {currentActivedRegion ? formatRegionTitle(currentActivedRegion.region) : '동네 설정'}
              </button>
            ) : (
              <div className='flex items-center justify-center text-sm bg-main-1 text-white w-[80px] h-[36px] py-2 rounded-[10px]'>
                <CgSpinner className='text-white animate-spin w-5 h-5' />
              </div>
            )}
          </div>
        </Section.Container>
      </section>

      <section className='pet-info-container flex flex-col items-center'>
        <Section.Container className='flex flex-col py-[0px] '>
          <Section.Title title='저의 사랑스러운 반려견입니다! 🐾' />
          <PetCardList pets={pets} type='slide' />
        </Section.Container>
        <div className='' />
      </section>

      <section className={`post-container flex flex-col items-center pb-[${BOTTOM_NAVIGATION_HEIGHT}px]`}>
        <Section.Container className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <Section.Title title='산책해주실 분을 구하고 있어요 ! :)' className='mb-[0px]' />

            <button
              type='button'
              className='text-sm px-5 pb-1 h-[35px] leading-[33px] rounded-[10px] bg-white-1 border-[1px] border-gray-1 text-text-2'
              onClick={handleClickWrite}
            >
              글쓰기
            </button>
          </div>
          {/* </div> */}

          {isActivedRegionLoading && <PostListSkeletonUI />}

          {!isActivedRegionLoading && !userActivedRegion ? (
            <div className='flex flex-col justify-center items-center gap-y-2 h-[300px]'>
              <p className='text-text-2 font-Jalnan'>등록된 동네가 없습니다.</p>
              <NativeLink
                href='/user/region'
                webviewPushPage='home'
                className='bg-main-2 text-white text-xs px-6 py-2 rounded-[10px]'
              >
                등록하러가기
              </NativeLink>
            </div>
          ) : (
            currentActivedRegion && <PostList region={currentActivedRegion.region} />
          )}
        </Section.Container>
      </section>

      <Alert
        title={alertConfig.title}
        message={alertConfig.message}
        isOpen={alertConfig.isOpen}
        buttonText='등록하러가기'
        onClick={() => router.push(alertConfig.type === 'PET' ? '/pets/new' : '/user/region')}
        onClose={() => setAlertConfig({ type: null, isOpen: false, title: '', message: '' })}
      />

      {user && userRegions && (
        <UserActivedRegionSheet
          isOpen={isTopSheetOpen}
          regions={userRegions}
          activedRegion={userActivedRegion}
          onClick={handleUpdateActivedRegion}
          onClose={handleTopSheet}
        />
      )}
    </>
  );
}
