import { Dispatch, SetStateAction, useState } from 'react';

import { getIsExistedUserName } from '@/services/user';

interface UserNameInputProps {
  value: string;
  onChange: (value: string) => void;
  setIsInvalidName: Dispatch<SetStateAction<boolean>>;
  currentUserName?: string;
}

export default function UserNameInput({ value, onChange, setIsInvalidName, currentUserName }: UserNameInputProps) {
  const [errorText, setErrorText] = useState('');

  const checkUserName = async (value: string) => {
    if (value.length <= 1 || value.length >= 11) {
      setErrorText('이름은 2~10자로 입력해주세요.');
      setIsInvalidName(true);
      return;
    }

    if (currentUserName === value) {
      setIsInvalidName(false);
      setErrorText('');
      return;
    }

    const isExistedName = await getIsExistedUserName(value);
    if (isExistedName) {
      setErrorText('다른 사람이 사용하고 있어요.');
      setIsInvalidName(true);
      return;
    }

    setIsInvalidName(false);
    setErrorText('');
  };

  return (
    <div className='mb-6'>
      <div className='flex text-text-3 text-[12px] mb-1 items-center relative'>
        <p className='mr-[1px]'>*</p>
        <p>이름</p>
        <p className='absolute right-0'>{value ? value.length : 0} / 10</p>
      </div>
      <input
        className={`px-[14px] py-[10px] rounded-[15px] block border border-gray-3 w-full text-[14px] ${
          errorText && 'border-red-500'
        }`}
        type='text'
        minLength={2}
        maxLength={10}
        value={value}
        onKeyUp={({ currentTarget }) => checkUserName(currentTarget.value)}
        onBlur={({ currentTarget }) => checkUserName(currentTarget.value)}
        onChange={({ currentTarget }) => onChange(currentTarget.value)}
      />
      {errorText && <p className='text-[12px] text-red-500'>{errorText}</p>}
    </div>
  );
}
