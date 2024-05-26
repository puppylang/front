import { Gender, Pet } from './pet';
import { UserType } from './user';

export interface Post {
  id: number | null;
  title: string;
  content: string;
  start_at: string | null;
  end_at: string | null;
  status: PostStatus;
  preferred_walk_location: string;
  proposed_fee: number;
  cautions: Caution[];
  author?: UserType;
  pet_id: number | null;
  pet: Pet | null;
  is_liked?: boolean;
  like_count?: number;
  view_count?: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface Caution {
  id: number | null;
  content: string;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export enum PostStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMING = 'COMING',
  FINISHED = 'FINISHED',
}

export interface PageParams {
  page?: number;
  size?: number;
}

export interface ResumeFormType {
  image: string;
  birth_year: string;
  introduction: string;
  phone_number: string;
  name: string | null;
  has_puppy: boolean | null;
  gender: Gender | null;
}

export type BottomSheetType = 'POST_UPDATE' | 'POST_STATUS_UPDATE' | null;
