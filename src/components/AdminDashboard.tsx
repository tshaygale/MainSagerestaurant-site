import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Star,
  Mail,
  Users,
  Check,
  X,
  Trash2,
  LogOut,
  Loader2,
  Clock,
  Phone,
  MessageSquare,
  User,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

type Reservation = {
  id: string;
  guest_name: string;
  email: string;
  phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  special_requests: string | null;
  status: string;
  created_at: string;
};

type Review = {
  id: string;
  author_name: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

type Tab = 'reservations' | 'reviews' | 'messages';

export default function AdminDashboard() {
  const { session, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [resRes, resRev, resMsg] = await Promise.all([
      supabase.from('reservations').select('*').order('created_at', { ascending: false }),
      supabase.from('guest_reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ]);

    if (resRes.data) setReservations(resRes.data as Reservation[]);
    if (resRev.data) setReviews(resRev.data as Review[]);
    if (resMsg.data) setMessages(resMsg.data as ContactMessage[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/admin/signin');
      return;
    }
    if (session) fetchData();
  }, [session, authLoading, navigate, fetchData]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#2b1d16] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c8a96a]" />
      </div>
    );
  }

  if (!session) return null;

  const updateReservationStatus = async (id: string, status: string) => {
    await supabase.from('reservations').update({ status }).eq('id', id);
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const deleteReservation = async (id: string) => {
    await supabase.from('reservations').delete().eq('id', id);
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const approveReview = async (id: string) => {
    await supabase.from('guest_reviews').update({ is_approved: true }).eq('id', id);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_approved: true } : r)));
  };

  const deleteReview = async (id: string) => {
    await supabase.from('guest_reviews').delete().eq('id', id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const updateMessageStatus = async (id: string, status: string) => {
    await supabase.from('contact_messages').update({ status }).eq('id', id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const deleteMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const pendingReservations = reservations.filter((r) => r.status === 'pending').length;
  const pendingReviews = reviews.filter((r) => !r.is_approved).length;
  const newMessages = messages.filter((m) => m.status === 'new').length;

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (t: string) => {
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const tabBtn = (t: Tab, label: string, count: number) => (
    <button
      onClick={() => setTab(t)}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm transition-all duration-200 ${
        tab === t
          ? 'bg-[#c8a96a] text-[#2b1d16]'
          : 'bg-[#3a2a20] text-[#f7f3ee]/70 hover:text-[#c8a96a]'
      }`}
    >
      {label}
      {count > 0 && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          tab === t ? 'bg-[#2b1d16] text-[#c8a96a]' : 'bg-[#b5563a] text-[#f7f3ee]'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#2b1d16]">
      {/* Header */}
      <header className="border-b border-[#c8a96a]/15 bg-[#3a2a20]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="Maison Sage" className="h-10 w-36 object-contain" />
            <span className="font-serif-display text-xl text-[#c8a96a] hidden sm:block">Owner Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="font-body text-sm text-[#f7f3ee]/60 hover:text-[#c8a96a] transition-colors hidden sm:block">
              View site
            </a>
            <button
              onClick={async () => { await signOut(); navigate('/'); }}
              className="inline-flex items-center gap-2 rounded-full border border-[#c8a96a]/40 px-4 py-2 font-body text-sm text-[#c8a96a] hover:bg-[#c8a96a] hover:text-[#2b1d16] transition-all duration-300"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabBtn('reservations', 'Reservations', pendingReservations)}
          {tabBtn('reviews', 'Reviews', pendingReviews)}
          {tabBtn('messages', 'Messages', newMessages)}
        </div>

        {/* Reservations */}
        {tab === 'reservations' && (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <p className="font-body text-sm text-[#f7f3ee]/40 text-center py-20">No reservations yet.</p>
            ) : (
              reservations.map((r) => (
                <div key={r.id} className="rounded-2xl bg-[#3a2a20] border border-[#c8a96a]/10 p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#c8a96a]" />
                        <span className="font-serif-display text-lg text-[#f7f3ee]">{r.guest_name}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          r.status === 'pending' ? 'bg-[#b5563a]/20 text-[#b5563a]' :
                          r.status === 'confirmed' ? 'bg-[#8a9a6b]/20 text-[#8a9a6b]' :
                          'bg-[#f7f3ee]/10 text-[#f7f3ee]/40'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 font-body text-sm text-[#f7f3ee]/60">
                        <span className="flex items-center gap-1.5"><CalendarCheck className="h-3.5 w-3.5" /> {formatDate(r.reservation_date)}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {formatTime(r.reservation_time)}</span>
                        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {r.party_size} {r.party_size === 1 ? 'guest' : 'guests'}</span>
                        <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {r.email}</span>
                        <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {r.phone}</span>
                      </div>
                      {r.special_requests && (
                        <p className="font-body text-sm text-[#f7f3ee]/50 italic">
                          "{r.special_requests}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {r.status !== 'confirmed' && (
                        <button onClick={() => updateReservationStatus(r.id, 'confirmed')}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#8a9a6b]/20 px-3 py-2 font-body text-xs text-[#8a9a6b] hover:bg-[#8a9a6b]/30 transition-colors">
                          <Check className="h-3.5 w-3.5" /> Confirm
                        </button>
                      )}
                      {r.status !== 'cancelled' && (
                        <button onClick={() => updateReservationStatus(r.id, 'cancelled')}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#b5563a]/20 px-3 py-2 font-body text-xs text-[#b5563a] hover:bg-[#b5563a]/30 transition-colors">
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                      )}
                      <button onClick={() => deleteReservation(r.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#f7f3ee]/5 px-3 py-2 font-body text-xs text-[#f7f3ee]/40 hover:bg-[#f7f3ee]/10 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reviews */}
        {tab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="font-body text-sm text-[#f7f3ee]/40 text-center py-20">No reviews yet.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className={`rounded-2xl border p-5 ${
                  r.is_approved ? 'bg-[#3a2a20] border-[#8a9a6b]/15' : 'bg-[#3a2a20] border-[#b5563a]/20'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#c8a96a]" />
                        <span className="font-serif-display text-lg text-[#f7f3ee]">{r.author_name}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-[#c8a96a] text-[#c8a96a]" />
                          ))}
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          r.is_approved ? 'bg-[#8a9a6b]/20 text-[#8a9a6b]' : 'bg-[#b5563a]/20 text-[#b5563a]'
                        }`}>
                          {r.is_approved ? 'approved' : 'pending'}
                        </span>
                      </div>
                      <p className="font-body text-sm text-[#f7f3ee]/60 italic">"{r.review_text}"</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {!r.is_approved && (
                        <button onClick={() => approveReview(r.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#8a9a6b]/20 px-3 py-2 font-body text-xs text-[#8a9a6b] hover:bg-[#8a9a6b]/30 transition-colors">
                          <Check className="h-3.5 w-3.5" /> Approve
                        </button>
                      )}
                      <button onClick={() => deleteReview(r.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#f7f3ee]/5 px-3 py-2 font-body text-xs text-[#f7f3ee]/40 hover:bg-[#f7f3ee]/10 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Messages */}
        {tab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="font-body text-sm text-[#f7f3ee]/40 text-center py-20">No messages yet.</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="rounded-2xl bg-[#3a2a20] border border-[#c8a96a]/10 p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#c8a96a]" />
                        <span className="font-serif-display text-lg text-[#f7f3ee]">{m.subject}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          m.status === 'new' ? 'bg-[#b5563a]/20 text-[#b5563a]' :
                          m.status === 'read' ? 'bg-[#c8a96a]/20 text-[#c8a96a]' :
                          'bg-[#f7f3ee]/10 text-[#f7f3ee]/40'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 font-body text-sm text-[#f7f3ee]/60">
                        <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {m.name}</span>
                        <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {m.email}</span>
                      </div>
                      <p className="font-body text-sm text-[#f7f3ee]/50 italic">"{m.message}"</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {m.status !== 'read' && (
                        <button onClick={() => updateMessageStatus(m.id, 'read')}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#c8a96a]/15 px-3 py-2 font-body text-xs text-[#c8a96a] hover:bg-[#c8a96a]/25 transition-colors">
                          <Check className="h-3.5 w-3.5" /> Mark read
                        </button>
                      )}
                      <button onClick={() => updateMessageStatus(m.id, 'archived')}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#f7f3ee]/5 px-3 py-2 font-body text-xs text-[#f7f3ee]/40 hover:bg-[#f7f3ee]/10 transition-colors">
                          Archive
                        </button>
                      <button onClick={() => deleteMessage(m.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#f7f3ee]/5 px-3 py-2 font-body text-xs text-[#f7f3ee]/40 hover:bg-[#f7f3ee]/10 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
