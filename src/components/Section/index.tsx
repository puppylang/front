import { ReactNode } from 'react';

interface SectionContainerProps {
  children?: ReactNode;
  className?: string;
}

function SectionContainer({ children, className }: SectionContainerProps) {
  return <div className={`container p-4 ${className || ''}`}>{children}</div>;
}

function SectionTitle({ title, className }: { title: string; className?: string }) {
  return <p className={`font-semibold text-text-2 text-sm mb-4 ${className || ''}`}>{title}</p>;
}

export const Section = {
  Container: SectionContainer,
  Title: SectionTitle,
};
