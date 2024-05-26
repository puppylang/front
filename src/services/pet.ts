import { useQuery } from '@tanstack/react-query';

import { Pet, UpdatePetFormType } from '@/types/pet';
import { fetcherWithToken } from '@/utils/request';

export const PET_QUERY_KEY = '/user/pet';

export const usePetQuery = (userId?: string) => {
  return useQuery({
    queryKey: userId ? [PET_QUERY_KEY, userId] : [PET_QUERY_KEY],
    queryFn: () => fetcherWithToken<Pet[]>(userId ? `${PET_QUERY_KEY}?user_id=${userId}` : PET_QUERY_KEY),
  });
};

export const deletePet = (id: string) => {
  return fetcherWithToken(PET_QUERY_KEY, { method: 'DELETE', data: { id } });
};

export const updatePet = (data: UpdatePetFormType) => {
  return fetcherWithToken(PET_QUERY_KEY, { method: 'PATCH', data });
};
