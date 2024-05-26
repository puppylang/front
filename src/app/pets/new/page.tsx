'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { DEFAULT_PET_FORM, petFormState } from '@/recoil/atoms/petAtom';
import { PET_QUERY_KEY } from '@/services/pet';
import { useUserQuery } from '@/services/user';
import { CreatePetFormType, PetFormType } from '@/types/pet';

import { PetForm } from '@/components/PetForm';

export default function NewPet() {
  const [formState, setFormState] = useRecoilState(petFormState);

  const router = useRouter();
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

  const onSubmitPetForm = (formState: PetFormType) => {
    if (!user) return;
    setFormState(DEFAULT_PET_FORM);
    petMutation.mutate({ ...formState, user_id: user.id });
  };

  useEffect(() => {
    if (!petMutation.isSuccess) return;
    router.push('/user');
  }, [petMutation.isSuccess, router]);

  return (
    <PetForm onSubmitForm={onSubmitPetForm} isLoading={petMutation.isPending}>
      <div className='fixed bottom-0 w-full bg-white-1'>
        <button
          type='submit'
          className={`${isInvalidForm && ' opacity-40'} w-full bg-main-1 text-white-1 text-[14px] py-3 `}
          disabled={isInvalidForm}
        >
          등록
        </button>
      </div>
    </PetForm>
  );
}
