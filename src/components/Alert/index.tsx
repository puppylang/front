'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AlertProps {
  message?: string;
  title?: string;
  onClose: () => void;
  onClick?: () => void;
  buttonText?: string;
  isOpen: boolean;
  useActionButton?: boolean;
  messageStyle?: string;
}

export default function Alert({ isOpen, ...props }: AlertProps) {
  const [isMounted, setIsMounted] = useState(false);

  if (typeof window === 'undefined') return null;

  const portalRoot = document.getElementById('portal-root');

  // eslint-disable-next-line
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted || !isOpen || !portalRoot) return null;

  return createPortal(
    <div className='fixed w-screen h-screen top-0 z-50'>
      <AlertUI {...props} />
    </div>,
    portalRoot,
  );
}

function AlertUI({
  message,
  onClose,
  title,
  onClick,
  buttonText,
  messageStyle,
  useActionButton = true,
}: Omit<AlertProps, 'isOpen'>) {
  return (
    <>
      <section className='z-[50] p-4 rounded-[10px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white w-72'>
        <h3 className='text-base text-text-1'>{title}</h3>

        <div className='pt-4'>
          <p className={`text-text-2 text-sm break-words ${messageStyle}`}>{message}</p>
        </div>

        <div className='flex gap-x-2 mt-4'>
          <button type='button' onClick={onClose} className='flex-1 py-2 rounded-[10px] text-sm bg-gray-2 text-text-1'>
            닫기
          </button>

          {useActionButton && (
            <button type='button' onClick={onClick} className='flex-1 py-2 rounded-[10px] text-sm bg-main-1 text-white'>
              {buttonText || '확인'}
            </button>
          )}
        </div>
      </section>
      <div className='dim absolute left-0 top-0 w-screen h-screen backdrop-blur-[1.2px] bg-[#23232310]' />
    </>
  );
}
