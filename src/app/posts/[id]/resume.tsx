'use client';

import { FormEvent, useEffect, useState } from 'react';

import RecordWalkItem from '@/components/RecordWalkList/RecordWalkItem';
import { createResume } from '@/services/resume';
import { useUserQuery } from '@/services/user';
import { useCalendarWalks } from '@/services/walk';
import { Gender } from '@/types/pet';
import { ResumeFormType } from '@/types/resume';
import { WalkRole } from '@/types/walk';

import { Form } from '@/components/Form';
import ImageUpload from '@/components/ImageUpload';
import Loading from '@/components/Loading';
import NativeLink from '@/components/NativeLink';

const DEFAULT_FORM: ResumeFormType = {
  image: '',
  name: '',
  introduction: '',
  phone_number: '',
  birth_year: '',
  has_puppy: null,
  gender: null,
  has_walk_record: null,
};

interface ResumeProps {
  id: number;
  onClose: () => void;
}

export default function Resume({ id, onClose }: ResumeProps) {
  const [formState, setFormState] = useState(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useUserQuery();
  const { data: walkList, isLoading: isLoadingWalkList } = useCalendarWalks({
    from: '2024-04-30T15:00:00.000Z',
    to: '2024-05-31T14:59:59.999Z',
    role: WalkRole.PetOwner,
  });

  const isDisabledSubmitBtn =
    formState.birth_year.length !== 4 ||
    formState.gender === undefined ||
    formState.phone_number.length !== 11 ||
    formState.introduction.length < 10;

  const sendResume = async () => {
    if (!user) return;
    const { status } = await createResume({
      ...formState,
      user_id: user.id,
      post_id: id,
      has_walk_record: Boolean(walkList?.length),
    });
    if (status === 201) {
      setIsLoading(false);
      onClose();
    }
  };

  const onSubmitResume = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    sendResume();
  };

  useEffect(() => {
    if (!user) return;
    const { name, birthday, gender, image } = user;
    const birthYear = birthday ? birthday.split('.')[0] : '';

    setFormState(prev => ({ ...prev, name, gender, birth_year: birthYear, image: image || '' }));
  }, [user]);

  return (
    <>
      {isLoading && <Loading />}
      <form className='container px-4 bg-white-1 min-h-screen pb-16 bg-opacity-50' onSubmit={onSubmitResume}>
        <div className='font-Jalnan text-[22px] py-[30px] flex flex-col justify-center items-center'>
          <p>견주에게 보낼 프로필을</p>
          <p>완성해 주세요.</p>
        </div>

        <div className='flex justify-center mb-[30px]'>
          <ImageUpload
            defaultURL={formState.image}
            onChangeFileInput={url => setFormState(prev => ({ ...prev, image: url }))}
          />
        </div>

        <Form.String
          title='이름'
          value={formState.name || ''}
          onChange={value => setFormState(prev => ({ ...prev, name: value }))}
        />

        <Form.Number
          isRequired
          title='태어난 연도'
          value={formState.birth_year}
          onChange={value => setFormState(prev => ({ ...prev, birth_year: value }))}
          maxLength={4}
          minLength={4}
          placeholder='0000'
          errorText='태어난 연도 4글자 입력해주세요.'
        />

        <Form.Radio
          isRequired
          title='성별'
          onChange={value => setFormState(prev => ({ ...prev, gender: value as Gender }))}
          firstInput={{ value: Gender.Male, id: 'male', title: '남성' }}
          secondInput={{ value: Gender.Female, id: 'female', title: '여성' }}
          activedValue={formState.gender}
        />

        <Form.Radio
          title='반려견 부양 여부'
          // eslint-disable-next-line
          activedValue={formState.has_puppy === null ? '' : formState.has_puppy ? '부양' : '미부양'}
          onChange={value => setFormState(prev => ({ ...prev, has_puppy: value === '부양' || false }))}
          firstInput={{ value: '부양', id: '부양', title: '예' }}
          secondInput={{ value: '미부양', id: '미부양', title: '아니요' }}
        />

        <Form.Title title='산책 경험'>
          <p className='text-xs mb-2 text-text-1'>앱에 등록된 나의 산책 기록 10개를 불러와요!</p>
          <div className='bg-gray-3 w-full p-2 py-3 rounded-xl px-3 h-[200px] overflow-y-scroll flex flex-col gap-y-3'>
            {!isLoadingWalkList && walkList && walkList.length ? (
              walkList.map(walk => (
                <RecordWalkItem
                  key={walk.id}
                  className='drop-shadow-sm bg-white-1 rounded-xl'
                  walk={walk}
                  role={WalkRole.PetOwner}
                />
              ))
            ) : (
              <div className='h-full flex items-center flex-col justify-center'>
                <p className='text-xs'>등록된 산책 기록이 없어요.</p>
                <NativeLink href='/walk-role' className='bg-main-3 text-white-1 rounded-lg text-xs px-2 py-1 mt-1'>
                  산책하러 가기
                </NativeLink>
              </div>
            )}
          </div>
        </Form.Title>

        <Form.Number
          isRequired
          placeholder='010 0000 0000'
          title='연락처'
          value={formState.phone_number}
          onChange={value => {
            setFormState(prev => ({ ...prev, phone_number: value }));
          }}
          maxLength={11}
          minLength={11}
          errorText='올바른 연락처를 입력해주세요.'
        />

        <Form.Textarea
          isRequired
          title='간단 자기소개'
          value={formState.introduction}
          minLength={10}
          errorText='자기 소개를 입력해주세요.'
          placeholder='최소 10글자 이상 입력해주세요.'
          onChange={value => setFormState(prev => ({ ...prev, introduction: value }))}
        >
          <p className='text-xs mb-1 text-text-1'>나를 소개할 수 있는 인사말로 시작해요.</p>
          <p className='text-xs mb-1 text-text-1'>강아지 산책 경험이나 강아지를 언제 키워봤는지 작성하면 좋아요.</p>
          <p className='text-xs mb-1 text-text-1'>해당 견종 산책 경험이 있는지 작성하면 좋아요.</p>
        </Form.Textarea>

        <div className='fixed bottom-0 left-0 w-full bg-white-1'>
          <button
            type='submit'
            className={`w-full bg-main-1 text-white-1 text-[14px] py-3 ${isDisabledSubmitBtn && 'opacity-40'}`}
            disabled={isDisabledSubmitBtn}
          >
            등록
          </button>
        </div>
      </form>
    </>
  );
}
