'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import WalkSuccess from '@/components/WalkEditor/WalkSuccess';
import { stopWatchState, trackMapState } from '@/recoil/atoms/walkAtom';
import { usePetQuery } from '@/services/pet';
import { createPetWalkRecord } from '@/services/walk';
import { WalkForm, WalkRole } from '@/types/walk';

import Loading from '@/components/Loading';

import { WalkEditor } from '../../../components/WalkEditor';

interface PetWalkProps {
  params: {
    petId: string;
  };
}

function PetWalk({ params: { petId } }: PetWalkProps) {
  const { data: pets } = usePetQuery();
  const { locations, distance } = useRecoilValue(trackMapState);
  const { isPaused, start_at, end_at } = useRecoilValue(stopWatchState);
  const [isLoading, setIsLoading] = useState(false);

  const {
    mutate: petWalkMutation,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: (payload: WalkForm) => createPetWalkRecord(payload),
    onSuccess: () => setIsLoading(false),
    onError: () => setIsLoading(false),
  });

  const pet = useMemo(() => {
    const target = pets?.filter(({ id }) => id === Number(petId))[0];
    return target;
  }, [petId, pets]);

  const handleSubmitPetWalk = useCallback(() => {
    if (petId && start_at && end_at) {
      const payload = {
        start_at,
        end_at,
        locations,
        distance,
        pet_id: Number(petId),
      };

      petWalkMutation(payload);
    }
  }, [petWalkMutation, start_at, end_at, locations, distance, petId]);

  useEffect(() => {
    if (isPaused) {
      setIsLoading(true);
      return handleSubmitPetWalk();
    }
  }, [handleSubmitPetWalk, isPaused]);

  return (
    <>
      {isLoading && <Loading />}

      {isSuccess ? (
        <WalkSuccess data={data} type={WalkRole.PetOwner} />
      ) : (
        <section id='walk' className='flex flex-col items-center'>
          {pet && <WalkEditor pet={pet} />}
        </section>
      )}
    </>
  );
}

export default PetWalk;
