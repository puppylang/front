const DivLength = 3;

function PostListSkeletonUI() {
  return (
    <div className='animate-pulse'>
      <ul className='flex flex-col gap-4 w-full'>
        {Array.from({ length: DivLength }, (v, i) => i).map(el => (
          <li key={el} className='bg-white rounded-[10px] h-[110px]' />
        ))}
      </ul>
    </div>
  );
}

export default PostListSkeletonUI;
