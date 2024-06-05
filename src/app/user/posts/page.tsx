'use client';

import { useUserQuery } from '@/services/user';

import { HeaderNavigation } from '@/components/HeaderNavigation';
import Loading from '@/components/Loading';
import UserPostList from '@/components/UserPostList';

function UserPosts() {
  const { data: user } = useUserQuery();

  return (
    <section id='user-post' className='flex flex-col items-center '>
      <HeaderNavigation.Container>
        <HeaderNavigation.Title text='내 게시글' />
      </HeaderNavigation.Container>
      <div className='container'>
        <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>내 게시글</h1>

        {user ? <UserPostList authorId={user.id} /> : <Loading />}
      </div>
    </section>
  );
}
export default UserPosts;
