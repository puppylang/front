import { UserSkeleton } from './UserSkeleton';
import { Section } from '../Section';

function UserProfileSkeleton() {
  return (
    <section id='user-info-container' className='flex flex-col items-center'>
      <Section.Container className='bg-white'>
        <UserSkeleton.Profile />
        <div className='mt-4'>
          <UserSkeleton.Pet />
        </div>

        <UserSkeleton.Activity />
      </Section.Container>
    </section>
  );
}

export default UserProfileSkeleton;
