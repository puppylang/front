'use client';

export function TabSkelectonUI() {
  return (
    <div className='relative animate-pulse grid grid-cols-2 border-b border-gray-200'>
      <div className='h-[3rem] ' />
      <div className='h-[3rem] ' />
    </div>
  );
}

export function ChatSkelectonUI() {
  return (
    <div className='animate-pulse flex flex-row gap-x-4 h-20 p-4'>
      <div className='rounded-full bg-gray-200 w-[50px] h-[50px]' />

      <div className='flex flex-col gap-y-2 justify-center w-[calc(100%-66px)]'>
        <div className='w-[60%] h-5 bg-gray-200 rounded-[4px]' />
        <div className='w-[80%] h-5 bg-gray-200 rounded-[4px]' />
      </div>
    </div>
  );
}
