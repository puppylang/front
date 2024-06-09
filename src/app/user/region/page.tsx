'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDeferredValue, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { IoCloseCircle, IoCloseOutline, IoSearch } from 'react-icons/io5';

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
  const [value, setValue] = useState('');
  const [activedGeo, setActivedGeo] = useState('');
  const [position, setPostion] = useState({
    x: '',
    y: '',
  });
  const [showsToast, setShowsToast] = useState(false);
  const [toastDescription, setDescription] = useState('');
  const [updatingActivedRegion, setUpdatingActivedRegion] = useState('');

  const defferedValue = useDeferredValue(value);

  const { data: regionInfos } = useRegionQuery(defferedValue || position);
  const { data: user } = useUserQuery();
  const queryClient = useQueryClient();

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
    setValue('');
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setPostion({ x: String(coords.longitude), y: String(coords.latitude) });
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

    if (!activedGeo) {
      setActivedGeo(address);
    }
    createRegionMutation.mutate(address);
  };

  const onClickDeleteRegionBtn = (address: string) => {
    setUpdatingActivedRegion(address);
    deleteRegionMutation.mutate(address);
  };

  const onClickGeoBtn = async (address: string) => {
    setActivedGeo(address);
    setUpdatingActivedRegion(address);
    updateReigonMutation.mutate(address);
  };

  return (
    <>
      <HeaderNavigation.Container className='bg-bg-blue'>
        <HeaderNavigation.Title text='내 동네 설정' />
      </HeaderNavigation.Container>
      <section className='container pt-2 px-4'>
        <div className='mb-3'>
          <div className='mb-1 flex items-center'>
            <span className='text-sm'>내 동네</span>
            <span className='ml-2 text-[10px] text-text-3'>동네는 최대 2개까지 설정할 수 있습니다.</span>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            {user &&
              user.region.map(geo => (
                <RegisterLocationList
                  isActived={user.actived_region === geo}
                  address={geo}
                  key={geo}
                  isLoading={updatingActivedRegion === geo}
                  onClickRegionBtn={onClickGeoBtn}
                  onClickDeleteBtn={onClickDeleteRegionBtn}
                />
              ))}
          </div>
        </div>
        <div>
          <p className='mb-1 text-sm'>동네 검색</p>
          <div className='flex items-center relative'>
            <IoSearch color='#E5E5E5' className='absolute left-2.5' />
            <input
              className='border border-gray-1 w-full rounded-md px-8 py-2 text-[13px] text-text-1'
              type='text'
              placeholder='지역을 입력해 주세요.'
              value={value}
              onChange={({ target }) => setValue(target.value)}
            />
            <button type='button' className='absolute right-3' onClick={() => setValue('')}>
              <IoCloseCircle color='#E5E5E5' />
            </button>
          </div>
          <button
            onClick={onClickCurrentPositionBtn}
            type='button'
            className='block rounded-md py-1.5 w-full bg-main-2 text-white my-3 text-sm'
          >
            현재 위치로 찾기
          </button>
        </div>
        <ul>
          {regionInfos?.length === 0 && <div className='text-[14px]'>등록된 동네가 없어요.</div>}
          {regionInfos &&
            regionInfos.map(region => (
              <li key={region.address_name}>
                <button
                  type='button'
                  onClick={() => onClickAddRegionBtn(region.address_name)}
                  className='block w-full text-left border-b border-gray-1 py-2 text-[14px]'
                >
                  <span className='text-text-1'>{region.address_name}</span>
                </button>
              </li>
            ))}
        </ul>
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
    <div className={`${isActived ? 'bg-text-3 text-white-1' : 'bg-gray-1  text-text-1'} rounded-md flex`}>
      <button
        type='button'
        disabled={isLoading}
        className='pl-4 w-full py-2 text-left text-sm'
        onClick={() => onClickRegionBtn(address)}
      >
        {isLoading ? <CgSpinner className='text-text-2  animate-spin w-5 h-5 m-[0_auto]' /> : address.split(' ')[2]}
      </button>
      <button type='button' className='py-2 pr-3' onClick={() => onClickDeleteBtn(address)}>
        <IoCloseOutline />
      </button>
    </div>
  );
}
