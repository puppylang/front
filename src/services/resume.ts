import { useQuery } from '@tanstack/react-query';

import { ResumeFormType } from '@/types/resume';
import { Resume } from '@/types/resume';
import { fetcherStatusWithToken, fetcherWithToken } from '@/utils/request';

interface CreateResumeType extends ResumeFormType {
  user_id: string;
  post_id: number;
}

const RESUME_KEY = '/resume';
export const RESUMES_KEY = '/resumes';

export const createResume = (data: CreateResumeType) => {
  return fetcherStatusWithToken(RESUME_KEY, {
    method: 'POST',
    data,
  });
};

export const useResumesQuery = (id: string) => {
  return useQuery({
    queryKey: [RESUMES_KEY, id],
    queryFn: () => fetcherWithToken<Resume[]>(`${RESUMES_KEY}?postId=${id}`),
  });
};

export const updateResume = (data: Resume) => {
  return fetcherStatusWithToken(`${RESUME_KEY}/${data.id}`, {
    method: 'PUT',
    data,
  });
};
