'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';

import useNativeRouter from '@/hooks/useNativeRouter';
import { PET_QUERY_KEY, deletePet, updatePet, usePetQuery } from '@/services/pet';
import { useUserQuery } from '@/services/user';
import { DogBreed, Gender, Neuter, Pet, PetFormType, UpdatePetFormType } from '@/types/pet';

import Alert from '@/components/Alert';
import Breed from '@/components/Breed';
import { Form } from '@/components/Form';
import ImageUpload from '@/components/ImageUpload';
import Loading from '@/components/Loading';
import { Popup } from '@/components/Popup';

const DEFAULT_PET_FORM: PetFormType = {
  birthday: '',
  name: '',
  character: undefined,
  gender: undefined,
  image: undefined,
  is_newtralize: undefined,
  weight: undefined,
  breed: undefined,
};

interface DynamicRouteParams {
  params: {
    id: string;
  };
}

export default function EditPet({ params: { id } }: DynamicRouteParams) {
  const [formState, setFormState] = useState(DEFAULT_PET_FORM);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const queryClient = useQueryClient();
  const router = useNativeRouter();

  const petUpdateMutation = useMutation({
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

  const onChangeFileInput = (uploadedImageURL: string) => {
    setFormState(prev => ({ ...prev, image: uploadedImageURL }));
  };

  const onSubmitPetForm = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    petUpdateMutation.mutate({ ...formState, user_id: user.id, id: Number(id) });
  };

  const addDotInputValue = (value: string) => {
    if (value.length === 4 || value.length === 7) {
      return `${value}-`;
    }

    return value;
  };

  const onChangeBirthdayInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const INPUT_BACKWARD_TYPE = 'deleteContentBackward';
    const isBackwordKey = (event.nativeEvent as InputEvent).inputType === INPUT_BACKWARD_TYPE;

    setFormState(prev => ({ ...prev, birthday: isBackwordKey ? value : addDotInputValue(value) }));
  };

  const onClickPetDeleteBtn = () => {
    petDeleteMutaion.mutate(id);
  };

  useEffect(() => {
    if (!currentPet) return;
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
    if (!petUpdateMutation.isSuccess) return;
    router.push('/user', {
      webviewPushPage: 'home',
    });
  }, [petUpdateMutation.isSuccess]);

  useEffect(() => {
    if (!petDeleteMutaion.isSuccess) return;
    router.push('/user', {
      webviewPushPage: 'home',
    });
  }, [petDeleteMutaion.isSuccess]);

  return (
    <section className='w-screen bg-white-1'>
      {(petDeleteMutaion.isPending || petUpdateMutation.isPending) && <Loading />}
      <div className='h-32 bg-main-4 text-text-3 font-semibold flex justify-center items-center'>
        <p>반려견을 등록해 주세요!</p>
      </div>
      <form onSubmit={onSubmitPetForm}>
        <div className='px-6 pb-16'>
          <div className='flex justify-center items-center py-5'>
            <ImageUpload defaultURL={formState.image} onChangeFileInput={onChangeFileInput} />
          </div>

          <Form.String
            isRequired
            title='이름'
            onChange={value => setFormState(prev => ({ ...prev, name: value }))}
            value={formState.name || ''}
            minLength={2}
            maxLength={10}
            errorText='이름 2~10글자를 입력해 주세요.'
          />

          <Form.Title title='견종' isRequired>
            <button
              type='button'
              onClick={() => setIsOpenPopup(true)}
              className='flex items-center border border-gray-3 px-[14px] py-[10px] text-[13px] rounded-[15px] w-full'
            >
              <IoSearch color='#E5E5E5' />
              {!formState.breed && <p className='pl-[6px] text-[#9BA3AF]'>견종 선택하기</p>}
              {formState.breed && <p className='pl-[6px] text-text-1'>{formState.breed}</p>}
            </button>
          </Form.Title>

          <Popup.Container className='h-full' isOpen={isOpenPopup}>
            <Popup.CloseButton onClose={() => setIsOpenPopup(false)} className='border-b-0 text-center justify-center'>
              <p className='text-center font-bold'>견종 선택하기</p>
            </Popup.CloseButton>
            <Breed
              onClick={value => {
                setIsOpenPopup(false);
                setFormState(prev => ({ ...prev, breed: value.replaceAll('_', '') as DogBreed }));
              }}
            />
          </Popup.Container>

          <Form.Number
            isRequired
            title='몸무게'
            value={formState.weight ? String(formState.weight) : ''}
            onChange={({ target }) => setFormState(prev => ({ ...prev, weight: Number(target.value) }))}
            placeholder='00kg'
            maxLength={4}
          />

          <Form.Number
            isRequired
            title='생년월일'
            value={formState.birthday || ''}
            onChange={onChangeBirthdayInput}
            placeholder='0000-00-00'
            maxLength={10}
            minLength={10}
            errorText='생년월일을 8글자를 입력해 주세요.'
          />

          <Form.Radio
            title='성별'
            onChange={value => setFormState(prev => ({ ...prev, gender: value as Gender }))}
            firstInput={{ value: Gender.Male, id: 'male', title: '남성' }}
            secondInput={{ value: Gender.Female, id: 'female', title: '여성' }}
            activedValue={formState.gender || ''}
          />

          <Form.Radio
            title='중성화 여부'
            onChange={value => setFormState(prev => ({ ...prev, is_newtralize: value === Neuter.Neuter }))}
            firstInput={{ value: Neuter.Neuter, id: Neuter.Neuter, title: '예' }}
            secondInput={{ value: Neuter.NotNeuter, id: Neuter.NotNeuter, title: '아니오' }}
            activedValue={
              // eslint-disable-next-line
              formState.is_newtralize ? Neuter.Neuter : formState.is_newtralize === false ? Neuter.NotNeuter : ''
            }
          />

          <Form.Textarea
            title='특징'
            value={formState.character || ''}
            onChange={value => setFormState(prev => ({ ...prev, character: value }))}
          />
        </div>

        <div className='fixed grid grid-cols-2  bottom-0 w-full bg-white-1'>
          <button type='button' className='text-white-1 bg-red-400' onClick={() => setIsAlertOpen(true)}>
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
          isOpen={isAlertOpen}
          message='반려견 정보를 삭제할 경우 모든 산책 기록은 삭제됩니다. 삭제하시겠습니까?'
          onClose={() => setIsAlertOpen(false)}
          onClick={onClickPetDeleteBtn}
        />
      </form>
    </section>
  );
}
