'use client';

import React, { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

interface BottomSheetProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  onClose: () => void;
}

export function BottomSheet({ isOpen, children, onClose, className }: BottomSheetProps) {
  const [isMounted, setIsMounted] = useState(false);

  const nodeRef = useRef(null);
  const bottomSheetRef = useRef(null);

  if (typeof window === 'undefined') return null;

  const portalRoot = document.getElementById('portal-root');

  const onClickOverlayElement = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target !== nodeRef.current) return;
    onClose();
  };

  // eslint-disable-next-line
  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  if (!isMounted || !portalRoot) return null;

  return createPortal(
    <CSSTransition in={isOpen} timeout={400} nodeRef={bottomSheetRef} classNames='bottomSheet' unmountOnExit>
      <section
        ref={nodeRef}
        aria-hidden='true'
        className='fixed w-screen h-screen top-0 z-50 bg-[rgba(0,0,0,0.5)]'
        onClick={onClickOverlayElement}
      >
        <div
          className={`fixed mb-5 bottom-0 h-auto w-full opacity-1 py-5 flex flex-col px-3 ${className}`}
          ref={bottomSheetRef}
        >
          <div className='bg-white flex flex-col rounded-lg opacity-85 text-sm'>
            {children}
            <button type='button' className='py-[10px] text-text-2 text-sm' onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </section>
    </CSSTransition>,
    portalRoot,
  );
}

interface SheetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

export function SheetButton({ className = '', onClick, children, ...props }: SheetButtonProps) {
  return (
    <button type='button' className={`py-[10px] text-main-1 border-b-[1px] ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
