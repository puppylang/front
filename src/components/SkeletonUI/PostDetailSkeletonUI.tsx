import PetCardSkeletonUI from './PetCardSkeletonUI';

function PostDetailSkeletonUI() {
  return (
    <div className='flex flex-col items-center min-h-[100vh] animate-pulse'>
      <div className='container'>
        <div className='p-4 bg-white min-h-[150px]'>
          <div className='w-[65px] h-3 rounded-[10px] bg-bg-blue' />
          <div className='rounded-[10px] bg-bg-blue h-7 mt-2' />

          <div className='flex items-center gap-x-2 mt-2'>
            <div className='rounded-full bg-bg-blue w-8 h-8' />
            <div className='rounded-[10px] bg-bg-blue h-8 w-[110px] ' />
          </div>
          <div className='rounded-[10px] bg-bg-blue h-[1px] mt-4' />
          <div className='rounded-[10px] bg-bg-blue h-[150px] mt-4' />
        </div>

        <div className='p-4 bg-white min-h-[300px] mt-8'>
          <div className='rounded-[10px] bg-bg-blue h-7 w-[150px] mb-4' />
          <PetCardSkeletonUI bgColor='bg-bg-blue' />

          <div className='rounded-[10px] bg-bg-blue h-7 w-[150px] mt-4' />
          <ul className='flex flex-col gap-y-3 mt-4'>
            <li className='bg-bg-blue rounded-[10px] h-5' />
            <li className='bg-bg-blue rounded-[10px] h-5' />
            <li className='bg-bg-blue rounded-[10px] h-5' />
          </ul>
        </div>
      </div>
    </div>
  );
}
export default PostDetailSkeletonUI;
