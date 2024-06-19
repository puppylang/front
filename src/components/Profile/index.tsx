import Image from 'next/image';

import { Pet } from '@/types/pet';

import { IconDog, IconUserDefault } from '../../../public/assets/svgs';

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

interface UserProfileProps {
  image?: string;
  alt?: string;
  imageClassName?: string;
  defaultUserDivClassName?: string;
  defaultUserImageClassName?: string;
}

function UserProfile({
  image,
  alt,
  imageClassName = '',
  defaultUserDivClassName = '',
  defaultUserImageClassName = '',
}: UserProfileProps) {
  return image ? (
    <Image
      width={60}
      height={60}
      className={`border-[1px] rounded-full w-[70px] h-[70px] object-cover ${imageClassName}`}
      src={image}
      alt={alt || 'profile'}
    />
  ) : (
    <div
      className={`flex items-center justify-center w-[60px] h-[60px] bg-gray-200 rounded-full overflow-hidden ${defaultUserDivClassName}`}
    >
      <IconUserDefault width='35' height='35' className={`${defaultUserImageClassName}`} />
    </div>
  );
}

export const Profile = {
  Pet: PetProfile,
  User: UserProfile,
};
