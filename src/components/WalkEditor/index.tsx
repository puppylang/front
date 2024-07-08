'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import TrackMap from '@/components/WalkEditor/TrackMap';
import { WalkInfoContainer } from '@/components/WalkEditor/WalkInfoContainer';
import { mapIsClicked, recordedCautions, stopWatchState } from '@/recoil/atoms/walkAtom';
import { Pet } from '@/types/pet';
import { Caution, Schedule } from '@/types/post';
import { formatDateTime } from '@/utils/date';

import RecordAction from './RecordAction';
import {
  IconCaretDown,
  IconCaretUp,
  IconCheckbox,
  IconCheckboxFill,
  IconCurrentLocation,
} from '../../../public/assets/svgs';
import { Profile } from '../Profile';

interface WalkFormProps {
  defaultCautions?: Caution[];
  schedule?: Schedule;
  pet: Pet;
}

export function WalkEditor({ defaultCautions, schedule, pet }: WalkFormProps) {
  const [cautions, setCautions] = useRecoilState(recordedCautions);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isRunning } = useRecoilValue(stopWatchState);
  const setIsChangedCenter = useSetRecoilState(mapIsClicked);

  const toggleFolder = () => setIsExpanded(prev => !prev);

  const handleChangeCurrentLocation = () => setIsChangedCenter(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, changedIndex: number) => {
    const { checked } = e.currentTarget;

    const updatedCautions = cautions.map((caution, index) => {
      if (index === changedIndex) {
        return { ...caution, is_completed: checked };
      }
      return caution;
    });

    setCautions(updatedCautions);
  };

  useEffect(() => {
    if (defaultCautions) return setCautions(defaultCautions);
  }, [defaultCautions, setCautions]);

  const hasSchedule = schedule && schedule.start_at && schedule.end_at;

  return (
    <div className='container relative'>
      <TrackMap />

      <div
        className={`container p-4 pb-8 fixed left-[50%] bottom-0 translate-x-[-50%] w-full flex flex-col items-center gap-y-4 bg-white z-[45] rounded-tl-[16px] rounded-tr-[16px]
          ${isExpanded && 'translate-y-[calc(100%-56px)]'} transition-transform`}
      >
        <div className='arrow w-full'>
          <button type='button' onClick={toggleFolder} className='w-full flex justify-center'>
            {isExpanded ? <IconCaretUp /> : <IconCaretDown />}
          </button>
        </div>

        <div className='current-location-btn absolute top-[-46px] right-4'>
          <button
            type='button'
            className='flex items-center justify-center w-[30px] h-[30px] bg-white rounded-full border scale-[1.2]'
            onClick={handleChangeCurrentLocation}
          >
            <IconCurrentLocation />
          </button>
        </div>

        <RecordAction />

        <div className='info w-full flex flex-col gap-y-4 mt-4'>
          <div className='puppy-info flex items-center gap-x-2'>
            <Profile.Pet pet={pet} width={32} height={32} />

            <p className='text-text-1 text-sm font-semibold'>
              {pet.name}와(과) {isRunning ? '산책 중입니다!' : '산책을 시작해볼까요?'}
            </p>
          </div>

          {hasSchedule && (
            <div className='scheduled-walk-time-container'>
              <WalkInfoContainer label='산책 예정 시간'>
                <div className='flex gap-x-2 text-sm text-text-1 font-light'>
                  {schedule.start_at && <span>{formatDateTime(schedule.start_at)}</span>}
                  <span>-</span>
                  {schedule.end_at && <span>{formatDateTime(schedule.end_at)}</span>}
                </div>
              </WalkInfoContainer>
            </div>
          )}

          {cautions.length > 0 && (
            <div className='caution-container'>
              <WalkInfoContainer label='산책시 주의사항'>
                <ul className='flex flex-col gap-y-2'>
                  {cautions.map(({ content, is_completed }, index) => {
                    const key = `caution-${index}`;
                    return (
                      <li className='text-text-1 text-sm font-light' key={key}>
                        <label htmlFor={`caution-${index}`}>
                          <input
                            type='checkbox'
                            id={`caution-${index}`}
                            checked={is_completed}
                            className='hidden'
                            onChange={e => handleChange(e, index)}
                          />
                          {is_completed ? (
                            <IconCheckboxFill className='inline-block mr-2' />
                          ) : (
                            <IconCheckbox className='inline-block mr-2' />
                          )}
                          <span>{content}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </WalkInfoContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
