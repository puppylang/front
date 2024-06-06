interface PetCardSkeletonUIProps {
  bgColor?: string;
}

function PetCardSkeletonUI({ bgColor = 'bg-white' }: PetCardSkeletonUIProps) {
  return <div className={`animate-pulse rounded-[10px] ${bgColor} h-[112px] mb-[26px]`} />;
}

export default PetCardSkeletonUI;
