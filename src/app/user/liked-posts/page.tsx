'use client';

import { useCallback, useEffect, useState } from 'react';

import { PostItem } from '@/app/posts/PostItem';
import { getPostsByLike } from '@/services/user';
import { Post } from '@/types/post';

import Loading from '@/components/Loading';

export default function UserFavorites() {
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [observeTarget, setObserveTarget] = useState<Element | null>(null);

  const fetchLikedPosts = useCallback(async () => {
    setIsLoading(true);

    if (last) return setIsLoading(false);

    if (!last) {
      const data = await getPostsByLike({ page, size: 20 });

      if (data) {
        setLikedPosts(prev => [...prev, ...data.content]);
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
        fetchLikedPosts();
      }
    },
    [fetchLikedPosts, isLoading, last],
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
    <section id='favorite-post' className='flex flex-col items-center'>
      <div className='container'>
        <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>좋아요 목록</h1>

        <div className='post-list p-4'>
          {likedPosts.length ? (
            <ul className='flex flex-col gap-y-4 animation-load'>
              {likedPosts.map(postItem => (
                <PostItem key={postItem.id} post={postItem} />
              ))}
            </ul>
          ) : (
            <div className='flex justify-center items-center h-[500px]'>
              <p className='text-text-2'>좋아요한 게시글이 없습니다.</p>
            </div>
          )}

          <div ref={setObserveTarget}>{isLoading && <Loading />}</div>
        </div>
      </div>
    </section>
  );
}
