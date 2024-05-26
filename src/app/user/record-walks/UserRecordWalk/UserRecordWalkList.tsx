import { WalkForm, WalkRole } from '@/types/walk';
import { formatDate } from '@/utils/date';

import RecordWalkList from '@/components/RecordWalkList';

interface UserRecordWalkListProps {
  walkList: WalkForm[];
  date: string;
  role: WalkRole;
}

function UserRecordWalkList({ date, walkList, ...props }: UserRecordWalkListProps) {
  return (
    <div className='walk-list p-4'>
      <span className='block text-xs text-text-2 font-light mb-4'>{formatDate(date)}</span>

      {walkList.length ? (
        <RecordWalkList walkList={walkList} {...props} />
      ) : (
        <p className='text-sm text-text-1'>해당 날짜로 기록이 존재하지 않습니다.</p>
      )}
    </div>
  );
}

export default UserRecordWalkList;
