'use client';

import { SessionProvider } from 'next-auth/react';
import ReduxProvider from './redux/ReduxProvider';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}
