'use client';

import { FormEvent, useEffect, useState } from 'react';

import useNativeRouter from '@/hooks/useNativeRouter';
import { createReport } from '@/services/report';
import { useUserQuery } from '@/services/user';
import { RouterMethod } from '@/types/route';

import { BottomSheet, SheetButton } from '@/components/BottomSheet';
import { Form } from '@/components/Form';
import { HeaderNavigation } from '@/components/HeaderNavigation';
import Loading from '@/components/Loading';
import NativeLink from '@/components/NativeLink';

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
    <section className='flex flex-col items-center bg-white h-[100vh]'>
      <div className='container'>
        {isLoading && <Loading />}

        <HeaderNavigation.Container>
          <HeaderNavigation.Title text='신고하기' />
        </HeaderNavigation.Container>

        <form onSubmit={onSubmitForm} className='p-4'>
          <Form.Title title='신고 유형' isRequired>
            <button
              onClick={() => setIsOpenBottomSheet(true)}
              type='button'
              className='flex justify-between items-center text-left border border-gray-2 w-full rounded-[10px] px-4 py-[7px] mt-2 text-sm text-text-2'
            >
              <span className='text-sm text-gray-500'>{formState.title || '신고 유형을 선택해주세요.'}</span>
              <IconCaretDown color='#6b7280' className='text-blue-500' />
            </button>
          </Form.Title>

          <Form.Textarea
            isRequired
            placeholder='상세한 신고 내용을 입력해주세요.'
            title='신고 내용'
            divClassName=''
            onChange={value => setFormState(prev => ({ ...prev, detail: value }))}
          >
            <p className='text-xs text-text-2 mb-[2px] mt-2'>신고가 접수되면, 검토까지는 최대 24시간이 걸려요.</p>
            <p className='text-xs text-text-2 mb-2 leading-[18px]'>
              궁금한 사항은 sksp4334@naver.com 또는 <br /> rkddb1031@naver.com로 문의해 주세요.
            </p>
          </Form.Textarea>

          <div className='fixed left-[50%] bottom-0 translate-x-[-50%] w-full container bg-white-1 p-4 border-t flex gap-x-2'>
            <NativeLink
              type={RouterMethod.Back}
              href=''
              className='py-2 flex-1 rounded-[10px] border border-main-1 text-main-1 text-center'
            >
              취소
            </NativeLink>

            <button
              type='submit'
              className={`${!isValidForm && 'opacity-40'} py-2 flex-1 rounded-[10px] bg-main-1 text-white-1`}
              disabled={!isValidForm}
            >
              {/* onClick event 추가 필요 */}
              신고하기
            </button>
          </div>
        </form>

        <BottomSheet isOpen={isOpenBottomSheet} onClose={() => setIsOpenBottomSheet(false)}>
          {REPORT_TITLE.map(title => (
            <SheetButton
              key={title}
              onClick={() => {
                setIsOpenBottomSheet(false);
                setFormState(prev => ({ ...prev, title }));
              }}
            >
              {title}
            </SheetButton>
          ))}
        </BottomSheet>
      </div>
    </section>
  );
}
