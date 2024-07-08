import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { PageParams, Post, PostStatus } from '@/types/post';
import { PageResponse } from '@/types/response';
import { UserEditForm, UserResponseType, UserType, UserDeleteError, LoggedFrom } from '@/types/user';
import { TotalDistance } from '@/types/walk';
import { fetchWithStatus, fetcher, fetcherStatusWithToken, fetcherWithToken, requestURL } from '@/utils/request';

export const USER_QUERY_KEY = '/user';

const VALIDATE_USER_NAME_QUERY_KEY = '/user/name';

export const getKakaoAuth = async (code: string) => {
  const URL = '/user/login-kakao';
  const response = await fetcher<UserResponseType>(URL, {
    method: 'POST',
    withCredentials: true,
    data: { code },
  });
  return response;
};

export const getAppleAuth = async (code: string, token: string) => {
  const URL = '/user/login-apple';
  const response = await fetcher<UserResponseType>(URL, {
    method: 'POST',
    withCredentials: true,
    data: { code, token },
  });

  return response;
};

export const getNaverAuth = async (accessToken: string) => {
  const URL = '/user/login-naver';
  const response = await fetcher<UserResponseType>(URL, {
    method: 'POST',
    withCredentials: true,
    data: { access_token: accessToken },
  });
  return response;
};

export const deleteUser = async (userId: string, loggedFrom: LoggedFrom) => {
  const response = await fetchWithStatus(USER_QUERY_KEY, {
    method: 'DELETE',
    data: {
      user_id: userId,
      logged_from: loggedFrom,
    },
  });

  const { status } = response;
  return status;
};

export const useOthersQuery = (id: string) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: () => fetcherWithToken<UserType>(`${USER_QUERY_KEY}?id=${id}`),
  });
};

export const useUserQuery = () => {
  return useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () =>
      fetcherWithToken<UserType>(USER_QUERY_KEY, {
        withCredentials: true,
      }),
  });
};

export const editUserInfo = (editUser: UserEditForm) => {
  return axios.patch(`${requestURL}${USER_QUERY_KEY}`, editUser);
};

export const useValidateUserName = (name: string) => {
  return useQuery({
    queryKey: [`${VALIDATE_USER_NAME_QUERY_KEY}/${name}`],
    queryFn: () => fetcherWithToken<boolean>(`${VALIDATE_USER_NAME_QUERY_KEY}?name=${name}`),
    enabled: name.length >= 2 && name.length <= 10,
  });
};

export const getIsExistedUserName = async (name: string) => {
  if (name.length <= 1 || name.length >= 11) {
    return;
  }

  const response = fetcherWithToken<boolean>(`${VALIDATE_USER_NAME_QUERY_KEY}?name=${name}`);
  return response;
};

export const logoutUser = async (userId: string, loggedFrom: LoggedFrom) => {
  const URL = '/user/logout';
  const response = await fetcherStatusWithToken(URL, {
    method: 'POST',
    data: { user_id: userId, logged_from: loggedFrom },
  });
  const { status } = response;
  return status;
};

export const getPostsByUserAndStatus = ({
  page = 0,
  size = 20,
  status,
  authorId,
}: PageParams & { status: PostStatus; authorId: string }) => {
  try {
    const data = fetcherWithToken<PageResponse<Post[]>>(
      `${USER_QUERY_KEY}/posts?size=${size}&page=${page}&status=${status}&author_id=${authorId}`,
    );

    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const getPostsByLike = ({ page = 0, size = 20 }: PageParams) => {
  try {
    const data = fetcherWithToken<PageResponse<Post[]>>(`${USER_QUERY_KEY}/liked-posts?size=${size}&page=${page}`);

    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};

export const useRecordWalkCount = (id?: string) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id, 'RECORD_WALK_COUNT'],
    queryFn: () =>
      fetcherWithToken<number>(
        id ? `${USER_QUERY_KEY}/record-walks/count?user_id=${id}` : `${USER_QUERY_KEY}/record-walks/count`,
      ),
  });
};

export const useRecordWalkDistance = (id?: string) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id, 'RECORD_WALK_TOTAL_DISTANCE'],
    queryFn: () =>
      fetcherWithToken<TotalDistance>(
        id ? `${USER_QUERY_KEY}/record-walks/distance?user_id=${id}` : `${USER_QUERY_KEY}/record-walks/distance`,
      ),
  });
};

export const getUserSubmittedPosts = ({ page = 0, size = 20 }: PageParams) => {
  try {
    const data = fetcherWithToken<PageResponse<Post[]>>(`${USER_QUERY_KEY}/submitted-posts?size=${size}&page=${page}`);
    return data;
  } catch (err) {
    if (err instanceof UserDeleteError) {
      console.error(err.response.status);
    }
  }
};
