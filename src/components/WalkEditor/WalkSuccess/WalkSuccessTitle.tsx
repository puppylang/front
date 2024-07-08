import { useMemo } from 'react';

import { Pet } from '@/types/pet';

import { Profile } from '@/components/Profile';

interface WalkSuccessTitleProps {
  title: string;
  align?: 'CENTER' | 'LEFT' | 'RIGHT' | null;
  pet: Pet;
}

function WalkSuccessTitle({ title, align, pet }: WalkSuccessTitleProps) {
  const ALIGN = useMemo(() => {
    if (align === 'CENTER') return 'justify-center';
    if (align === 'LEFT') return 'justify-start';
    if (align === 'RIGHT') return 'justify-end';
  }, [align]);
  return (
    <div className={`puppy-info flex items-center gap-x-2 mt-4 ${ALIGN}`}>
      <Profile.Pet pet={pet} width={30} height={30} />

      <p className='text-text-1 text-sm font-semibold'>{title}</p>
    </div>
  );
}

export default WalkSuccessTitle;
