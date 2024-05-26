'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { usePostDetailQuery, useUpdatePost } from '@/services/post';
import { Post } from '@/types/post';

import Loading from '@/components/Loading';
import PostEditor from '@/components/PostEditor';

interface PostEditProps {
  params: {
    id: string;
  };
}

export default function PostEdit({ params: { id } }: PostEditProps) {
  const { data: postData, isLoading } = usePostDetailQuery(id);
  const updatePostMutation = useUpdatePost(id);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleSubmit = (postData: Post) => {
    setIsEditing(true);
    updatePostMutation.mutate({ id, postData });
  };

  useEffect(() => {
    if (updatePostMutation.isSuccess) {
      setIsEditing(false);
      router.push(`/posts/${id}`);
    }
  }, [id, router, updatePostMutation.isSuccess]);

  return (
    <section id='post-edit-editor'>
      <h2 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>게시글 수정</h2>

      <PostEditor defaultValue={postData} onSubmit={handleSubmit} />

      {(isLoading || isEditing) && <Loading />}
    </section>
  );
}
