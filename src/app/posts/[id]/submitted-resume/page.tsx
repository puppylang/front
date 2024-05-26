'use client';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { TfiAngleRight } from 'react-icons/tfi';

import useNativeRouter from '@/hooks/useNativeRouter';
import { createChatRoom } from '@/services/chat';
import { POST__KEY, updatePost } from '@/services/post';
import { RESUMES_KEY, updateResume } from '@/services/resume';
import { USER_QUERY_KEY } from '@/services/user';
import { CreateChatType } from '@/types/chat';
import { Post, PostStatus } from '@/types/post';
import { Resume } from '@/types/resume';
import { DynamicParamTypes } from '@/types/route';
import { UserType } from '@/types/user';
import { formatDiffTime } from '@/utils/date';
import { fetcherWithToken } from '@/utils/request';

import { Card } from '@/components/Card';
import Loading from '@/components/Loading';
import Popup from '@/components/Popup';
import { PuppyError } from '@/components/PuppyError';
import SuspenseWithoutSSR from '@/components/Suspense';

import ResumeInfoPopup from './resumeInfoPopup';
import { PostItem } from '../../PostItem';

export default function SubmittedResume({ params: { id } }: DynamicParamTypes) {
  return (
    <SuspenseWithoutSSR fallback={<Loading />}>
      <SubmittedResumeUI id={id} />
    </SuspenseWithoutSSR>
  );
}

function SubmittedResumeUI({ id }: { id: string }) {
  const [clickedResumeId, setClickedResumeId] = useState<number>();
  const [showsPopup, setShowsPopup] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSelectLoading, setIsSelectLoading] = useState(false);

  const router = useNativeRouter();
  const queryClient = useQueryClient();

  const { data: postDetail } = useSuspenseQuery({
    queryKey: [POST__KEY, id],
    queryFn: () => fetcherWithToken<Post>(`${POST__KEY}/${id}`),
  });

  const { data: resumes } = useSuspenseQuery({
    queryKey: [RESUMES_KEY, id],
    queryFn: () => fetcherWithToken<Resume[]>(`${RESUMES_KEY}?postId=${id}`),
    staleTime: 0,
  });

  const { data: user } = useSuspenseQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => fetcherWithToken<UserType>(USER_QUERY_KEY),
  });

  const resumeMutation = useMutation({
    mutationKey: [RESUMES_KEY, id],
    mutationFn: (editResume: Resume) => {
      return updateResume(editResume);
    },
    onSuccess: (_, variable) => {
      queryClient.setQueryData([RESUMES_KEY, id], (oldData: Resume[]) => {
        setIsSelectLoading(false);
        return oldData.map(resume => (resume.id === variable.id ? variable : resume));
      });
    },
  });

  const onClickResume = (id: number) => {
    setClickedResumeId(id);
    setShowsPopup(true);
  };

  const onClickChatBtn = async (userId: string, guestImage?: string) => {
    setIsChatLoading(true);
    const data: CreateChatType = {
      post_id: id,
      author_id: user.id,
      guest_id: userId,
      guest_image: guestImage,
    };

    const chatId = await createChatRoom(data);
    if (!chatId) return;
    router.push(`/chat/${chatId}?postId=${id}`);
  };

  const onClickSelectBtn = async (resume: Resume) => {
    if (!postDetail) return;
    const { user_id: userId, is_selected: isSelected } = resume;
    setIsSelectLoading(true);

    const data: CreateChatType = {
      post_id: id,
      author_id: user.id,
      guest_id: userId,
      guest_image: resume.image,
    };

    if (isSelected) {
      resumeMutation.mutate({ ...resume, is_selected: !resume.is_selected });
      return;
    }

    const { status: resumeStatus } = await updateResume({ ...resume, is_selected: !resume.is_selected });
    const chatId = await createChatRoom(data);
    const updatedPost = await updatePost(id, { ...postDetail, status: PostStatus.FINISHED });
    if (!chatId && resumeStatus !== 200 && !updatedPost) return;

    router.push(`/chat/${chatId}?postId=${id}`);
  };

  const getSelectBtnText = (isLoading: boolean, isSelected: boolean): string | JSX.Element => {
    if (isSelected && !isLoading) {
      return '취소하기';
    }

    if (isLoading) {
      return <CgSpinner className='text-gray-100 animate-spin w-6 h-6' />;
    }

    return '선택하기';
  };

  const isMyPost = postDetail && user && user.id === postDetail.author?.id;
  const clickedResume = resumes && resumes.find(resume => resume.id === clickedResumeId);

  return isMyPost ? (
    <div className='p-4 container'>
      <ul>{postDetail && <PostItem post={postDetail} />}</ul>
      <section className='my-4 py-2 px-4 bg-white rounded-[10px] shadow-[0_2px_4px_0_rgba(76,76,76,0.1)]'>
        <h1 className='pb-2'>지원자 목록 🐾</h1>
        <div>
          {resumes &&
            resumes.map(resume => (
              <div className='py-3' key={resume.id}>
                <button type='button' className='w-full text-left pb-3' onClick={() => onClickResume(resume.id)}>
                  <Card.Container className='text-text-1 px-0 py-0'>
                    <Card.ImgContainer src={resume.image} alt={resume.name} />
                    <Card.TextContainer>
                      <div className='flex items-center'>
                        <div className='w-full'>
                          <div className='flex items-center'>
                            <p className='mr-2 text-md'>{resume.name}</p>
                            <p className='text-sm'>{formatDiffTime(resume.created_at)}전</p>
                          </div>
                          <div>
                            <span className='text-xs mr-1 bg-gray-100 text-gray-700 rounded-md px-2 py-0.5 ring-1 ring-inset ring-gray-500/10'>
                              산책 경험 다수
                            </span>
                            <span className='text-xs bg-main-3 text-gray-100 rounded-md px-2 py-0.5 ring-1 ring-inset ring-blue-600/10'>
                              {resume.has_puppy ? '반려견 소유' : '반려견 미소유'}
                            </span>
                          </div>
                        </div>
                        <TfiAngleRight className='w-[18px] h-[18px] text-gray-400' />
                      </div>
                    </Card.TextContainer>
                  </Card.Container>
                </button>
                <div className='grid grid-cols-2 gap-x-3 text-sm'>
                  <button
                    type='button'
                    className={`${
                      resume.is_selected ? 'bg-[#f66969]' : 'bg-main-1'
                    } text-white-1 rounded-md h-[36px] flex justify-center items-center`}
                    onClick={() => onClickSelectBtn(resume)}
                    disabled={isSelectLoading}
                  >
                    {getSelectBtnText(isSelectLoading, resume.is_selected)}
                  </button>
                  <button
                    type='button'
                    className='bg-gray-200 rounded-md h-[36px] flex justify-center items-center'
                    onClick={() => onClickChatBtn(resume.user_id, resume.image)}
                    disabled={isChatLoading}
                  >
                    {isChatLoading ? <CgSpinner className='text-text-3 animate-spin w-6 h-6' /> : '채팅하기'}
                  </button>
                </div>
              </div>
            ))}
          {resumes && resumes.length === 0 && (
            <PuppyError.Container className='!pt-4 pb-4'>
              <PuppyError.Title title='아직 지원자가 없어요.' />
            </PuppyError.Container>
          )}
        </div>
      </section>
      <Popup isOpen={showsPopup} onClose={() => setShowsPopup(false)}>
        {clickedResume && (
          <ResumeInfoPopup
            onClickSelectBtn={onClickSelectBtn}
            getSelectBtnText={getSelectBtnText}
            resume={clickedResume}
            onClickChatBtn={onClickChatBtn}
            isChatLoading={isChatLoading}
            isSelectLoading={isSelectLoading}
          />
        )}
      </Popup>
    </div>
  ) : (
    <PuppyError.Container>
      <PuppyError.Title title='접근 권한이 없습니다.' />
      <PuppyError.Desc text='글을 작성한 사람만 지원서를 확인할 수 있어요!' />
    </PuppyError.Container>
  );
}
