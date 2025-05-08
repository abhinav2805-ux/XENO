'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link href="/" className="text-xl font-bold hover:text-blue-400">
        Xeno CRM
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/" className="hover:text-blue-400">
          Home
        </Link>

        {isLoggedIn && (
          <>
            <Link href="/dashboard" className="hover:text-blue-400">
              Dashboard
            </Link>
            <Link href="/campaigns" className="hover:text-blue-400">
              Campaigns
            </Link>
            <Link href="/upload" className="hover:text-blue-400">
              Upload
            </Link>
          </>
        )}

        {isLoggedIn ? (
          <button
            onClick={() => signOut()}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 transition"
          >
            Login with Google
          </button>
        )}
      </div>
    </nav>
  );
}
