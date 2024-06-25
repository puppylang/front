import { SheetButton } from '@/components/BottomSheet';
import NativeLink from '@/components/NativeLink';
import { TopSheet } from '@/components/TopSheet';

interface UserActivedRegionSheetProps {
  isOpen: boolean;

  regions: string[];
  activedRegion: string | undefined;
  onClick: (address: string) => void;
  onClose: () => void;
}

function UserActivedRegionSheet({ isOpen, regions, activedRegion, onClick, onClose }: UserActivedRegionSheetProps) {
  return (
    <TopSheet isOpen={isOpen} onClose={onClose} className='top-14 text-left'>
      {regions.map(region => (
        <SheetButton
          key={region}
          onClick={() => onClick(region)}
          className={`px-4 text-left ${activedRegion === region ? 'text-main-1' : 'text-text-2 '}`}
        >
          {region.split(' ')[2]}
        </SheetButton>
      ))}
      <NativeLink href='/user/region' className='py-[10px] px-4 text-text-2 border-b-[1px]'>
        동네 설정
      </NativeLink>
    </TopSheet>
  );
}

export default UserActivedRegionSheet;
