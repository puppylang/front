'use client';

import { ReactNode, Suspense, SuspenseProps, useEffect, useState } from 'react';

interface SuspenseWithoutSSRProps extends SuspenseProps {
  children: ReactNode;
}

export default function SuspenseWithoutSSR({ children, ...props }: SuspenseWithoutSSRProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <Suspense {...props}>{children}</Suspense>;
}
