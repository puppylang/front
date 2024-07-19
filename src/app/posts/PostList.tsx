import { Post } from '@/types/post';

import { PostSection } from '@/components/Post';

function PostList({ posts }: { posts: Post[] }) {
  return posts?.length > 0 ? (
    <PostSection.List
      posts={posts}
      className='animation-load'
      itemClassName='shadow-[0_2px_4px_0_rgba(76,76,76,0.1)]'
    />
  ) : (
    <div className='flex justify-center items-center h-[300px] animation-show'>
      <p className='text-text-2'>등록된 구인 게시글이 없습니다.</p>
    </div>
  );
}

export default PostList;
