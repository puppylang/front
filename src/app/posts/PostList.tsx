import { useCallback, useEffect, useState } from 'react';

import PostListSkeletonUI from '@/components/SkeletonUI/PostListSkeletonUI';
import { getPostsWithPaging } from '@/services/post';
import { Post } from '@/types/post';

import { PostSection } from '@/components/Post';

function PostList({ region }: { region: string }) {
  const [isFetching, setIsFetching] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [observeTarget, setObserveTarget] = useState<Element | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsFetching(true);

    if (last) return setIsFetching(false);

    if (!last) {
      const result = await getPostsWithPaging({ page, region });

      if (result) {
        setPosts(prev => [...prev, ...result.content]);
        setLast(result.last);
      }
      setPage(prev => prev + 1);
      setIsFetching(false);
    }
  }, [last, page, region]);

  const onIntersect: IntersectionObserverCallback = useCallback(
    ([entry]) => {
      if (last || isFetching) return;

      if (entry.isIntersecting) {
        fetchPosts();
      }
    },
    [fetchPosts, isFetching, last],
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

  useEffect(() => {
    if (region) {
      setPage(0);
      setLast(false);
      setPosts([]);
    }
  }, [region]);

  if (isFetching && page === 0) return <PostListSkeletonUI />;

  return (
    <>
      {posts?.length > 0 ? (
        <>
          <PostSection.List
            posts={posts}
            className='animation-load'
            itemClassName='shadow-[0_2px_4px_0_rgba(76,76,76,0.1)]'
          />

          {isFetching && (
            <div className='list-none animate-pulse w-full h-[112px] bg-white rounded-[10px] shadow-[0_2px_4px_0_rgba(76,76,76,0.1)]' />
          )}
        </>
      ) : (
        <div className='flex justify-center items-center h-[300px] animation-show'>
          <p className='text-text-2'>등록된 구인 게시글이 없습니다.</p>
        </div>
      )}
      <div ref={setObserveTarget} />
    </>
  );
}

export default PostList;
