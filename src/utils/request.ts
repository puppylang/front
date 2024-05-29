import axios, { AxiosRequestConfig } from 'axios';

import { getToken } from './token';

export const requestURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'http://localhost:8000';

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
    // Client Side Rendering get cookie
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
