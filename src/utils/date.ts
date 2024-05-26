import dayjs, { Dayjs } from 'dayjs';

const dayOfWeek = (day: string) => {
  const weekStr: Record<string, string> = {
    Mon: '월',
    Tue: '화',
    Wed: '수',
    Thu: '목',
    Fri: '금',
    Sat: '토',
    Sun: '일',
  };

  return weekStr[day];
};

export const formatDate = (date: string) => {
  const day = dayjs(date).format('ddd');

  return `${dayjs(date).format('YYYY.MM.DD')} (${dayOfWeek(day)})`;
};

export const formatDateTime = (date: string) => {
  const day = dayjs(date).format('ddd');

  return `${dayjs(date).format('YYYY.MM.DD')} (${dayOfWeek(day)}) ${formatTime(date)}`;
};

export const formatAge = (date: string) => {
  const formatDate = dayjs(date.replaceAll('.', '-')).toDate();
  return `${dayjs().diff(formatDate, 'year')}살`;
};

export const formatDiffTime = (date: string | Date) => {
  const currentDate = dayjs();

  const diffYear = currentDate.diff(date, 'y');

  if (diffYear >= 1) {
    return `${diffYear}년`;
  }

  const diffMonth = currentDate.diff(date, 'month');
  if (diffMonth >= 1) {
    return `${diffYear}월`;
  }

  const diffDay = currentDate.diff(date, 'd');
  if (diffDay >= 1) {
    return `${diffDay}일`;
  }

  const diffHour = currentDate.diff(date, 'h');
  if (diffHour >= 1) {
    return `${diffHour}시간`;
  }

  const diffMinute = currentDate.diff(date, 'm');
  if (diffMinute >= 1) {
    return `${diffMinute}분`;
  }

  const diffSecond = currentDate.diff(date, 's');
  return `${diffSecond}초`;
};

export const formatTime = (date: string) => {
  return `${dayjs(date).format('HH시 mm분')}`;
};

export const getYearMonth = (date: Dayjs) => {
  return {
    year: date.year(),
    month: date.month() + 1,
  };
};
