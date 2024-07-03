'use client';

import UserProfileSkeleton from '@/components/SkeletonUI/UserProfileSkeleton';
import { usePetQuery } from '@/services/pet';
import { StackPushRoute } from '@/types/route';

import { HeaderNavigation } from '@/components/HeaderNavigation';
import NativeLink from '@/components/NativeLink';
import { PetCardList } from '@/components/PetCardList';
import { Profile } from '@/components/Profile';
import { Section } from '@/components/Section';
import UserActivity from '@/components/UserActivity';
import UserPostList from '@/components/UserPostList';

import { useOthersQuery, useRecordWalkCount, useRecordWalkDistance } from '../../../services/user';

interface UserProfileProps {
  id: string;
}

export default function UserProfile({ id }: UserProfileProps) {
  const { data: user, isLoading } = useOthersQuery(id);
  const { data: pets } = usePetQuery(id);
  const { data: recordWalks } = useRecordWalkCount(id);
  const { data: totalDistance } = useRecordWalkDistance(id);

  if (isLoading) return <UserProfileSkeleton />;

  return user ? (
    <>
      <HeaderNavigation.Container>
        <HeaderNavigation.Title text='프로필' />
      </HeaderNavigation.Container>
      <section id='user-info-container' className='flex flex-col items-center animation-show'>
        <Section.Container className='bg-white'>
          <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>퍼피랑 사용자 프로필 화면</h1>

          <div className='flex items-center gap-x-4'>
            <div className='image-container'>
              <Profile.User image={user.image || ''} defaultUserImageClassName='' />
            </div>

            <div className='user-info flex flex-col'>
              <h2 className='text-base font-semibold text-text-2'>
                <strong className='font-Jalnan text-main-3'>{user.name}</strong>님
              </h2>
              {user.character && <p className='text-sm text-text-1'>{user.character}</p>}
            </div>
          </div>
        </Section.Container>
      </section>

      <section id='pet-info-container' className='flex flex-col items-center animation-show'>
        <Section.Container className='bg-white border-t border-t-1 border-gray-3'>
          <Section.Title title='반려견 정보 🐾' />
          <PetCardList pets={pets} type='slide' />
        </Section.Container>
      </section>

      <section id='activity-info-container' className='flex flex-col items-center animation-show'>
        <Section.Container className='bg-white border-t border-t-1 border-gray-3'>
          <Section.Title title='활동' />
          <UserActivity totalDistance={totalDistance?.total_distance} walkCount={recordWalks} />
        </Section.Container>
      </section>

      <section id='post-info-container' className='flex flex-col items-center animation-show'>
        <Section.Container className='p-[0px] border-t border-t-1 border-gray-3'>
          <Section.Title title='작성한 글' className='bg-white mb-[0px] p-4' />
          <UserPostList authorId={id} />
        </Section.Container>
      </section>
    </>
  ) : (
    <section id='user' className='animation-show'>
      <Section.Container className='bg-white flex flex-col gap-y-4 items-center justify-center min-h-[100vh]'>
        <h2 className='font-Jalnan text-text-1'>해당 유저가 존재하지 않습니다.</h2>
        <NativeLink
          href='/posts'
          webviewPushPage={StackPushRoute.Posts}
          className='bg-main-2 text-white text-sm px-6 py-2 rounded-[10px]'
        >
          홈으로 가기
        </NativeLink>
      </Section.Container>
    </section>
  );
}
