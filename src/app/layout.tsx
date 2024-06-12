import { Viewport } from 'next';

import RootLayout from './clientLayout';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default RootLayout;
