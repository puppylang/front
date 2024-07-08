import { IconClose, IconErrorBoxBlue } from '../../../../public/assets/svgs';

interface ChatPopupProps {
  onClose: () => void;
}

export default function ChatPopup({ onClose }: ChatPopupProps) {
  return (
    <div className='w-full absolute left-0'>
      <div className='bg-main-5 grid grid-cols-[24px_1fr_24px] justify-between mx-4 px-2 rounded-md'>
        <span className='py-2.5 flex justify-center h-full items-start'>
          <IconErrorBoxBlue className='w-[16px] h-[16px]' />
        </span>
        <p className='text-xs text-text-2 pl-1 pr-1 py-2'>
          부적절하거나 불쾌감을 줄 수 있는 컨텐츠는 제재를 받을 수 있습니다. 주의해 주세요!
        </p>
        <button className='h-full flex py-0.5' onClick={onClose} type='button'>
          <IconClose className='fill-neutral-50' />
        </button>
      </div>
    </div>
  );
}
