import { useQuery } from '@tanstack/react-query';

import { ActivedRegion, Region, UserRegion } from '@/types/region';
import { fetcherStatusWithToken, fetcherWithToken } from '@/utils/request';

const REGION_QUERY_KEY = '/region';
export const USER_REGION_QUERY_KEY = '/region/user';
export const ACTIVED_REGION_QUERY_KEY = '/region/active';

export const useRegionQuery = (query: string | { x: string; y: string }) => {
  const isStringTypeQuery = typeof query === 'string';

  return useQuery({
    queryKey: [REGION_QUERY_KEY, isStringTypeQuery, query],
    queryFn: () => {
      if (isStringTypeQuery) {
        return fetcherWithToken<Region>(`${REGION_QUERY_KEY}?text=${query}`);
      }
      return fetcherWithToken<Region>(`${REGION_QUERY_KEY}?x=${query.x}&y=${query.y}`);
    },
    enabled: isStringTypeQuery || (Boolean(query.x) && Boolean(query.y)),
  });
};

export const updateActivedRegion = (regionId: number) => {
  return fetcherWithToken<ActivedRegion>(REGION_QUERY_KEY, {
    method: 'PATCH',
    data: {
      region_id: regionId,
    },
  });
};

export const deleteRegion = (id: number) => {
  return fetcherStatusWithToken(REGION_QUERY_KEY, { method: 'DELETE', data: { id } });
};

export const createRegion = (region: string) => {
  return fetcherWithToken<UserRegion>(REGION_QUERY_KEY, { method: 'POST', data: { region } });
};

export const useUserRegionQuery = () => {
  return useQuery({
    queryKey: [USER_REGION_QUERY_KEY],
    queryFn: () => fetcherWithToken<UserRegion[]>(USER_REGION_QUERY_KEY),
  });
};

export const useActiveRegionQuery = () => {
  return useQuery({
    queryKey: [ACTIVED_REGION_QUERY_KEY],
    queryFn: () => fetcherWithToken<ActivedRegion | undefined>(ACTIVED_REGION_QUERY_KEY),
  });
};
