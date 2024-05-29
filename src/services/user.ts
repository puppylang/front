import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { PageParams, Post, PostStatus } from '@/types/post';
import { PageResponse } from '@/types/response';
import { RegionType, UserEditForm, UserResponseType, UserType, UserDeleteError } from '@/types/user';
import { fetchWithStatus, fetcher, fetcherStatusWithToken, fetcherWithToken, requestURL } from '@/utils/request';

export const USER_QUERY_KEY = '/user';
export const USER_REGION_QUERY_KEY = '/user/region';
export const USER_ACTIVED_REGION_QUERY_KEY = '/user/actived-region';

const REGION_QUERY_KEY = '/region';
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

export const getNaverAuth = async (accessToken: string) => {
  const URL = '/user/login-naver';
  const response = await fetcher<UserResponseType>(URL, {
    method: 'POST',
    withCredentials: true,
    data: { access_token: accessToken },
  });
  return response;
};

export const deleteUser = async (id: string) => {
  const response = await fetchWithStatus(USER_QUERY_KEY, {
    method: 'DELETE',
    data: {
      id,
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

export const useRegionQuery = (query: string | { x: string; y: string }) => {
  const isStringTypeQuery = typeof query === 'string';
  return useQuery({
    queryKey: [REGION_QUERY_KEY, isStringTypeQuery, query],
    queryFn: () => {
      if (isStringTypeQuery) {
        return fetcher<RegionType[]>(`${REGION_QUERY_KEY}?text=${query}`);
      }
      return fetcher<RegionType[]>(`${REGION_QUERY_KEY}?x=${query.x}&y=${query.y}`);
    },
    enabled: isStringTypeQuery || (Boolean(query.x) && Boolean(query.y)),
  });
};

export const editUserInfo = (editUser: UserEditForm) => {
  return axios.patch(`${requestURL}${USER_QUERY_KEY}`, editUser);
};

export const useValidateUserName = (name: string) => {
  return useQuery({
    queryKey: [`${VALIDATE_USER_NAME_QUERY_KEY}/${name}`],
    queryFn: () => (name !== '' ? fetcherWithToken<boolean>(`${VALIDATE_USER_NAME_QUERY_KEY}?name=${name}`) : null),
  });
};

export const logoutUser = async () => {
  const URL = '/user/logout';
  const response = await fetcherStatusWithToken(URL);
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

export const deleteUserRegion = (region: string) => {
  return fetcherStatusWithToken(USER_REGION_QUERY_KEY, { method: 'DELETE', data: { region } });
};

export const createUserRegion = (region: string) => {
  return fetcherStatusWithToken(USER_REGION_QUERY_KEY, { method: 'POST', data: { region } });
};

export const updateUserActivedRegion = (region: string) => {
  return fetcherStatusWithToken(USER_ACTIVED_REGION_QUERY_KEY, {
    method: 'PATCH',
    data: {
      region,
    },
  });
};
