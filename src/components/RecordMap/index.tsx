import { useMemo } from 'react';
import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk';

import { Location } from '@/types/walk';
import { calculatePathCenter } from '@/utils/walk';

import MapPositionMarker from './MapPositionMarker';
import { PathLine } from '../WalkEditor/TrackMap/PathLine';

interface RecordMapProps {
  locations: Location[];
}

function RecordMap({ locations }: RecordMapProps) {
  const positions = useMemo(() => {
    if (!locations) return [{ lat: 0, lng: 0 }];

    return locations
      .sort((a, b) => +(a.recorded_at || '') - +(b.recorded_at || ''))
      .map(({ latitude, longitude }) => ({ lat: latitude, lng: longitude }));
  }, [locations]);

  const baseCenter = useMemo(() => {
    if (locations) {
      return calculatePathCenter(locations);
    }

    return { lat: 0, lng: 0 };
  }, [locations]);

  const startPosition = useMemo(() => {
    return positions[0];
  }, [positions]);

  const endPosition = useMemo(() => {
    const lastIndex = positions.length - 1;
    const { lat, lng } = positions[lastIndex];

    return { lat, lng };
  }, [positions]);

  return (
    <Map center={baseCenter} className='w-full h-full' level={4}>
      <PathLine path={positions} strokeWeight={2} strokeColor='#6AC9E5' strokeOpacity={0.9} />

      <CustomOverlayMap position={startPosition}>
        <MapPositionMarker label='시작' fontColor='#fff' fill='#6AC9E5' />
      </CustomOverlayMap>
      <CustomOverlayMap position={endPosition}>
        <MapPositionMarker label='종료' fontColor='#fff' fill='#6AC9E5' />
      </CustomOverlayMap>
    </Map>
  );
}
export default RecordMap;
