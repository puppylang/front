import { useRouter } from 'next/navigation';

import { CustomNavigateOptions, RouterMethod, WebviewRouter } from '@/types/route';

export default function useNativeRouter() {
  const router = useRouter();

  const sendMessageToWebview = (message: WebviewRouter) => {
    const { type, url, isStack, webviewPushPage } = message;
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, url, isStack, pushPage: webviewPushPage }));
  };

  const nativeRouter = (href: string, options?: CustomNavigateOptions) => {
    if (window.ReactNativeWebView) {
      sendMessageToWebview({
        type: RouterMethod.Push,
        url: href,
        isStack: options?.isStack,
        webviewPushPage: options?.webviewPushPage,
      });
      return;
    }
    router.push(href, options);
  };

  const nativeReplace = (href: string, options?: CustomNavigateOptions) => {
    if (window.ReactNativeWebView) {
      sendMessageToWebview({
        type: RouterMethod.Replace,
        url: href,
        isStack: options?.isStack,
        webviewPushPage: options?.webviewPushPage,
      });

      return;
    }
    router.replace(href, options);
  };

  const nativeBack = () => {
    if (window.ReactNativeWebView) {
      sendMessageToWebview({
        type: RouterMethod.Back,
      });
      return;
    }
    router.back();
  };

  return { ...router, push: nativeRouter, replace: nativeReplace, back: nativeBack };
}
