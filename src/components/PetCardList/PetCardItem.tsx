import { Gender, Pet } from '@/types/pet';
import { formatAge } from '@/utils/date';

import PetProfile from '../PetProfile';

interface PetCardItemProps {
  pet: Pet;
}

const breedCssStyle = `relative after:content-[''] after:absolute after:top-[50%] after:left-[-6px] after:translate-x-[50%] after:translate-y-[-50%] after:w-[1px] after:h-[10px] after:bg-text-2`;

export function PetCardItem({ pet }: PetCardItemProps) {
  return (
    <div className='!flex !flex-row justify-between items-center gap-x-4 p-4 rounded-[10px] bg-main-5'>
      <div className='pet-description flex flex-col gap-y-1 items-start'>
        <div className='pet-info flex gap-x-2 items-center'>
          <p className='text-[15px] text-text-3 font-Jalnan'>{pet.name}</p>
          <p className='text-text-2 flex gap-x-[12px] text-[10px]'>
            <span>{pet.breed}</span>
            {pet.gender !== null && (
              <span className={breedCssStyle}>{pet.gender === Gender.Female ? '암컷' : '수컷'}</span>
            )}
            {pet.birthday !== null && <span className={breedCssStyle}>{formatAge(pet.birthday)}</span>}
          </p>
        </div>
        {pet.character?.length && (
          <div className='pet-character'>
            <p className='text-xs text-text-1'>{pet.character}</p>
          </div>
        )}
      </div>

      <PetProfile pet={pet} width={80} height={80} />
    </div>
  );
}
