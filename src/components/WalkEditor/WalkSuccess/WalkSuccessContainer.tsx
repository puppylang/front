import { useMemo } from 'react';

import { Caution } from '@/types/post';
import { WalkForm, WalkRole } from '@/types/walk';
import { formatRecordedWalkTime } from '@/utils/time';
import { formatDistance } from '@/utils/walk';

import RecordMap from '@/components/RecordMap';
import { FormattedRecordWalkTime } from '@/components/RecordWalkTime';

import WalkSuccessTitle from './WalkSuccessTitle';
import RecordInfo from '../RecordInfo';

interface WalkSuccessContainerProps {
  walkData: WalkForm;
  title: string;
  type: WalkRole;
  titleAlign?: 'CENTER' | 'LEFT' | 'RIGHT';
}

function WalkSuccessContainer({ walkData, title, type, titleAlign }: WalkSuccessContainerProps) {
  const recordedDistance = useMemo(() => {
    if (!walkData || !walkData.distance) return '0m';

    return formatDistance(walkData.distance);
  }, [walkData]);

  const recordedTime = useMemo(() => {
    if (!walkData) return null;

    const { hours, minutes, seconds } = formatRecordedWalkTime({
      start_at: walkData.start_at,
      end_at: walkData.end_at,
    });

    return (
      <>
        <FormattedRecordWalkTime label='시간' value={hours} labelStyle='pr-1' />
        <FormattedRecordWalkTime label='분' value={minutes} labelStyle='pr-1' />
        <FormattedRecordWalkTime label='초' value={seconds} alwaysVisible />
      </>
    );
  }, [walkData]);

  const filteredBySuccessfulCautions: Caution[] = useMemo(() => {
    if (!walkData || !walkData.cautions) return [];

    return walkData.cautions?.filter(({ is_completed }) => is_completed);
  }, [walkData]);

  const filteredByUnsuccessfulCautions: Caution[] = useMemo(() => {
    if (!walkData || !walkData.cautions) return [];

    return walkData.cautions?.filter(({ is_completed }) => !is_completed);
  }, [walkData]);

  return (
    <>
      {walkData.pet && <WalkSuccessTitle title={title} pet={walkData.pet} align={titleAlign || null} />}

      <div className='walk-info flex items-center mt-6'>
        <RecordInfo
          label='산책 거리'
          value={recordedDistance}
          containerStyle="relative after:content-[''] after:absolute after:top-[50%] after:right-0 after:translate-x-[50%] after:translate-y-[-40%] after:w-[1px] after:h-[98%] after:bg-gray-2"
        />
        <RecordInfo label='산책 시간' value={recordedTime} />
      </div>

      <div className='location-info mt-8 bg-bg-blue w-full h-[300px] rounded-[10px] overflow-hidden'>
        <RecordMap locations={walkData.locations} />
      </div>

      {type === WalkRole.PetSitterWalker && walkData.cautions && (
        <div className='caution-info mt-8 flex flex-col gap-y-4'>
          {filteredBySuccessfulCautions.length && (
            <RecordCautionList
              containerClassName='successful'
              title='이렇게 주의사항도 잘 지켜주셨어요!'
              cautions={filteredBySuccessfulCautions}
            />
          )}
          {filteredByUnsuccessfulCautions.length && (
            <RecordCautionList
              containerClassName='unsuccessful'
              title='좀 더 주의할게요.'
              cautions={filteredByUnsuccessfulCautions}
            />
          )}
        </div>
      )}
    </>
  );
}
export default WalkSuccessContainer;

interface RecordCautionListProps {
  containerClassName: string;
  title: string;
  cautions: Caution[];
}

function RecordCautionList({ containerClassName, title, cautions }: RecordCautionListProps) {
  return (
    <div className={containerClassName}>
      <p className='text-sm font-semibold text-text-2'>{title}</p>
      <ul className='flex flex-col gap-y-1 mt-2'>
        {cautions.map(({ id, content }) => (
          <li
            key={id}
            className="text-xs text-text-1 relative pl-4 after:content-['・'] after:absolute after:left-0 after:text-text-2"
          >
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
}
