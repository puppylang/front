import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

import { UserType } from '@/types/user';
import { formatDateTime } from '@/utils/date';

import { IconUserDefault } from '../../../public/assets/svgs';

interface PostTopInfoProps {
  date: string;
  title: string;
  author?: UserType;
  children?: ReactNode;
}

function PostTopInfo({ date, title, author, children }: PostTopInfoProps) {
  return (
    <div>
      <span className='text-[10px] text-text-2 font-light px-4'>{date}</span>

      <div className='flex justify-between items-center gap-x-2 px-4'>
        <div className='post-title-and-user-info flex flex-col items-start gap-y-2 '>
          <h3 className='post-title text-lg font-medium text-text-1'>{title}</h3>

          {author && (
            <div className='user-info flex items-center gap-x-2'>
              <Link href={`/user/${author.id}`}>
                <div className='flex justify-center items-center rounded-full overflow-hidden bg-gray-3 w-8 h-8'>
                  {author.image ? (
                    <Image
                      width={32}
                      height={32}
                      src={author.image}
                      alt={`${author.name}프로필이미지`}
                      className='object-cover'
                    />
                  ) : (
                    <IconUserDefault width='18px' height='18px' />
                  )}
                </div>
              </Link>
              <Link href={`/user/${author.id}`}>
                <span className='user-name text-xs text-text-1'>{author.name}</span>
              </Link>
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

function PostContent({ content }: { content: string }) {
  return (
    <div className='post-content border-t-[1px] border-gray-4 p-4 mt-4'>
      <p className='text-sm text-text-1 whitespace-pre-wrap'>{content}</p>
    </div>
  );
}

interface PostWalkInfoItemProps {
  title: string;
  description: string | null;
  type: 'TEXT' | 'DATE';
  className?: string;
}

function PostWalkInfoItem({ title, description, type = 'TEXT', className }: PostWalkInfoItemProps) {
  const formattedDescription = type === 'DATE' && description ? formatDateTime(description) : description;

  return (
    <li className={`border-b-[1px] border-gray-3 py-3 ${className}`}>
      <dl className='flex items-center'>
        <dt className='text-xs font-light text-text-3 min-w-[100px]'>{title}</dt>
        <dd className='grow shrink basis-[0%] text-center text-sm font-light text-text-1'>
          <span>{formattedDescription}</span>
        </dd>
      </dl>
    </li>
  );
}

function PostWalkCautionItem({ index, content }: { index: number; content: string }) {
  return (
    <li className='flex items-start gap-x-1 text-sm font-light text-text-1'>
      <span>{`${index}.`}</span>
      <span>{content}</span>
    </li>
  );
}

export const PostInfo = {
  Top: PostTopInfo,
  Content: PostContent,
  WalkItem: PostWalkInfoItem,
  CautionItem: PostWalkCautionItem,
};
