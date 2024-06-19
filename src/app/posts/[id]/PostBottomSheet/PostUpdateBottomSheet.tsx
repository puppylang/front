import { BottomSheetButton } from '@/components/BottomSheet';
import NativeLink from '@/components/NativeLink';

interface PostUpdateBottomSheetProps {
  id: string;
  onDelete: () => void;
}

function PostUpdateBottomSheet({ id, onDelete }: PostUpdateBottomSheetProps) {
  return (
    <>
      <NativeLink href={`/posts/${id}/edit`} className='text-center py-[10px] text-main-1 border-b-[1px]'>
        수정하기
      </NativeLink>
      <BottomSheetButton onClick={onDelete}>삭제하기</BottomSheetButton>
    </>
  );
}

export default PostUpdateBottomSheet;
