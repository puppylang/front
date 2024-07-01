import { Pet } from './pet';
import { UserRegion } from './region';
import { UserType } from './user';

export interface Schedule {
  start_at: string | null;
  end_at: string | null;
}

export interface Post extends Schedule {
  id: number | null;
  title: string;
  content: string;
  status: PostStatus;
  preferred_walk_location: string;
  proposed_fee: number;
  cautions: Caution[];
  author?: UserType;
  pet_id: number | null;
  pet: Pet | null;
  region_id?: null | number;
  region?: UserRegion;
  is_liked?: boolean;
  like_count?: number;
  view_count?: number;
  created_at: string | null;
  updated_at: string | null;
  is_matched?: boolean;
  matched_user_id?: string | null;
}

export interface Caution {
  id: number | null;
  content: string;
  is_completed?: boolean;
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

export const BOTTOM_NAVIGATION_HEIGHT = 68;

export type BottomSheetType = 'POST_UPDATE' | 'POST_STATUS_UPDATE' | 'POST_USER_BLOCK' | null;
