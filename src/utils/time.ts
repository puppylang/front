import dayjs from 'dayjs';

export const formatRunningTime = (time: number) => {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return formattedTime;
};

export const formatRecordedWalkTime = ({ start_at, end_at }: { start_at: string; end_at: string }) => {
  if (!start_at || !end_at) return { hours: 0, minutes: 0, seconds: 0 };

  const startAt = dayjs(start_at);
  const endAt = dayjs(end_at);

  const duration = endAt.diff(startAt);

  const hours = Math.floor(duration / (60 * 60 * 1000));
  const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((duration % (60 * 1000)) / 1000);

  return { hours, minutes, seconds };
};
