import { useCallback, useEffect, useState } from 'react';

import { getPostsByUserAndStatus } from '@/services/user';
import { Post, PostStatus } from '@/types/post';

import Loading from '../Loading';
import { PostSection } from '../Post';

interface UserPostListProps {
  authorId: string;
}

export default function UserPostList({ authorId }: UserPostListProps) {
  const [selectedStatus, setSelectedStatus] = useState(PostStatus.IN_PROGRESS);
  const [postData, setPostData] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [observeTarget, setObserveTarget] = useState<Element | null>(null);

  const handleClickTab = (status: PostStatus) => {
    setPage(0);
    setLast(false);
    setPostData([]);
    setSelectedStatus(status);
  };

  const fetchPostData = useCallback(async () => {
    setIsLoading(true);

    if (last) return setIsLoading(false);

    if (!last) {
      const data = await getPostsByUserAndStatus({ page, size: 20, status: selectedStatus, authorId });

      if (data) {
        setPostData(prev => [...prev, ...data.content]);
        setLast(data.last);
      }
      setPage(prev => prev + 1);
      setIsLoading(false);
    }
  }, [authorId, last, page, selectedStatus]);

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

  return (
    <div className='user-post-list'>
      <div className='tab-list bg-white'>
        <ul className={`flex ${selectedStatus}`}>
          {Object.keys(PostStatus).map(status => (
            <li
              key={status}
              className={`flex-1 ${
                selectedStatus === status
                  ? 'border-b border-b-text-1 text-text-1'
                  : 'border-b border-b-gray-2 text-text-2'
              } `}
            >
              <button
                type='button'
                onClick={() => handleClickTab(status as PostStatus)}
                className='w-full h-12 font-semibold text-xs'
              >
                {status === PostStatus.IN_PROGRESS && '진행중'}
                {status === PostStatus.COMING && '예약중'}
                {status === PostStatus.FINISHED && '마감완료'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className='post-list p-4'>
        {postData.length ? (
          <PostSection.List
            posts={postData}
            className='animation-load'
            itemClassName='shadow-[0_2px_4px_0_rgba(76,76,76,0.1)]'
          />
        ) : (
          <div className='flex justify-center items-center h-[500px]'>
            <p className='text-text-2'>
              {selectedStatus === PostStatus.IN_PROGRESS && '진행중인 '}
              {selectedStatus === PostStatus.COMING && '예약중인 '}
              {selectedStatus === PostStatus.FINISHED && '마감완료된 '}
              게시글이 없습니다.
            </p>
          </div>
        )}

        <div ref={setObserveTarget}>{isLoading && <Loading />}</div>
      </div>
    </div>
  );
}
