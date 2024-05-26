import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { stopWatchState, trackMapState } from '@/recoil/atoms/walkAtom';
import { formatRunningTime } from '@/utils/time';
import { formatDistance } from '@/utils/walk';

import RecordInfo from '../RecordInfo';
import StopWatch from '../StopWatch';

function RecordAction() {
  const { distance } = useRecoilValue(trackMapState);
  const { time } = useRecoilValue(stopWatchState);

  const recordTime = useMemo(() => formatRunningTime(time), [time]);
  const recordDistance = useMemo(() => formatDistance(distance), [distance]);

  return (
    <div className='record-action-container relative flex gap-x-4 justify-between items-center w-full'>
      <RecordInfo label='거리' value={recordDistance} />
      <StopWatch />
      <RecordInfo label='시간' value={recordTime} />
    </div>
  );
}

export default RecordAction;
