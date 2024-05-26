'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

import Empty_chat from '../../../public/empty_chat.png';

interface PuppyErrorContainerProps {
  children: ReactNode;
  className?: string;
  imgClassName?: string;
}

function PuppyErrorContainer({ children, className = '', imgClassName = '' }: PuppyErrorContainerProps) {
  return (
    <div className={`pt-24 flex flex-col items-center px-12 text-text-1 ${className}`}>
      <Image src={Empty_chat} alt='jump cogi' width={150} height={100} className={`${imgClassName}`} />
      {children}
    </div>
  );
}

function PuppyErrorTitle({ title, className = '' }: { title: string; className?: string }) {
  return <p className={`mb-2 font-Jalnan ${className}`}>{title}</p>;
}

function PuppyErrorDesc({ text, className = '' }: { text: string; className?: string }) {
  return <p className={`text-sm text-gray-500 ${className}`}>{text}</p>;
}

export const PuppyError = {
  Container: PuppyErrorContainer,
  Title: PuppyErrorTitle,
  Desc: PuppyErrorDesc,
};
