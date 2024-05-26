import { atom } from 'recoil';

import { Caution } from '@/types/post';
import { StopWatch, TrackMap } from '@/types/walk';

export const stopWatchState = atom<StopWatch>({
  key: 'stopWatchState',
  default: {
    isRunning: false,
    isPaused: false,
    start_at: null,
    end_at: null,
    time: 0,
  },
});

export const trackMapState = atom<TrackMap>({
  key: 'trackMapState',
  default: {
    distance: 0,
    locations: [],
  },
});

export const mapIsClicked = atom<boolean>({
  key: 'mapIsClicked',
  default: false,
});

export const recordedCautions = atom<Caution[]>({
  key: 'recordedCautions',
  default: [],
});

export const recordCalendarState = atom<{ from: string | null; to: string | null }>({
  key: 'recordCalendarState',
  default: {
    from: null,
    to: null,
  },
});
