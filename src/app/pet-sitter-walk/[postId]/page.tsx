'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import WalkSuccess from '@/components/WalkEditor/WalkSuccess';
import { recordedCautions, stopWatchState, trackMapState } from '@/recoil/atoms/walkAtom';
import { usePostDetailQuery, useUpdatePostStatus } from '@/services/post';
import { WALK_RECORD_KEY, createPetSitterWalkRecord } from '@/services/walk';
import { PostStatus } from '@/types/post';
import { WalkForm, WalkRole } from '@/types/walk';

import Loading from '@/components/Loading';
import { WalkEditor } from '@/components/WalkEditor';

interface PetSitterWalkProps {
  params: {
    postId: string;
  };
}

function PetSitterWalk({ params: { postId } }: PetSitterWalkProps) {
  const { data: postData } = usePostDetailQuery(postId);
  const { locations, distance } = useRecoilValue(trackMapState);
  const { isPaused, start_at, end_at } = useRecoilValue(stopWatchState);
  const cautions = useRecoilValue(recordedCautions);
  const [isLoading, setIsLoading] = useState(false);

  const postStatusMutation = useUpdatePostStatus(postId);

  const {
    mutate: petSitterWalkMutation,
    isSuccess,
    data,
  } = useMutation({
    mutationKey: [WALK_RECORD_KEY, 'PET_SITTER_WALK', postId],
    mutationFn: (payload: WalkForm) => createPetSitterWalkRecord(payload),
    onSuccess: () => {
      setIsLoading(false);
      postStatusMutation.mutate({ id: postId, status: PostStatus.FINISHED });
    },
    onError: () => setIsLoading(false),
  });

  const walkSchedule = useMemo(() => {
    if (!postData) return { start_at: null, end_at: null };
    return { start_at: postData.start_at, end_at: postData.end_at };
  }, [postData]);

  const walkCautions = useMemo(() => {
    if (!postData) return [];
    return postData.cautions.map(({ content }) => ({ id: null, content, is_completed: false }));
  }, [postData]);

  const handleSubmitPetWalk = useCallback(() => {
    if (start_at && end_at) {
      const payload = {
        start_at,
        end_at,
        locations,
        distance,
        pet_id: Number(postData?.pet_id),
        post_id: Number(postId),
        cautions,
      };

      console.log(payload);
      petSitterWalkMutation(payload);
    }
  }, [petSitterWalkMutation, start_at, end_at, locations, distance, postData?.pet_id, cautions, postId]);

  useEffect(() => {
    if (isPaused) {
      setIsLoading(true);
      return handleSubmitPetWalk();
    }
  }, [handleSubmitPetWalk, isPaused]);

  return (
    <>
      {isLoading && <Loading />}

      {isSuccess ? (
        <WalkSuccess data={data} type={WalkRole.PetSitterWalker} />
      ) : (
        <section id='walk' className='flex flex-col items-center'>
          {postData && postData.pet && (
            <WalkEditor pet={postData.pet} schedule={walkSchedule} defaultCautions={walkCautions} />
          )}
        </section>
      )}
    </>
  );
}

export default PetSitterWalk;
