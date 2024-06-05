import { Gender } from './pet';

export interface UserFormType {
  email: string;
  name: string;
  password: string;
  gender: string;
  phone_number: string;
  birthday: string;
}

export interface UserType {
  id: string;
  name: string;
  image: string | null;
  logged_from: LoggedFrom;
  is_first_login: boolean;
  gender: Gender | null;
  birthday: string | null;
  character: string | null;
  region: string[];
  actived_region?: string;
}

export interface UserResponseType {
  is_first_login: boolean;
  token: string;
}

export enum LoggedFrom {
  Kakao = 'KAKAO',
  Naver = 'NAVER',
  Apple = 'APPLE',
}

export interface UserDeleteErrorType extends Error {
  name: string;
  message: string;
  stack?: string | undefined;
  response: {
    status: number;
  };
}

export class UserDeleteError implements UserDeleteErrorType {
  name: string;

  message: string;

  response: {
    status: number;
  };

  constructor(message: string, status: number) {
    this.name = 'UserDeleteError';
    this.message = message;
    this.response = {
      status,
    };
  }
}

export interface RegionType {
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

export interface UserEditForm {
  id: string;
  name: string;
  gender: Gender | null;
  birthday: string | null;
  character: string | null;
  image: string | null;
}
