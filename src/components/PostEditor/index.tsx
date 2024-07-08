'use client';

import dayjs from 'dayjs';
import { FormEvent, useState } from 'react';

import { usePetQuery } from '@/services/pet';
import { Caution, Post, PostStatus } from '@/types/post';

import { Cautions } from './Cautions';
import { DateTimePickerWithLabel } from '../DateTimePicker';
import { FormInputsWithLabel } from '../FormInputs';
import { HeaderNavigation } from '../HeaderNavigation';
import { PetCardList } from '../PetCardList';
import Toast from '../Toast';

const INIT_STATE: Post = {
  id: null,
  title: '',
  content: '',
  start_at: null,
  end_at: null,
  status: PostStatus.IN_PROGRESS,
  preferred_walk_location: '',
  proposed_fee: 0,
  cautions: [],
  pet_id: null,
  pet: null,
  created_at: null,
  updated_at: null,
};

interface PostEditorProps {
  defaultValue?: Post;
  onSubmit: (postData: Post) => void;
}

function PostEditor({ defaultValue, onSubmit }: PostEditorProps) {
  const { data: pets } = usePetQuery();
  const [postData, setPostData] = useState(defaultValue || INIT_STATE);
  const startAt = postData.start_at ? dayjs(postData.start_at) : dayjs();
  const endAt = postData.end_at ? dayjs(postData.end_at) : startAt;

  const [isShowToast, setIsShowToast] = useState(false);
  const [toastDescription, setToastDescription] = useState('');

  const handleChangeTitle = (title: string) => setPostData(prev => ({ ...prev, title }));

  const handleChangeContent = (content: string) => setPostData(prev => ({ ...prev, content }));

  const handleSelectPet = (pet_id: number) => {
    const pet = pets?.filter(pet => pet.id === pet_id)[0];

    if (pet) {
      setPostData(prev => ({ ...prev, pet_id, pet }));
    }
  };

  const handleChangeCautions = (cautions: Caution[]) => setPostData(prev => ({ ...prev, cautions }));

  const handleChangePreferredWalkLocation = (preferred_walk_location: string) =>
    setPostData(prev => ({ ...prev, preferred_walk_location }));

  const handleChangeWalkPrice = (proposed_fee: number) => setPostData(prev => ({ ...prev, proposed_fee }));

  const handleChangeStartAt = (startAt: string) =>
    setPostData(prev => ({ ...prev, start_at: dayjs(startAt).toISOString() }));

  const handleChangeEndAt = (endAt: string) => setPostData(prev => ({ ...prev, end_at: dayjs(endAt).toISOString() }));

  const handleOnSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    const { title, content, start_at, end_at, pet_id, proposed_fee } = postData;

    if (title.trim().length < 1) return handleShowToast('제목은 필수값입니다.');

    if (title.trim().length > 45) return handleShowToast('제목은 최대 45글자까지 입니다.');

    if (content.trim().length < 1) return handleShowToast('내용은 필수값입니다.');

    if (content.trim().length > 300) return handleShowToast('내용은 최대 300글자까지 입니다.');

    if (!pet_id) return handleShowToast('반려견 선택은 필수입니다.');

    if (!proposed_fee) return handleShowToast('산책 보수값 필수입니다.');

    if (!start_at || !end_at) return handleShowToast('시작일시와 종료일시는 필수값입니다.');

    if (!(start_at <= end_at)) return handleShowToast('종료일시는 시작일시보다 최소 30분 늦게 등록되어야합니다.');

    onSubmit(postData);
  };

  const handleShowToast = (description: string) => {
    setIsShowToast(true);
    setToastDescription(description);
  };

  return (
    <>
      <div className='container mx-auto my-0 bg-white'>
        <form onSubmit={handleOnSubmit}>
          <div className='min-h-[100vh]'>
            <HeaderNavigation.Container className='z-10'>
              <HeaderNavigation.Title text={`구인 게시글 ${defaultValue ? '수정' : '작성'}`} />
            </HeaderNavigation.Container>

            <div className='post-info p-4 pt-0 flex flex-col gap-y-4'>
              <FormInputsWithLabel.Container label='제목' isRequired>
                <FormInputsWithLabel.TextInput
                  placeholder='제목'
                  value={postData.title}
                  maxLength={45}
                  onChange={handleChangeTitle}
                />
              </FormInputsWithLabel.Container>

              <FormInputsWithLabel.Container label='내용' isRequired>
                <p className='text-xs text-gray-500 mb-2'>
                  부적절하거나 불쾌감을 줄 수 있는 컨텐츠는 제재를 받을 수 있습니다.
                </p>
                <FormInputsWithLabel.TextArea
                  placeholder='내용을 입력해주세요.'
                  value={postData.content}
                  maxLength={300}
                  onChange={handleChangeContent}
                />
              </FormInputsWithLabel.Container>
            </div>

            <div className='pet-info flex flex-col gap-y-4 p-4'>
              <p className='text-sm font-semibold text-text-2'>함께 산책할 반려견을 선택해주세요! 🐾</p>

              <PetCardList pets={pets} defaultValue={postData.pet_id} type='select' onClick={handleSelectPet} />
            </div>

            <div className='walk-info flex flex-col gap-y-4 p-4'>
              <p className='text-sm font-semibold text-text-2'>산책 정보</p>

              <FormInputsWithLabel.Container label='산책 보수' isRequired>
                <FormInputsWithLabel.NumericInput
                  placeholder='내용을 입력해주세요.'
                  value={postData.proposed_fee}
                  onChange={handleChangeWalkPrice}
                >
                  <span className='absolute text-sm text-text-2 top-[50%] left-4 translate-y-[-50%]'>₩</span>
                </FormInputsWithLabel.NumericInput>
              </FormInputsWithLabel.Container>

              <FormInputsWithLabel.Container label='산책 희망 장소'>
                <FormInputsWithLabel.TextInput
                  placeholder='산책 희망장소를 입력해주세요.'
                  value={postData.preferred_walk_location}
                  onChange={handleChangePreferredWalkLocation}
                />
              </FormInputsWithLabel.Container>

              <DateTimePickerWithLabel.Container label='시작 일시' isRequired>
                <DateTimePickerWithLabel.DateTimePicker
                  value={startAt}
                  minDateTime={dayjs().subtract(1, 'minute')}
                  onChange={handleChangeStartAt}
                />
              </DateTimePickerWithLabel.Container>

              <DateTimePickerWithLabel.Container label='종료 일시' isRequired>
                <DateTimePickerWithLabel.DateTimePicker
                  value={endAt}
                  minDateTime={startAt}
                  onChange={handleChangeEndAt}
                />
              </DateTimePickerWithLabel.Container>
            </div>

            <div className='walk-info flex flex-col gap-y-4 p-4'>
              <p className='text-sm font-semibold text-text-2'>주의사항</p>

              <Cautions defaultValue={postData.cautions} onChange={handleChangeCautions} />
            </div>
          </div>

          <div className='sticky-navigation sticky left-0 bottom-0 z-10 flex justify-end items-center h-[58px] p-4 bg-white border-t-[1px] border-gray-3'>
            <button type='submit' className='w-20 h-8 text-white text-sm bg-main-2 rounded-[10px]'>
              {defaultValue ? '수정하기' : '작성하기'}
            </button>
          </div>
        </form>
      </div>

      <Toast
        position='TOP'
        status='error'
        description={toastDescription}
        isInvisible={isShowToast}
        onClose={() => {
          setIsShowToast(false);
          setToastDescription('');
        }}
      />
    </>
  );
}

export default PostEditor;
