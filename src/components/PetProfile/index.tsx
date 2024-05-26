import Image from 'next/image';

import { Pet } from '@/types/pet';

import { IconDog } from '../../../public/assets/svgs';

interface PetProfileProps {
  pet: Pet;
  width: number;
  height: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  className?: string;
}

function PetProfile({ pet, width, height, minW, minH, maxW, maxH, className = '' }: PetProfileProps) {
  return (
    <div
      className={`flex items-center justify-center flex-none rounded-full overflow-hidden bg-gray-3 w-[${width}px] h-[${height}px] ${
        minW ? `min-w-[${minW}px]` : ''
      } ${minH ? `min-h-[${minH}px]` : ''} ${maxW ? `max-w-[${maxW}px]` : ''} ${
        maxH ? `max-h-[${maxH}px]` : ''
      } ${className}`}
    >
      {pet.image ? (
        <Image
          src={pet.image}
          alt={pet.name}
          width={width}
          height={height}
          priority
          className='object-cover'
          style={{ width, height }}
        />
      ) : (
        <IconDog />
      )}
    </div>
  );
}

export default PetProfile;
