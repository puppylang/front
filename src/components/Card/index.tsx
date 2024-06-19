'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

import { IconDog, IconUserDefault } from '../../../public/assets/svgs';

function CardContainer({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`grid grid-cols-[70px_1fr] p-4 ${className}`}>{children}</div>;
}

function CardImageContainer({
  className = '',
  src,
  alt = 'profile',
  type = 'USER',
}: {
  className?: string;
  type?: 'USER' | 'PET';
  src?: string;
  alt?: string;
}) {
  return (
    <div
      className={`rounded-full w-[70px] h-[70px] overflow-hidden flex justify-center items-center object-cover ${className}`}
    >
      {src && (
        <Image
          className='rounded-full w-[70px] h-[70px] object-cover'
          src={src}
          alt={alt}
          width={70}
          height={70}
          priority
        />
      )}
      {!src && (type === 'USER' ? <IconUserDefault alt='default user' width={35} height={35} /> : <IconDog />)}
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
