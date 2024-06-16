'use client';

import { FormEvent, useEffect, useState } from 'react';

import useNativeRouter from '@/hooks/useNativeRouter';
import { createReport } from '@/services/report';
import { useUserQuery } from '@/services/user';

import { BottomSheet, BottomSheetButton } from '@/components/BottomSheet';
import { Form } from '@/components/Form';
import { HeaderNavigation } from '@/components/HeaderNavigation';
import Loading from '@/components/Loading';

import { IconCaretDown } from '../../../public/assets/svgs';

const REPORT_TITLE = [
  '비매너 사용자',
  '욕설﹒비방﹒혐오표현',
  '부적절한 펫시터 행위',
  '광고성 내용 포함',
  '선정적 내용 포함',
  '기타 부적절한 행위',
];

const DEFAULT_FORM_STATE = {
  title: '',
  detail: '',
  reportedId: '',
};

export default function Report() {
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useUserQuery();
  const router = useNativeRouter();

  const onSubmitForm = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!user) return;
    const { status } = await createReport({ ...formState, reporterId: user.id });

    if (status === 201) {
      router.back();
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setFormState(prev => ({ ...prev, reportedId: id || '' }));
  }, []);

  const isValidForm = formState.detail && formState.title;

  return (
    <section className='container'>
      {isLoading && <Loading />}
      <HeaderNavigation.Container className='!bg-bg-blue'>
        <HeaderNavigation.Title text='신고하기' />
      </HeaderNavigation.Container>
      <form onSubmit={onSubmitForm}>
        <Form.Title title='신고 유형' divClassName='pb-1 px-4'>
          <button
            onClick={() => setIsOpenBottomSheet(true)}
            type='button'
            className='bg-white w-full text-left  px-3 py-2 rounded-md flex items-center'
          >
            <span className='text-sm text-gray-500'>{formState.title || '신고 유형을 선택해주세요.'}</span>
            <IconCaretDown color='#6b7280' className='ml-auto text-blue-500' />
          </button>
        </Form.Title>

        <Form.Textarea
          placeholder='상세한 신고 내용을 입력해주세요.'
          title='신고 내용'
          divClassName='px-4'
          onChange={value => setFormState(prev => ({ ...prev, detail: value }))}
        >
          <p className='mb-2 text-xs text-text-2'>신고가 접수되면, 검토까지는 최대 24시간이 걸려요.</p>
        </Form.Textarea>

        <div className='fixed bottom-0 w-screen'>
          <button
            type='button'
            className={`${!isValidForm && 'opacity-50'} w-full bg-main-1 px-3 pt-3 py-7 text-white-1`}
            disabled={!isValidForm}
          >
            신고하기
          </button>
        </div>
      </form>

      <BottomSheet isOpen={isOpenBottomSheet} onClose={() => setIsOpenBottomSheet(false)}>
        {REPORT_TITLE.map(title => (
          <BottomSheetButton
            key={title}
            onClick={() => {
              setIsOpenBottomSheet(false);
              setFormState(prev => ({ ...prev, title }));
            }}
          >
            {title}
          </BottomSheetButton>
        ))}
      </BottomSheet>
    </section>
  );
}
