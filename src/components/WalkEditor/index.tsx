'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import TrackMap from '@/components/WalkEditor/TrackMap';
import { WalkInfoContainer } from '@/components/WalkEditor/WalkInfoContainer';
import { mapIsClicked, recordedCautions, stopWatchState } from '@/recoil/atoms/walkAtom';
import { Pet } from '@/types/pet';
import { Caution } from '@/types/post';
import { formatDateTime } from '@/utils/date';

import RecordAction from './RecordAction';
import {
  IconCaretDown,
  IconCaretUp,
  IconCheckbox,
  IconCheckboxFill,
  IconCurrentLocation,
} from '../../../public/assets/svgs';
import PetProfile from '../PetProfile';

interface WalkFormProps {
  defaultCautions?: Caution[];
  pet: Pet;
}

export function WalkEditor({ defaultCautions, pet }: WalkFormProps) {
  const [cautions, setCautions] = useRecoilState(recordedCautions);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isRunning } = useRecoilValue(stopWatchState);
  const setIsChangedCenter = useSetRecoilState(mapIsClicked);

  const toggleFolder = () => setIsExpanded(prev => !prev);

  const handleChangeCurrentLocation = () => setIsChangedCenter(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, targetId: number) => {
    const { checked } = e.currentTarget;

    const updatedCautions = cautions.map(caution => {
      if (caution.id === targetId) {
        return { ...caution, is_completed: checked };
      }
      return caution;
    });

    setCautions(updatedCautions);
  };

  useEffect(() => {
    if (defaultCautions) return setCautions(defaultCautions);
  }, [defaultCautions, setCautions]);

  return (
    <div className='container relative'>
      <TrackMap />

      <div
        className={`container p-4 fixed left-[50%] bottom-0 translate-x-[-50%] w-full flex flex-col items-center gap-y-4 bg-white z-[45] rounded-tl-[16px] rounded-tr-[16px]
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
            <PetProfile pet={pet} width={32} height={32} />

            <p className='text-text-1 text-sm font-semibold'>
              {pet.name}와(과) {isRunning ? '산책 중입니다!' : '산책을 시작해볼까요?'}
            </p>
          </div>

          {/* TODO PetSitter 하게 되면서 수정 필요 */}
          {defaultCautions && (
            <div className='scheduled-walk-time-container'>
              <WalkInfoContainer label='산책 예정 시간'>
                <div className='flex gap-x-2 text-sm text-text-1 font-light'>
                  <span>{formatDateTime('2024-03-15T03:30:00.000Z')}</span>
                  <span>-</span>
                  <span>{formatDateTime('2024-03-15T03:30:00.000Z')}</span>
                </div>
              </WalkInfoContainer>
            </div>
          )}

          {cautions.length > 0 && (
            <div className='caution-container'>
              <WalkInfoContainer label='산책시 주의사항'>
                <ul className='flex flex-col gap-y-2'>
                  {cautions.map(({ id, content, is_completed }) => (
                    <li className='text-text-1 text-sm font-light' key={id}>
                      <label htmlFor={`caution-${id}`}>
                        <input
                          type='checkbox'
                          id={`caution-${id}`}
                          checked={is_completed}
                          className='hidden'
                          onChange={e => id && handleChange(e, id)}
                        />
                        {is_completed ? (
                          <IconCheckboxFill className='inline-block mr-2' />
                        ) : (
                          <IconCheckbox className='inline-block mr-2' />
                        )}
                        <span>{content}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </WalkInfoContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
