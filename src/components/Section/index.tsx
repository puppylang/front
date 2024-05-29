import { ReactNode } from 'react';

interface SectionContainerProps {
  children?: ReactNode;
  className?: string;
}

function SectionContainer({ children, className }: SectionContainerProps) {
  return <div className={`bg-white p-4 ${className || ''}`}>{children}</div>;
}

function SectionTitle({ title }: { title: string }) {
  return <p className='font-bold text-text-2 text-sm mb-4'>{title}</p>;
}

export const Section = {
  Container: SectionContainer,
  Title: SectionTitle,
};
