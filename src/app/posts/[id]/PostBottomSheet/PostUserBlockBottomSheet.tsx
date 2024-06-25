import { SheetButton } from '@/components/BottomSheet';
import NativeLink from '@/components/NativeLink';

interface PostUserBlockBottomSheetProps {
  href: string;
  isBlocked: boolean;
  onClickBlockButton: (isBlocked: boolean) => void;
}

export default function PostUserBlockBottomSheet({
  href,
  onClickBlockButton,
  isBlocked,
}: PostUserBlockBottomSheetProps) {
  return (
    <>
      <NativeLink className='text-center py-[10px] text-main-1 border-b-[1px]' href={href}>
        신고하기
      </NativeLink>
      <SheetButton onClick={() => onClickBlockButton(isBlocked)}>
        {isBlocked ? '차단 해제하기' : '차단하기'}
      </SheetButton>
    </>
  );
}
