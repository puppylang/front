'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { PostItem } from '@/app/posts/PostItem';
import useNativeRouter from '@/hooks/useNativeRouter';
import { usePetQuery } from '@/services/pet';
import { getPostsWithPaging } from '@/services/post';
import { Post as IPost } from '@/types/post';

import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import { PetCardList } from '@/components/PetCardList';
import { Section } from '@/components/Section';

import ApiErrorFallback from '../user/error';

export default function PostComponent() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={ApiErrorFallback} onReset={reset}>
          <Suspense fallback={<Loading />}>
            <Post />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function Post() {
  const router = useNativeRouter();
  const { data: pets } = usePetQuery();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [observeTarget, setObserveTarget] = useState<Element | null>(null);

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const fetchPostData = useCallback(async () => {
    setIsLoading(true);

    if (last) return setIsLoading(false);

    if (!last) {
      const data = await getPostsWithPaging({ page });

      if (data) {
        setPosts(prev => [...prev, ...data.content]);
        setLast(data.last);
      }
      setPage(prev => prev + 1);
      setIsLoading(false);
    }
  }, [last, page]);

  const onIntersect: IntersectionObserverCallback = useCallback(
    ([entry]) => {
      if (last || isLoading) return;

      if (entry.isIntersecting) {
        fetchPostData();
      }
    },
    [fetchPostData, isLoading, last],
  );

  useEffect(() => {
    if (!observeTarget) return;

    const observe: IntersectionObserver = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    });

    observe.observe(observeTarget);

    return () => observe.unobserve(observeTarget);
  }, [observeTarget, onIntersect]);

  const handleClickWrite = () => {
    if (!pets?.length) return setIsAlertOpen(true);

    router.push('/posts/write');
  };

  return (
    <>
      <section className='flex flex-col items-center'>
        <Section.Container className='pt-[0px] pb-[0px]'>
          <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>
            퍼피랑 홈 및 구인 게시글 페이지
          </h1>

          <div className='head flex justify-between items-center py-[24px]'>
            <h2 className='logo font-Jalnan text-xl text-main-3'>퍼피랑</h2>
            <button type='button' className='text-sm bg-main-1 text-white w-[80px] py-2 rounded-[10px]'>
              내 동네
            </button>
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

      <section className='post-container flex flex-col items-center'>
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

          {posts?.length > 0 ? (
            <ul className='post-list flex flex-col gap-4 animation-load'>
              {posts?.map(postItem => <PostItem key={postItem.id} post={postItem} />)}
            </ul>
          ) : (
            <div className='flex justify-center items-center h-[300px]'>
              <p className='text-text-2'>등록된 구인 게시글이 없습니다.</p>
            </div>
          )}
          <div ref={setObserveTarget}>{isLoading && <Loading />}</div>
        </Section.Container>
      </section>

      <Alert
        title='아직 등록된 반려견이 없습니다.'
        message='등록하러 가보실까요?'
        isOpen={isAlertOpen}
        buttonText='등록하러가기'
        onClick={() => router.push('/pets/new')}
        onClose={() => setIsAlertOpen(false)}
      />
    </>
  );
}
