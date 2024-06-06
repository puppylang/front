import { UserSkeleton } from './UserSkeleton';
import { Section } from '../Section';

function MyPageSkeleton() {
  return (
    <section id='my-page-container' className='flex flex-col items-center'>
      <Section.Container className='bg-white'>
        <UserSkeleton.Profile />
        <div className='mt-4'>
          <UserSkeleton.Pet />
        </div>
        <div>
          <UserSkeleton.Activity />
          <div className='flex flex-col gap-y-4 mt-4 animate-pulse'>
            <div className='w-full h-9 rounded-[10px] bg-bg-blue' />
            <div className='w-full h-9 rounded-[10px] bg-bg-blue' />
            <div className='w-full h-9 rounded-[10px] bg-bg-blue' />
            <div className='w-full h-9 rounded-[10px] bg-bg-blue' />
          </div>
        </div>
      </Section.Container>
    </section>
  );
}

export default MyPageSkeleton;
