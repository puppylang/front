import { CustomOverlayMap } from 'react-kakao-maps-sdk';

import { Center } from '@/types/walk';

import { IconDog } from '../../../../public/assets/svgs';

interface CenterMarkerProps {
  position: Center;
}

export function CenterMarker({ position }: CenterMarkerProps) {
  return (
    <CustomOverlayMap position={position}>
      <div className='flex items-center justify-center w-[30px] h-[30px] bg-gray-1 rounded-full'>
        <IconDog />
      </div>
    </CustomOverlayMap>
  );
}
