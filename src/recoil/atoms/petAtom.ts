import { atom } from 'recoil';

import { PetFormType } from '@/types/pet';

export const DEFAULT_PET_FORM: PetFormType = {
  birthday: '',
  name: '',
  character: undefined,
  gender: undefined,
  image: undefined,
  is_newtralize: undefined,
  weight: undefined,
  breed: undefined,
};

export const petFormState = atom({
  key: 'petFormState',
  default: DEFAULT_PET_FORM,
});
