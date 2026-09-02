import { Sparkles } from 'lucide-react';
import type { MenuItem } from '@/lib/supabase';
import { useReveal } from '@/hooks/useReveal';

export default function FeaturedSection({ items }: { items: MenuItem[] }) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  if (items.length === 0) return null;

  return (
    <section
      id="featured"
      className="relative bg-[#2b1d16] py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div
          ref={ref}
          className={`reveal ${visible ? 'is-visible' : ''} text-center max-w-2xl mx-auto`}
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

        {/* Featured cards */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item, idx) => (
            <article
              key={item.id}
              className={`group relative overflow-hidden rounded-3xl bg-[#3a2a20] border border-[#c8a96a]/15 animate-fade-up flex flex-col ${
                idx === 0 ? 'lg:col-span-2 lg:row-span-1' : ''
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`flex ${idx === 0 ? 'flex-col lg:flex-row' : 'flex-col'}`}>
                {/* Spinning circular plate */}
                <div className={`plate-roll relative flex items-center justify-center ${idx === 0 ? 'lg:w-1/2 p-10' : 'p-8'}`}>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`rounded-full border-2 border-[#c8a96a]/20 scale-110 transition-transform duration-500 group-hover:scale-[1.15] ${idx === 0 ? 'h-64 w-64 lg:h-72 lg:w-72' : 'h-44 w-44'}`} />
                  </div>
                  <div className={`rounded-full overflow-hidden ring-4 ring-[#2b1d16] shadow-2xl ${idx === 0 ? 'h-56 w-56 lg:h-64 lg:w-64' : 'h-40 w-40'}`}>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Text */}
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
                    {item.tags.includes("Chef's Pick") && (
                      <span className="rounded-full bg-[#c8a96a]/15 px-3 py-1 font-body text-[11px] tracking-wide text-[#c8a96a]">
                        Chef's Pick
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
