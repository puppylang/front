'use client';

import { useState } from 'react';

import { PetCardItem } from '@/components/PetCardList/PetCardItem';
import PostDetailSkeletonUI from '@/components/SkeletonUI/PostDetailSkeletonUI';
import useNativeRouter from '@/hooks/useNativeRouter';
import { useLikeCancelMutation, useLikePostMutation } from '@/services/like';
import { deletePost, usePostDetailSSRQuery, useUpdatePostStatus } from '@/services/post';
import { useCancelBlockMutation, useCreateBlockMutation } from '@/services/report';
import { useResumesQuery } from '@/services/resume';
import { useUserQuery } from '@/services/user';
import { BottomSheetType, PostStatus } from '@/types/post';
import { formatDate } from '@/utils/date';

import Alert from '@/components/Alert';
import { BottomSheet } from '@/components/BottomSheet';
import { HeaderNavigation } from '@/components/HeaderNavigation';
import Loading from '@/components/Loading';
import NativeLink from '@/components/NativeLink';
import { Popup } from '@/components/Popup';
import { PostInfo } from '@/components/PostInfo';
import PostStatusBadge from '@/components/PostStatusBadge';
import PostStatusButton from '@/components/PostStatusButton';
import { Section } from '@/components/Section';
import Toast from '@/components/Toast';

import { IconHeartFill, IconHeartOutline, IconView } from '../../../../../public/assets/svgs';
import PostStatusUpdateBottomSheet from '../PostBottomSheet/PostStatusUpdateBottomSheet';
import PostUpdateBottomSheet from '../PostBottomSheet/PostUpdateBottomSheet';
import PostUserBlockBottomSheet from '../PostBottomSheet/PostUserBlockBottomSheet';
import Resume from '../resume';

function PostDetail({ id }: { id: string }) {
  const { data: postData, isLoading: isPostLoading } = usePostDetailSSRQuery(id);
  const { data: user, isLoading: isUserLoading } = useUserQuery();
  const { data: resumes, isLoading: isResumeLoading } = useResumesQuery(id);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isShowToast, setIsShowToast] = useState(false);
  const [toastDescription, setToastDescription] = useState('');
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isShowSuccessToast, setIsShowSuccessToast] = useState(false);
  const [isShowBottomMenu, setIsShowBottomMenu] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState<BottomSheetType>(null);
  const [isSubmittedResume, setIsSubmittedResume] = useState(false);

  const router = useNativeRouter();

  const isLoading = isPostLoading || isUserLoading || isResumeLoading;

  const isMyPost = user && postData && user.id === postData.author?.id;
  const filteredMyResume = resumes && user ? resumes.filter(resume => resume.user_id === user.id) : [];
  const isBlockedAuthor =
    !isMyPost && Boolean(user?.blocker.find(blocker => blocker.blocked_id === postData?.author?.id));

  const likePostMutation = useLikePostMutation(id);
  const likeCancelMutation = useLikeCancelMutation(id);
  const createBlockMutation = useCreateBlockMutation();
  const cancelBlockMutation = useCancelBlockMutation();
  const postStatusMutation = useUpdatePostStatus(id);

  const handleClickDotBtn = (status: BottomSheetType) => {
    setIsShowBottomMenu(true);
    setBottomSheetType(status);
  };

  const handleClickStatusBtn = () => {
    setIsShowBottomMenu(true);
    setBottomSheetType('POST_STATUS_UPDATE');
  };

  const handleClickLike = () => {
    if (!postData) return;

    if (postData.is_liked) {
      likeCancelMutation.mutate(id);
    } else {
      likePostMutation.mutate(id);
    }
  };

  const handleClickUserBlock = (isBlocked: boolean) => {
    if (!user || !postData || !postData.author) return;
    if (isBlocked) {
      setIsShowBottomMenu(false);
      setBottomSheetType(null);
      cancelBlockMutation.mutate({
        blockerId: user.id,
        blockedId: postData.author.id,
      });
      setIsShowToast(true);
      setToastDescription('차단이 해제되었습니다.');
      return;
    }

    setIsShowBottomMenu(false);
    setBottomSheetType(null);
    setIsShowAlert(true);
  };
  const handleCloseBottomSheet = () => {
    setIsShowBottomMenu(false);
    setBottomSheetType(null);
  };

  const handleDeletePost = () => {
    setIsDeleting(true);
    deletePost(id)
      .then(res => {
        if (res) {
          handleCloseBottomSheet();
          setToastDescription('삭제되었습니다.');
          setIsShowToast(true);

          const timer = setTimeout(() => {
            router.replace('/posts');
          }, 2000);

          return () => clearTimeout(timer);
        }
      })
      .catch((err: Error) => {
        console.log(err);
      })
      .finally(() => setIsDeleting(false));
  };

  const handleChangeStatus = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { status } = e.currentTarget.dataset;
    postStatusMutation.mutate({ id, status: status as PostStatus });
    handleCloseBottomSheet();
  };

  const onSubmitResume = () => {
    setIsOpenPopup(false);
    setIsShowSuccessToast(true);
    setIsShowToast(true);
    setIsSubmittedResume(true);

    setToastDescription('견주에게 정보를 전달했어요!');
  };

  const handleClickAlertUserBlock = () => {
    if (!user || !postData || !postData.author) return;
    createBlockMutation.mutate({
      blockerId: user.id,
      blockedId: postData.author.id,
    });

    setIsShowToast(true);
    setToastDescription('사용자가 차단되었습니다.');
    setIsShowAlert(false);
  };

  if (isLoading) return <PostDetailSkeletonUI />;

  return (
    postData && (
      <>
        <section id='post-container' className='animation-show flex flex-col items-center min-h-[100vh]'>
          <h2 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>게시글 상세</h2>

          <div className='container'>
            <HeaderNavigation.Container className='flex justify-between'>
              <HeaderNavigation.DotBtn
                onClick={() => handleClickDotBtn(isMyPost ? 'POST_UPDATE' : 'POST_USER_BLOCK')}
              />
            </HeaderNavigation.Container>

            <Section.Container className='post-info-container bg-white p-[0px]'>
              <PostInfo.Top
                title={postData.title}
                author={postData.author}
                address={postData.region?.region}
                date={postData.created_at ? formatDate(postData.created_at) : ''}
              >
                {isMyPost ? (
                  <PostStatusButton status={postData.status as PostStatus} onClick={handleClickStatusBtn} />
                ) : (
                  <PostStatusBadge status={postData.status as PostStatus} />
                )}
              </PostInfo.Top>

              <PostInfo.Content content={postData.content} />
            </Section.Container>

            <Section.Container className='pet-and-walk-info-container bg-white flex flex-col p-4 mt-4'>
              <div className='pet-info pb-4'>
                <Section.Title title='함께 산책할 반려견 🐾' />

                {postData.pet && <PetCardItem pet={postData.pet} />}
              </div>

              <div className='walk-info'>
                <Section.Title title='산책 정보' />

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
            </Section.Container>

            <Section.Container className='caution-container bg-white p-4 mt-4'>
              <Section.Title title='주의사항' />

              {postData.cautions?.length ? (
                <ul className='flex flex-col gap-y-1'>
                  {postData.cautions.map((caution, index) => (
                    <PostInfo.CautionItem key={caution.id} index={index + 1} content={caution.content} />
                  ))}
                </ul>
              ) : (
                <span className='text-sm font-light text-text-1'>없습니다 :&#41;</span>
              )}
            </Section.Container>
          </div>
        </section>

        <section
          id='sticky-navigation'
          className='animation-show sticky left-0 bottom-0 flex justify-center bg-white border-[1px] border-gray-3'
        >
          <div className='container flex justify-between items-center p-4'>
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

            {user?.id === postData.author?.id ? (
              <NativeLink
                href={`/posts/${id}/submitted-resume`}
                className='bg-main-2 text-white text-sm h-8 leading-8 px-4 rounded-[10px]'
              >
                지원서보기 ({resumes && resumes?.length > 99 ? '99+' : resumes?.length || 0})
              </NativeLink>
            ) : (
              <button
                type='button'
                className={`${
                  filteredMyResume.length && 'opacity-40'
                } text-white bg-main-2 rounded-[10px] w-[80px] h-8 text-sm`}
                onClick={() => setIsOpenPopup(true)}
                disabled={Boolean(filteredMyResume.length)}
              >
                {filteredMyResume.length || isSubmittedResume ? '신청완료' : '신청하기'}
              </button>
            )}
          </div>
        </section>

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
          {bottomSheetType === 'POST_UPDATE' && <PostUpdateBottomSheet id={id} onDelete={handleDeletePost} />}
          {bottomSheetType === 'POST_STATUS_UPDATE' && <PostStatusUpdateBottomSheet onChange={handleChangeStatus} />}
          {bottomSheetType === 'POST_USER_BLOCK' && (
            <PostUserBlockBottomSheet
              isBlocked={isBlockedAuthor}
              href={`/report?id=${postData?.author?.id}`}
              onClickBlockButton={handleClickUserBlock}
            />
          )}
        </BottomSheet>

        <Popup.Container isOpen={isOpenPopup}>
          <Popup.CloseButton onClose={() => setIsOpenPopup(false)} />
          <Resume id={Number(id)} onClose={() => setIsOpenPopup(false)} onSubmit={onSubmitResume} />
        </Popup.Container>

        <Alert
          buttonText='차단하기'
          message='차단시 서로의 게시글 확인하거나 채팅을 할 수 없어요. 정말 차단하실래요?'
          isOpen={isShowAlert}
          onClose={() => setIsShowAlert(false)}
          onClick={handleClickAlertUserBlock}
        />
      </>
    )
  );
}

export default PostDetail;
