'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { DEFAULT_PET_FORM, petFormState } from '@/recoil/atoms/petAtom';
import { PET_QUERY_KEY, deletePet, updatePet, usePetQuery } from '@/services/pet';
import { useUserQuery } from '@/services/user';
import { Pet, PetFormType, UpdatePetFormType } from '@/types/pet';

import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import { PetForm } from '@/components/PetForm';

interface DynamicRouteParams {
  params: {
    id: string;
  };
}

export default function EditPet({ params: { id } }: DynamicRouteParams) {
  const [formState, setFormState] = useRecoilState(petFormState);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const petAddMutation = useMutation({
    mutationKey: [PET_QUERY_KEY],
    mutationFn: (editPet: UpdatePetFormType) => {
      return updatePet(editPet);
    },
    onSuccess: (_, variable) => {
      queryClient.setQueryData([PET_QUERY_KEY], (oldData: Pet[]) => {
        return oldData.map(pet => (pet.id === variable.id ? variable : pet));
      });
    },
  });
  const petDeleteMutaion = useMutation({
    mutationKey: [PET_QUERY_KEY],
    mutationFn: (id: string) => {
      return deletePet(id);
    },
    onSuccess: (_, variable) => {
      queryClient.setQueryData([PET_QUERY_KEY], (oldData: Pet[]) => {
        return oldData.filter(pet => pet.id !== Number(variable));
      });
    },
  });

  const { data: pets } = usePetQuery();
  const { data: user } = useUserQuery();
  const currentPet = pets && pets.length !== 0 && pets.find(pets => pets.id === Number(id));

  const isInvalidForm = ![
    formState.name && formState.name.length >= 2,
    formState.breed,
    formState.weight,
    formState.birthday && formState.birthday.length === 10,
  ].every(Boolean);

  const onSubmitPetForm = (formState: PetFormType) => {
    if (!user) return;
    setFormState(DEFAULT_PET_FORM);
    petAddMutation.mutate({ ...formState, user_id: user.id, id: Number(id) });
  };

  const onClickPetDeleteBtn = () => {
    petDeleteMutaion.mutate(id);
  };

  useEffect(() => {
    if (!currentPet) return;
    if (searchParams.get('breed')) return;
    const { name, birthday, character, gender, image, is_newtralize, weight, breed } = currentPet;
    setFormState({
      name,
      birthday,
      character: character || undefined,
      gender,
      image: image || undefined,
      is_newtralize,
      weight,
      breed,
    });
  }, [currentPet]);

  useEffect(() => {
    if (!petAddMutation.isSuccess) return;
    router.push('/user');
  }, [petAddMutation.isSuccess, router]);

  useEffect(() => {
    if (!petDeleteMutaion.isSuccess) return;
    setFormState(DEFAULT_PET_FORM);
    router.push('/user');
  }, [petDeleteMutaion.isSuccess, router]);

  return (
    <>
      {petDeleteMutaion.isPending && <Loading />}
      <PetForm onSubmitForm={onSubmitPetForm} isLoading={petAddMutation.isPending}>
        <div className='fixed grid grid-cols-2  bottom-0 w-full bg-white-1'>
          <button type='button' className='text-white-1 bg-red-400' onClick={() => setIsOpen(true)}>
            삭제
          </button>
          <button
            type='submit'
            className={`${isInvalidForm && ' opacity-40'} w-full bg-main-1 text-white-1 text-[14px] py-3 `}
            disabled={isInvalidForm}
          >
            수정
          </button>
        </div>
        <Alert
          isOpen={isOpen}
          message='반려견 정보를 삭제할 경우 모든 산책 기록은 삭제됩니다. 삭제하시겠습니까?'
          onClose={() => setIsOpen(false)}
          onClick={onClickPetDeleteBtn}
        />
      </PetForm>
    </>
  );
}
