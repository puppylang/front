import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode } from 'react';

import { RouterMethod } from '@/types/route';

interface NativeLinkProps extends LinkProps {
  children: ReactNode;

  isStack?: boolean;
  webviewPushPage?: string;
  className?: string;
  type?: RouterMethod;
  onClick?: () => void;
}

export default function NativeLink({
  onClick,
  children,
  className,
  webviewPushPage = 'detail',
  isStack = true,
  type = RouterMethod.Push,
  ...props
}: NativeLinkProps) {
  const router = useRouter();
  const onClickLink = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (onClick) {
      onClick();
    }

    const href = props.href as string;
    if (!window.ReactNativeWebView) {
      if (type === RouterMethod.Back) {
        router.back();
        return;
      }

      router[type](href);
      return;
    }

    if (type === 'back') {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: RouterMethod.Back,
        }),
      );
      return;
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ type, url: href, pushPage: webviewPushPage, isStack }));
  };

  return (
    // eslint-disable-next-line
    <Link {...props} className={className || ''} href='#' onClick={onClickLink}>
      {children}
    </Link>
  );
}
