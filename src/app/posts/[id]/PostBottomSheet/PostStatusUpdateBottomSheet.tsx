import { MouseEvent } from 'react';

import { PostStatus } from '@/types/post';

interface PostStatusUpdateBottomSheetProps {
  onChange: (e: MouseEvent<HTMLElement>) => void;
  onClose: () => void;
}

function PostStatusUpdateBottomSheet({ onChange, onClose }: PostStatusUpdateBottomSheetProps) {
  return (
    <ul>
      {Object.keys(PostStatus).map(status => (
        <li key={status} className=''>
          <button
            type='button'
            data-status={status}
            onClick={onChange}
            className='w-full text-left px-4 py-2 text-sm text-text-1'
          >
            {status === PostStatus.IN_PROGRESS && '진행중'}
            {status === PostStatus.COMING && '예약중'}
            {status === PostStatus.FINISHED && '마감완료'}
          </button>
        </li>
      ))}
      <li>
        <button type='button' onClick={onClose} className='w-full text-left px-4 py-2 text-sm text-text-1'>
          닫기
        </button>
      </li>
    </ul>
  );
}

export default PostStatusUpdateBottomSheet;
