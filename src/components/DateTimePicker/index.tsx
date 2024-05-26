import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import 'dayjs/locale/ko';
import { Dayjs } from 'dayjs';
import * as React from 'react';
import { ReactNode, useState } from 'react';

import './style.css';

interface DateTimePickerContainerProps {
  label: string;
  isRequired?: boolean;
  children: ReactNode;
}

function DateTimePickerContainer({ label, isRequired, children }: DateTimePickerContainerProps) {
  return (
    <dl>
      <dt className='text-text-3 text-xs font-normal mb-2'>
        {label}
        {isRequired && <span>*</span>}
      </dt>
      <dd>{children}</dd>
    </dl>
  );
}

interface DateTimePickerProps {
  value: Dayjs;
  minDateTime: Dayjs;
  onChange: (date: string) => void;
}

function DateTimePicker({ value, minDateTime, onChange }: DateTimePickerProps) {
  const [dateTime, setDateTime] = useState<Dayjs>(value);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ko'>
      <MobileDateTimePicker
        className='date-time-picker w-full '
        orientation='portrait'
        value={dateTime}
        format='YYYY.MM.DD A hh:mm'
        minDateTime={minDateTime}
        onChange={date => {
          if (date) {
            onChange(date.toString());
            setDateTime(date);
          }
        }}
        slotProps={{
          toolbar: { toolbarFormat: `MMMM DD일`, hidden: false },
        }}
      />
    </LocalizationProvider>
  );
}

export const DateTimePickerWithLabel = {
  Container: DateTimePickerContainer,
  DateTimePicker,
};
