'use client';

import { useCallback, useEffect, useState } from 'react';

import { getUserSubmittedPosts } from '@/services/user';
import { Post } from '@/types/post';

import { HeaderNavigation } from '@/components/HeaderNavigation';
import { PostSection } from '@/components/Post';

function UserSubmittedPosts() {
  const [submittedPosts, setSubmittedPsots] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
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
    if (!observeTarget) return;

    const observe: IntersectionObserver = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    });

    observe.observe(observeTarget);

    return () => observe.unobserve(observeTarget);
  }, [observeTarget, onIntersect]);

  return (
    <section id='submitted-posts' className='flex flex-col items-center'>
      <HeaderNavigation.Container>
        <HeaderNavigation.Title text='산책 신청목록' />
      </HeaderNavigation.Container>

      <div className='container'>
        <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>산책 신청목록</h1>

        <div className='post-list p-4'>
          {submittedPosts.length ? (
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
          ) : (
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
