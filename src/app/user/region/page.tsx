'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDeferredValue, useMemo, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { IoCloseCircle, IoCloseOutline, IoSearch } from 'react-icons/io5';

import useDebounce from '@/hooks/useDebounce';
import {
  USER_QUERY_KEY,
  createUserRegion,
  deleteUserRegion,
  updateUserActivedRegion,
  useRegionQuery,
  useUserQuery,
} from '@/services/user';
import { UserType } from '@/types/user';

import { HeaderNavigation } from '@/components/HeaderNavigation';
import Toast from '@/components/Toast';

export default function UserRegion() {
  const [searchValue, setSearchValue] = useState('');
  const [activeRegion, setActiveRegion] = useState('');
  const [position, setPosition] = useState({ x: '', y: '' });
  const [showsToast, setShowsToast] = useState(false);
  const [toastDescription, setDescription] = useState('');
  const [updatingActivedRegion, setUpdatingActivedRegion] = useState('');

  const debounceSearchValue = useDebounce(searchValue, 300);
  const deferredValue = useDeferredValue(debounceSearchValue);

  const { data: regionInfos } = useRegionQuery(deferredValue || position);
  const { data: user } = useUserQuery();
  const queryClient = useQueryClient();

  const regions = useMemo(() => user?.region, [user]);

  const createRegionMutation = useMutation({
    mutationFn: (region: string) => createUserRegion(region),
    mutationKey: [USER_QUERY_KEY],
    onSuccess: (_, variable) => {
      queryClient.setQueryData([USER_QUERY_KEY], (oldData: UserType) => {
        return { ...oldData, region: [...oldData.region, variable] };
      });
    },
  });

  const deleteRegionMutation = useMutation({
    mutationFn: (region: string) => deleteUserRegion(region),
    mutationKey: [USER_QUERY_KEY],
    onSuccess: (_, variable) => {
      setUpdatingActivedRegion('');
      queryClient.setQueryData([USER_QUERY_KEY], (oldData: UserType) => {
        return {
          ...oldData,
          region: oldData.region.filter(data => data !== variable),
          actived_region: variable === oldData.actived_region ? null : oldData.actived_region,
        };
      });
    },
  });

  const updateReigonMutation = useMutation({
    mutationFn: (region: string) => updateUserActivedRegion(region),
    mutationKey: [USER_QUERY_KEY],
    onSuccess: (_, variable) => {
      setUpdatingActivedRegion('');
      queryClient.setQueryData([USER_QUERY_KEY], (oldData: UserType) => {
        return { ...oldData, actived_region: variable };
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
    if (user && user.region.length === 2) {
      setShowsToast(true);
      setDescription('지역은 최대 2개까지 설정할 수 있습니다.');
      return;
    }
    const isIncludedSameGeo = user && user.region.includes(address);
    if (isIncludedSameGeo) {
      setShowsToast(true);
      setDescription('중복된 지역이 존재합니다.');
      return;
    }

    if (!activeRegion) {
      setActiveRegion(address);
    }
    createRegionMutation.mutate(address);
  };

  const onClickDeleteRegionBtn = (address: string) => {
    setUpdatingActivedRegion(address);
    deleteRegionMutation.mutate(address);
  };

  const onClickGeoBtn = async (address: string) => {
    setActiveRegion(address);
    setUpdatingActivedRegion(address);
    updateReigonMutation.mutate(address);
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

              {regions && user && (
                <ul className='flex gap-x-2'>
                  {regions.map(region => (
                    <RegisterLocationList
                      key={region}
                      isActived={user.actived_region === region}
                      address={region}
                      isLoading={updatingActivedRegion === region}
                      onClickRegionBtn={onClickGeoBtn}
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
                  placeholder='지역을 입력해 주세요.'
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

              {regionInfos && (
                <div className='region-info-container'>
                  {regionInfos.length === 0 ? (
                    <p className='text-[14px] text-text-2'>등록된 동네가 없어요.</p>
                  ) : (
                    <ul>
                      {regionInfos.map(region => (
                        <li key={region.address_name}>
                          <button
                            type='button'
                            onClick={() => onClickAddRegionBtn(region.address_name)}
                            className='block w-full text-left border-b border-gray-2 py-[13px] text-[14px]'
                          >
                            <span className='text-text-1 text-[14px]'>{region.address_name}</span>
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
  onClickDeleteBtn: (address: string) => void;
  onClickRegionBtn: (address: string) => void;
  isLoading: boolean;
}

function RegisterLocationList({
  isActived,
  address,
  onClickDeleteBtn,
  onClickRegionBtn,
  isLoading,
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
            onClick={() => onClickRegionBtn(address)}
          >
            {address.split(' ')[2]}
          </button>
          <button type='button' onClick={() => onClickDeleteBtn(address)}>
            <IoCloseOutline />
          </button>
        </>
      )}
    </li>
  );
}
