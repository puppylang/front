import { useMemo } from 'react';

import { PostStatus } from '@/types/post';

import SelectArrowIcon from './SelectArrowIcon';

interface PostStatusButtonProps {
  status: PostStatus;
  onClick: () => void;
}

const FILL = {
  IN_PROGRESS: '#87D3EA',
  COMING: '#ffffff',
  FINISHED: '#666666',
};

function PostStatusButton({ status, onClick }: PostStatusButtonProps) {
  const borderStyle = useMemo(() => {
    if (status === PostStatus.IN_PROGRESS) return 'text-main-2 border-main-2';
    if (status === PostStatus.COMING) return 'text-white border-main-2 bg-main-2';
    if (status === PostStatus.FINISHED) return 'text-text-2 border-gray-3 bg-gray-3';
  }, [status]);

  return (
    <button
      type='button'
      onClick={onClick}
      className={`flex gap-x-2 items-center text-[10px] min-w-[72px] px-4 pt-[6px] pb-[7px] rounded-[10px] border-[1px] ${borderStyle} bg-no-repeat appearance-none `}
    >
      {status === PostStatus.IN_PROGRESS && '진행중'}
      {status === PostStatus.COMING && '예약중'}
      {status === PostStatus.FINISHED && '마감완료'}
      <SelectArrowIcon fill={FILL[status]} />
    </button>
  );
}
export default PostStatusButton;
