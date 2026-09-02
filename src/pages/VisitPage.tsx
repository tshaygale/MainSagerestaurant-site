import { Clock, MapPin, Phone, Mail, Instagram, Facebook, Navigation } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useReveal } from '@/hooks/useReveal';

export default function VisitPage() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  const mapQuery = encodeURIComponent('42 Garden Street, Rosewood Quarter');
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  const mapEmbed = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <PageLayout>
      <section className="bg-[#f7f3ee] pt-32 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            ref={ref}
            className={`reveal ${visible ? 'is-visible' : ''} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
          >
            {/* Info */}
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

              <div className="mt-10 space-y-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efe7db] text-[#b5563a]">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-body text-sm font-medium text-[#2b1d16]">Address</p>
                    <p className="font-body text-sm text-[#6b4f3a]">
                      42 Garden Street, Rosewood Quarter
                    </p>
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

                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efe7db] text-[#b5563a]">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-body text-sm font-medium text-[#2b1d16]">Reservations</p>
                    <p className="font-body text-sm text-[#6b4f3a]">
                      +1 (555) 014-2278 · hello@maisonsage.cafe
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <a
                  href="https://instagram.com/maisonsage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2b1d16] text-[#c8a96a] hover:bg-[#3a2a20] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/maisonsage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2b1d16] text-[#c8a96a] hover:bg-[#3a2a20] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c8a96a] px-5 h-11 font-body text-sm text-[#2b1d16] hover:bg-[#d8b97a] transition-colors"
                >
                  <Navigation className="h-4 w-4" /> Get directions
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-[#6b4f3a]/10 shadow-lg">
                <iframe
                  src={mapEmbed}
                  title="Maison Sage location map"
                  className="w-full h-[420px] lg:h-[520px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
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
    </PageLayout>
  );
}
