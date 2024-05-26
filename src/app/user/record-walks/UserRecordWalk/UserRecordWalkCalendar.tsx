import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import { useEffect, useMemo, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { recordCalendarState } from '@/recoil/atoms/walkAtom';
import { YearMonth } from '@/types/date';
import { WalkForm } from '@/types/walk';
import { getYearMonth } from '@/utils/date';

const today = dayjs();

const formatYearMonth = ({ year, month }: YearMonth) => dayjs(`${year}-${month}`);

interface UserRecordWalkCalendarProps {
  recordedWalks: WalkForm[] | undefined | null;
  isLoading: boolean;
  onChangeDate: (date: Dayjs) => void;
}

function UserRecordWalkCalendar({ recordedWalks, isLoading, onChangeDate }: UserRecordWalkCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentYearMonth, setCurrentYearMonth] = useState<YearMonth>(getYearMonth(today));
  const setCalendarDate = useSetRecoilState(recordCalendarState);

  const fromDate = useMemo(() => formatYearMonth(currentYearMonth).startOf('month').toISOString(), [currentYearMonth]);
  const toDate = useMemo(() => formatYearMonth(currentYearMonth).endOf('month').toISOString(), [currentYearMonth]);

  useEffect(() => {
    setCalendarDate({ from: fromDate, to: toDate });
  }, [fromDate, setCalendarDate, toDate]);

  const recordeddays: number[] = useMemo(() => {
    if (!recordedWalks) return [];

    return recordedWalks.map(walk => dayjs(walk.created_at).date());
    return [1, 2];
  }, [recordedWalks]);

  const handleChangeDate = (date: Dayjs) => {
    setSelectedDate(date);
    onChangeDate(date);
  };
  const handleMonthChange = (date: Dayjs) => setCurrentYearMonth(getYearMonth(date));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ko'>
      <DateCalendar
        value={selectedDate}
        loading={isLoading}
        onChange={handleChangeDate}
        renderLoading={() => <DayCalendarSkeleton />}
        onMonthChange={handleMonthChange}
        slots={{
          day: RecordedWalkDay,
        }}
        slotProps={{
          day: {
            recordeddays,
          } as any,
        }}
      />
    </LocalizationProvider>
  );
}

export default UserRecordWalkCalendar;

function RecordedWalkDay({ day, outsideCurrentMonth, ...props }: PickersDayProps<Dayjs> & { recordeddays?: number[] }) {
  const { recordeddays = [] } = props;

  const isSelected = !outsideCurrentMonth && recordeddays.indexOf(day.date()) >= 0;

  return (
    <div className='relative'>
      {isSelected && <span className='absolute right-0 z-[1] w-[5px] h-[5px] rounded-full bg-text-3' />}
      <PickersDay {...props} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </div>
  );
}
