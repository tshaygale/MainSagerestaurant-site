import { type ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f3ee] font-body text-[#2b1d16]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
