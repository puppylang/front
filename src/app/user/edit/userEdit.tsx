'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import useNativeRouter from '@/hooks/useNativeRouter';
import { USER_QUERY_KEY, editUserInfo, useUserQuery } from '@/services/user';
import { Gender } from '@/types/pet';
import { StackPushRoute } from '@/types/route';
import { UserEditForm } from '@/types/user';

import { Form } from '@/components/Form';
import { HeaderNavigation } from '@/components/HeaderNavigation';
import ImageUpload from '@/components/ImageUpload';
import Loading from '@/components/Loading';

import UserNameInput from './userNameInput';

const DEFAULT_FORM_STATE: UserEditForm = {
  name: '',
  id: '',
  gender: null,
  birthday: null,
  character: null,
  image: null,
};

export default function UserEdit() {
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);
  const [isInvalidName, setIsInvalidName] = useState(false);

  const router = useNativeRouter();
  const queryClient = useQueryClient();

  const { data: user } = useUserQuery();

  const userMutation = useMutation({
    mutationKey: [USER_QUERY_KEY],
    mutationFn: (editUser: UserEditForm) => {
      return editUserInfo(editUser);
    },
    onSuccess: (_, variable) => {
      return queryClient.setQueryData([USER_QUERY_KEY], () => {
        return variable;
      });
    },
  });

  const addDotInputValue = (value: string) => {
    if (value.length === 4 || value.length === 7) {
      return `${value}-`;
    }

    return value;
  };

  const onChangeFileInput = (uploadedURL: string) => {
    setFormState(prev => ({ ...prev, image: uploadedURL }));
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
    router.push('/user', {
      webviewPushPage: StackPushRoute.User,
    });
  }, [userMutation.isSuccess, router]);

  return (
    <section className='flex flex-col items-center min-h-[100vh]'>
      <div className='container'>
        <HeaderNavigation.Container>
          <HeaderNavigation.Title text='회원정보수정' />
        </HeaderNavigation.Container>
        <form className='h-full min-h-screen bg-white-1 py-4 pb-14' onSubmit={onSubmitForm}>
          {userMutation.isPending && <Loading />}
          <div className='px-4'>
            <div className='flex justify-center items-center py-5'>
              <ImageUpload defaultURL={formState.image || undefined} onChangeFileInput={onChangeFileInput} />
            </div>

            <div className='flex flex-col gap-y-4'>
              <UserNameInput
                setIsInvalidName={setIsInvalidName}
                value={formState.name || ''}
                onChange={(value: string) => setFormState(prev => ({ ...prev, name: value }))}
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
            </div>
          </div>

          <div className='fixed left-[50%] bottom-0 translate-x-[-50%] w-full bg-white container p-4'>
            <button
              type='submit'
              className={`${isInvalidName && 'opacity-40'} w-full py-2 rounded-[10px] bg-main-1 text-white`}
              disabled={isInvalidName}
            >
              수정
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
