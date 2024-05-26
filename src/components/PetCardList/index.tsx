import Link from 'next/link';
import { useState } from 'react';
import SwiperCore from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './styles.css';
import { Pet } from '@/types/pet';

import { PetCardItem } from './PetCardItem';
import { IconCheck } from '../../../public/assets/svgs';
import PetCardSkeletonUI from '../SkeletonUI/PetCardSkeletonUI';

SwiperCore.use([Navigation, Pagination]);

interface PetCardListProps {
  pets: Pet[] | undefined;
  type: 'select' | 'slide' | 'link';
  defaultValue?: number | null;
  onClick?: (activeIndex: number) => void;
  showsAddCard?: boolean;
}

export function PetCardList({ pets, type, defaultValue, onClick, showsAddCard }: PetCardListProps) {
  const [selectedPetId, setSelectedPetId] = useState<number | null>(defaultValue || null);

  const handleOnClick = (activeIndex: number) => {
    if (onClick && pets) {
      if (!pets[activeIndex]) return;
      const selectedPetId = pets[activeIndex].id;
      if (!selectedPetId) return;
      onClick(selectedPetId);
      setSelectedPetId(selectedPetId);
    }
  };

  const sortedPetsById = pets?.sort((a, b) => a.id - b.id);

  if (!sortedPetsById) return <PetCardSkeletonUI bgColor='bg-white' />;

  return sortedPetsById.length ? (
    <div className='pet-card-list'>
      <Swiper
        loop={false}
        spaceBetween={50}
        navigation={false}
        pagination={{ type: 'bullets' }}
        className='!pb-[26px]'
        onClick={swiper => handleOnClick(swiper.activeIndex)}
      >
        {sortedPetsById.map(pet => (
          <SwiperSlide
            key={pet.id}
            className={`rounded-[10px] bg-main-5 ${
              type === 'select' && selectedPetId === pet.id ? 'border-2 border-main-1' : 'border-2 border-main-5'
            } ${type === 'select' && 'cursor-pointer'}`}
          >
            <PetCardItem pet={pet} />

            {type === 'select' && selectedPetId === pet.id && (
              <div className='absolute top-1 left-1 bg-main-1 rounded-full'>
                <IconCheck />
              </div>
            )}
          </SwiperSlide>
        ))}
        {showsAddCard && sortedPetsById.length === 1 && (
          <SwiperSlide key='add' className='rounded-[10px] border-2 border-main-5'>
            <Link
              href='/pets/new'
              className='flex flex-col justify-center items-center h-[112px] leading-5 p-4 bg-main-5 rounded-[10px]'
            >
              <p className='text-center text-sm text-text-3 '>
                반려견은 최대 2마리까지 등록할 수 있습니다.
                <br />
                <span>등록하러 갈까요?</span>
              </p>
            </Link>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  ) : (
    <Link
      href='/pets/new'
      className='flex flex-col justify-center items-center h-[112px] leading-5 p-4 bg-main-5 rounded-[10px]'
    >
      <p className='text-center text-sm text-text-3 font-medium'>
        아직 등록된 반려견이 없습니다.
        <br />
        <span>등록하러 가보실까요?</span>
      </p>
    </Link>
  );
}
