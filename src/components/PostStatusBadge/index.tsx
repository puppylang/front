import { PostStatus } from '@/types/post';

interface PostStatusProps {
  status: PostStatus;
  className?: string;
}

const statusStyle = 'py-[6px] min-w-[54px] text-[10px] text-center rounded-[10px]';

function PostStatusBadge({ status, className }: PostStatusProps) {
  return (
    <>
      {status === PostStatus.IN_PROGRESS && (
        <span className={`${statusStyle} text-main-2 border-[1px] border-main-2 ${className}`}>진행중</span>
      )}
      {status === PostStatus.COMING && (
        <span className={`${statusStyle} text-white border-[1px] border-main-2 bg-main-2 ${className}`}>예약중</span>
      )}
      {status === PostStatus.FINISHED && (
        <span className={`${statusStyle} text-text-1 border-[1px] border-gray-3  bg-gray-3 ${className}`}>
          마감완료
        </span>
      )}
    </>
  );
}

export default PostStatusBadge;
