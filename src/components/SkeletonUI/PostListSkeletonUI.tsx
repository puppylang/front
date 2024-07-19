import { UserSkeleton } from './UserSkeleton';
import { Section } from '../Section';

function PostContainerSkeletonUI({ bgColor = 'bg-white' }: { bgColor?: string }) {
  return (
    <div className='flex flex-col items-center'>
      <Section.Container>
        <UserSkeleton.Pet petBGColor={bgColor || ''} />

        <div className='mt-4'>
          <div className='flex justify-between items-center animate-pulse'>
            <div className={`animate-pulse w-[150px] h-4 rounded-[10px] mb-4 ${bgColor || ''}`} />
            <div className={`animate-pulse w-[100px] h-8 rounded-[10px] mb-4 ${bgColor || ''}`} />
          </div>
          <PostListSkeletonUI length={3} bgColor={bgColor || ''} />
        </div>
      </Section.Container>
    </div>
  );
}

function PostListSkeletonUI({ length = 3, bgColor = 'bg-white' }: { length?: number; bgColor?: string }) {
  return (
    <div className='animate-pulse'>
      <ul className='flex flex-col gap-4 w-full'>
        {Array.from({ length }, (_, i) => i).map(el => (
          <PostListItemSkeletonUI key={el} bgColor={bgColor} />
        ))}
      </ul>
    </div>
  );
}

function PostListItemSkeletonUI({ bgColor }: { bgColor?: string }) {
  return <li className={`animate-pulse list-none rounded-[10px] h-[110px] ${bgColor || ''}`} />;
}

export const PostSkeletonUI = {
  Container: PostContainerSkeletonUI,
  List: PostListSkeletonUI,
  Item: PostListItemSkeletonUI,
};
