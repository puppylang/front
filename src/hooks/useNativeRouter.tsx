import { useRouter } from 'next/navigation';

import { CustomNavigateOptions, WebviewActionType, WebviewRequestType } from '@/types/route';

export default function useNativeRouter() {
  const router = useRouter();

  const sendMessageToWebview = (message: WebviewRequestType) => {
    const { type, url, isStack, webviewPushPage, token } = message;
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, url, isStack, pushPage: webviewPushPage, token }));
  };

  const nativeRouter = (href: string, options?: CustomNavigateOptions) => {
    if (window.ReactNativeWebView) {
      sendMessageToWebview({
        type: WebviewActionType.Push,
        url: href,
        isStack: options?.isStack,
        webviewPushPage: options?.webviewPushPage,
        token: options?.token,
      });
      return;
    }
    router.push(href, options);
  };

  const nativeReplace = (href: string, options?: CustomNavigateOptions) => {
    if (window.ReactNativeWebView) {
      sendMessageToWebview({
        type: WebviewActionType.Replace,
        url: href,
        isStack: options?.isStack,
        webviewPushPage: options?.webviewPushPage,
        token: options?.token,
      });

      return;
    }
    router.replace(href, options);
  };

  const nativeBack = () => {
    if (window.ReactNativeWebView) {
      sendMessageToWebview({
        type: WebviewActionType.Back,
      });
      return;
    }
    router.back();
  };

  return { ...router, push: nativeRouter, replace: nativeReplace, back: nativeBack };
}
