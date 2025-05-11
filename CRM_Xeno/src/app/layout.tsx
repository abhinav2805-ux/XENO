// app/layout.tsx
/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
import './globals.css';

import AuthProvider from '@/components/AuthProvider';
import { Inter } from 'next/font/google';

import { ReactNode } from 'react';
import ClientLayout from '@/components/ClientLayout';

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
          <ClientLayout>
            {children}
          </ClientLayout>
          
        </AuthProvider>
      </body>
    </html>
  );
}