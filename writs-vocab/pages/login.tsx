// pages/auth.tsx   ← or rename to pages/login.tsx for /login
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '@/lib/supabaseClient';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF6]">
      <Auth
        supabaseClient={supabase}
        providers={[]}
        magicLink={false}
        theme="default"
        appearance={{
          variables: {
            default: {
              colors: {
                brand: '#C90000',
                brandAccent: '#002B42',
              },
              fonts: {
                bodyFontFamily: 'Inter, sans-serif',
                buttonFontFamily: 'Poppins, sans-serif',
              },
            },
          },
        }}
      />
    </div>
  );
}
