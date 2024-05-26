'use client';

import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useState } from 'react';

import useNativeRouter from '@/hooks/useNativeRouter';
import { USER_QUERY_KEY, editUserInfo, useUserQuery, useValidateUserName } from '@/services/user';
import { Gender } from '@/types/pet';
import { UserEditForm } from '@/types/user';

import ImageUpload from '@/components/ImageUpload';

const DEFAULT_CHARACTER_TEXTAREA_HEIGHT = 78;

const DEFAULT_FORM_STATE: UserEditForm = {
  name: '',
  id: '',
  gender: null,
  birthday: null,
  character: null,
  image: null,
};

export default function Edit() {
  const [currentHeight, setCurrentHeight] = useState(DEFAULT_CHARACTER_TEXTAREA_HEIGHT);
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);
  const [isNameChanging, setIsNameChanging] = useState(false);

  const router = useNativeRouter();
  const { data: user } = useUserQuery();
  const { data: isInvalidName } = useValidateUserName(formState.name);
  const userMutation = useMutation({
    mutationKey: [USER_QUERY_KEY],
    mutationFn: (editUser: UserEditForm) => {
      return editUserInfo(editUser);
    },
  });

  const addDotInputValue = (value: string) => {
    if (value.length === 4 || value.length === 7) {
      return `${value}.`;
    }

    return value;
  };

  const onChangeFileInput = (uploadedURL: string) => {
    setFormState(prev => ({ ...prev, image: uploadedURL }));
  };

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

  const onChangeBirthdayInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const INPUT_BACKWARD_TYPE = 'deleteContentBackward';
    const isBackwordKey = (event.nativeEvent as InputEvent).inputType === INPUT_BACKWARD_TYPE;
    setFormState(prev => ({ ...prev, birthday: isBackwordKey ? value : addDotInputValue(value) }));
  };

  const onSubmitForm = (event: FormEvent) => {
    if (!user) return;
    event.preventDefault();
    userMutation.mutate({ ...formState, id: user.id });
  };

  useEffect(() => {
    if (!user) return;
    const { birthday, gender, name, character, image } = user;
    setFormState(prev => ({
      ...prev,
      birthday: birthday || '',
      character: character || '',
      name,
      image,
      gender,
    }));
  }, [user]);

  useEffect(() => {
    if (!userMutation.isSuccess) return;
    router.push('/user');
  }, [userMutation.isSuccess, router]);

  return (
    <form className='h-full min-h-screen bg-white-1 py-4 pb-14' onSubmit={onSubmitForm}>
      {userMutation.isPending && (
        <section className='w-screen min-h-screen bg-text-1 fixed z-10 opacity-50 flex justify-center items-center'>
          <div className='border-[8px] border-[#f1f1f1] border-t-main-1 rounded-full w-16 h-16 animate-spin' />
        </section>
      )}
      <div className='px-4'>
        <div className='flex justify-center items-center py-5'>
          <ImageUpload defaultURL={formState.image || undefined} onChangeFileInput={onChangeFileInput} />
        </div>

        <div className='mb-6'>
          <div className='text-[12px] mb-1 text-text-3'>
            <label htmlFor='name'>이름</label>
          </div>
          <input
            type='text'
            id='name'
            value={formState.name}
            onKeyDown={() => setIsNameChanging(true)}
            onBlur={() => setIsNameChanging(false)}
            onChange={({ currentTarget }) => setFormState(prev => ({ ...prev, name: currentTarget.value }))}
            className='px-[14px] py-[10px] rounded-[15px] block border border-gray-3 w-full text-[14px]'
          />
          {isNameChanging && isInvalidName && <p className='text-red-400 text-xs mt-1'>다른 사람이 사용하고 있어요.</p>}
        </div>

        <div className='mb-6'>
          <div className='text-[12px] mb-1 text-text-3'>
            <label htmlFor='birthday'>생년월일</label>
          </div>
          <input
            inputMode='numeric'
            placeholder='0000.00.00'
            id='birthday'
            maxLength={10}
            onChange={onChangeBirthdayInput}
            value={formState.birthday || ''}
            className='px-[14px] py-[10px] rounded-[15px] block border border-gray-3 w-full text-[14px]'
          />
        </div>

        <div className='mb-6'>
          <div className='text-[12px] mb-1 text-text-3'>
            <label htmlFor='weight'>성별</label>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <input
              onChange={() => setFormState(prev => ({ ...prev, gender: Gender.Male }))}
              type='radio'
              value={Gender.Male}
              id='male'
              name='gender'
              className='hidden'
            />
            <label
              htmlFor='male'
              className={`${
                formState.gender === Gender.Male ? 'bg-main-2 text-white-1' : 'bg-gray-3 text-text-2'
              } block text-center text-[14px] py-4 rounded-3xl`}
            >
              남자
            </label>
            <input
              onChange={() => setFormState(prev => ({ ...prev, gender: Gender.Female }))}
              type='radio'
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
              여자
            </label>
          </div>
        </div>

        <div className='mb-6'>
          <div className='text-[12px] mb-1 text-text-3'>
            <label htmlFor='weight'>자기소개</label>
          </div>
          <textarea
            onKeyUp={onKeyUpTextarea}
            id='character'
            value={formState.character || ''}
            onChange={({ target }) => setFormState(prev => ({ ...prev, character: target.value }))}
            className='resize-none overflow-hidden w-full border border-gray-3 rounded-[15px] px-[14px] py-[10px] text-[14px] h-[80px] outline-main-2'
          />
        </div>
      </div>

      <div className='fixed bottom-0 w-full bg-white-1'>
        <button type='submit' className='w-full bg-main-1 text-white-1 text-[14px] py-3'>
          수정
        </button>
      </div>
    </form>
  );
}
