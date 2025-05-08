// app/layout.tsx
import './globals.css';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import { Inter } from 'next/font/google';

import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Xeno CRM - Customer Relationship Management',
  description: 'Manage your customer relationships efficiently with Xeno CRM',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-gray-100 py-6 text-center text-gray-600">
            <p>© {new Date().getFullYear()} Xeno CRM. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}