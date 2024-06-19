import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { IConErrorBox, IconCheckedBox } from '../../../public/assets/svgs';

export type ToastStatus = 'error' | 'success';
type ToastPosition = 'TOP' | 'BOTTOM' | 'CENTER';

interface ToastProps {
  position?: ToastPosition;
  status: ToastStatus;
  description: string;
  isInvisible: boolean;
  onClose: () => void;
}

export default function Toast({ position = 'BOTTOM', status, description, isInvisible, onClose }: ToastProps) {
  const [isMounted, setIsMounted] = useState(false);

  if (typeof window === 'undefined') return null;

  const portalRoot = document.getElementById('toast-root');

  // eslint-disable-next-line
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleToastPosition = () => {
    if (position === 'BOTTOM') return 'bottom-4 right-4';
    if (position === 'TOP') return 'top-4 right-4 ';
    if (position === 'CENTER') return 'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]';
  };

  const handleToastStatusStyle = () => {
    if (status === 'error') return 'bg-[#E06052]';
    if (status === 'success') return 'bg-main-1';
  };

  const positionStyle = handleToastPosition();
  const statusStyle = handleToastStatusStyle();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isMounted || !isInvisible || !portalRoot) return null;

  return createPortal(
    <section
      id='toast'
      className={`px-4 py-2 rounded-[5px] fixed ${positionStyle} z-[100] ${statusStyle} animation-toast`}
    >
      <ToastUI status={status} description={description} />
    </section>,
    portalRoot,
  );
}

interface ToastUIProps {
  status: ToastStatus;
  description: string;
}

function ToastUI({ status, description }: ToastUIProps) {
  return (
    <div className='flex gap-x-2 items-center max-w-[200px]'>
      {status === 'error' && (
        <div className='icon flex justify-center items-center w-6 h-6 bg-toast-error rounded-full'>
          <IConErrorBox />
        </div>
      )}

      {status === 'success' && (
        <div className='icon flex justify-center items-center w-6 h-6 bg-toast-success rounded-full'>
          <IconCheckedBox />
        </div>
      )}

      <p className='text-[12px] text-white-1'>{description}</p>
    </div>
  );
}
