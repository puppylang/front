import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Post } from '@/types/post';
import { UserDeleteError } from '@/types/user';
import { fetcherWithToken } from '@/utils/request';

import { POST_KEY } from './post';

export const createLike = async (id: string) => {
  try {
    const data = await fetcherWithToken(`/posts/${id}/likes`, { method: 'POST' });
    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const deleteLike = async (id: string) => {
  try {
    const data = await fetcherWithToken(`/posts/${id}/likes`, { method: 'DELETE' });
    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const useLikeCancelMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLike(id),
    onSuccess: () => {
      queryClient.setQueryData([POST_KEY, id], (prev: Post) => {
        if (prev.like_count === undefined) return;

        return { ...prev, is_liked: false, like_count: prev.like_count - 1 };
      });
    },
  });
};

export const useLikePostMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => createLike(id),
    onSuccess: () => {
      queryClient.setQueryData([POST_KEY, id], (prev: Post) => {
        if (prev.like_count === undefined) return;

        return { ...prev, is_liked: true, like_count: prev.like_count + 1 };
      });
    },
  });
};
