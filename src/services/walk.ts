import { useQuery } from '@tanstack/react-query';

import { WalkForm, WalkRole } from '@/types/walk';
import { fetcherWithToken } from '@/utils/request';

export const WALK_RECORD_KEY = '/walk-records';
export const SITTER_WALK_RECORD_KEY = '/sitter-walk-records';
export const RECORD_WALK_QUERY_KEY = '/record-walks';

export const createPetWalkRecord = async (payload: WalkForm) => {
  try {
    const data = await fetcherWithToken<WalkForm>(WALK_RECORD_KEY, {
      method: 'POST',
      data: payload,
    });

    if (data) return data;
  } catch (err) {
    console.error(err);
  }
};

export const useCalendarWalks = ({ from, to, role }: { from: string | null; to: string | null; role: WalkRole }) => {
  return useQuery({
    queryKey: [RECORD_WALK_QUERY_KEY, from, to, role],
    queryFn: () =>
      from || to ? fetcherWithToken<WalkForm[]>(`${RECORD_WALK_QUERY_KEY}?from=${from}&to=${to}&role=${role}`) : null,
  });
};

export const useRecordWalkDetail = ({ id, role }: { id: string | null; role: WalkRole | null }) => {
  return useQuery({
    queryKey: [RECORD_WALK_QUERY_KEY, id, role],
    queryFn: () => (role ? fetcherWithToken<WalkForm>(`${RECORD_WALK_QUERY_KEY}/${id}?role=${role}`) : null),
  });
};

export const useRecordWalkByUser = (userId: string, role: WalkRole, limit?: number) => {
  return useQuery({
    queryKey: [RECORD_WALK_QUERY_KEY, userId],
    queryFn: () =>
      fetcherWithToken<WalkForm[]>(`${RECORD_WALK_QUERY_KEY}/user?user_id=${userId}&role=${role}&limit=${limit || 10}`),
  });
};
