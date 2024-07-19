'use client';

import { useCallback, useEffect, useState } from 'react';

import { PostSkeletonUI } from '@/components/SkeletonUI/PostListSkeletonUI';
import { getUserSubmittedPosts } from '@/services/user';
import { Post } from '@/types/post';

import { HeaderNavigation } from '@/components/HeaderNavigation';
import { PostSection } from '@/components/Post';

function UserSubmittedPosts() {
  const [submittedPosts, setSubmittedPsots] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [observeTarget, setObserveTarget] = useState<Element | null>(null);

  const fetchSubmittedPosts = useCallback(async () => {
    setIsFetching(true);

    if (last) return setIsFetching(false);

    if (!last) {
      const data = await getUserSubmittedPosts({ page, size: 20 });

      if (data) {
        setSubmittedPsots(prev => [...prev, ...data.content]);
        setLast(data.last);
      }

      setPage(prev => prev + 1);
      setIsFetching(false);
    }
  }, [last, page]);

  const onIntersect: IntersectionObserverCallback = useCallback(
    ([entry]) => {
      if (last || isFetching) return;
      if (entry.isIntersecting) {
        fetchSubmittedPosts();
      }
    },
    [fetchSubmittedPosts, isFetching, last],
  );

  useEffect(() => {
    if (!observeTarget || !submittedPosts.length) return;

    const observe: IntersectionObserver = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    });

    observe.observe(observeTarget);

    return () => observe.unobserve(observeTarget);
  }, [observeTarget, onIntersect]);

  useEffect(() => {
    fetchSubmittedPosts();
  }, []);

  return (
    <section id='submitted-posts' className='flex flex-col items-center'>
      <div className='container'>
        <HeaderNavigation.Container>
          <HeaderNavigation.Title text='산책 신청목록' />
        </HeaderNavigation.Container>

        <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>산책 신청목록</h1>

        <div className='post-list p-4'>
          {submittedPosts.length === 0 && isFetching && <PostSkeletonUI.List />}

          {submittedPosts.length !== 0 && (
            <>
              <PostSection.List
                posts={submittedPosts}
                className='animation-load'
                itemClassName='shadow-[0_2px_4px_0_rgba(76,76,76,0.1)]'
              />
              {isFetching && (
                <div className='list-none animate-pulse w-full h-[112px] bg-white rounded-[10px] shadow-[0_2px_4px_0_rgba(76,76,76,0.1)]' />
              )}
            </>
          )}

          {!isFetching && !submittedPosts.length && (
            <div className='flex justify-center items-center h-[500px]'>
              <p className='text-text-2'>산책을 신청한 내역이 없습니다.</p>
            </div>
          )}

          <div ref={setObserveTarget} />
        </div>
      </div>
    </section>
  );
}

export default UserSubmittedPosts;
