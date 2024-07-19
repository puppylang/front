'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDeferredValue, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { IoCloseCircle, IoCloseOutline, IoSearch } from 'react-icons/io5';

import useDebounce from '@/hooks/useDebounce';
import {
  ACTIVED_REGION_QUERY_KEY,
  USER_REGION_QUERY_KEY,
  createRegion,
  deleteRegion,
  updateActivedRegion,
  useActiveRegionQuery,
  useRegionQuery,
  useUserRegionQuery,
} from '@/services/region';
import { USER_QUERY_KEY } from '@/services/user';
import { ActivedRegion, UserRegion } from '@/types/region';
import { UserType } from '@/types/user';
import { formatRegionTitle } from '@/utils/region';

import { HeaderNavigation } from '@/components/HeaderNavigation';
import Toast from '@/components/Toast';

export default function Region() {
  const [searchValue, setSearchValue] = useState('');
  const [position, setPosition] = useState({ x: '', y: '' });
  const [showsToast, setShowsToast] = useState(false);
  const [toastDescription, setDescription] = useState('');
  const [updatingActivedRegion, setUpdatingActivedRegion] = useState<number | undefined>(undefined);

  const debounceSearchValue = useDebounce(searchValue, 300);
  const deferredValue = useDeferredValue(debounceSearchValue);

  const queryClient = useQueryClient();

  const { data: regionInfos } = useRegionQuery(deferredValue || position);
  const { data: userRegions } = useUserRegionQuery();
  const { data: activedRegion } = useActiveRegionQuery();

  const createRegionMutation = useMutation({
    mutationFn: (region: string) => createRegion(region),
    mutationKey: [USER_REGION_QUERY_KEY],
    onSuccess: data => {
      queryClient.setQueryData([ACTIVED_REGION_QUERY_KEY], () => {
        return { ...data, region_id: data.id };
      });

      queryClient.setQueryData([USER_REGION_QUERY_KEY], (oldData: UserRegion[]) => {
        return [...oldData, data];
      });
    },
  });

  const deleteRegionMutation = useMutation({
    mutationFn: (id: number) => deleteRegion(id),
    mutationKey: [USER_REGION_QUERY_KEY],
    onSuccess: (_, variable) => {
      setUpdatingActivedRegion(undefined);

      queryClient.setQueryData([USER_REGION_QUERY_KEY], (oldData: UserRegion[]) => {
        return oldData.filter(region => region.id !== variable);
      });
    },
  });

  const updateReigonMutation = useMutation({
    mutationFn: (regionId: number) => updateActivedRegion(regionId),
    mutationKey: [USER_QUERY_KEY],
    onSuccess: data => {
      setUpdatingActivedRegion(undefined);
      queryClient.setQueryData([ACTIVED_REGION_QUERY_KEY], (oldData: ActivedRegion | undefined) => {
        return oldData ? { ...oldData, region_id: data.region_id } : data;
      });

      queryClient.setQueryData([USER_QUERY_KEY], (oldData: UserType) => {
        return { ...oldData, actived_region: data };
      });
    },
  });

  const onClickCurrentPositionBtn = () => {
    setSearchValue('');
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setPosition({ x: String(coords.longitude), y: String(coords.latitude) });
    });
  };

  const onClickAddRegionBtn = async (address: string) => {
    if (userRegions && userRegions.length === 2) {
      setShowsToast(true);
      setDescription('지역은 최대 2개까지 설정할 수 있습니다.');
      return;
    }

    const isIncludedSameGeo = userRegions && Boolean(userRegions.find(region => region.region === address));
    if (isIncludedSameGeo) {
      setShowsToast(true);
      setDescription('중복된 지역이 존재합니다.');
      return;
    }

    createRegionMutation.mutate(address);
  };

  const onClickDeleteRegionBtn = (id: number) => {
    setUpdatingActivedRegion(id);
    deleteRegionMutation.mutate(id);
  };

  const onClickActiveRegionBtn = async (id: number) => {
    setUpdatingActivedRegion(id);
    updateReigonMutation.mutate(id);
  };

  return (
    <>
      <section id='region' className='flex flex-col items-center min-h-[100vh] bg-white'>
        <div className='container'>
          <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>내 동네 설정 페이지</h1>

          <HeaderNavigation.Container>
            <HeaderNavigation.Title text='내 동네 설정' />
          </HeaderNavigation.Container>

          <div className='bg-white flex flex-col gap-y-4 p-4 pt-0'>
            <div className='my-region-container flex flex-col gap-y-4'>
              <div className='flex items-center gap-x-2'>
                <span className='text-sm text-text-2 font-bold'>내 동네</span>
                <span className='text-[12px] text-text-3'>동네는 최대 2개까지 설정할 수 있습니다.</span>
              </div>

              {userRegions && (
                <ul className='flex gap-x-2'>
                  {userRegions.map(region => (
                    <RegisterLocationList
                      key={region.id}
                      id={region.id}
                      isActived={activedRegion?.region_id === region.id}
                      address={region.region}
                      isLoading={updatingActivedRegion === region.id}
                      onClickRegionBtn={onClickActiveRegionBtn}
                      onClickDeleteBtn={onClickDeleteRegionBtn}
                    />
                  ))}
                </ul>
              )}
            </div>

            <div className='flex flex-col gap-y-4'>
              <p className='text-sm text-text-2 font-bold'>동네 검색</p>
              <div className='flex items-center relative'>
                <IoSearch color='#E5E5E5' className='absolute left-4' />
                <input
                  className='border border-gray-2 w-full rounded-[10px] px-10 py-[10px] text-sm text-text-2'
                  type='text'
                  placeholder='동명(읍,면)으로 검색(ex. 작전동)'
                  value={searchValue}
                  onChange={({ target }) => setSearchValue(target.value)}
                />
                <button type='button' className='absolute right-4' onClick={() => setSearchValue('')}>
                  <IoCloseCircle color='#E5E5E5' />
                </button>
              </div>

              <button
                onClick={onClickCurrentPositionBtn}
                type='button'
                className='block rounded-[10px] py-[10px] w-full bg-main-2 text-white text-sm'
              >
                현재 위치로 찾기
              </button>

              {searchValue.length >= 1 && (
                <p className='font-semibold text-sm text-text-2'>`{searchValue}` 검색 결과</p>
              )}

              {regionInfos && (
                <div className='region-info-container'>
                  {regionInfos.status === 'NOT_FOUND' ? (
                    <div className='h-[200px] text-sm text-text-2 flex flex-col items-center justify-center gap-y-1'>
                      {searchValue.length === 1 && <p>정확한 검색을 위해 2글자 이상 입력해주세요.</p>}
                      <p>검색 결과가 존재하지 않아요.</p>
                    </div>
                  ) : (
                    <ul className='max-h-[320px] overflow-y-auto'>
                      {regionInfos.regions.map(region => (
                        <li key={region.title}>
                          <button
                            type='button'
                            onClick={() => onClickAddRegionBtn(region.title)}
                            className='block w-full text-left border-b border-gray-2 py-[13px] text-[14px]'
                          >
                            <span className='text-text-1 text-[14px]'>{region.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Toast
        position='CENTER'
        status='error'
        description={toastDescription}
        isInvisible={showsToast}
        onClose={() => {
          setShowsToast(false);
        }}
      />
    </>
  );
}

interface RegisterLocationListProps {
  isActived: boolean;
  address: string;
  id: number;
  onClickDeleteBtn: (id: number) => void;
  onClickRegionBtn: (id: number) => void;
  isLoading: boolean;
}

function RegisterLocationList({
  isActived,
  address,
  onClickDeleteBtn,
  onClickRegionBtn,
  isLoading,
  id,
}: RegisterLocationListProps) {
  return (
    <li
      className={`${
        isActived ? 'bg-main-5 text-text-3' : 'border border-gray-2 text-text-2'
      } rounded-[10px] flex flex-1 justify-between px-4 py-3`}
    >
      {isLoading ? (
        <CgSpinner className='text-text-2 animate-spin w-5 h-5 m-[0_auto]' />
      ) : (
        <>
          <button
            type='button'
            disabled={isLoading}
            className='text-sm p-0 m-0 w-[100%] text-left'
            onClick={() => onClickRegionBtn(id)}
          >
            {formatRegionTitle(address)}
          </button>
          <button type='button' onClick={() => onClickDeleteBtn(id)}>
            <IoCloseOutline />
          </button>
        </>
      )}
    </li>
  );
}
