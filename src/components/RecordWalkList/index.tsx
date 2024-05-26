import { WalkForm, WalkRole } from '@/types/walk';

import RecordWalkItem from './RecordWalkItem';

interface RecordWalkList {
  walkList: WalkForm[];
  role: WalkRole;
}

function RecordWalkList({ walkList, ...props }: RecordWalkList) {
  return (
    <ul className='flex flex-col gap-y-2'>
      {walkList.map(walk => (
        <RecordWalkItem key={walk.id} walk={walk} {...props} className='border-b-[1px] border-gray-3' />
      ))}
    </ul>
  );
}

export default RecordWalkList;
