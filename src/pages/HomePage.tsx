import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, MapPin, Clock, Users, ArrowDown } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import type { MenuItem } from '@/lib/supabase';
import PlateCard from '@/components/PlateCard';

type Props = {
  featured: MenuItem[];
  menuItems: MenuItem[];
};

export default function HomePage({ featured, menuItems }: Props) {
  const { ref: storyRef, visible: storyVisible } = useReveal<HTMLDivElement>();
  const { ref: featuredRef, visible: featuredVisible } = useReveal<HTMLDivElement>();
  const { ref: menuRef, visible: menuVisible } = useReveal<HTMLDivElement>();
  const { ref: visitRef, visible: visitVisible } = useReveal<HTMLDivElement>();

  const menuPreview = menuItems.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#2b1d16]"
      >
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            poster="https://images.pexels.com/photos/1813422/pexels-photo-1813422.jpeg"
          >
            <source
              src="https://cdn.coverr.co/videos/coverr-chef-cooking-in-a-restaurant-3327/1080p.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#2b1d16]/85 via-[#2b1d16]/60 to-[#2b1d16]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2b1d16]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a96a]/40 bg-[#2b1d16]/40 px-4 py-1.5 mb-8 animate-fade-up backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-[#c8a96a] text-[#c8a96a]" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-[#c8a96a]">
              Seasonal · Since 2014
            </span>
          </div>

          <h1
            className="font-serif-display text-5xl sm:text-6xl lg:text-8xl text-[#f7f3ee] leading-[1.05] animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            A table set for
            <br />
            <span className="italic text-[#c8a96a]">slow mornings</span>
          </h1>

          <p
            className="mt-7 max-w-xl mx-auto font-body text-base sm:text-lg text-[#f7f3ee]/75 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Seasonal plates, honest coffee, and a room that smells like fresh
            herbs. Pull up a chair — the menu changes with the harvest.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link
              to="/reserve"
              className="inline-flex items-center gap-2 rounded-full bg-[#c8a96a] px-8 py-3.5 font-body text-sm tracking-wide text-[#2b1d16] hover:bg-[#d8b97a] transition-all duration-300 hover:scale-[1.03]"
            >
              Reserve a Table
              <ArrowDown className="h-4 w-4" />
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center rounded-full border border-[#f7f3ee]/30 px-8 py-3.5 font-body text-sm tracking-wide text-[#f7f3ee] hover:border-[#c8a96a] hover:text-[#c8a96a] transition-all duration-300"
            >
              Explore the Menu
            </Link>
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="bg-[#f7f3ee] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            ref={storyRef}
            className={`reveal ${storyVisible ? 'is-visible' : ''} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
          >
            <div className="relative order-2 lg:order-1">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="https://images.pexels.com/photos/14590691/pexels-photo-14590691.jpeg"
                  alt="Maison Sage interior"
                  className="h-[400px] w-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -top-5 -right-5 hidden sm:flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[#c8a96a] text-[#2b1d16] shadow-xl">
                <span className="font-serif-display text-2xl leading-none">10</span>
                <span className="font-body text-[10px] tracking-wide mt-1">YEARS</span>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="font-body text-xs tracking-[0.3em] uppercase text-[#b5563a]">
                Our Story
              </span>
              <h2 className="mt-4 font-serif-display text-4xl lg:text-5xl text-[#2b1d16] leading-tight">
                A neighbourhood kitchen with a seasonal heart
              </h2>
              <p className="mt-6 font-body text-[#6b4f3a] leading-relaxed">
                Maison Sage opened in 2014 as a tiny six-table cafe on Garden
                Street. A decade later, we still change the menu with every
                harvest, working directly with twelve local farms and two
                coffee roasters.
              </p>
              <div className="mt-8 flex gap-8">
                <div>
                  <p className="font-serif-display text-3xl text-[#c8a96a]">12</p>
                  <p className="font-body text-xs text-[#6b4f3a] mt-1">Local farms</p>
                </div>
                <div>
                  <p className="font-serif-display text-3xl text-[#c8a96a]">30+</p>
                  <p className="font-body text-xs text-[#6b4f3a] mt-1">Seasonal dishes</p>
                </div>
                <div>
                  <p className="font-serif-display text-3xl text-[#c8a96a]">4.9</p>
                  <p className="font-body text-xs text-[#6b4f3a] mt-1">Average rating</p>
                </div>
              </div>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 font-body text-sm text-[#c8a96a] hover:gap-3 transition-all"
              >
                Read our full story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured preview */}
      <section className="relative bg-[#2b1d16] py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            ref={featuredRef}
            className={`reveal ${featuredVisible ? 'is-visible' : ''} text-center max-w-2xl mx-auto`}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a96a]/40 px-4 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#c8a96a]" />
              <span className="font-body text-xs tracking-[0.25em] uppercase text-[#c8a96a]">
                Chef's Featured Plates
              </span>
            </div>
            <h2 className="font-serif-display text-4xl lg:text-5xl text-[#f7f3ee]">
              What we're proud of today
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featured.slice(0, 3).map((item, idx) => (
              <article
                key={item.id}
                className={`group relative overflow-hidden rounded-3xl bg-[#3a2a20] border border-[#c8a96a]/15 animate-fade-up flex flex-col ${
                  idx === 0 ? 'lg:col-span-2 lg:row-span-1' : ''
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`flex ${idx === 0 ? 'flex-col lg:flex-row' : 'flex-col'}`}>
                  <div className={`plate-roll relative flex items-center justify-center ${idx === 0 ? 'lg:w-1/2 p-10' : 'p-8'}`}>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`rounded-full border-2 border-[#c8a96a]/20 scale-110 transition-transform duration-500 group-hover:scale-[1.15] ${idx === 0 ? 'h-64 w-64 lg:h-72 lg:w-72' : 'h-44 w-44'}`} />
                    </div>
                    <div className={`rounded-full overflow-hidden ring-4 ring-[#2b1d16] shadow-2xl ${idx === 0 ? 'h-56 w-56 lg:h-64 lg:w-64' : 'h-40 w-40'}`}>
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                  </div>
                  <div className={`flex-1 flex flex-col justify-center p-6 lg:p-8 ${idx === 0 ? 'lg:w-1/2' : ''}`}>
                    <span className="font-body text-xs tracking-[0.2em] uppercase text-[#c8a96a]">
                      {item.category}
                    </span>
                    <h3 className="mt-2 font-serif-display text-2xl lg:text-3xl text-[#f7f3ee]">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="mt-2 font-body text-sm text-[#f7f3ee]/65 max-w-md leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-3">
                      <span className="font-body text-lg text-[#c8a96a]">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-[#c8a96a]/50 px-6 py-2.5 font-body text-sm text-[#c8a96a] hover:bg-[#c8a96a] hover:text-[#2b1d16] transition-all duration-300"
            >
              See full menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Menu preview */}
      <section className="bg-[#efe7db] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            ref={menuRef}
            className={`reveal ${menuVisible ? 'is-visible' : ''} text-center max-w-2xl mx-auto`}
          >
            <span className="font-body text-xs tracking-[0.3em] uppercase text-[#b5563a]">
              A Taste
            </span>
            <h2 className="mt-4 font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
              From our kitchen
            </h2>
            <p className="mt-4 font-body text-[#6b4f3a] leading-relaxed">
              A quick look at what's on the menu. Visit the full menu to browse
              everything.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {menuPreview.map((item, idx) => (
              <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                <PlateCard item={item} />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-[#2b1d16] px-8 py-3.5 font-body text-sm text-[#c8a96a] hover:bg-[#3a2a20] transition-all duration-300"
            >
              View full menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Visit preview */}
      <section className="bg-[#f7f3ee] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            ref={visitRef}
            className={`reveal ${visitVisible ? 'is-visible' : ''} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
          >
            <div>
              <span className="font-body text-xs tracking-[0.3em] uppercase text-[#b5563a]">
                Visit Us
              </span>
              <h2 className="mt-4 font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
                Come sit by the window
              </h2>
              <p className="mt-5 font-body text-[#6b4f3a] leading-relaxed max-w-md">
                We're tucked into the quiet end of Garden Street. Walk-ins are
                welcome, but weekends fill up — book ahead to be sure.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efe7db] text-[#b5563a]">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-body text-sm font-medium text-[#2b1d16]">Address</p>
                    <p className="font-body text-sm text-[#6b4f3a]">42 Garden Street, Rosewood Quarter</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efe7db] text-[#b5563a]">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-body text-sm font-medium text-[#2b1d16]">Hours</p>
                    <p className="font-body text-sm text-[#6b4f3a]">
                      Tue – Fri · 8am – 10pm<br />
                      Sat – Sun · 9am – 11pm · Closed Mondays
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/visit"
                className="mt-8 inline-flex items-center gap-2 font-body text-sm text-[#c8a96a] hover:gap-3 transition-all"
              >
                More info & directions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg"
                  alt="Restaurant interior"
                  className="h-[400px] w-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-2xl bg-[#2b1d16] px-6 py-5 shadow-xl">
                <p className="font-serif-display text-3xl text-[#c8a96a]">10</p>
                <p className="font-body text-xs tracking-wide text-[#f7f3ee]/70">years serving</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reserve CTA */}
      <section className="bg-[#efe7db] py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a96a]/40 px-4 py-1.5 mb-6">
            <Users className="h-3.5 w-3.5 text-[#c8a96a]" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-[#c8a96a]">
              Book a Table
            </span>
          </div>
          <h2 className="font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
            Ready to join us?
          </h2>
          <p className="mt-4 font-body text-[#6b4f3a] leading-relaxed">
            Reserve your table in just a minute. Pick a date, time, and party
            size — we'll send a confirmation to your email.
          </p>
          <Link
            to="/reserve"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c8a96a] px-8 py-3.5 font-body text-sm tracking-wide text-[#2b1d16] hover:bg-[#d8b97a] transition-all duration-300 hover:scale-[1.03]"
          >
            Reserve a Table <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
