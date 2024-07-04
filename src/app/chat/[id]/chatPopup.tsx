import { IconClose, IconErrorBoxBlue } from '../../../../public/assets/svgs';

interface ChatPopupProps {
  onClose: () => void;
}

export default function ChatPopup({ onClose }: ChatPopupProps) {
  return (
    <div className=' w-full absolute z-[100] left-[50%] translate-x-[-50%] '>
      <div className='bg-main-5 relative flex gap-x-2 items-start mx-4 px-4 py-2 rounded-[10px]'>
        <span className='flex justify-center mt-[2px]'>
          <IconErrorBoxBlue className='w-[16px] h-[16px]' />
        </span>
        <p className='text-xs text-text-2 w-[calc(100%-48px)] leading-[16px] mt-[2px]'>
          부적절하거나 불쾌감을 줄 수 있는 컨텐츠는 제재를 받을 수 있습니다. 주의해 주세요!
        </p>
        <button className='w-[22px] h-[22px] flex justify-center items-center' onClick={onClose} type='button'>
          <IconClose className='fill-neutral-50' />
        </button>
      </div>
    </div>
  );
}
