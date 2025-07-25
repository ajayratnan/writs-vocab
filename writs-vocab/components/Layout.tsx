// components/Layout.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <img
              src="https://writs.in/wp/wp-content/uploads/2023/10/Black-Letters.png"
              alt="WRITS Logo"
              className="h-12 object-contain"
            />
            <span className="ml-3 font-heading text-2xl text-brand-navy">
              WRITS Vocabulary Builder
            </span>
          </div>
          <nav className="space-x-6">
            <Link href="/" className="font-body hover:text-brand-red">
              Home
            </Link>
            {/* Admin link removed per request */}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-brand-navy text-white py-4">
        <div className="max-w-6xl mx-auto text-center font-body text-sm">
          © 2025 WRITS • Empowering tomorrow’s leaders
        </div>
      </footer>
    </div>
  );
}
