import { useCallback } from 'react';
import { Polyline } from 'react-kakao-maps-sdk';
import { useSetRecoilState } from 'recoil';

import { trackMapState } from '@/recoil/atoms/walkAtom';
import { Center } from '@/types/walk';

interface PathLineProps {
  path: Center[];
  strokeWeight: number;
  strokeColor: string;
  strokeOpacity: number;
}
export function PathLine({ path, strokeWeight, strokeColor, strokeOpacity }: PathLineProps) {
  const setDistance = useSetRecoilState(trackMapState);

  const handleCreatePath = useCallback(
    (polyline: kakao.maps.Polyline) => {
      if (path.length > 0) {
        setDistance(prev => ({ ...prev, distance: Math.floor(polyline.getLength()) }));
      }
    },
    [path.length, setDistance],
  );

  return (
    <Polyline
      path={path}
      strokeWeight={strokeWeight}
      strokeColor={strokeColor}
      strokeOpacity={strokeOpacity}
      strokeStyle='solid'
      onCreate={handleCreatePath}
    />
  );
}
