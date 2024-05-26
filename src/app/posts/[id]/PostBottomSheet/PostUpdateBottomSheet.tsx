import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { TfiClose } from 'react-icons/tfi';

import NativeLink from '@/components/NativeLink';

interface PostUpdateBottomSheetProps {
  id: string;
  onDelete: () => void;
  onClose: () => void;
}

function PostUpdateBottomSheet({ id, onDelete, onClose }: PostUpdateBottomSheetProps) {
  return (
    <>
      <NativeLink href={`/posts/${id}/edit`} className='w-full py-2 px-6 text-left flex items-center text-text-1 '>
        <FaPencilAlt className='mr-3' />
        수정하기
      </NativeLink>
      <button onClick={onDelete} type='button' className='w-full py-2 px-6 text-left flex items-center text-text-1 '>
        <FaTrash className='mr-3' />
        삭제하기
      </button>
      <button type='button' className='w-full py-2 px-6 text-left flex items-center text-text-1 ' onClick={onClose}>
        <TfiClose className='mr-3' />
        닫기
      </button>
    </>
  );
}

export default PostUpdateBottomSheet;
