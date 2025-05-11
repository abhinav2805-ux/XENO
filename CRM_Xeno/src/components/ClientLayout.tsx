'use client';

import { usePathname } from 'next/navigation';
import Navbar from "../components/Navbar";
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = ['/signin', '/signup'].includes(pathname);
  const hideFoot = ['/signin', '/signup'].includes(pathname);

  return (
    <>
      {!hideNav && <Navbar />}
      {children}
      {!hideFoot && <Footer />}

    </>
  );
}