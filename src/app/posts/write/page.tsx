'use client';

import { useState } from 'react';

import useNativeRouter from '@/hooks/useNativeRouter';
import { createPost } from '@/services/post';
import { useUserQuery } from '@/services/user';
import { Post } from '@/types/post';

import Loading from '@/components/Loading';
import PostEditor from '@/components/PostEditor';

function PostWrite() {
  const router = useNativeRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useUserQuery();

  const handleSubmit = (postData: Post) => {
    if (!user) {
      // 게시글은 로그인 후 작성이 가능합니다.
      return;
    }

    setIsLoading(true);

    createPost(postData)
      .then(res => {
        if (res) router.push('/posts', { webviewPushPage: 'home' });
      })
      .catch((err: Error) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section id='post-write-editor' className=''>
      <h2 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>게시글 작성</h2>

      <PostEditor onSubmit={handleSubmit} />

      {isLoading && <Loading />}
    </section>
  );
}

export default PostWrite;
