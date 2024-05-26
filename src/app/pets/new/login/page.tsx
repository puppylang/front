'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import useNativeRouter from '@/hooks/useNativeRouter';
import { DEFAULT_PET_FORM, petFormState } from '@/recoil/atoms/petAtom';
import { PET_QUERY_KEY } from '@/services/pet';
import { useUserQuery } from '@/services/user';
import { CreatePetFormType, DogBreed, PetFormType } from '@/types/pet';

import { PetForm } from '@/components/PetForm';

export default function NewLoginPet() {
  const [formState, setFormState] = useRecoilState(petFormState);

  const router = useNativeRouter();
  const petMutation = useMutation({
    mutationFn: (newPet: CreatePetFormType) => {
      return axios.post(`http://localhost:8000${PET_QUERY_KEY}`, newPet);
    },
  });
  const { data: user } = useUserQuery();

  const isInvalidForm = ![
    formState.name && formState.name.length >= 2,
    formState.breed,
    formState.weight,
    formState.birthday && formState.birthday.length === 10,
  ].every(Boolean);

  const onClickSkipButton = () => {
    router.push('/posts');
    setFormState(DEFAULT_PET_FORM);
  };

  const onSubmitPetForm = (formState: PetFormType) => {
    if (!user) return;
    setFormState(DEFAULT_PET_FORM);
    petMutation.mutate({ ...formState, user_id: user.id });
    router.replace('/posts');
  };

  useEffect(() => {
    const breed = localStorage.getItem('breed') as DogBreed;
    if (breed) {
      setFormState(prev => ({ ...prev, breed }));
      localStorage.removeItem('breed');
    }
  }, []);

  return (
    <PetForm onSubmitForm={onSubmitPetForm} isLoading={petMutation.isPending}>
      <div className='grid grid-cols-2 gap-2 fixed bottom-0 w-full px-6 bg-white-1 pt-4 pb-3'>
        <button
          type='button'
          onClick={onClickSkipButton}
          className='text-[14px] border border-main-1 text-main-1 py-3 rounded-[9px]'
        >
          건너뛰기
        </button>
        <button
          type='submit'
          className={`${isInvalidForm && ' opacity-40'} bg-main-1 text-white-1 text-[14px]  py-3 rounded-[9px]`}
          disabled={isInvalidForm}
        >
          등록
        </button>
      </div>
    </PetForm>
  );
}
