import { Swiper, SwiperSlide } from 'swiper/react';

import { Gender } from '@/types/pet';
import { PostStatus, Post as PostType } from '@/types/post';
import { formatAge, formatDate } from '@/utils/date';

import NativeLink from '../NativeLink';
import PostStatusBadge from '../PostStatusBadge';
import { Profile } from '../Profile';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../PetCardList/styles.css';

interface PostProps {
  posts: PostType[];
  className?: string;
  itemClassName?: string;
}

function PostList({ posts, className, itemClassName }: PostProps) {
  return (
    <ul className={`post-list flex flex-col gap-4 ${className || ''}`}>
      {posts?.map(post => <PostItem key={post.id} post={post} className={itemClassName} />)}
    </ul>
  );
}

type PostItemType = 'LINK' | 'BUTTON';

interface PostSlideProps {
  posts: PostType[];
  type?: PostItemType;
  onClick: (idx: number) => void;
  className?: string;
}

function PostSlide({ posts, type = 'LINK', onClick, className }: PostSlideProps) {
  return (
    <Swiper
      loop={false}
      spaceBetween={50}
      navigation={false}
      pagination={{ type: 'bullets' }}
      className='!pb-[26px]'
      onClick={swiper => onClick(swiper.activeIndex)}
    >
      {posts.map(post => (
        <SwiperSlide key={post.id}>
          <PostItem post={post} type={type} className={className} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

interface PostItemProps {
  post: PostType;
  type?: PostItemType;
  className?: string;
}

function PostItem({ type = 'LINK', className, ...props }: PostItemProps) {
  return (
    <li className={`bg-white rounded-[10px] ${className || ''}`}>
      {type === 'LINK' ? (
        <NativeLink href={`/posts/${props.post.id}`} className='flex flex-row justify-between gap-x-3 p-4'>
          <PostItemContent {...props} />
        </NativeLink>
      ) : (
        <div className='flex flex-row justify-between gap-x-3 p-4'>
          <PostItemContent {...props} />
        </div>
      )}
    </li>
  );
}

interface PostItemContentProps {
  post: PostType;
}

function PostItemContent({ post }: PostItemContentProps) {
  return (
    <>
      {post.pet && <Profile.Pet pet={post.pet} width={80} height={80} minW={80} />}

      <div className='post-info flex flex-col gap-y-2 w-full'>
        <p className='text-base text-text-1 line-clamp-1'>{post.title}</p>

        {post.pet && (
          <p className='flex items-center gap-x-3 text-sm text-text-2 font-light'>
            <span>{post.pet.breed}</span>

            {post.pet.gender && (
              <span
                className="relative after:content-[''] after:absolute after:top-[52%] after:left-[-8px] after:translate-x-[50%]
          after:translate-y-[-50%] after:w-[1px] after:h-[10px] after:bg-text-2"
              >
                {post.pet.gender === Gender.Female ? '암컷' : '수컷'}
              </span>
            )}

            {post.pet.birthday && (
              <span className="relative after:content-[''] after:absolute after:top-[52%] after:left-[-8px] after:translate-x-[50%] after:translate-y-[-50%] after:w-[1px] after:h-[10px] after:bg-text-2">
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
    </>
  );
}

export const PostSection = {
  List: PostList,
  Slide: PostSlide,
  Item: PostItem,
};
