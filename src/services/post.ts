import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { PageParams, Post, PostStatus } from '@/types/post';
import { PageResponse } from '@/types/response';
import { UserDeleteError } from '@/types/user';
import { fetcherWithSSRToken, fetcherWithToken } from '@/utils/request';

export const POST_KEY = '/posts';
export const MESSAGE_POST_KEY = '/chat/post';

export const createPost = async (postData: Post) => {
  try {
    const data = await fetcherWithToken<Post>(POST_KEY, { method: 'POST', data: postData });
    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const getPosts = async () => {
  try {
    const data = await fetcherWithToken<PageResponse<Post[]>>(POST_KEY);
    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const getPostsWithPaging = async ({ page = 0, size = 10 }: PageParams) => {
  try {
    const data = await fetcherWithToken<PageResponse<Post[]>>(`${POST_KEY}?size=${size}&page=${page}`);
    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const usePostDetailQuery = (id: string) => {
  return useQuery({
    queryKey: [POST_KEY, id],
    queryFn: () => fetcherWithToken<Post>(`${POST_KEY}/${id}`),
  });
};

export const updatePost = async (id: string, postData: Post) => {
  try {
    const data = await fetcherWithToken(`${POST_KEY}/${id}`, { method: 'PUT', data: postData });
    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const useUpdatePost = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_KEY, id],
    mutationFn: ({ id, postData }: { id: string; postData: Post }) => updatePost(id, postData),
    onSuccess: response => {
      if (!response) return;

      queryClient.setQueryData([POST_KEY, id], () => ({ ...response }));
    },
  });
};

export const deletePost = async (id: string) => {
  try {
    const data = await fetcherWithToken(`${POST_KEY}/${id}`, { method: 'DELETE' });
    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const usePostPetDetail = (id: string | null) => {
  return useQuery({
    queryKey: [MESSAGE_POST_KEY, id],
    queryFn: () => getPostPetDetail(id),
    enabled: id !== null,
    staleTime: 5000,
  });
};

export const getPostPetDetail = (id: string | null, token?: string) => {
  return fetcherWithSSRToken<Post>(`${MESSAGE_POST_KEY}/${id}`, token);
};

export const updatePostStatus = async (id: string, status: PostStatus) => {
  try {
    const data = await fetcherWithToken<Post>(`${POST_KEY}/${id}/status`, {
      method: 'PUT',
      data: { status },
    });

    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const useUpdatePostStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_KEY, id],
    mutationFn: ({ id, status }: { id: string; status: PostStatus }) => updatePostStatus(id, status),
    onSuccess: response => {
      if (!response) return;

      queryClient.setQueryData([POST_KEY, id], (prev: Post) => {
        return { ...prev, status: response.status };
      });
    },
  });
};

export const useMatchPost = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_KEY, id],
    mutationFn: ({ id, matched_user_id }: { id: string; matched_user_id: string | null }) => {
      return matched_user_id ? matchPost(id, matched_user_id) : unMatchPost(id);
    },
    onSuccess: response => {
      if (!response) return;

      queryClient.setQueryData([POST_KEY, id], () => ({ ...response }));
    },
  });
};

export const matchPost = async (id: string, matched_user_id: string) => {
  try {
    const data = await fetcherWithToken(`${POST_KEY}/${id}/match`, {
      method: 'POST',
      data: { matched_user_id },
    });
    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const unMatchPost = async (id: string) => {
  try {
    const data = await fetcherWithToken(`${POST_KEY}/${id}/match`, { method: 'DELETE' });
    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const useMatchedPosts = (user_id: string | undefined) => {
  return useQuery({
    queryKey: [POST_KEY, user_id],
    queryFn: () => (user_id ? fetcherWithToken<Post[]>(`${POST_KEY}/matched?user_id=${user_id}`) : null),
  });
};
