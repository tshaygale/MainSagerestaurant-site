import { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Loader2,
  CalendarCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/useReveal';

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
];

const partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

type FormState = {
  guest_name: string;
  email: string;
  phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  special_requests: string;
};

const initialForm: FormState = {
  guest_name: '',
  email: '',
  phone: '',
  party_size: 2,
  reservation_date: '',
  reservation_time: '',
  special_requests: '',
};

export default function ReservationSection() {
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

    const { error } = await supabase.from('reservations').insert({
      guest_name: form.guest_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      party_size: form.party_size,
      reservation_date: form.reservation_date,
      reservation_time: form.reservation_time,
      special_requests: form.special_requests.trim() || null,
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
    <section id="reservations" className="relative bg-[#efe7db] py-24 lg:py-32 pt-32 overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-[#c8a96a]/10 blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-6 lg:px-10">
        <div
          ref={ref}
          className={`reveal ${visible ? 'is-visible' : ''} text-center`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a96a]/40 px-4 py-1.5 mb-6">
            <CalendarCheck className="h-3.5 w-3.5 text-[#c8a96a]" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-[#c8a96a]">
              Book a Table
            </span>
          </div>
          <h2 className="font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
            Reserve your seat
          </h2>
          <p className="mt-4 font-body text-[#6b4f3a] leading-relaxed max-w-md mx-auto">
            Tell us when you're coming and how many seats you need. We'll send
            a confirmation to your email.
          </p>
        </div>

        {status === 'success' ? (
          <div className="mt-12 rounded-3xl bg-[#f7f3ee] border border-[#c8a96a]/20 p-10 text-center animate-fade-up">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c8a96a]/15">
              <CheckCircle2 className="h-8 w-8 text-[#c8a96a]" />
            </div>
            <h3 className="mt-6 font-serif-display text-2xl text-[#2b1d16]">
              Request received!
            </h3>
            <p className="mt-3 font-body text-sm text-[#6b4f3a] leading-relaxed max-w-sm mx-auto">
              Thank you — we've got your reservation request. Check your email
              for a confirmation shortly.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 inline-flex items-center rounded-full border border-[#c8a96a]/50 px-6 py-2.5 font-body text-sm text-[#c8a96a] hover:bg-[#c8a96a] hover:text-[#2b1d16] transition-all duration-300"
            >
              Make another reservation
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-12 rounded-3xl bg-[#f7f3ee] border border-[#6b4f3a]/10 p-6 lg:p-10 space-y-6"
          >
            {/* Name */}
            <div>
              <label className={labelClass} htmlFor="guest_name">
                <User className="h-3.5 w-3.5" /> Full name
              </label>
              <input
                id="guest_name"
                type="text"
                required
                value={form.guest_name}
                onChange={(e) => update('guest_name', e.target.value)}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} htmlFor="email">
                  <Mail className="h-3.5 w-3.5" /> Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="jane@email.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Party size */}
            <div>
              <label className={labelClass} htmlFor="party_size">
                <Users className="h-3.5 w-3.5" /> Party size
              </label>
              <div className="flex flex-wrap gap-2">
                {partySizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => update('party_size', size)}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                      form.party_size === size
                        ? 'bg-[#c8a96a] text-[#2b1d16] shadow-md scale-105'
                        : 'bg-[#efe7db] text-[#6b4f3a] border border-[#6b4f3a]/15 hover:border-[#c8a96a]/50 hover:text-[#c8a96a]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
                <span className="flex items-center px-2 font-body text-xs text-[#6b4f3a]/50">
                  For larger parties, call us
                </span>
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} htmlFor="reservation_date">
                  <Calendar className="h-3.5 w-3.5" /> Date
                </label>
                <input
                  id="reservation_date"
                  type="date"
                  required
                  min={today}
                  value={form.reservation_date}
                  onChange={(e) => update('reservation_date', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="reservation_time">
                  <Clock className="h-3.5 w-3.5" /> Time
                </label>
                <select
                  id="reservation_time"
                  required
                  value={form.reservation_time}
                  onChange={(e) => update('reservation_time', e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Special requests */}
            <div>
              <label className={labelClass} htmlFor="special_requests">
                <MessageSquare className="h-3.5 w-3.5" /> Special requests{' '}
                <span className="normal-case lowercase text-[#f7f3ee]/30">
                  (optional)
                </span>
              </label>
              <textarea
                id="special_requests"
                rows={3}
                value={form.special_requests}
                onChange={(e) => update('special_requests', e.target.value)}
                placeholder="Dietary needs, birthday surprise, window seat preference…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Error message */}
            {status === 'error' && errorMsg && (
              <div className="rounded-xl bg-[#b5563a]/15 border border-[#b5563a]/30 px-4 py-3">
                <p className="font-body text-sm text-[#b5563a]">{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#c8a96a] px-8 py-4 font-body text-sm tracking-wide text-[#2b1d16] hover:bg-[#d8b97a] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending request…
                </>
              ) : (
                <>
                  <CalendarCheck className="h-4 w-4" />
                  Request reservation
                </>
              )}
            </button>

            <p className="text-center font-body text-xs text-[#6b4f3a]/50">
              We'll confirm by email within a few hours. Walk-ins are always
              welcome too.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
