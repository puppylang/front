'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TfiClose } from 'react-icons/tfi';
import { CSSTransition } from 'react-transition-group';

interface PopupProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
}

function PopupContainer({ isOpen, children, className }: PopupProps) {
  const [isMounted, setIsMounted] = useState(false);

  const nodeRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        className={`fixed w-screen h-screen overflow-scroll top-0 z-50 bg-white-1 ${className || ''} pb-3`}
      >
        {children}
      </section>
    </CSSTransition>,
    portalRoot,
  );
}

interface PopupCloseButtonProps {
  onClose: () => void;
  className?: string;
  children?: ReactNode;
}

function PopupCloseButton({ onClose, className = '', children }: PopupCloseButtonProps) {
  return (
    <div className={`py-3 px-3 border-b-[1px] border-gray-3 flex items-center relative h-12 ${className} `}>
      {children}
      <button type='button' onClick={onClose} className='right-4 absolute'>
        <TfiClose className='text-xl text-text-1' />
      </button>
    </div>
  );
}

export const Popup = {
  Container: PopupContainer,
  CloseButton: PopupCloseButton,
};
