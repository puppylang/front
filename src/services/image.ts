import { fetcherWithToken } from '@/utils/request';

const IMAGE_UPLOAD_QUERY = '/image';

export const uploadImage = (data: FormData) => {
  return fetcherWithToken<string>(IMAGE_UPLOAD_QUERY, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    data,
  });
};
