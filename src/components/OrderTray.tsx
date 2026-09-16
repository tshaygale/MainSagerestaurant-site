import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X, Loader2, CheckCircle2, Send, User, Hash, StickyNote } from 'lucide-react';
import { useOrder } from '@/hooks/useOrder';
import { supabase } from '@/lib/supabase';

export default function OrderTray() {
  const { lines, increment, decrement, remove, clear, totalItems, totalPrice } = useOrder();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg(null);

    const { error } = await supabase.from('orders').insert({
      customer_name: customerName.trim(),
      table_number: tableNumber.trim(),
      items: lines.map((l) => ({ name: l.name, price: l.price, quantity: l.quantity })),
      total: totalPrice,
      notes: notes.trim() || null,
    });

    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or call us directly.');
      return;
    }

    setStatus('success');
    clear();
    setCustomerName('');
    setTableNumber('');
    setNotes('');
  };

  if (totalItems === 0 && status !== 'success' && !open) {
    return null;
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#c8a96a] px-5 py-3.5 font-body text-sm font-medium text-[#2b1d16] shadow-xl hover:scale-105 transition-all duration-300"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2b1d16] text-[#c8a96a] text-xs font-bold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Slide-in panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative h-full w-full max-w-md bg-[#f7f3ee] shadow-2xl flex flex-col animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#6b4f3a]/15 px-6 py-5 bg-[#2b1d16]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#c8a96a]" />
                <h2 className="font-serif-display text-xl text-[#f7f3ee]">Your Order</h2>
                {totalItems > 0 && (
                  <span className="rounded-full bg-[#c8a96a] px-2 py-0.5 text-xs font-bold text-[#2b1d16]">
                    {totalItems}
                  </span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-[#f7f3ee]/60 hover:text-[#c8a96a] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c8a96a]/15">
                    <CheckCircle2 className="h-8 w-8 text-[#c8a96a]" />
                  </div>
                  <h3 className="mt-6 font-serif-display text-2xl text-[#2b1d16]">Order sent!</h3>
                  <p className="mt-3 font-body text-sm text-[#6b4f3a] leading-relaxed max-w-xs">
                    Your order has been sent to the kitchen. The chef will start preparing it right away.
                  </p>
                  <button
                    onClick={() => { setStatus('idle'); setOpen(false); }}
                    className="mt-8 inline-flex items-center rounded-full border border-[#c8a96a]/50 px-6 py-2.5 font-body text-sm text-[#c8a96a] hover:bg-[#c8a96a] hover:text-[#2b1d16] transition-all duration-300"
                  >
                    Back to menu
                  </button>
                </div>
              ) : lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="h-12 w-12 text-[#6b4f3a]/30" />
                  <p className="mt-4 font-body text-sm text-[#6b4f3a]">
                    Your order is empty. Browse the menu and tap "Add to order" on any plate.
                  </p>
                </div>
              ) : (
                <>
                  {/* Items */}
                  <div className="space-y-3">
                    {lines.map((line) => (
                      <div key={line.id} className="flex items-center gap-3 rounded-xl bg-[#efe7db] border border-[#6b4f3a]/10 p-3">
                        <div className="flex-1">
                          <p className="font-body text-sm font-medium text-[#2b1d16]">{line.name}</p>
                          <p className="font-body text-xs text-[#6b4f3a]">
                            ${line.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decrement(line.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2b1d16] text-[#c8a96a] hover:bg-[#3a2a20] transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="font-body text-sm font-medium text-[#2b1d16] w-6 text-center">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => increment(line.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2b1d16] text-[#c8a96a] hover:bg-[#3a2a20] transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => remove(line.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-[#b5563a]/60 hover:bg-[#b5563a]/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="w-16 text-right">
                          <p className="font-body text-sm font-medium text-[#2b1d16]">
                            ${(line.price * line.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#6b4f3a]/15 pt-4">
                    <span className="font-serif-display text-lg text-[#2b1d16]">Total</span>
                    <span className="font-serif-display text-2xl text-[#c8a96a]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Submission form */}
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2">
                        <User className="h-3.5 w-3.5" /> Your name
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full rounded-xl border border-[#6b4f3a]/20 bg-[#f7f3ee] px-4 py-3 font-body text-sm text-[#2b1d16] placeholder-[#6b4f3a]/40 focus:border-[#c8a96a] focus:outline-none focus:ring-1 focus:ring-[#c8a96a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2">
                        <Hash className="h-3.5 w-3.5" /> Table number
                      </label>
                      <input
                        type="text"
                        required
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Table 7"
                        className="w-full rounded-xl border border-[#6b4f3a]/20 bg-[#f7f3ee] px-4 py-3 font-body text-sm text-[#2b1d16] placeholder-[#6b4f3a]/40 focus:border-[#c8a96a] focus:outline-none focus:ring-1 focus:ring-[#c8a96a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2">
                        <StickyNote className="h-3.5 w-3.5" /> Notes (optional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="No onions, extra sauce, allergies…"
                        className="w-full rounded-xl border border-[#6b4f3a]/20 bg-[#f7f3ee] px-4 py-3 font-body text-sm text-[#2b1d16] placeholder-[#6b4f3a]/40 focus:border-[#c8a96a] focus:outline-none focus:ring-1 focus:ring-[#c8a96a] transition-all resize-none"
                      />
                    </div>

                    {status === 'error' && errorMsg && (
                      <div className="rounded-xl bg-[#b5563a]/10 border border-[#b5563a]/30 px-4 py-3">
                        <p className="font-body text-sm text-[#b5563a]">{errorMsg}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#c8a96a] px-8 py-4 font-body text-sm tracking-wide text-[#2b1d16] hover:bg-[#d8b97a] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Sending order…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Send order to kitchen
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
