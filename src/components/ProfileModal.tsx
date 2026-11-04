import React, { useState } from 'react';
import { X, User, Wallet, RefreshCw, Save, LogOut, CheckCircle2, ShieldCheck, Phone } from 'lucide-react';
import { authService } from '../api';
import { UserProfileData } from '../api/types';
import { soundFx } from '../utils/sound';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfileData | null;
  walletBalance: number;
  onProfileUpdated: (updatedUser: UserProfileData, newBalance: number) => void;
  onLogout: () => void;
}

const AVATAR_OPTIONS = [
  { id: '1', label: 'Pro Pilot', color: 'from-amber-400 to-orange-500' },
  { id: '2', label: 'Cyber Ace', color: 'from-cyan-400 to-blue-600' },
  { id: '3', label: 'Neon Highroller', color: 'from-emerald-400 to-teal-600' },
  { id: '4', label: 'Golden Master', color: 'from-yellow-300 to-amber-600' },
  { id: '5', label: 'Shadow Boss', color: 'from-purple-500 to-pink-600' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  walletBalance,
  onProfileUpdated,
  onLogout,
}) => {
  const [username, setUsername] = useState<string>(currentUser?.username || 'Player');
  const [userimage, setUserimage] = useState<string>(currentUser?.userimage || '1');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  // Sync state if currentUser changes
  const activeUser = currentUser || {
    id: 1,
    username: 'Admin',
    userimage: 'https://root.bdgcassino.com/uploads/profileimage/4.png',
    mobile: '1234567890',
    email: 'admin@gmail.com',
    u_id: 'ADMIN_123',
    wallet: walletBalance,
    total_wallet: walletBalance,
    winning_wallet: 13867.48,
  };

  // Fetch Live Profile & Wallet Balance (GET /api/profile)
  const handleRefreshProfile = async () => {
    setIsRefreshing(true);
    setNotification(null);
    soundFx.playClick();

    try {
      const response = await authService.fetchProfile();
      const liveWallet =
        typeof response.wallet === 'number'
          ? response.wallet
          : typeof response.total_wallet === 'number'
          ? response.total_wallet
          : response.data?.wallet ?? response.data?.total_wallet ?? walletBalance;

      const updatedUser: UserProfileData = {
        ...activeUser,
        ...(response.data || {}),
        wallet: liveWallet,
        total_wallet: response.total_wallet ?? liveWallet,
      };

      onProfileUpdated(updatedUser, liveWallet);
      setNotification({
        type: 'success',
        message: `Wallet refreshed: ₹${liveWallet.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      });
      soundFx.speak('Wallet updated');
    } catch {
      setNotification({
        type: 'error',
        message: 'Failed to refresh profile',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update Profile (POST /api/update_profile)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setNotification({ type: 'error', message: 'Username cannot be empty' });
      return;
    }

    setIsUpdating(true);
    setNotification(null);
    soundFx.playClick();

    try {
      const res = await authService.updateProfile({
        username: username.trim(),
        userimage: userimage,
      });

      const updatedUser: UserProfileData = {
        ...activeUser,
        username: username.trim(),
        userimage: userimage,
      };

      onProfileUpdated(updatedUser, walletBalance);
      setNotification({
        type: 'success',
        message: res.message || 'Profile updated successfully!',
      });
      soundFx.speak('Profile updated');
    } catch {
      setNotification({
        type: 'error',
        message: 'Failed to update profile',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_10px_50px_rgba(0,0,0,0.85)] flex flex-col relative overflow-hidden">
        {/* Top ambient highlight */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 overflow-hidden">
              {activeUser.userimage && activeUser.userimage.startsWith('http') ? (
                <img
                  src={activeUser.userimage}
                  alt={activeUser.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-mono">
                Player Profile
              </h3>
              <p className="text-[10px] sm:text-xs text-emerald-400/90 font-medium">
                Live Account & Wallet Details
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

        {/* Notification Banner */}
        {notification && (
          <div
            className={`mt-3 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-500 text-rose-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Live Wallet Box (from GET /api/profile) */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                Live Wallet Balance
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                  ₹{walletBalance.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-[10px] font-extrabold text-amber-300 font-mono">INR</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleRefreshProfile}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 transition active:scale-95 disabled:opacity-50"
            title="Refresh Wallet from /api/profile"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* User Identity Info */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">USER ID</span>
            <span className="text-white font-bold">{activeUser.u_id || activeUser.id}</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" /> MOBILE
            </span>
            <span className="text-white font-bold truncate block">{activeUser.mobile || 'N/A'}</span>
          </div>
        </div>

        {/* Update Profile Form (POST /api/update_profile) */}
        <form onSubmit={handleUpdateProfile} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Player Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. NewPlayerName"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400 transition"
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Choose Avatar (userimage)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = userimage === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setUserimage(avatar.id);
                    }}
                    className={`h-10 rounded-xl bg-gradient-to-tr ${avatar.color} flex items-center justify-center font-mono font-black text-xs text-white shadow transition-all ${
                      isSelected
                        ? 'ring-2 ring-white scale-105 shadow-lg'
                        : 'opacity-60 hover:opacity-100 hover:scale-100'
                    }`}
                    title={avatar.label}
                  >
                    #{avatar.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons: Save Profile & Logout */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md border-t border-emerald-300 active:scale-98 transition flex items-center justify-center gap-1.5 font-mono disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Update Profile</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onLogout();
                onClose();
              }}
              className="h-10 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition flex items-center gap-1 active:scale-95"
              title="Logout session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </form>

        {/* Security badge */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bearer token active for Stack Tower matches</span>
        </div>
      </div>
    </div>
  );
};

