'use client';

import { ChangeEvent, useState } from 'react';

import { Caution } from '@/types/post';

import { IconCheck, IconEdit, IconTrash } from '../../../../public/assets/svgs';

interface CautionsProps {
  defaultValue?: Caution[];
  onChange: (cautions: Caution[]) => void;
}

export function Cautions({ defaultValue, onChange }: CautionsProps) {
  const [addCaution, setAddCaution] = useState('');
  const [cautions, setCautions] = useState<Caution[]>(defaultValue || []);

  const handleChangeAddCaution = (e: ChangeEvent<HTMLInputElement>) => setAddCaution(e.currentTarget.value);
  const handleAddCaution = () => {
    if (!addCaution.trim().length) {
      return console.log('빈문자열');
    }
    if (cautions.length >= 3) {
      return console.log('END!');
    }

    setCautions(prev => {
      onChange([...prev, { id: null, content: addCaution, is_completed: false }]);
      return [...prev, { id: null, content: addCaution, is_completed: false }];
    });
    setAddCaution('');
  };

  const handleChangeCaution = (idx: number, content: string) => {
    const target = cautions[idx];
    const editedCaution = { ...target, content };
    const copiedCautions = [...cautions];
    copiedCautions.splice(idx, 1, editedCaution);

    setCautions(copiedCautions);
    onChange(copiedCautions);
  };

  const handleDeleteCaution = (idx: number) => {
    const copiedCautions = [...cautions];
    copiedCautions.splice(idx, 1);

    setCautions(copiedCautions);
    onChange(copiedCautions);
  };

  return (
    <div className='caution-container'>
      <div className='add-caution-container flex gap-x-2'>
        <input
          type='text'
          value={addCaution}
          placeholder='예시) 간식 2번만 주기'
          className='w-[calc(100%_-_80px)] h-10 text-sm px-4 pt-2 pb-[10px] text-sm text-text-1 border-[1px] border-gray-3 rounded-[10px] placeholder:text-xs'
          onChange={handleChangeAddCaution}
        />
        <button
          type='button'
          className='w-20 h-10 rounded-[10px] text-sm font-light text-text-2 border-[1px] border-gray-3 bg-gray-3'
          onClick={handleAddCaution}
        >
          추가
        </button>
      </div>

      <ul className='flex flex-col gap-y-2 mt-4'>
        {cautions.map((caution, index) => (
          <CautionInputItem
            key={caution.content}
            value={caution.content}
            onEdit={content => handleChangeCaution(index, content)}
            onDelete={() => handleDeleteCaution(index)}
          />
        ))}
      </ul>
    </div>
  );
}

interface CautionInputItemProps {
  value: string;
  onEdit: (value: string) => void;
  onDelete: () => void;
}

export function CautionInputItem({ value, onEdit, onDelete }: CautionInputItemProps) {
  const [content, setContent] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => setContent(e.currentTarget.value);

  const handleClickEdit = () => {
    setIsEditing(prev => !prev);

    if (isEditing) {
      onEdit(content);
    }
  };

  return (
    <li className='flex gap-x-2'>
      {isEditing ? (
        <input
          type='text'
          value={content}
          className='w-full min-h-10 text-sm px-4 pt-[10px] pb-3 leading-[18px] border-[1px] border-gray-3 rounded-[5px]'
          onChange={handleOnChange}
        />
      ) : (
        <p className='w-full min-h-10 text-sm px-4 pt-[10px] pb-3 leading-[18px] border-[1px] border-gray-3 rounded-[5px]'>
          {content}
        </p>
      )}
      <div className='button-container flex w-20 h-10 border-[1px] border-gray-3 bg-white rounded-[10px] '>
        <button type='button' className='flex items-center justify-center w-10' onClick={handleClickEdit}>
          {isEditing ? <IconCheck className='stroke-main-2' /> : <IconEdit />}
        </button>
        <button
          type='button'
          className='flex items-center justify-center w-10 border-l-[1px] border-gray-3'
          onClick={onDelete}
        >
          <IconTrash />
        </button>
      </div>
    </li>
  );
}
