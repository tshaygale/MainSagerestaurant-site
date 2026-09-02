import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#2b1d16] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-serif-display text-7xl text-[#c8a96a]">404</p>
        <h1 className="mt-4 font-serif-display text-3xl text-[#f7f3ee]">
          This page isn't on the menu
        </h1>
        <p className="mt-3 font-body text-sm text-[#f7f3ee]/50">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c8a96a] px-6 py-3 font-body text-sm text-[#2b1d16] hover:bg-[#d8b97a] transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </div>
  );
}
