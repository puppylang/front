import { ReactNode } from 'react';

interface WalkSuccessSkeletonUIProps {
  children: ReactNode;
}

function WalkSuccessSkeletonUI({ children }: WalkSuccessSkeletonUIProps) {
  return (
    <div className='flex flex-col'>
      {children}
      <div className='animate-pulse bg-bg-blue h-[35px] mt-4 rounded-[10px]' />
      <ul className='flex items-center mt-4 gap-x-2'>
        <li className='animate-pulse bg-bg-blue flex-1 h-[50px] rounded-[10px]' />
        <li className='animate-pulse bg-bg-blue flex-1 h-[50px] rounded-[10px]' />
      </ul>
      <div className='animate-pulse mt-4 bg-bg-blue w-full h-[300px] rounded-[10px]' />
    </div>
  );
}
export default WalkSuccessSkeletonUI;
