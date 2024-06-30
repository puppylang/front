export interface UserRegion {
  id: number;
  region: string;
  user_id: string;
  created_at: string;
}

export interface ActivedRegion {
  region_id: number;
  user_id: string;
  created_at: string;
}

export interface Region {
  status: 'OK' | 'NOT_FOUND';
  regions: {
    id: string;
    title: string;
    geometry: string;
    point: { x: string; y: string };
  }[];
}
