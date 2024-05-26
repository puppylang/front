'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PetCardItem } from '@/components/PetCardList/PetCardItem';
import PostDetailSkeletonUI from '@/components/SkeletonUI/PostDetailSkeletonUI';
import { useLikeCancelMutation, useLikePostMutation } from '@/services/like';
import { deletePost, usePostDetailQuery, useUpdatePostStatus } from '@/services/post';
import { useResumesQuery } from '@/services/resume';
import { useUserQuery } from '@/services/user';
import { BottomSheetType, PostStatus } from '@/types/post';
import { formatDate } from '@/utils/date';

import BottomSheet from '@/components/BottomSheet';
import { HeaderNavigation } from '@/components/HeaderNavigation';
import Loading from '@/components/Loading';
import NativeLink from '@/components/NativeLink';
import Popup from '@/components/Popup';
import PostStatusBadge from '@/components/PostStatusBadge';
import PostStatusButton from '@/components/PostStatusButton';
import Toast from '@/components/Toast';

import PostStatusUpdateBottomSheet from './PostBottomSheet/PostStatusUpdateBottomSheet';
import PostUpdateBottomSheet from './PostBottomSheet/PostUpdateBottomSheet';
import Resume from './resume';
import { IconHeartOutline, IconView, IconHeartFill } from '../../../../public/assets/svgs';
import { PostInfo } from '../../../components/PostInfo';

interface PostDetailProps {
  params: {
    id: string;
  };
}

export default function PostDetail({ params: { id } }: PostDetailProps) {
  const { data: postData, isLoading } = usePostDetailQuery(id);
  const { data: user } = useUserQuery();
  const { data: resumes } = useResumesQuery(id);
  const likePostMutation = useLikePostMutation(id);
  const likeCancelMutation = useLikeCancelMutation(id);
  const postStatusMutation = useUpdatePostStatus(id);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isShowToast, setIsShowToast] = useState(false);
  const [toastDescription, setToastDescription] = useState('');
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isShowSuccessToast, setIsShowSuccessToast] = useState(false);
  const [isShowBottomMenu, setIsShowBottomMenu] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState<BottomSheetType>(null);

  const router = useRouter();

  const isShowPost = !isLoading && postData;
  const isMyPost = user && postData && user.id === postData.author?.id;
  const filteredMyResume = resumes && user ? resumes.filter(resume => resume.user_id === user.id) : [];

  const handleDeletePost = () => {
    setIsDeleting(true);
    deletePost(id)
      .then(res => {
        if (res) {
          handleCloseBottomSheet();
          setToastDescription('삭제되었습니다.');
          setIsShowToast(true);

          const timer = setTimeout(() => {
            router.push('/posts');
          }, 2000);

          return () => clearTimeout(timer);
        }
      })
      .catch((err: Error) => {
        console.log(err);
      })
      .finally(() => setIsDeleting(false));
  };

  const handleClickLike = () => {
    if (!postData) return;

    if (postData.is_liked) {
      likeCancelMutation.mutate(id);
    } else {
      likePostMutation.mutate(id);
    }
  };

  const handleChangeStatus = (e: React.MouseEvent<HTMLElement>) => {
    const { status } = e.currentTarget.dataset;
    postStatusMutation.mutate({ id, status: status as PostStatus });

    handleCloseBottomSheet();
  };

  const onSubmitResume = () => {
    setIsOpenPopup(false);
    setIsShowSuccessToast(true);
    setIsShowToast(true);
    setToastDescription('견주에게 정보를 전달했어요!');
  };

  const handleClickDotBtn = () => {
    setIsShowBottomMenu(true);
    setBottomSheetType('POST_UPDATE');
  };

  const handleClickStatusBtn = () => {
    setIsShowBottomMenu(true);
    setBottomSheetType('POST_STATUS_UPDATE');
  };

  const handleCloseBottomSheet = () => {
    setIsShowBottomMenu(false);
    setBottomSheetType(null);
  };

  return (
    <>
      {!isShowPost ? (
        <PostDetailSkeletonUI />
      ) : (
        <>
          <section id='post-container' className='animation-show flex flex-col items-center min-h-[100vh]'>
            <h2 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>게시글 상세</h2>

            <div className='container'>
              <HeaderNavigation.Container className='flex justify-between'>
                {isMyPost && <HeaderNavigation.DotBtn onClick={handleClickDotBtn} />}
              </HeaderNavigation.Container>

              <PostInfo.Container className='post-info-container'>
                <PostInfo.Top
                  title={postData.title}
                  author={postData.author}
                  date={postData.created_at ? formatDate(postData.created_at) : ''}
                >
                  {isMyPost ? (
                    <PostStatusButton status={postData.status as PostStatus} onClick={handleClickStatusBtn} />
                  ) : (
                    <PostStatusBadge status={postData.status as PostStatus} />
                  )}
                </PostInfo.Top>

                <PostInfo.Content content={postData.content} />
              </PostInfo.Container>

              <PostInfo.Container className='pet-and-walk-info-container flex flex-col p-4 mt-4 '>
                <div className='pet-info pb-4'>
                  <PostInfo.SectionTitle title='함께 산책할 반려견 🐾' />

                  {postData.pet && <PetCardItem pet={postData.pet} />}
                </div>

                <div className='walk-info'>
                  <PostInfo.SectionTitle title='산책 정보' />

                  <ul>
                    <PostInfo.WalkItem
                      title='산책 보수'
                      description={`₩${postData.proposed_fee.toLocaleString()}`}
                      type='TEXT'
                      className='pt-0'
                    />
                    <PostInfo.WalkItem
                      title='산책 희망 장소'
                      description={postData.preferred_walk_location}
                      type='TEXT'
                    />
                    <PostInfo.WalkItem title='시작 일시' description={postData.start_at} type='DATE' />
                    <PostInfo.WalkItem title='종료 일시' description={postData.end_at} type='DATE' />
                  </ul>
                </div>
              </PostInfo.Container>

              <PostInfo.Container className='caution-container p-4 mt-4'>
                <PostInfo.SectionTitle title='주의사항' />

                {postData.cautions?.length ? (
                  <ul className='flex flex-col gap-y-1'>
                    {postData.cautions.map((caution, index) => (
                      <PostInfo.CautionItem key={caution.id} index={index + 1} content={caution.content} />
                    ))}
                  </ul>
                ) : (
                  <span className='text-sm font-light text-text-1'>없습니다 :&#41;</span>
                )}
              </PostInfo.Container>
            </div>
          </section>

          <section
            id='sticky-navigation'
            className='animation-show sticky left-0 bottom-0 flex justify-center bg-white border-[1px] border-gray-3'
          >
            <div className='container flex justify-between items-center p-4'>
              {user?.id === postData.author?.id ? (
                <NativeLink
                  href={`/posts/${id}/submitted-resume`}
                  className='bg-main-1 text-white text-sm w-full py-3 rounded-xl font-bold text-center'
                >
                  지원서보기 ({resumes?.length})
                </NativeLink>
              ) : (
                <>
                  <div className='icon-button-container flex gap-x-2'>
                    <div className='like flex items-center gap-x-1'>
                      <button type='button' onClick={handleClickLike}>
                        {postData.is_liked ? <IconHeartFill /> : <IconHeartOutline />}
                      </button>
                      <span className='count text-xs text-text-2'>{postData.like_count?.toLocaleString()}</span>
                    </div>

                    <div className='view flex items-center gap-x-1'>
                      <IconView />
                      <span className='count text-xs text-text-2'>{postData.view_count?.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    type='button'
                    className={`${
                      filteredMyResume.length && 'opacity-40'
                    } text-white bg-main-2 rounded-[10px] w-[80px] h-8 text-sm`}
                    onClick={() => setIsOpenPopup(true)}
                    disabled={Boolean(filteredMyResume.length)}
                  >
                    {filteredMyResume.length ? '신청완료' : '신청하기'}
                  </button>
                </>
              )}
            </div>
          </section>
        </>
      )}

      {isDeleting && (
        <section className='min-h-[100vh]'>
          <Loading />
        </section>
      )}

      <Toast
        position={isShowSuccessToast ? 'CENTER' : 'TOP'}
        status={isShowSuccessToast ? 'success' : 'error'}
        description={toastDescription}
        isInvisible={isShowToast}
        onClose={() => {
          setIsShowToast(false);
          setToastDescription('');
          setIsShowSuccessToast(false);
        }}
      />

      <BottomSheet isOpen={isShowBottomMenu} onClose={() => setIsShowBottomMenu(false)}>
        {bottomSheetType === 'POST_UPDATE' && (
          <PostUpdateBottomSheet id={id} onDelete={handleDeletePost} onClose={handleCloseBottomSheet} />
        )}
        {bottomSheetType === 'POST_STATUS_UPDATE' && (
          <PostStatusUpdateBottomSheet onChange={handleChangeStatus} onClose={handleCloseBottomSheet} />
        )}
      </BottomSheet>

      <Popup isOpen={isOpenPopup} onClose={() => setIsOpenPopup(false)}>
        <Resume id={Number(id)} onClose={onSubmitResume} />
      </Popup>
    </>
  );
}
