'use client';

import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { stopWatchState, trackMapState } from '@/recoil/atoms/walkAtom';

import Alert from '@/components/Alert';
import Toast from '@/components/Toast';

import { IconPause, IconRun } from '../../../../public/assets/svgs';

function StopWatch() {
  const [stopWatchValue, setStopWatchValue] = useRecoilState(stopWatchState);
  const { locations } = useRecoilValue(trackMapState);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const handleCloseToast = () => setIsToastOpen(false);

  const handleResumeWalk = () => {
    setIsAlertOpen(false);
    setStopWatchValue(prev => ({ ...prev, isRunning: true, end_at: null }));

    intervalRef.current = setInterval(() => {
      setStopWatchValue(prev => ({ ...prev, time: prev.time + 1000 }));
    }, 1000);
  };

  const handleSaveWalk = () => {
    if (locations.length < 3) {
      setIsToastOpen(true);
      setIsAlertOpen(false);
    } else {
      setIsAlertOpen(false);
      setStopWatchValue(prev => ({ ...prev, isPaused: true }));
    }
  };

  const handleClickStartAndStop = () => {
    if (stopWatchValue.isRunning) {
      setIsAlertOpen(true);
      clearInterval(intervalRef.current);
      setStopWatchValue(prev => ({ ...prev, isRunning: false, end_at: dayjs().toISOString() }));
    } else {
      intervalRef.current = setInterval(() => {
        setStopWatchValue(prev => ({ ...prev, time: prev.time + 1000 }));
      }, 1000);

      setStopWatchValue(prev => ({ ...prev, isRunning: true, isPaused: false, start_at: dayjs().toISOString() }));
    }
  };

  return (
    <>
      <div className='button-container absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'>
        <button
          type='button'
          onClick={handleClickStartAndStop}
          className='flex items-center justify-center w-[40px] h-[40px] bg-main-1 rounded-full'
        >
          {stopWatchValue.isRunning ? <IconPause /> : <IconRun />}
        </button>
      </div>

      <Alert
        title='산책 기록 저장'
        message='현재까지의 기록을 저장하실건가요?'
        isOpen={isAlertOpen}
        buttonText='저장하기'
        onClick={handleSaveWalk}
        onClose={handleResumeWalk}
      />

      <Toast
        position='TOP'
        status='error'
        isInvisible={isToastOpen}
        description='선택하신 경로가 너무 적습니다. 조금만 더 산책해주세요!'
        onClose={handleCloseToast}
      />
    </>
  );
}

export default StopWatch;
