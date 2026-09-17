import { useState } from 'react';
import {
  CalendarDays,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Send,
  PartyPopper,
  Building2,
  Utensils,
  Home,
} from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useReveal } from '@/hooks/useReveal';
import { supabase } from '@/lib/supabase';

const eventTypes = [
  { key: 'Private Event', icon: PartyPopper, desc: 'Birthday, anniversary, or gathering' },
  { key: 'Corporate Catering', icon: Building2, desc: 'Office coffee cart or meeting catering' },
  { key: 'Venue Rental', icon: Home, desc: 'Book our space for your event' },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  message: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  event_type: 'Private Event',
  event_date: '',
  guest_count: 10,
  message: '',
};

export default function CateringPage() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const update = (field: keyof FormState, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg(null);

    const { error } = await supabase.from('catering_requests').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      event_type: form.event_type,
      event_date: form.event_date,
      guest_count: form.guest_count,
      message: form.message.trim() || null,
    });

    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or call us directly.');
      return;
    }

    setStatus('success');
    setForm(initialForm);
  };

  const inputClass =
    'w-full rounded-xl border border-[#6b4f3a]/20 bg-[#f7f3ee] px-4 py-3 font-body text-sm text-[#2b1d16] placeholder-[#6b4f3a]/40 focus:border-[#c8a96a] focus:outline-none focus:ring-1 focus:ring-[#c8a96a] transition-all duration-200';
  const labelClass =
    'flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2';

  return (
    <PageLayout>
      <section className="bg-[#efe7db] pt-32 pb-24 lg:pb-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} text-center`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a96a]/40 px-4 py-1.5 mb-6">
              <Utensils className="h-3.5 w-3.5 text-[#c8a96a]" />
              <span className="font-body text-xs tracking-[0.25em] uppercase text-[#c8a96a]">
                Catering &amp; Events
              </span>
            </div>
            <h2 className="font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
              Let's host your next event
            </h2>
            <p className="mt-4 font-body text-[#6b4f3a] leading-relaxed max-w-md mx-auto">
              From corporate coffee carts to private parties and venue rentals —
              tell us what you're planning and we'll make it happen.
            </p>
          </div>

          {/* Event type cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {eventTypes.map(({ key, icon: Icon, desc }) => (
              <button key={key} type="button" onClick={() => update('event_type', key)}
                className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                  form.event_type === key
                    ? 'bg-[#c8a96a] border-[#c8a96a] shadow-md scale-[1.02]'
                    : 'bg-[#f7f3ee] border-[#6b4f3a]/10 hover:border-[#c8a96a]/50'
                }`}>
                <Icon className={`h-7 w-7 ${form.event_type === key ? 'text-[#2b1d16]' : 'text-[#c8a96a]'}`} />
                <h3 className={`mt-3 font-serif-display text-base ${form.event_type === key ? 'text-[#2b1d16]' : 'text-[#2b1d16]'}`}>{key}</h3>
                <p className="mt-1 font-body text-xs text-[#6b4f3a] leading-relaxed">{desc}</p>
              </button>
            ))}
          </div>

          {status === 'success' ? (
            <div className="mt-10 rounded-3xl bg-[#f7f3ee] border border-[#c8a96a]/20 p-10 text-center animate-fade-up">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c8a96a]/15">
                <CheckCircle2 className="h-8 w-8 text-[#c8a96a]" />
              </div>
              <h3 className="mt-6 font-serif-display text-2xl text-[#2b1d16]">Request received!</h3>
              <p className="mt-3 font-body text-sm text-[#6b4f3a] leading-relaxed max-w-sm mx-auto">
                Thank you — we'll review your request and get back to you within
                24 hours to discuss the details.
              </p>
              <button onClick={() => setStatus('idle')}
                className="mt-8 inline-flex items-center rounded-full border border-[#c8a96a]/50 px-6 py-2.5 font-body text-sm text-[#c8a96a] hover:bg-[#c8a96a] hover:text-[#2b1d16] transition-all duration-300">
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 rounded-3xl bg-[#f7f3ee] border border-[#6b4f3a]/10 p-6 lg:p-10 space-y-6">
              {/* Name */}
              <div>
                <label className={labelClass} htmlFor="cat_name"><User className="h-3.5 w-3.5" /> Full name</label>
                <input id="cat_name" type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Doe" className={inputClass} />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="cat_email"><Mail className="h-3.5 w-3.5" /> Email</label>
                  <input id="cat_email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@email.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="cat_phone"><Phone className="h-3.5 w-3.5" /> Phone</label>
                  <input id="cat_phone" type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" className={inputClass} />
                </div>
              </div>

              {/* Date + Guest count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="cat_date"><CalendarDays className="h-3.5 w-3.5" /> Event date</label>
                  <input id="cat_date" type="date" required min={today} value={form.event_date} onChange={(e) => update('event_date', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="cat_guests"><Users className="h-3.5 w-3.5" /> Guest count</label>
                  <input id="cat_guests" type="number" required min={1} max={500} value={form.guest_count} onChange={(e) => update('guest_count', parseInt(e.target.value) || 1)} className={inputClass} />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={labelClass} htmlFor="cat_message"><MessageSquare className="h-3.5 w-3.5" /> Tell us about your event</label>
                <textarea id="cat_message" rows={4} value={form.message} onChange={(e) => update('message', e.target.value)}
                  placeholder="What kind of event? Any dietary needs, timing, budget range, or special requests?"
                  className={`${inputClass} resize-none`} />
              </div>

              {status === 'error' && errorMsg && (
                <div className="rounded-xl bg-[#b5563a]/15 border border-[#b5563a]/30 px-4 py-3">
                  <p className="font-body text-sm text-[#b5563a]">{errorMsg}</p>
                </div>
              )}

              <button type="submit" disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#c8a96a] px-8 py-4 font-body text-sm tracking-wide text-[#2b1d16] hover:bg-[#d8b97a] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed">
                {status === 'submitting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending request…</> : <><Send className="h-4 w-4" /> Send request</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
