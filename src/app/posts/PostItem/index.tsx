import { Gender } from '@/types/pet';
import { Post, PostStatus } from '@/types/post';
import { formatAge, formatDate } from '@/utils/date';

import NativeLink from '@/components/NativeLink';
import PetProfile from '@/components/PetProfile';
import PostStatusBadge from '@/components/PostStatusBadge';

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  return (
    <li className='bg-white rounded-[10px] shadow-[0_2px_4px_0_rgba(76,76,76,0.1)]'>
      <NativeLink href={`/posts/${post.id}`} className='flex flex-row justify-between gap-x-3 p-4'>
        {post.pet && <PetProfile pet={post.pet} width={80} height={80} minW={80} />}

        <div className='post-info flex flex-col gap-y-2 w-full'>
          <p className='text-base text-text-1 line-clamp-1'>{post.title}</p>

          {post.pet && (
            <p className='flex items-center gap-x-3 text-sm text-text-2 font-light'>
              <span>{post.pet.breed}</span>

              {post.pet.gender && (
                <span
                  className="relative after:content-[''] after:absolute after:top-[55%] after:left-[-8px] after:translate-x-[50%]
                after:translate-y-[-50%] after:w-[1px] after:h-[12px] after:bg-text-2"
                >
                  {post.pet.gender === Gender.Female ? '암컷' : '수컷'}
                </span>
              )}

              {post.pet.birthday && (
                <span className="relative after:content-[''] after:absolute after:top-[55%] after:left-[-8px] after:translate-x-[50%] after:translate-y-[-50%] after:w-[1px] after:h-[12px] after:bg-text-2">
                  {formatAge(post.pet.birthday)}
                </span>
              )}
            </p>
          )}

          <span className='text-xs text-text-2 font-light'>{post.created_at && formatDate(post.created_at)}</span>
        </div>

        <div className='active-button-container flex flex-col justify-between'>
          <PostStatusBadge status={post.status as PostStatus} />
        </div>
      </NativeLink>
    </li>
  );
}
