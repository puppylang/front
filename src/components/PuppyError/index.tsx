'use client';

import { ReactNode } from 'react';

interface PuppyErrorContainerProps {
  children: ReactNode;
  className?: string;
}

function PuppyErrorContainer({ children, className = '' }: PuppyErrorContainerProps) {
  return <div className={`flex flex-col items-center justify-center px-4 text-text-1 ${className}`}>{children}</div>;
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
