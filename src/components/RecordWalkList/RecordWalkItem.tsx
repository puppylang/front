import Link from 'next/link';
import { useMemo } from 'react';

import { WalkForm, WalkRole } from '@/types/walk';
import { formatRecordedWalkTime } from '@/utils/time';
import { formatDistance } from '@/utils/walk';

import PetProfile from '../PetProfile';
import { FormattedRecordWalkTime } from '../RecordWalkTime';
import RecordInfo from '../WalkEditor/RecordInfo';

interface RecordWalkItemProps {
  walk: WalkForm;
  className?: string;
  role: WalkRole;
}

function RecordWalkItem({ walk, className, role }: RecordWalkItemProps) {
  const recordedTime = useMemo(() => {
    const { hours, minutes, seconds } = formatRecordedWalkTime({ start_at: walk.start_at, end_at: walk.end_at });

    return (
      <>
        <FormattedRecordWalkTime label='시간' value={hours} labelStyle='pr-1' />
        <FormattedRecordWalkTime label='분' value={minutes} labelStyle='pr-1' />
        <FormattedRecordWalkTime label='초' value={seconds} alwaysVisible />
      </>
    );
  }, [walk.start_at, walk.end_at]);

  const recordedDistance = useMemo(() => formatDistance(walk.distance), [walk.distance]);

  return (
    <Link
      href={{
        pathname: `/user/record-walks/${walk.id}`,
        query: { role: role === WalkRole.PetOwner ? WalkRole.PetOwner : WalkRole.PetSitterWalker },
      }}
    >
      <div className={`${className} flex gap-x-4 p-4`}>
        {walk.pet && <PetProfile pet={walk.pet} width={45} height={45} minW={45} />}

        <div className='walk-info w-full flex mt-[-4px]'>
          <RecordInfo label='산책 거리' value={recordedDistance} containerStyle='flex-1' />
          <RecordInfo label='산책시간' value={recordedTime} containerStyle='flex-1' />
        </div>
      </div>
    </Link>
  );
}
export default RecordWalkItem;
