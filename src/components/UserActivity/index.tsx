import { useMemo } from 'react';

import { formatDistance } from '@/utils/walk';

import RecordInfo from '../WalkEditor/RecordInfo';

interface UserActivityProps {
  totalDistance: number | undefined;
  walkCount: number | undefined;
}

const valueStyle = 'text-sm text-main-3 font-semibold';
const containerStyle =
  "relative after:content-[''] after:absolute after:top-[50%] after:right-0 after:translate-x-[50%] after:translate-y-[-40%] after:w-[1px] after:h-[98%] after:bg-gray-1";

function UserActivity({ totalDistance, walkCount }: UserActivityProps) {
  const recordedTotalDistance = useMemo(() => formatDistance(totalDistance || 0), [totalDistance]);
  const recordedWalkCount = useMemo(() => (walkCount ? `${walkCount}회` : '0회'), [walkCount]);

  return (
    <div className='user-activity-container bg-bg-blue rounded-[10px]'>
      <div className='flex pt-2 pb-5'>
        <RecordInfo
          label='총 산책 거리'
          value={recordedTotalDistance}
          valueStyle={valueStyle}
          containerStyle={containerStyle}
        />
        <RecordInfo label='총 산책 횟수' value={recordedWalkCount} valueStyle={valueStyle} />
      </div>
    </div>
  );
}

export default UserActivity;
