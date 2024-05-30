import PetCardSkeletonUI from './PetCardSkeletonUI';

function UserProfile() {
  return (
    <div className='animate-pulse flex items-center gap-x-4'>
      <div className='w-[60px] h-[60px] rounded-full bg-bg-blue' />
      <div className='flex flex-col gap-y-2'>
        <div className='w-[80px] h-4 rounded-[10px] bg-bg-blue' />
        <div className='w-[160px] h-4 rounded-[10px] bg-bg-blue' />
      </div>
    </div>
  );
}

function UserPet() {
  return (
    <div className='animate-pulse flex flex-col gap-y-4 '>
      <div className='w-[100px] h-4 rounded-[10px] bg-bg-blue' />
      <PetCardSkeletonUI bgColor='bg-bg-blue' />
    </div>
  );
}

function UserActivity() {
  return (
    <div className='animate-pulse flex flex-col gap-y-4 '>
      <div className='w-[100px] h-4 rounded-[10px] bg-bg-blue' />
      <div className='w-full h-20 rounded-[10px] bg-bg-blue' />
    </div>
  );
}
export const UserSkeleton = {
  Profile: UserProfile,
  Pet: UserPet,
  Activity: UserActivity,
};
