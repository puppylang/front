'use client';

import React, { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

interface TopSheetProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  onClose: () => void;
}

export function TopSheet({ isOpen, children, onClose, className }: TopSheetProps) {
  const [isMounted, setIsMounted] = useState(false);

  const nodeRef = useRef(null);
  const topSheetRef = useRef(null);

  if (typeof window === 'undefined') return null;

  const portalRoot = document.getElementById('portal-root');

  const onClickOverlayElement = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target !== nodeRef.current) return;
    onClose();
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  if (!isMounted || !portalRoot) return null;

  return createPortal(
    <CSSTransition in={isOpen} timeout={400} nodeRef={topSheetRef} classNames='topSheet' unmountOnExit>
      <section
        ref={nodeRef}
        aria-hidden='true'
        className='fixed w-screen h-screen top-0 z-50 backdrop-blur-[1.2px] bg-[#23232310]'
        onClick={onClickOverlayElement}
      >
        <div
          className={`fixed top-0 h-auto w-full opacity-1 flex flex-col items-end p-4 ${className || ''}`}
          ref={topSheetRef}
        >
          <div className='bg-white flex flex-col rounded-[10px] opacity-85 text-sm text-left w-full max-w-[250px]'>
            {children}
            <button type='button' className='px-4 py-4 text-text-2 text-sm ' onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </section>
    </CSSTransition>,
    portalRoot,
  );
}
