import { useState } from 'react';
import { Mail, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/useReveal';

export default function NewsletterSection() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg(null);

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim() });

    if (error) {
      if (error.code === '23505') {
        setStatus('success');
        setEmail('');
        return;
      }
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
      return;
    }

    setStatus('success');
    setEmail('');
  };

  return (
    <section className="bg-[#2b1d16] py-16 lg:py-20">
      <div className="max-w-2xl mx-auto px-6 lg:px-10">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a96a]/40 px-4 py-1.5 mb-6">
            <Mail className="h-3.5 w-3.5 text-[#c8a96a]" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-[#c8a96a]">
              Stay in the loop
            </span>
          </div>
          <h2 className="font-serif-display text-3xl lg:text-4xl text-[#f7f3ee]">
            Seasonal updates, straight to your inbox
          </h2>
          <p className="mt-4 font-body text-sm text-[#f7f3ee]/60 leading-relaxed">
            New menu drops, special events, and the occasional recipe. No spam —
            just the good stuff, a few times a season.
          </p>

          {status === 'success' ? (
            <div className="mt-8 flex flex-col items-center gap-3 animate-fade-up">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c8a96a]/15">
                <CheckCircle2 className="h-7 w-7 text-[#c8a96a]" />
              </div>
              <p className="font-body text-sm text-[#c8a96a]">
                You're subscribed! Welcome to the table.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-full border border-[#f7f3ee]/20 bg-[#3a2a20] px-5 py-3 font-body text-sm text-[#f7f3ee] placeholder-[#f7f3ee]/30 focus:border-[#c8a96a] focus:outline-none transition-all duration-200"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c8a96a] px-6 py-3 font-body text-sm text-[#2b1d16] hover:bg-[#d8b97a] transition-all duration-300 disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Subscribe <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {status === 'error' && errorMsg && (
            <p className="mt-4 font-body text-sm text-[#b5563a]">{errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}
