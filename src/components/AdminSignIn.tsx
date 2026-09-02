import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogIn, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminSignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[#6b4f3a]/20 bg-[#f7f3ee] px-4 py-3 pl-11 font-body text-sm text-[#2b1d16] placeholder-[#6b4f3a]/40 focus:border-[#c8a96a] focus:outline-none focus:ring-1 focus:ring-[#c8a96a] transition-all duration-200';

  return (
    <div className="min-h-screen bg-[#2b1d16] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/logo.svg" alt="Maison Sage" className="h-14 w-52 object-contain mx-auto mb-6" />
          <h1 className="font-serif-display text-3xl text-[#f7f3ee]">Owner Sign In</h1>
          <p className="mt-2 font-body text-sm text-[#f7f3ee]/50">
            Manage reservations, reviews, and messages
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-[#3a2a20] border border-[#c8a96a]/15 p-8 space-y-5"
        >
          <div className="relative">
            <label className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#f7f3ee]/60 mb-2">
              <Mail className="h-3.5 w-3.5" /> Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@maisonsage.cafe"
              className={inputClass}
            />
            <Mail className="absolute left-4 top-[42px] h-4 w-4 text-[#6b4f3a]/40 pointer-events-none" />
          </div>

          <div className="relative">
            <label className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-[#f7f3ee]/60 mb-2">
              <Lock className="h-3.5 w-3.5" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
            <Lock className="absolute left-4 top-[42px] h-4 w-4 text-[#6b4f3a]/40 pointer-events-none" />
          </div>

          {error && (
            <div className="rounded-xl bg-[#b5563a]/15 border border-[#b5563a]/30 px-4 py-3">
              <p className="font-body text-sm text-[#b5563a]">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#c8a96a] px-8 py-3.5 font-body text-sm text-[#2b1d16] hover:bg-[#d8b97a] transition-all duration-300 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" /> Sign in
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-xs text-[#f7f3ee]/30">
          This area is for the restaurant owner only.
        </p>
      </div>
    </div>
  );
}
