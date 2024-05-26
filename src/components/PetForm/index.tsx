'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, KeyboardEvent, ReactNode, useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { useRecoilState } from 'recoil';

import { petFormState } from '@/recoil/atoms/petAtom';
import { useUserQuery } from '@/services/user';
import { DogBreed, Gender, PetFormType } from '@/types/pet';

import ImageUpload from '../ImageUpload';
import NativeLink from '../NativeLink';

interface PetFormProps {
  children: ReactNode;
  onSubmitForm: (formState: PetFormType) => void;
  isLoading: boolean;
}

const DEFAULT_CHARACTER_TEXTAREA_HEIGHT = 78;

export function PetForm({ children, onSubmitForm, isLoading }: PetFormProps) {
  const [currentHeight, setCurrentHeight] = useState(DEFAULT_CHARACTER_TEXTAREA_HEIGHT);
  const [formState, setFormState] = useRecoilState(petFormState);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: user } = useUserQuery();

  const onKeyUpTextarea = (event: KeyboardEvent) => {
    const { currentTarget } = event;
    if (!currentTarget) return;
    const { scrollHeight } = currentTarget;

    if (scrollHeight >= DEFAULT_CHARACTER_TEXTAREA_HEIGHT && scrollHeight - currentHeight > 2) {
      (currentTarget as HTMLTextAreaElement).style.height = `${scrollHeight}px`;
      setCurrentHeight(scrollHeight);
      return;
    }

    if (currentHeight - scrollHeight >= 2 && currentHeight > DEFAULT_CHARACTER_TEXTAREA_HEIGHT) {
      const calcuratedGood = currentHeight - 20 < 78 ? 78 : currentHeight - 20;
      (currentTarget as HTMLTextAreaElement).style.height = `${calcuratedGood}px`;
      setCurrentHeight(scrollHeight);
    }
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

  const onSubmitPetForm = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    onSubmitForm(formState);
  };

  const onChangeFileInput = (uploadedImageURL: string) => {
    setFormState(prev => ({ ...prev, image: uploadedImageURL }));
  };

  useEffect(() => {
    const breed = searchParams.get('breed');
    if (!breed) return;
    setFormState(prev => ({ ...prev, breed: breed.replaceAll('_', '') as DogBreed }));
  }, []);

  return (
    <section className='w-screen bg-white-1'>
      {isLoading && (
        <section className='w-screen min-h-screen bg-text-1 fixed z-10 opacity-50 flex justify-center items-center'>
          <div className='border-[8px] border-[#f1f1f1] border-t-main-1 rounded-full w-16 h-16 animate-spin' />
        </section>
      )}
      <div className='h-32 bg-main-4 text-text-3 font-semibold flex justify-center items-center'>
        <p>반려견을 등록해 주세요!</p>
      </div>
      <form onSubmit={onSubmitPetForm}>
        <div className='px-6 pb-16'>
          <div className='flex justify-center items-center py-5'>
            <ImageUpload defaultURL={formState.image} onChangeFileInput={onChangeFileInput} />
          </div>

          <div className='mb-6'>
            <div className='text-[12px] mb-1 text-text-3 relative'>
              <span>*</span>
              <label htmlFor='name'>이름</label>
              <span className='text-[10px] absolute right-1'>{formState.name ? formState.name.length : 0} / 10</span>
            </div>
            <input
              type='text'
              id='name'
              maxLength={10}
              value={formState.name}
              onChange={({ target }) => setFormState(prev => ({ ...prev, name: target.value }))}
              className='px-[14px] py-[10px] rounded-[15px] block border border-gray-3 w-full text-[14px]'
            />
          </div>

          <div className='mb-6'>
            <div className='text-[12px] mb-1 text-text-3'>
              <span>*</span>
              <span>견종</span>
            </div>
            <NativeLink
              href={`/pets/breed?from=${pathname}`}
              webviewPushPage='breed'
              className='flex items-center border border-gray-3 px-[14px] py-[10px] text-[13px] rounded-[15px] '
            >
              <IoSearch color='#E5E5E5' />
              {!formState.breed && <p className='pl-[6px] text-[#9BA3AF]'>견종 선택하기</p>}
              {formState.breed && <p className='pl-[6px] text-text-1'>{formState.breed}</p>}
            </NativeLink>
          </div>

          <div className='mb-6'>
            <div className='text-[12px] mb-1 text-text-3'>
              <span>*</span>
              <label htmlFor='weight'>몸무게</label>
            </div>
            <input
              inputMode='numeric'
              defaultValue={formState.weight !== 0 ? formState.weight : ''}
              placeholder='00kg'
              id='weight'
              onChange={({ target }) => setFormState(prev => ({ ...prev, weight: Number(target.value) }))}
              maxLength={4}
              className='px-[14px] py-[10px] rounded-[15px] block border border-gray-3 w-full text-[14px]'
            />
          </div>

          <div className='mb-6'>
            <div className='text-[12px] mb-1 text-text-3'>
              <span>*</span>
              <label htmlFor='birthday'>생년월일</label>
            </div>
            <input
              inputMode='numeric'
              value={formState.birthday}
              placeholder='0000-00-`00'
              id='birthday'
              onChange={onChangeBirthdayInput}
              maxLength={10}
              className='px-[14px] py-[10px] rounded-[15px] block border border-gray-3 w-full text-[14px]'
            />
          </div>

          <div className='mb-6'>
            <div className='text-[12px] mb-1 text-text-3'>
              <span>성별</span>
            </div>
            <div className='grid grid-cols-2 gap-5'>
              <input
                type='radio'
                onChange={() => setFormState(prev => ({ ...prev, gender: Gender.Male }))}
                id='male'
                name='gender'
                className='hidden'
                value={Gender.Male}
              />
              <label
                htmlFor='male'
                className={`${
                  formState.gender === Gender.Male ? 'bg-main-2 text-white-1' : 'bg-gray-3 text-text-2'
                } block text-center text-[14px] py-4 rounded-3xl`}
              >
                수컷
              </label>
              <input
                type='radio'
                onChange={() => setFormState(prev => ({ ...prev, gender: Gender.Female }))}
                id='female'
                name='gender'
                className='hidden'
                value={Gender.Female}
              />
              <label
                htmlFor='female'
                className={`${
                  formState.gender === Gender.Female ? 'bg-main-2 text-white-1' : 'bg-gray-3 text-text-2'
                } text-center text-[14px] py-4 rounded-3xl`}
              >
                암컷
              </label>
            </div>
          </div>

          <div className='mb-6'>
            <div className='text-[12px] mb-1 text-text-3'>
              <span>중성화여부</span>
            </div>
            <div className='grid grid-cols-2 gap-5'>
              <input
                type='radio'
                onChange={() =>
                  setFormState(prev => {
                    return { ...prev, is_newtralize: true };
                  })
                }
                id='isNeutralized'
                name='neutralization'
                className='hidden'
                defaultChecked={formState.is_newtralize}
              />
              <label
                htmlFor='isNeutralized'
                className={`${
                  formState.is_newtralize ? 'bg-main-2 text-white-1' : 'bg-gray-3 text-text-2'
                } block text-center text-[14px] py-4 rounded-3xl`}
              >
                예
              </label>
              <input
                type='radio'
                onChange={() =>
                  setFormState(prev => {
                    return { ...prev, is_newtralize: false };
                  })
                }
                id='isNotNeutralized'
                name='neutralization'
                className='hidden'
                defaultChecked={formState.is_newtralize === false}
              />
              <label
                htmlFor='isNotNeutralized'
                className={`${
                  formState.is_newtralize === false ? 'bg-main-2 text-white-1' : 'bg-gray-3 text-text-2'
                } text-center text-[14px] py-4 rounded-3xl`}
              >
                아니요
              </label>
            </div>
          </div>

          <div className='mb-6'>
            <label htmlFor='character' className='block text-text-3 text-[12px] mb-1'>
              특징
            </label>
            <textarea
              id='character'
              onKeyUp={onKeyUpTextarea}
              value={formState.character || ''}
              onChange={({ target }) => setFormState(prev => ({ ...prev, character: target.value }))}
              className='resize-none overflow-hidden w-full border border-gray-3 rounded-[15px] px-[14px] py-[10px] text-[14px] h-[80px] outline-main-2'
            />
          </div>
        </div>

        {children}
      </form>
    </section>
  );
}
