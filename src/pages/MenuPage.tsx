import { useMemo, useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase, type MenuItem } from '@/lib/supabase';
import PlateCard from '@/components/PlateCard';
import FeaturedSection from '@/components/FeaturedSection';
import PageLayout from '@/components/PageLayout';
import { useReveal } from '@/hooks/useReveal';

const categoryOrder = ['Brunch', 'Starters', 'Mains', 'Desserts', 'Drinks'];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<string>('All');
  const { ref, visible } = useReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) {
        setError("We couldn't load the menu. Please try again shortly.");
      } else {
        setItems(data as MenuItem[]);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const featured = items.filter((i) => i.is_featured);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ['All', ...categoryOrder.filter((c) => set.has(c))];
  }, [items]);

  const filtered = useMemo(
    () =>
      (active === 'All' ? items : items.filter((i) => i.category === active)).sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    [items, active]
  );

  return (
    <PageLayout>
      {/* Featured */}
      <div className="pt-20">
        <FeaturedSection items={featured} />
      </div>

      {/* Full menu */}
      <section className="relative bg-[#efe7db] py-24 lg:py-32">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a96a]/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            ref={ref}
            className={`reveal ${visible ? 'is-visible' : ''} text-center max-w-2xl mx-auto`}
          >
            <span className="font-body text-xs tracking-[0.3em] uppercase text-[#b5563a]">
              The Full Menu
            </span>
            <h2 className="mt-4 font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
              Everything from our kitchen
            </h2>
            <p className="mt-4 font-body text-[#6b4f3a] leading-relaxed">
              Filter by category to find your next favorite.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full bg-[#2b1d16] p-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`whitespace-nowrap rounded-full px-5 py-2 font-body text-sm tracking-wide transition-all duration-300 ${
                    active === cat
                      ? 'bg-[#c8a96a] text-[#2b1d16] shadow-md'
                      : 'text-[#f7f3ee]/70 hover:text-[#c8a96a]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#6b4f3a]" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="font-body text-[#b5563a]">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-[#6b4f3a]">No dishes in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filtered.map((item, idx) => (
                  <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                    <PlateCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
