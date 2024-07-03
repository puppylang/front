'use client';

import { HeaderNavigation } from '@/components/HeaderNavigation';

function UserSubmittedPosts() {
  return (
    <section id='submitted-posts' className='flex flex-col items-center'>
      <HeaderNavigation.Container>
        <HeaderNavigation.Title text='산책 신청목록' />
      </HeaderNavigation.Container>
    </section>
  );
}

export default UserSubmittedPosts;
