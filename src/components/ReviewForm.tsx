import { useState } from 'react';
import { Star, Loader2, CheckCircle2, MessageSquare, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/useReveal';

export default function ReviewForm() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [form, setForm] = useState({ author_name: '', rating: 5, review_text: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    const { error } = await supabase.from('guest_reviews').insert({
      author_name: form.author_name.trim(),
      rating: form.rating,
      review_text: form.review_text.trim(),
    });

    if (error) {
      setStatus('error');
      return;
    }

    setStatus('success');
    setForm({ author_name: '', rating: 5, review_text: '' });
  };

  const inputClass =
    'w-full rounded-xl border border-[#6b4f3a]/20 bg-[#f7f3ee] px-4 py-3 font-body text-sm text-[#2b1d16] placeholder-[#6b4f3a]/40 focus:border-[#c8a96a] focus:outline-none focus:ring-1 focus:ring-[#c8a96a] transition-all duration-200';

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} mt-16 max-w-2xl mx-auto`}>
      <div className="rounded-3xl bg-[#efe7db] border border-[#6b4f3a]/10 p-6 lg:p-8">
        <h3 className="font-serif-display text-2xl text-[#2b1d16] text-center">
          Share your experience
        </h3>
        <p className="mt-2 font-body text-sm text-[#6b4f3a] text-center">
          Your review will appear after the owner approves it.
        </p>

        {status === 'success' ? (
          <div className="mt-6 flex flex-col items-center gap-3 animate-fade-up">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c8a96a]/15">
              <CheckCircle2 className="h-7 w-7 text-[#c8a96a]" />
            </div>
            <p className="font-body text-sm text-[#6b4f3a]">
              Thank you! Your review is pending approval.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 font-body text-sm text-[#c8a96a] hover:underline"
            >
              Write another review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2">
                <User className="h-3.5 w-3.5" /> Your name
              </label>
              <input
                type="text"
                required
                value={form.author_name}
                onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2">
                <Star className="h-3.5 w-3.5" /> Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: star }))}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoverRating || form.rating)
                          ? 'fill-[#c8a96a] text-[#c8a96a]'
                          : 'fill-transparent text-[#6b4f3a]/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2">
                <MessageSquare className="h-3.5 w-3.5" /> Your review
              </label>
              <textarea
                rows={4}
                required
                value={form.review_text}
                onChange={(e) => setForm((p) => ({ ...p, review_text: e.target.value }))}
                placeholder="Tell us about your visit…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {status === 'error' && (
              <p className="font-body text-sm text-[#b5563a]">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2b1d16] px-8 py-3.5 font-body text-sm text-[#c8a96a] hover:bg-[#3a2a20] transition-all duration-300 disabled:opacity-60"
            >
              {status === 'submitting' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Submit review'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
