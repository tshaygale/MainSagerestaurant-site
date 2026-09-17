import { useState, useEffect } from 'react';
import { Award, Coffee, Loader2, CheckCircle2, User, Mail, Gift } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useReveal } from '@/hooks/useReveal';
import { supabase } from '@/lib/supabase';

type LoyaltyMember = {
  id: string;
  name: string;
  email: string;
  points: number;
  stamps: number;
};

export default function LoyaltyPage() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [member, setMember] = useState<LoyaltyMember | null>(null);
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupStatus, setLookupStatus] = useState<'idle' | 'searching' | 'notfound'>('idle');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg(null);

    const { data, error } = await supabase
      .from('loyalty_members')
      .insert({ name: name.trim(), email: email.trim().toLowerCase() })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        setStatus('error');
        setErrorMsg('You are already a member! Look up your account below.');
      } else {
        setStatus('error');
        setErrorMsg('Something went wrong. Please try again.');
      }
      return;
    }

    setStatus('success');
    setMember(data as LoyaltyMember);
    setName('');
    setEmail('');
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupStatus('searching');

    const { data, error } = await supabase
      .from('loyalty_members')
      .select('*')
      .eq('email', lookupEmail.trim().toLowerCase())
      .single();

    if (error || !data) {
      setLookupStatus('notfound');
      return;
    }

    setMember(data as LoyaltyMember);
    setLookupStatus('idle');
  };

  useEffect(() => {
    if (member) {
      const el = document.getElementById('loyalty-card');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [member]);

  const inputClass =
    'w-full rounded-xl border border-[#6b4f3a]/20 bg-[#f7f3ee] px-4 py-3 font-body text-sm text-[#2b1d16] placeholder-[#6b4f3a]/40 focus:border-[#c8a96a] focus:outline-none focus:ring-1 focus:ring-[#c8a96a] transition-all duration-200';
  const labelClass =
    'flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2';

  return (
    <PageLayout>
      <section className="bg-[#efe7db] pt-32 pb-24 lg:pb-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} text-center`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a96a]/40 px-4 py-1.5 mb-6">
              <Award className="h-3.5 w-3.5 text-[#c8a96a]" />
              <span className="font-body text-xs tracking-[0.25em] uppercase text-[#c8a96a]">
                Rewards
              </span>
            </div>
            <h2 className="font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
              The Daily Cup Club
            </h2>
            <p className="mt-4 font-body text-[#6b4f3a] leading-relaxed max-w-md mx-auto">
              Earn points on every order and collect coffee stamps. Get a free
              coffee after your 10th visit.
            </p>
          </div>

          {/* How it works */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-[#f7f3ee] border border-[#6b4f3a]/10 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#c8a96a]/15">
                <Gift className="h-7 w-7 text-[#c8a96a]" />
              </div>
              <h3 className="mt-4 font-serif-display text-lg text-[#2b1d16]">1 point per $1</h3>
              <p className="mt-2 font-body text-sm text-[#6b4f3a] leading-relaxed">
                Every dollar you spend on food and drinks earns you a loyalty point.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f7f3ee] border border-[#6b4f3a]/10 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#c8a96a]/15">
                <Coffee className="h-7 w-7 text-[#c8a96a]" />
              </div>
              <h3 className="mt-4 font-serif-display text-lg text-[#2b1d16]">Stamp card</h3>
              <p className="mt-2 font-body text-sm text-[#6b4f3a] leading-relaxed">
                Get a stamp for every coffee. Collect 9 stamps and your 10th
                coffee is on us.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f7f3ee] border border-[#6b4f3a]/10 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#c8a96a]/15">
                <Award className="h-7 w-7 text-[#c8a96a]" />
              </div>
              <h3 className="mt-4 font-serif-display text-lg text-[#2b1d16]">Redeem rewards</h3>
              <p className="mt-2 font-body text-sm text-[#6b4f3a] leading-relaxed">
                100 points gets you a free pastry. 250 points earns a free
                brunch plate.
              </p>
            </div>
          </div>

          {/* Join form */}
          {status === 'success' && member ? (
            <div id="loyalty-card" className="mt-12 rounded-3xl bg-[#2b1d16] border border-[#c8a96a]/20 p-8 animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="h-6 w-6 text-[#c8a96a]" />
                <h3 className="font-serif-display text-2xl text-[#f7f3ee]">Welcome to the club!</h3>
              </div>
              <p className="font-body text-sm text-[#f7f3ee]/60 mb-6">
                Your digital loyalty card is below. Show this at the counter when
                you order.
              </p>
              <LoyaltyCard member={member} />
            </div>
          ) : (
            <form onSubmit={handleJoin} className="mt-12 rounded-3xl bg-[#f7f3ee] border border-[#6b4f3a]/10 p-6 lg:p-10 space-y-5">
              <h3 className="font-serif-display text-2xl text-[#2b1d16] text-center">Join the club</h3>
              <div>
                <label className={labelClass} htmlFor="loyalty_name">
                  <User className="h-3.5 w-3.5" /> Full name
                </label>
                <input id="loyalty_name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="loyalty_email">
                  <Mail className="h-3.5 w-3.5" /> Email
                </label>
                <input id="loyalty_email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@email.com" className={inputClass} />
              </div>
              {status === 'error' && errorMsg && (
                <div className="rounded-xl bg-[#b5563a]/15 border border-[#b5563a]/30 px-4 py-3">
                  <p className="font-body text-sm text-[#b5563a]">{errorMsg}</p>
                </div>
              )}
              <button type="submit" disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#c8a96a] px-8 py-4 font-body text-sm tracking-wide text-[#2b1d16] hover:bg-[#d8b97a] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60">
                {status === 'submitting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Joining…</> : <><Award className="h-4 w-4" /> Join the club</>}
              </button>
            </form>
          )}

          {/* Lookup existing member */}
          {!member && (
            <form onSubmit={handleLookup} className="mt-6 rounded-2xl bg-[#f7f3ee] border border-[#6b4f3a]/10 p-6 space-y-4">
              <h3 className="font-serif-display text-lg text-[#2b1d16] text-center">Already a member? Look up your card</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="email" required value={lookupEmail} onChange={(e) => setLookupEmail(e.target.value)} placeholder="your@email.com" className={inputClass} />
                <button type="submit" disabled={lookupStatus === 'searching'}
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full border border-[#c8a96a]/50 px-6 py-3 font-body text-sm text-[#c8a96a] hover:bg-[#c8a96a] hover:text-[#2b1d16] transition-all duration-300 disabled:opacity-60">
                  {lookupStatus === 'searching' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />} Find my card
                </button>
              </div>
              {lookupStatus === 'notfound' && (
                <p className="font-body text-sm text-[#b5563a] text-center">No account found with that email. Join above!</p>
              )}
            </form>
          )}

          {/* Show member card from lookup */}
          {member && status !== 'success' && (
            <div id="loyalty-card" className="mt-8 rounded-3xl bg-[#2b1d16] border border-[#c8a96a]/20 p-8 animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif-display text-xl text-[#f7f3ee]">Your loyalty card</h3>
                <button onClick={() => setMember(null)} className="font-body text-xs text-[#f7f3ee]/40 hover:text-[#c8a96a] transition-colors">Close</button>
              </div>
              <LoyaltyCard member={member} />
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

function LoyaltyCard({ member }: { member: LoyaltyMember }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#3a2a20] to-[#2b1d16] border border-[#c8a96a]/20 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-[#c8a96a]/70">The Daily Cup</p>
          <p className="font-serif-display text-xl text-[#f7f3ee] mt-1">{member.name}</p>
          <p className="font-body text-xs text-[#f7f3ee]/40 mt-0.5">{member.email}</p>
        </div>
        <Award className="h-10 w-10 text-[#c8a96a]" />
      </div>
      <div className="mt-6 flex items-center gap-6">
        <div>
          <p className="font-serif-display text-3xl text-[#c8a96a]">{member.points}</p>
          <p className="font-body text-xs text-[#f7f3ee]/50">points</p>
        </div>
        <div className="flex-1">
          <div className="flex gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                i < member.stamps ? 'bg-[#c8a96a] text-[#2b1d16]' : 'bg-[#f7f3ee]/5 text-[#f7f3ee]/20 border border-[#f7f3ee]/10'
              }`}>
                {i < member.stamps ? <Coffee className="h-4 w-4" /> : i + 1}
              </div>
            ))}
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#8a9a6b]/20 text-[#8a9a6b] text-lg font-bold">10</div>
          </div>
          <p className="mt-2 font-body text-xs text-[#f7f3ee]/40">{member.stamps} / 9 stamps — 10th coffee free!</p>
        </div>
      </div>
    </div>
  );
}
