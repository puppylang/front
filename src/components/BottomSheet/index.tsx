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

export default function BottomSheet({ isOpen, children, onClose, className }: BottomSheetProps) {
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
          className={`fixed bottom-0 h-auto bg-white w-full opacity-1 rounded-t-3xl pt-5 pb-3 flex flex-col ${className}`}
          ref={bottomSheetRef}
        >
          {children}
        </div>
      </section>
    </CSSTransition>,
    portalRoot,
  );
}
