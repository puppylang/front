import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { WebviewActionType, WebviewRequestType } from '@/types/route';

import { getToken } from './token';

export const requestURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://mass-bonnie-puppylang-server-accb847f.koyeb.app';

class CustomAxiosError extends AxiosError {
  constructor(error: AxiosError) {
    super(error.message);
    const errorStatus = error.response?.status || 0;
    let name: string;

    switch (errorStatus) {
      case 400:
        name = 'ApiBadRequestError';
        break;
      case 401:
        name = 'ApiUnauthorizedError';
        break;

      case 404:
        name = 'ApiNotFoundError';
        break;
      case 500:
        name = 'ApiInternalServerError';
        break;
      default:
        name = 'Api Error';
        break;
    }

    this.status = errorStatus;
    this.name = name;
  }
}

axios.interceptors.response.use(
  response => {
    if (typeof window !== 'undefined') {
      const token = response.headers.authorization;
      if (window.ReactNativeWebView && token) {
        const tokenMessage: WebviewRequestType = {
          token,
          type: WebviewActionType.UpdateToken,
        };
        window.ReactNativeWebView.postMessage(JSON.stringify(tokenMessage));
      }
      return response;
    }

    return response;
  },
  error => {
    throw new CustomAxiosError(error);
  },
);

export const fetcher = async <T>(queryKey: string, axiosConfig?: AxiosRequestConfig) => {
  const { data } = await axios<T>({ ...axiosConfig, url: `${requestURL}${queryKey}` });
  return data;
};

export const fetchWithStatus = async <T>(queryKey: string, axiosConfig?: AxiosRequestConfig) => {
  const { data, status } = await axios<T>({ ...axiosConfig, url: `${requestURL}${queryKey}` });
  return { data, status };
};

export const fetcherWithToken = async <T>(queryKey: string, axiosConfig?: AxiosRequestConfig) => {
  const token = getToken();

  const { data } = await axios<T>({
    ...axiosConfig,
    withCredentials: true,
    url: `${requestURL}${queryKey}`,
    headers: {
      ...axiosConfig?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const fetcherStatusWithToken = async <T>(queryKey: string, axiosConfig?: AxiosRequestConfig) => {
  const token = getToken();

  const { data, status } = await axios<T>({
    ...axiosConfig,
    url: `${requestURL}${queryKey}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return { data, status };
};

export const fetcherWithSSRToken = async <T>(queryKey: string, token?: string, axiosConfig?: AxiosRequestConfig) => {
  let clientSideCookie;
  if (typeof window !== 'undefined') {
    // Client Side  get cookie
    const cookie = document.cookie.split('; ').find(row => row.startsWith('token'));
    clientSideCookie = cookie ? cookie.split('=')[1] : undefined;
  }

  const { data } = await axios<T>({
    ...axiosConfig,
    url: `${requestURL}${queryKey}`,
    headers: {
      Authorization: `Bearer ${token || clientSideCookie}`,
    },
  });

  return data;
};
