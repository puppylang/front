'use client';

import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import UserNameInput from '@/app/user/edit/userNameInput';
import useNativeRouter from '@/hooks/useNativeRouter';
import { USER_QUERY_KEY, editUserInfo, useUserQuery } from '@/services/user';
import { Gender } from '@/types/pet';
import { UserEditForm } from '@/types/user';

import { Form } from '@/components/Form';
import ImageUpload from '@/components/ImageUpload';
import Loading from '@/components/Loading';
import NativeLink from '@/components/NativeLink';

import { IconCaretRight, IconCheckbox, IconCheckboxFill } from '../../../../public/assets/svgs';

const DEFAULT_PET_FORM: UserEditForm = {
  name: '',
  id: '',
  gender: null,
  birthday: null,
  character: null,
  image: null,
};

export default function LoginUser() {
  const [formState, setFormState] = useState(DEFAULT_PET_FORM);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isCheckedEULA, setIsCheckedEULA] = useState(false);
  const [isCheckedUserPolicy, setIsCheckedUserPolicy] = useState(false);

  const router = useNativeRouter();

  const { data: user } = useUserQuery();
  const userMutation = useMutation({
    mutationKey: [USER_QUERY_KEY],
    mutationFn: (editUser: UserEditForm) => {
      return editUserInfo(editUser);
    },
  });

  const isInvalidForm = ![isCheckedEULA, isCheckedUserPolicy, !isInvalidName].every(Boolean);

  const onChangeNameInput = (value: string) => {
    setFormState(prev => ({ ...prev, name: value }));
  };

  const onChangeFileInput = (uploadedImageURL: string) => {
    setFormState(prev => ({ ...prev, image: uploadedImageURL }));
  };

  const onSubmitUserForm = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    userMutation.mutate({ ...formState, id: user.id });
    router.replace('/posts');
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

  useEffect(() => {
    if (!user) return;
    setFormState(prev => ({ ...prev, name: user.name }));
    setIsInvalidName(false);
  }, [user]);

  return (
    <section className='w-screen bg-white-1 min-h-screen'>
      {userMutation.isPending && <Loading />}
      <div className='h-32 bg-main-4 text-text-3 font-semibold flex justify-center items-center'>
        <p>회원 정보를 등록해주세요!</p>
      </div>
      <form onSubmit={onSubmitUserForm} className='h-full'>
        <div className='px-6 pb-8'>
          <div className='flex justify-center items-center py-5'>
            <ImageUpload defaultURL={formState.image || ''} onChangeFileInput={onChangeFileInput} />
          </div>

          <UserNameInput
            setIsInvalidName={setIsInvalidName}
            value={formState.name || ''}
            onChange={onChangeNameInput}
            currentUserName={user?.name || ''}
          />

          <Form.Number
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
            firstInput={{ value: Gender.Male, id: 'male', title: '남자' }}
            secondInput={{ value: Gender.Female, id: 'female', title: '여자' }}
            activedValue={formState.gender || ''}
          />

          <Form.Textarea
            title='자기소개'
            value={formState.character || ''}
            onChange={value => setFormState(prev => ({ ...prev, character: value }))}
          />

          <div className='pt-3'>
            <p className='pb-3 text-text-1 text-sm'>서비스 이용 필수 동의</p>
            <ul className='bg-bg-blue px-3 py-4 text-text-1 rounded-md'>
              <li className='flex items-center'>
                <label htmlFor='EULA' className='mt-[-5px]'>
                  <input
                    type='checkbox'
                    id='EULA'
                    className='hidden'
                    onChange={() => setIsCheckedEULA(!isCheckedEULA)}
                    checked={isCheckedEULA}
                  />
                  {isCheckedEULA ? (
                    <IconCheckboxFill className='inline-block mr-1 w-5' />
                  ) : (
                    <IconCheckbox className='inline-block mr-1 w-5' />
                  )}
                </label>
                <NativeLink href='/login/EULA' className='w-full py-1 mb-1 flex justify-between text-sm items-center'>
                  <p>(필수)이용 약관 동의</p>
                  <IconCaretRight />
                </NativeLink>
              </li>

              <li className='flex items-center'>
                <label htmlFor='userPolicy' className='mt-[-2px]'>
                  <input
                    type='checkbox'
                    id='userPolicy'
                    className='hidden'
                    onChange={() => setIsCheckedUserPolicy(!isCheckedUserPolicy)}
                    checked={isCheckedUserPolicy}
                  />
                  {isCheckedUserPolicy ? (
                    <IconCheckboxFill className='inline-block mr-1 w-5' />
                  ) : (
                    <IconCheckbox className='inline-block mr-1 w-5' />
                  )}
                </label>
                <NativeLink href='/login/user-policy' className='w-full py-1 flex justify-between text-sm items-center'>
                  <p>(필수)개인정보 보호 방침 동의</p>
                  <IconCaretRight />
                </NativeLink>
              </li>
            </ul>
          </div>
        </div>

        <div className='w-full px-6 pb-10'>
          <button
            type='submit'
            className={`${isInvalidForm && ' opacity-40'} text-sm w-full bg-main-1 text-white-1 py-3 rounded-md`}
            disabled={isInvalidForm}
          >
            등록
          </button>
        </div>
      </form>
    </section>
  );
}
