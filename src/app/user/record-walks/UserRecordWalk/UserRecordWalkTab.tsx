import { WalkRole } from '@/types/walk';

interface UserRecordWalkTabProps {
  selectedRole: WalkRole;
  onClick: (role: WalkRole) => void;
}

function UserRecordWalkTab({ selectedRole, onClick }: UserRecordWalkTabProps) {
  return (
    <ul className='flex'>
      {Object.keys(WalkRole).map(role => (
        <li
          className={`flex-1 ${
            selectedRole === role ? 'border-b border-b-text-1 text-text-1' : 'border-b border-b-gray-2 text-text-2'
          }`}
          key={role}
        >
          <button type='button' className='w-full h-12 font-semibold text-xs' onClick={() => onClick(role as WalkRole)}>
            {role === WalkRole.PetOwner && '내 반려동물 기록'}
            {role === WalkRole.PetSitterWalker && '펫시터 기록'}
          </button>
        </li>
      ))}
    </ul>
  );
}
export default UserRecordWalkTab;
