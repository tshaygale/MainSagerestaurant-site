import { useState, useEffect } from 'react';
import { Loader2, ShoppingBag, Plus, Minus, X, CheckCircle2, Send, User, Mail, DollarSign } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useReveal } from '@/hooks/useReveal';
import { supabase, type MerchProduct } from '@/lib/supabase';

type CartLine = { id: string; name: string; price: number; quantity: number };

export default function ShopPage() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [products, setProducts] = useState<MerchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [active, setActive] = useState('All');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('merch_products')
        .select('*')
        .eq('is_available', true)
        .order('sort_order', { ascending: true });

      if (error) {
        setError("We couldn't load the shop. Please try again shortly.");
      } else {
        setProducts(data as MerchProduct[]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = ['All', 'Coffee Beans', 'Brewing Gear', 'Merchandise', 'Gift Cards'];

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active);

  const addToCart = (p: MerchProduct) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === p.id);
      if (existing) {
        return prev.map((l) => (l.id === p.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { id: p.id, name: p.name, price: Number(p.price), quantity: 1 }];
    });
  };

  const increment = (id: string) => setCart((prev) => prev.map((l) => (l.id === id ? { ...l, quantity: l.quantity + 1 } : l)));
  const decrement = (id: string) => setCart((prev) => prev.flatMap((l) => l.id === id ? (l.quantity > 1 ? [{ ...l, quantity: l.quantity - 1 }] : []) : [l]));
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((l) => l.id !== id));

  const cartTotal = cart.reduce((s, l) => s + l.price * l.quantity, 0);
  const cartCount = cart.reduce((s, l) => s + l.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg(null);

    const { error } = await supabase.from('merch_orders').insert({
      customer_name: customerName.trim(),
      email: customerEmail.trim().toLowerCase(),
      items: cart.map((l) => ({ name: l.name, price: l.price, quantity: l.quantity })),
      total: cartTotal,
    });

    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
      return;
    }

    setStatus('success');
    setCart([]);
    setCustomerName('');
    setCustomerEmail('');
  };

  return (
    <PageLayout>
      <section className="bg-[#f7f3ee] pt-32 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} text-center max-w-2xl mx-auto`}>
            <span className="font-body text-xs tracking-[0.3em] uppercase text-[#b5563a]">Shop</span>
            <h2 className="mt-4 font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
              Beans, gear &amp; gifts
            </h2>
            <p className="mt-4 font-body text-[#6b4f3a] leading-relaxed">
              Take a piece of The Daily Cup home. Freshly roasted beans, brewing
              equipment, and branded merchandise.
            </p>
          </div>

          {/* Category filter */}
          <div className="mt-10 flex justify-center">
            <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full bg-[#efe7db] p-1.5">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActive(cat)}
                  className={`whitespace-nowrap rounded-full px-5 py-2 font-body text-sm tracking-wide transition-all duration-300 ${
                    active === cat ? 'bg-[#c8a96a] text-[#2b1d16] shadow-md' : 'text-[#6b4f3a] hover:text-[#c8a96a]'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products grid */}
          <div className="mt-12">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#6b4f3a]" /></div>
            ) : error ? (
              <div className="text-center py-20"><p className="font-body text-[#b5563a]">{error}</p></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20"><p className="font-body text-[#6b4f3a]">No products in this category yet.</p></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filtered.map((p, idx) => (
                  <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                    <div className="group flex flex-col overflow-hidden rounded-2xl bg-[#efe7db] border border-[#6b4f3a]/10 shadow-sm hover:shadow-xl hover:shadow-[#2b1d16]/10 hover:-translate-y-1 transition-all duration-500">
                      <div className="relative h-56 overflow-hidden">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} loading="lazy"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="h-full w-full bg-[#efe7db]" />
                        )}
                        <div className="absolute top-3 right-3 rounded-full bg-[#2b1d16]/90 px-3 py-1.5 font-body text-sm font-medium text-[#c8a96a] backdrop-blur-sm">
                          ${Number(p.price).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <span className="font-body text-xs tracking-wide uppercase text-[#b5563a]">{p.category}</span>
                        <h3 className="mt-1 font-serif-display text-xl text-[#2b1d16]">{p.name}</h3>
                        {p.description && (
                          <p className="mt-2 font-body text-sm text-[#6b4f3a] leading-relaxed">{p.description}</p>
                        )}
                        <button onClick={() => { addToCart(p); setCartOpen(true); }}
                          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#2b1d16] px-5 py-2.5 font-body text-sm font-medium text-[#c8a96a] hover:bg-[#3a2a20] hover:scale-[1.03] transition-all duration-300">
                          <Plus className="h-4 w-4" /> Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating cart button */}
      {cartCount > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#c8a96a] px-5 py-3.5 font-body text-sm font-medium text-[#2b1d16] shadow-xl hover:scale-105 transition-all duration-300">
          <ShoppingBag className="h-5 w-5" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2b1d16] text-[#c8a96a] text-xs font-bold">{cartCount}</span>
        </button>
      )}

      {/* Cart panel */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative h-full w-full max-w-md bg-[#f7f3ee] shadow-2xl flex flex-col animate-fade-up">
            <div className="flex items-center justify-between border-b border-[#6b4f3a]/15 px-6 py-5 bg-[#2b1d16]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#c8a96a]" />
                <h2 className="font-serif-display text-xl text-[#f7f3ee]">Your Cart</h2>
                {cartCount > 0 && <span className="rounded-full bg-[#c8a96a] px-2 py-0.5 text-xs font-bold text-[#2b1d16]">{cartCount}</span>}
              </div>
              <button onClick={() => setCartOpen(false)} className="text-[#f7f3ee]/60 hover:text-[#c8a96a] transition-colors"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c8a96a]/15"><CheckCircle2 className="h-8 w-8 text-[#c8a96a]" /></div>
                  <h3 className="mt-6 font-serif-display text-2xl text-[#2b1d16]">Order placed!</h3>
                  <p className="mt-3 font-body text-sm text-[#6b4f3a] leading-relaxed max-w-xs">
                    Thank you for your purchase. We'll send a confirmation to your email shortly.
                  </p>
                  <button onClick={() => { setStatus('idle'); setCartOpen(false); }}
                    className="mt-8 inline-flex items-center rounded-full border border-[#c8a96a]/50 px-6 py-2.5 font-body text-sm text-[#c8a96a] hover:bg-[#c8a96a] hover:text-[#2b1d16] transition-all duration-300">
                    Continue shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-12 w-12 text-[#6b4f3a]/30" />
                  <p className="mt-4 font-body text-sm text-[#6b4f3a]">Your cart is empty. Browse the shop and add items to get started.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((line) => (
                      <div key={line.id} className="flex items-center gap-3 rounded-xl bg-[#efe7db] border border-[#6b4f3a]/10 p-3">
                        <div className="flex-1">
                          <p className="font-body text-sm font-medium text-[#2b1d16]">{line.name}</p>
                          <p className="font-body text-xs text-[#6b4f3a]">${line.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => decrement(line.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2b1d16] text-[#c8a96a] hover:bg-[#3a2a20] transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="font-body text-sm font-medium text-[#2b1d16] w-6 text-center">{line.quantity}</span>
                          <button onClick={() => increment(line.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2b1d16] text-[#c8a96a] hover:bg-[#3a2a20] transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                          <button onClick={() => removeFromCart(line.id)} className="flex h-7 w-7 items-center justify-center rounded-full text-[#b5563a]/60 hover:bg-[#b5563a]/10 transition-colors"><X className="h-3.5 w-3.5" /></button>
                        </div>
                        <div className="w-16 text-right"><p className="font-body text-sm font-medium text-[#2b1d16]">${(line.price * line.quantity).toFixed(2)}</p></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-[#6b4f3a]/15 pt-4">
                    <span className="font-serif-display text-lg text-[#2b1d16]">Total</span>
                    <span className="font-serif-display text-2xl text-[#c8a96a]">${cartTotal.toFixed(2)}</span>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2"><User className="h-3.5 w-3.5" /> Your name</label>
                      <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Jane Doe"
                        className="w-full rounded-xl border border-[#6b4f3a]/20 bg-[#f7f3ee] px-4 py-3 font-body text-sm text-[#2b1d16] placeholder-[#6b4f3a]/40 focus:border-[#c8a96a] focus:outline-none focus:ring-1 focus:ring-[#c8a96a] transition-all" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2"><Mail className="h-3.5 w-3.5" /> Email</label>
                      <input type="email" required value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="jane@email.com"
                        className="w-full rounded-xl border border-[#6b4f3a]/20 bg-[#f7f3ee] px-4 py-3 font-body text-sm text-[#2b1d16] placeholder-[#6b4f3a]/40 focus:border-[#c8a96a] focus:outline-none focus:ring-1 focus:ring-[#c8a96a] transition-all" />
                    </div>
                    {status === 'error' && errorMsg && (
                      <div className="rounded-xl bg-[#b5563a]/10 border border-[#b5563a]/30 px-4 py-3"><p className="font-body text-sm text-[#b5563a]">{errorMsg}</p></div>
                    )}
                    <button type="submit" disabled={status === 'submitting'}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#c8a96a] px-8 py-4 font-body text-sm tracking-wide text-[#2b1d16] hover:bg-[#d8b97a] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60">
                      {status === 'submitting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing order…</> : <><Send className="h-4 w-4" /> Place order — ${cartTotal.toFixed(2)}</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
