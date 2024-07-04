'use client';

import { useSearchParams } from 'next/navigation';

import WalkSuccessContainer from '@/components/WalkEditor/WalkSuccess/WalkSuccessContainer';
import WalkSuccessSkeletonUI from '@/components/WalkEditor/WalkSuccess/WalkSuccessSkeletonUI';
import { useRecordWalkDetail } from '@/services/walk';
import { WalkRole } from '@/types/walk';
import { formatDate, formatTime } from '@/utils/date';

import { HeaderNavigation } from '@/components/HeaderNavigation';

interface UserRecordWalkDetailProps {
  params: {
    id: string;
  };
}

function UserRecordWalkDetail({ params: { id } }: UserRecordWalkDetailProps) {
  const role = useSearchParams().get('role');
  const { data: recordWalkData } = useRecordWalkDetail({ id, role: role as WalkRole });

  return (
    <section id='record-walk-detail' className='flex flex-col items-center '>
      <div className='container'>
        <HeaderNavigation.Container>
          <HeaderNavigation.Title text='산책 일지 상세' />
        </HeaderNavigation.Container>
        <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>산책 일지 상세</h1>

        <div className='container bg-white p-4  min-h-[100vh]'>
          {recordWalkData && role ? (
            <>
              <div className='record-date-and-time flex justify-between mb-8'>
                <span className='text-base text-text-1'>
                  {recordWalkData.created_at && formatDate(recordWalkData.created_at)}
                </span>

                <ul className='record-time flex items-center gap-x-2'>
                  <RecordStartAndEndAt label='시작' value={recordWalkData.start_at} />
                  <RecordStartAndEndAt label='종료' value={recordWalkData.end_at} />
                </ul>
              </div>

              <WalkSuccessContainer
                walkData={recordWalkData}
                title={`${recordWalkData.pet?.name}와(과) 산책했어요!`}
                type={role as WalkRole}
                titleAlign='CENTER'
              />
            </>
          ) : (
            <WalkSuccessSkeletonUI>
              <div className='flex justify-between'>
                <div className='animate-pulse bg-bg-blue w-[110px] h-[35px] rounded-[10px]' />
                <div className='flex gap-x-2'>
                  <div className='animate-pulse bg-bg-blue w-[85px] h-[35px] rounded-[10px]' />
                  <div className='animate-pulse bg-bg-blue w-[85px] h-[35px] rounded-[10px]' />
                </div>
              </div>
            </WalkSuccessSkeletonUI>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserRecordWalkDetail;

interface RecordStartAndEndAtProps {
  label: string;
  value: string;
}

function RecordStartAndEndAt({ label, value }: RecordStartAndEndAtProps) {
  return (
    <li className='flex items-center gap-x-[6px]'>
      <span className='text-[10px] text-text-2 font-light'>{label}</span>
      <span className='text-sm text-text-1'>{formatTime(value)}</span>
    </li>
  );
}
