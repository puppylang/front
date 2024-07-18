'use client';

import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

import { uploadImage } from '@/services/image';

interface ImageUploadProps {
  onChangeFileInput: (url: string) => void;
  defaultURL?: string;
  disabled?: boolean;
}

export default function ImageUpload({ defaultURL, onChangeFileInput, disabled }: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const imageUploadRef = useRef<HTMLInputElement>(null);

  const onChangeImageInput = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const { files } = event.currentTarget;
    if (!files) return;
    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', file.name);
    const response = await uploadImage(formData);

    onChangeFileInput(response);
    setUploadedImage(response);
    setIsLoading(false);
  };

  useEffect(() => {
    if (defaultURL && !uploadedImage) {
      setUploadedImage(defaultURL);
    }
  }, [defaultURL]);

  return (
    <>
      <input
        className='hidden'
        id='imageUpload'
        type='file'
        ref={imageUploadRef}
        onChange={onChangeImageInput}
        accept='image/*'
        disabled={disabled}
      />

      {uploadedImage && !isLoading && (
        <div className='w-[120px] h-[120px] rounded-full bg-gray-3 flex items-center justify-center relative'>
          <div className='overflow-hidden w-full h-full rounded-full'>
            <Image
              src={uploadedImage}
              alt={uploadedImage}
              width={120}
              height={120}
              className='w-[120px] h-[120px] object-cover'
            />
          </div>
          <button
            onClick={() => imageUploadRef.current?.click()}
            type='button'
            className='absolute bottom-[10px] right-[-2px] z-10 w-[30px] h-[30px] bg-gray-200 rounded-full flex justify-center items-center'
          >
            <AiOutlineCamera className='w-[21px] h-[21px] text-white-1' />
          </button>
        </div>
      )}
      {isLoading && (
        <div className='w-[120px] h-[120px] rounded-full bg-gray-3 flex items-center justify-center relative'>
          <div className='flex gap-x-3'>
            {Array.from({ length: 3 }, (_, i) => i).map(div => (
              <div key={div} className={`relative w-2 h-2 bg-main-1 rounded-full animate-ping duration-700 `} />
            ))}
          </div>
        </div>
      )}
      {!uploadedImage && !isLoading && (
        <button
          onClick={() => imageUploadRef.current?.click()}
          type='button'
          className='h-[120px] w-[120px] bg-gray-3 rounded-full flex items-center justify-center '
        >
          <FaPlus className='text-text-2' />
        </button>
      )}
    </>
  );
}
