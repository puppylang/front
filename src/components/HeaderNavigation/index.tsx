'use client';

import { ReactNode } from 'react';
import { IoIosArrowRoundBack, IoMdMore } from 'react-icons/io';

import { WebviewActionType } from '@/types/route';

import NativeLink from '../NativeLink';

interface HeaderNavigationContainer {
  children?: ReactNode;
  className?: string;
}

function Container({ children, className }: HeaderNavigationContainer) {
  return (
    <nav className={`sticky top-0 w-full px-4 py-3 h-14 bg-white flex items-center justify-center ${className || ''}`}>
      <NativeLink type={WebviewActionType.Back} href='' className='absolute left-4'>
        <IoIosArrowRoundBack className='text-text-2 text-2xl font-bold' />
      </NativeLink>
      {children}
    </nav>
  );
}

function DotBtn({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button className={`absolute ${className} right-4`} onClick={onClick} type='button'>
      <IoMdMore className='text-text-2 text-2xl' />
    </button>
  );
}

function Title({ text, className }: { text: string; className?: string }) {
  return <h3 className={`text-text-2 text-sm ${className || ''}`}>{text}</h3>;
}

export const HeaderNavigation = {
  Container,
  DotBtn,
  Title,
};
