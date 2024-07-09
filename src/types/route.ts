import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface WebviewRequestType {
  type: WebviewActionType;

  url?: string;
  isStack?: boolean;
  webviewPushPage?: string;
  token?: string;
}

export enum WebviewActionType {
  Push = 'push',
  Replace = 'replace',
  Back = 'back',
  UpdateToken = 'updateToken',
}

export interface CustomNavigateOptions extends NavigateOptions {
  isStack?: boolean;
  webviewPushPage?: string;
  token?: string;
}

export interface DynamicParamTypes {
  params: {
    id: string;
  };
}

export enum StackPushRoute {
  Login = 'index',
  Posts = '(tabs)',
  Chat = 'chat',
  Walk = 'walk',
  User = 'user',
}
