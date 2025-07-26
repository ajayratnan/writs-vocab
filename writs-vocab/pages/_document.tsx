// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,600;1,400&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-cream text-brand-navy font-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
