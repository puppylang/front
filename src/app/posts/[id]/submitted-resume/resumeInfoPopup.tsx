'use client';

import { CgSpinner } from 'react-icons/cg';

import RecordWalkItem from '@/components/RecordWalkList/RecordWalkItem';
import { useRecordWalkByUser } from '@/services/walk';
import { Gender } from '@/types/pet';
import { Resume } from '@/types/resume';
import { WalkRole } from '@/types/walk';

import { Form } from '@/components/Form';
import ImageUpload from '@/components/ImageUpload';

interface ResumeInfoPopupProps {
  resume: Resume;
  onClickChatBtn: (userId: string) => void;
  onClickSelectBtn: (resume: Resume) => void;
  isSelectLoading: boolean;
  getSelectBtnText: (isLoading: boolean, isSelected: boolean) => string | JSX.Element;
  isChatLoading: boolean;
}

export default function ResumeInfoPopup({
  resume,
  onClickChatBtn,
  isChatLoading,
  onClickSelectBtn,
  getSelectBtnText,
  isSelectLoading,
}: ResumeInfoPopupProps) {
  const { data: walkList, isLoading } = useRecordWalkByUser(resume.user_id, WalkRole.PetOwner);

  return (
    <section className='px-4 pt-4'>
      <h2 className='text-center font-Jalnan py-2 text-lg'>{resume.name}님의 지원서</h2>

      <div className='flex justify-center mb-[30px]'>
        <ImageUpload defaultURL={resume.image} onChangeFileInput={() => {}} disabled />
      </div>

      <Form.String title='이름' value={resume.name || ''} onChange={() => {}} disabled />

      <Form.Number title='태어난 연도' value={resume.birth_year} onChange={() => {}} disabled />

      <Form.Radio
        title='성별'
        onChange={() => {}}
        disabled
        firstInput={{ value: Gender.Male, id: 'male', title: '남성' }}
        secondInput={{ value: Gender.Female, id: 'female', title: '여성' }}
        activedValue={resume.gender}
      />

      <Form.Radio
        title='반려견 부양 여부'
        // eslint-disable-next-line
        activedValue={resume.has_puppy === null ? '' : resume.has_puppy ? '부양' : '미부양'}
        onChange={() => {}}
        disabled
        firstInput={{ value: '부양', id: '부양', title: '예' }}
        secondInput={{ value: '미부양', id: '미부양', title: '아니요' }}
      />

      <Form.Title title='산책 경험'>
        <p className='text-xs mb-2 text-text-1'>앱에 등록된 최신 산책 기록 10개를 불러옵니다.</p>
        <div className='bg-gray-3 w-full p-2 py-3 rounded-xl px-3 h-[200px] overflow-y-scroll flex flex-col gap-y-3'>
          {!isLoading && walkList && walkList.length ? (
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
            </div>
          )}
        </div>
      </Form.Title>

      <Form.Number title='연락처' value={resume.phone_number} onChange={() => {}} disabled />

      <Form.Textarea disabled title='간단 자기소개' value={resume.introduction} onChange={() => {}} />

      <div className='grid grid-cols-2 gap-x-3 text-sm sticky bottom-0 bg-white left-0 py-4'>
        <button
          type='button'
          className={`${
            resume.is_selected ? 'bg-[#f66969]' : 'bg-main-1'
          } text-white-1 rounded-md h-[40px] flex justify-center items-center`}
          onClick={() => onClickSelectBtn(resume)}
          disabled={isSelectLoading}
        >
          {getSelectBtnText(isSelectLoading, resume.is_selected)}
        </button>
        <button
          type='button'
          className='bg-gray-200 rounded-lg h-[40px] flex justify-center items-center'
          onClick={() => onClickChatBtn(resume.user_id)}
          disabled={isChatLoading}
        >
          {isChatLoading ? <CgSpinner className='text-text-3 animate-spin w-6 h-6' /> : '채팅하기'}
        </button>
      </div>
    </section>
  );
}
