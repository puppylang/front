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
  address: {
    address_name: string;
    b_code: string;
    h_code: string;
    main_address_no: string;
    mountain_yn: 'N';
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_h_name: string;
    region_3depth_name: string;
    sub_address_no: string;
    x: string;
    y: string;
  } | null;
  address_name: string;
  address_type: string;
  road_address: {
    address_name: string;
    building_name: string;
    main_building_no: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    sub_building_no: string;
    underground_yn: string;
    x: string;
    y: string;
    zone_no: string;
  } | null;
  x: string;
  y: string;
}
