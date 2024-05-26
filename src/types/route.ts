import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface WebviewRouter {
  type: RouterMethod;

  url?: string;
  isStack?: boolean;
  webviewPushPage?: string;
}

export enum RouterMethod {
  Push = 'push',
  Replace = 'replace',
  Back = 'back',
}

export interface CustomNavigateOptions extends NavigateOptions {
  isStack?: boolean;
  webviewPushPage?: string;
}

export interface DynamicParamTypes {
  params: {
    id: string;
  };
}
