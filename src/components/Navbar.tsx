import { Menu as MenuIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Menu', href: '/menu' },
  { label: 'Visit', href: '/visit' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = location.pathname === '/';
  const showSolid = scrolled || !isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showSolid
          ? 'bg-[#2b1d16]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="group flex items-center">
          <img
            src="/logo.svg"
            alt="Maison Sage French Bistro & Coffee House"
            className="h-12 w-52 object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                className={`font-body text-sm tracking-wide transition-colors duration-300 relative after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-[#c8a96a] after:transition-all after:duration-300 hover:after:w-full ${
                  location.pathname === l.href
                    ? 'text-[#c8a96a] after:w-full'
                    : 'text-[#f7f3ee]/80 hover:text-[#c8a96a]'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/reserve"
          className="hidden md:inline-flex items-center rounded-full border border-[#c8a96a]/60 px-5 py-2 font-body text-sm text-[#c8a96a] hover:bg-[#c8a96a] hover:text-[#2b1d16] transition-all duration-300"
        >
          Reserve
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-[#f7f3ee]"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 bg-[#2b1d16] ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="px-6 py-4 space-y-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                onClick={() => setOpen(false)}
                className={`block py-3 font-body transition-colors ${
                  location.pathname === l.href
                    ? 'text-[#c8a96a]'
                    : 'text-[#f7f3ee]/85 hover:text-[#c8a96a]'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/reserve"
              onClick={() => setOpen(false)}
              className="block py-3 font-body text-[#c8a96a]"
            >
              Reserve
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
