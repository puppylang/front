import { Gender } from './pet';
import { BlockerType } from './report';

export interface UserType {
  id: string;
  name: string;
  image: string | null;
  logged_from: LoggedFrom;
  is_first_login: boolean;
  gender: Gender | null;
  birthday: string | null;
  character: string | null;
  blocker: BlockerType[];
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

export interface UserEditForm {
  id: string;
  name: string;
  gender: Gender | null;
  birthday: string | null;
  character: string | null;
  image: string | null;
}
