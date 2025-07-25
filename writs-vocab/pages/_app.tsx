// pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Layout from '@/components/Layout';  // <-- default import

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <Layout>                        {/* <-- wrap in Layout */}
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}
