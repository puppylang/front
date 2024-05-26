import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { recordCalendarState } from '@/recoil/atoms/walkAtom';
import { useCalendarWalks } from '@/services/walk';
import { WalkForm, WalkRole } from '@/types/walk';

import UserRecordWalkCalendar from './UserRecordWalkCalendar';
import UserRecordWalkList from './UserRecordWalkList';
import UserRecordWalkTab from './UserRecordWalkTab';

const today = dayjs();

function UserRecordWalk() {
  const [selectedRole, setSelectedRole] = useState(WalkRole.PetOwner);
  const { from, to } = useRecoilValue(recordCalendarState);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);

  const { data: recordedWalks, isLoading } = useCalendarWalks({ from, to, role: selectedRole });

  const handleClickWalkRole = (role: WalkRole) => setSelectedRole(role);

  const handleChangeDate = (date: Dayjs) => setSelectedDate(date);

  const walkList: WalkForm[] = useMemo(() => {
    if (!selectedDate) return [];

    if (!recordedWalks || recordedWalks.length < 1) return [];

    const formatSelectedDate = selectedDate.format('YYYY-MM-DD');
    const filteredWalkList = recordedWalks.filter(
      ({ created_at }) => dayjs(created_at).format('YYYY-MM-DD') === formatSelectedDate,
    );

    return filteredWalkList;
  }, [recordedWalks, selectedDate]);

  return (
    <>
      <div className='tab-list bg-white'>
        <UserRecordWalkTab selectedRole={selectedRole} onClick={handleClickWalkRole} />
      </div>

      <div className='record-walk p-4'>
        <div className='walk-calendar bg-white rounded-[10px]'>
          <UserRecordWalkCalendar recordedWalks={recordedWalks} isLoading={isLoading} onChangeDate={handleChangeDate} />
        </div>

        <div className='walk-list-container bg-white mt-4 rounded-[10px]'>
          <UserRecordWalkList walkList={walkList} date={selectedDate.toISOString()} role={selectedRole} />
        </div>
      </div>
    </>
  );
}
export default UserRecordWalk;
