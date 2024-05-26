'use client';

import { ReactNode } from 'react';
import { IoIosArrowRoundBack, IoMdMore } from 'react-icons/io';

import { RouterMethod } from '@/types/route';

import NativeLink from '../NativeLink';

interface HeaderNavigationContainer {
  children?: ReactNode;
  className?: string;
}

function Container({ children, className }: HeaderNavigationContainer) {
  return (
    <nav className={`sticky top-0 w-full px-4 py-3 bg-white ${className || ''}`}>
      <NativeLink type={RouterMethod.Back} href=''>
        <IoIosArrowRoundBack className='text-text-2 text-2xl' />
      </NativeLink>
      {children}
    </nav>
  );
}

function DotBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} type='button'>
      <IoMdMore className='text-text-2 text-2xl' />
    </button>
  );
}

function Title({ text, className }: { text: string; className?: string }) {
  return <h3 className={`font-bold text-sm  ${className || ''}`}>{text}</h3>;
}

export const HeaderNavigation = {
  Container,
  DotBtn,
  Title,
};
