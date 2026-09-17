import { Leaf, Flame, Award, Wheat, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import type { MenuItem } from '@/lib/supabase';
import { useOrder } from '@/hooks/useOrder';

const tagIcon: Record<string, { icon: typeof Leaf; label: string }> = {
  Vegetarian: { icon: Leaf, label: 'Veg' },
  Vegan: { icon: Leaf, label: 'Vegan' },
  Spicy: { icon: Flame, label: 'Spicy' },
  "Chef's Pick": { icon: Award, label: "Chef's Pick" },
  'Gluten-Free': { icon: Wheat, label: 'GF' },
};

export default function PlateCard({ item }: { item: MenuItem }) {
  const { add, lines } = useOrder();
  const [justAdded, setJustAdded] = useState(false);
  const line = lines.find((l) => l.id === item.id);

  const handleAdd = () => {
    if (!item.is_available) return;
    add(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border shadow-sm transition-all duration-500 pt-8 pb-5 px-5 ${
      item.is_available
        ? 'bg-[#f7f3ee] border-[#6b4f3a]/10 hover:shadow-xl hover:shadow-[#2b1d16]/10 hover:-translate-y-1'
        : 'bg-[#efe7db] border-[#6b4f3a]/5 opacity-60'
    }`}>
      {/* Spinning circular plate */}
      <div className="plate-roll relative">
        {/* Decorative plate rim */}
        <div className="absolute inset-0 rounded-full border-2 border-[#c8a96a]/25 scale-110 pointer-events-none transition-transform duration-500 group-hover:scale-[1.15]" />
        <div className="h-40 w-40 rounded-full overflow-hidden ring-4 ring-[#efe7db] shadow-inner">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              loading="lazy"
              className={`h-full w-full object-cover ${item.is_available ? '' : 'grayscale'}`}
            />
          ) : (
            <div className="h-full w-full bg-[#efe7db]" />
          )}
        </div>
      </div>

      {/* Price chip */}
      <div className="absolute top-4 right-4 rounded-full bg-[#2b1d16]/90 px-3.5 py-1.5 font-body text-sm font-medium text-[#c8a96a] backdrop-blur-sm">
        ${Number(item.price).toFixed(2)}
      </div>

      {/* Sold out badge */}
      {!item.is_available && (
        <div className="absolute top-4 left-4 rounded-full bg-[#b5563a] px-3 py-1 font-body text-xs font-medium text-[#f7f3ee]">
          Sold out
        </div>
      )}

      {/* Quantity badge */}
      {item.is_available && line && (
        <div className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#c8a96a] text-[#2b1d16] font-body text-sm font-bold shadow-md">
          {line.quantity}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col items-center text-center mt-5">
        <h3 className="font-serif-display text-xl text-[#2b1d16] leading-snug">
          {item.name}
        </h3>
        {item.description && (
          <p className="mt-2 font-body text-sm text-[#6b4f3a] leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {item.tags.map((tag) => {
              const meta = tagIcon[tag];
              const Icon = meta?.icon;
              return (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-[#efe7db] px-2.5 py-1 font-body text-[11px] tracking-wide text-[#6b4f3a]"
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {meta?.label ?? tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Add to order button */}
        {item.is_available && (
          <button
            onClick={handleAdd}
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium transition-all duration-300 ${
              justAdded
                ? 'bg-[#8a9a6b] text-[#f7f3ee]'
                : 'bg-[#2b1d16] text-[#c8a96a] hover:bg-[#3a2a20] hover:scale-[1.03]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" /> Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add to order
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
