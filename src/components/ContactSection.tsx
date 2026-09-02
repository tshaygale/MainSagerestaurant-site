import { useState } from 'react';
import {
  Mail,
  Phone,
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare,
  User,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/useReveal';

export default function ContactSection() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg(null);

    const { error } = await supabase.from('contact_messages').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });

    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or email us directly.');
      return;
    }

    setStatus('success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputClass =
    'w-full rounded-xl border border-[#6b4f3a]/20 bg-[#f7f3ee] px-4 py-3 font-body text-sm text-[#2b1d16] placeholder-[#6b4f3a]/40 focus:border-[#c8a96a] focus:outline-none focus:ring-1 focus:ring-[#c8a96a] transition-all duration-200';
  const labelClass = 'flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#6b4f3a] mb-2';

  return (
    <section id="contact" className="bg-[#efe7db] py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} text-center`}>
          <span className="font-body text-xs tracking-[0.3em] uppercase text-[#b5563a]">
            Get in Touch
          </span>
          <h2 className="mt-4 font-serif-display text-4xl lg:text-5xl text-[#2b1d16]">
            Send us a message
          </h2>
          <p className="mt-4 font-body text-[#6b4f3a] leading-relaxed max-w-md mx-auto">
            Questions about private events, catering, or anything else? We'd love
            to hear from you.
          </p>
        </div>

        {status === 'success' ? (
          <div className="mt-12 rounded-3xl bg-[#f7f3ee] border border-[#c8a96a]/20 p-10 text-center animate-fade-up">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c8a96a]/15">
              <CheckCircle2 className="h-8 w-8 text-[#c8a96a]" />
            </div>
            <h3 className="mt-6 font-serif-display text-2xl text-[#2b1d16]">Message sent!</h3>
            <p className="mt-3 font-body text-sm text-[#6b4f3a] leading-relaxed">
              Thanks for reaching out. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 inline-flex items-center rounded-full border border-[#c8a96a]/50 px-6 py-2.5 font-body text-sm text-[#c8a96a] hover:bg-[#c8a96a] hover:text-[#2b1d16] transition-all duration-300"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-12 rounded-3xl bg-[#f7f3ee] border border-[#6b4f3a]/10 p-6 lg:p-10 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} htmlFor="c_name">
                  <User className="h-3.5 w-3.5" /> Name
                </label>
                <input
                  id="c_name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="c_email">
                  <Mail className="h-3.5 w-3.5" /> Email
                </label>
                <input
                  id="c_email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="c_subject">
                <MessageSquare className="h-3.5 w-3.5" /> Subject
              </label>
              <input
                id="c_subject"
                type="text"
                required
                value={form.subject}
                onChange={(e) => update('subject', e.target.value)}
                placeholder="Private event inquiry, catering, feedback…"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="c_message">
                <MessageSquare className="h-3.5 w-3.5" /> Message
              </label>
              <textarea
                id="c_message"
                rows={4}
                required
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="Tell us what you need…"
                className={`${inputClass} resize-none`}
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2b1d16] px-8 py-4 font-body text-sm tracking-wide text-[#c8a96a] hover:bg-[#3a2a20] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send message
                </>
              )}
            </button>
          </form>
        )}

        {/* Quick contact info */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6 text-center">
          <div className="flex items-center justify-center gap-2 font-body text-sm text-[#6b4f3a]">
            <Phone className="h-4 w-4 text-[#b5563a]" /> +1 (555) 014-2278
          </div>
          <div className="flex items-center justify-center gap-2 font-body text-sm text-[#6b4f3a]">
            <Mail className="h-4 w-4 text-[#b5563a]" /> hello@maisonsage.cafe
          </div>
        </div>
      </div>
    </section>
  );
}
