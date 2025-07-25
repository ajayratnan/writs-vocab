// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="bg-cream">
      <Head>
        {/* 1️⃣ Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,600;1,400&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />

        {/* 2️⃣ Tailwind CDN + Inline Brand Config */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      cream:    '#FFFDF6',   // page bg
                      'option-bg':'#F5F3EE', // buttons, cards
                      'brand-red':'#C90000',
                      'brand-navy':'#002B42'
                    },
                    fontFamily: {
                      heading: ['"Playfair Display"','"Merriweather"','serif'],
                      body:    ['Inter','sans-serif'],
                    },
                    borderRadius: {
                      card: '16px',
                      btn:  '12px',
                    },
                    spacing: {
                      'btn-h': '56px',
                      'gap-y': '20px',
                    },
                  }
                }
              }
            `,
          }}
        />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* 3️⃣ Apply cream background & default navy text */}
      <body className="bg-cream text-brand-navy min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
