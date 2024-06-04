'use client';

import { useState } from 'react';
import { IoSearch, IoCloseCircle } from 'react-icons/io5';

import { DogBreed } from '@/types/pet';

const PUPULAR_DOG_BREED = [
  DogBreed.말티즈,
  DogBreed.푸들,
  DogBreed.포메라니언,
  DogBreed.치와와,
  DogBreed.골든_리트리버,
  DogBreed.시츄,
  DogBreed.진돗개,
  DogBreed.비숑_프리제,
];

interface BreedProps {
  onClick: (value: string) => void;
}

export default function Breed({ onClick }: BreedProps) {
  const [value, setValue] = useState('');
  const filteredBreed = Object.values(DogBreed).filter(breed => {
    return breed.includes(value.replace(/\s/g, '_'));
  });

  return (
    <section>
      <div className='flex items-center relative mx-4 py-4'>
        <IoSearch color='#E5E5E5' className='absolute left-2.5' />
        <input
          className='border border-gray-1 w-full rounded-md px-8 py-1.5 text-[15px] text-text-1'
          type='text'
          placeholder='견종을 입력해 주세요.'
          value={value}
          onChange={({ target }) => setValue(target.value)}
        />
        <button type='button' className='absolute right-3' onClick={() => setValue('')}>
          <IoCloseCircle color='#E5E5E5' />
        </button>
      </div>
      <ul className='mx-4'>
        {value !== '' && filteredBreed.map(dog => <BreedList onClick={onClick} key={dog} breed={dog} value={value} />)}
        {value === '' &&
          PUPULAR_DOG_BREED.map(dog => <BreedList onClick={onClick} key={dog} breed={dog} value={value} />)}
      </ul>
    </section>
  );
}

interface BreedListProps {
  breed: DogBreed;
  value: string;
  onClick: (value: string) => void;
}

function BreedList({ breed, value, onClick }: BreedListProps) {
  const replaceBreedName = breed.replace(/_/g, ' ').split('');
  const arrayValue = value.split('');

  return (
    <li>
      <button
        type='button'
        className='block border-b border-gray-1 py-2 text-[14px] w-full text-left'
        onClick={() => onClick(breed)}
      >
        {replaceBreedName.map((text, index) => {
          return (
            <span key={index} className={`${arrayValue.includes(text) ? 'text-main-1' : 'text-text-1'}`}>
              {text}
            </span>
          );
        })}
      </button>
    </li>
  );
}
