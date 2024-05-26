'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TfiClose } from 'react-icons/tfi';
import { CSSTransition } from 'react-transition-group';

interface PopupProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  onClose: () => void;
}

export default function Popup({ isOpen, children, onClose, className }: PopupProps) {
  const [isMounted, setIsMounted] = useState(false);

  const nodeRef = useRef(null);

  if (typeof window === 'undefined') return null;

  const portalRoot = document.getElementById('portal-root');

  // eslint-disable-next-line
  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  if (!isMounted || !portalRoot) return null;

  return createPortal(
    <CSSTransition in={isOpen} timeout={400} nodeRef={nodeRef} classNames='popup' unmountOnExit>
      <section
        ref={nodeRef}
        className={`fixed w-screen h-screen overflow-scroll top-0 z-50 bg-white-1 ${className || ''}`}
      >
        <div className='py-3 px-3 border-b-[1px] border-gray-3 flex items-center'>
          <button type='button' onClick={onClose}>
            <TfiClose className='text-xl text-text-1' />
          </button>
        </div>
        {children}
      </section>
    </CSSTransition>,
    portalRoot,
  );
}
