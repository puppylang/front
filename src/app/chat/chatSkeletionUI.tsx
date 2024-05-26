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
    <div>
      <div className='animate-pulse grid grid-cols-[90px_1fr] h-20 p-2'>
        <div className='relative'>
          <div className='absolute rounded-full top-0 left-2 w-[2.3rem] h-[2.3rem] bg-gray-200' />
          <div className='rounded-full bg-gray-200 absolute right-4 bottom-0 p-2 w-[50px] h-[50px]' />
        </div>
        <div className='flex flex-col px-2 justify-center'>
          <div className='w-[40%] h-5 bg-gray-200 mb-1' />
          <div className='w-[60%] h-5 bg-gray-200' />
        </div>
      </div>
    </div>
  );
}
