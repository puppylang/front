'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

import { IconUserDefault } from '../../../public/assets/svgs';

function CardContainer({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`grid grid-cols-[70px_1fr] p-4 ${className}`}>{children}</div>;
}

function CardImageContainer({
  className = '',
  src,
  alt = 'profile',
}: {
  className?: string;
  src?: string;
  alt?: string;
}) {
  return (
    <div className='rounded-full w-[70px] h-[70px] overflow-hidden'>
      {src ? (
        <Image className={`rounded-full ${className}`} src={src} alt={alt} width={70} height={70} />
      ) : (
        <IconUserDefault alt='default user image' width={70} height={70} />
      )}
    </div>
  );
}

function CardTextContainer({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`pl-3 flex flex-col ${className}`}>{children}</div>;
}

export const Card = {
  Container: CardContainer,
  ImgContainer: CardImageContainer,
  TextContainer: CardTextContainer,
};
