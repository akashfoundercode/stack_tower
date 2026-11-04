import React, { useState } from 'react';
import { X, LogIn, Phone, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { authService } from '../api';
import { UserProfileData } from '../api/types';
import { soundFx } from '../utils/sound';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfileData, token: string, wallet?: number) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mobile, setMobile] = useState<string>('1234567890');
  const [password, setPassword] = useState<string>('12345678');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim() || !password.trim()) {
      setErrorMsg('Please enter mobile number and password');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    soundFx.playClick();

    try {
      // 1. POST /api/login: Get authentication token
      const response = await authService.login({
        mobile: mobile.trim(),
        identity: mobile.trim(),
        password: password.trim(),
        country_code: '91',
      });

      const token = response.token || response.data?.token || '';

      // 2. GET /api/profile: Immediately fetch profile with the stored token
      const profileRes = await authService.fetchProfile(token);
      const user = profileRes.data || response.data;
      const liveWallet =
        typeof profileRes.wallet === 'number'
          ? profileRes.wallet
          : typeof profileRes.total_wallet === 'number'
          ? profileRes.total_wallet
          : typeof user.wallet === 'number'
          ? user.wallet
          : response.wallet ?? 21434.38;

      soundFx.speak('Login successful');
      onLoginSuccess(user, token, liveWallet);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed, please check credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    soundFx.playClick();
    setMobile('1234567890');
    setPassword('12345678');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-2 border-yellow-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_10px_50px_rgba(0,0,0,0.85)] flex flex-col relative overflow-hidden">
        {/* Top ambient glow */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <LogIn className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-mono">
                Player Login
              </h3>
              <p className="text-[10px] sm:text-xs text-amber-300/90 font-medium">
                Login with Token to Start Match
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Test Demo Fill Helper */}
        <div className="my-3 p-2.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-[11px]">Testing Credentials Available</span>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow font-mono"
          >
            Auto Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-500 text-rose-200 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          {/* Mobile / Identity */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Mobile Number / Identity
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition"
                required
              />
            </div>
          </div>

          {/* Security / Token Note */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Bearer Token will be stored for match authorization</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 border-t border-yellow-200 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2 font-mono"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[3]" />
                <span>Login & Start Match</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

