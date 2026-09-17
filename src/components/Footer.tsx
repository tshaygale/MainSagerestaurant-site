import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#2b1d16] border-t border-[#c8a96a]/15 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <img
            src="/logo.svg"
            alt="The Daily Cup — Cafe & Coffee House"
            className="h-14 w-52 object-contain"
          />

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link to="/about" className="font-body text-sm text-[#f7f3ee]/60 hover:text-[#c8a96a] transition-colors">About</Link>
            <Link to="/menu" className="font-body text-sm text-[#f7f3ee]/60 hover:text-[#c8a96a] transition-colors">Menu</Link>
            <Link to="/shop" className="font-body text-sm text-[#f7f3ee]/60 hover:text-[#c8a96a] transition-colors">Shop</Link>
            <Link to="/loyalty" className="font-body text-sm text-[#f7f3ee]/60 hover:text-[#c8a96a] transition-colors">Rewards</Link>
            <Link to="/catering" className="font-body text-sm text-[#f7f3ee]/60 hover:text-[#c8a96a] transition-colors">Catering</Link>
            <Link to="/visit" className="font-body text-sm text-[#f7f3ee]/60 hover:text-[#c8a96a] transition-colors">Visit</Link>
            <Link to="/reserve" className="font-body text-sm text-[#f7f3ee]/60 hover:text-[#c8a96a] transition-colors">Reserve</Link>
          </nav>

          <div className="flex flex-col items-center gap-2">
            <p className="font-body text-xs text-[#f7f3ee]/40">
              © {new Date().getFullYear()} The Daily Cup. Brewed with care.
            </p>
            <a href="/admin/signin" className="font-body text-xs text-[#f7f3ee]/20 hover:text-[#c8a96a] transition-colors">
              Owner login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
