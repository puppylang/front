import { MouseEvent } from 'react';

import { PostStatus } from '@/types/post';

import { SheetButton } from '@/components/BottomSheet';

interface PostStatusUpdateBottomSheetProps {
  onChange: (e: MouseEvent<HTMLButtonElement>) => void;
}

function PostStatusUpdateBottomSheet({ onChange }: PostStatusUpdateBottomSheetProps) {
  return (
    <>
      {Object.keys(PostStatus).map(status => (
        <SheetButton data-status={status} key={status} onClick={onChange}>
          {status === PostStatus.IN_PROGRESS && '진행중'}
          {status === PostStatus.COMING && '예약중'}
          {status === PostStatus.FINISHED && '마감완료'}
        </SheetButton>
      ))}
    </>
  );
}

export default PostStatusUpdateBottomSheet;
