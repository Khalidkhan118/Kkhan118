import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/config';
import { K118Logo } from '../K118Logo';
import { ShieldCheck, Zap, Users, MessageSquareHeart } from 'lucide-react';
import regeneratedImage from '../../assets/images/regenerated_image_1790200824450.jpg';

interface LoginViewProps {
  onDemoLogin?: (demoUser: { uid: string; displayName: string; email: string; photoURL: string }) => void;
  isLoading?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onDemoLogin, isLoading = false }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In failed';
      console.warn('Google sign-in popup notice:', msg);
      setErrorMsg(msg);
    } finally {
      setIsSigningIn(false);
    }
  };

  const demoAccounts = [
    {
      uid: 'demo_user_khalid',
      displayName: 'Khalid Khan (You)',
      email: 'kkhalidkkhan118113@gmail.com',
      photoURL: regeneratedImage,
    },
    {
      uid: 'demo_user_sarah',
      displayName: 'Dr. Sarah Chen',
      email: 'sarah.chen@example.com',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
      uid: 'demo_user_alex',
      displayName: 'Alex Vance',
      email: 'alex.vance@example.com',
      photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    }
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#110e26] via-[#0d0d1a] to-[#070710] text-slate-100 overflow-y-auto">
      {/* Top Banner / Logo */}
      <div className="flex flex-col items-center justify-center pt-8 text-center">
        <div className="relative group cursor-pointer transition-transform hover:scale-105 duration-300">
          <K118Logo size="lg" showOnlineDot={true} />
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
          <span>K</span>
          <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
            118
          </span>
        </h1>
        <p className="text-xs text-purple-300/80 font-medium tracking-wide uppercase mt-1">
          Online Jetpack Compose Chat
        </p>

        <p className="mt-3 text-xs text-slate-400 max-w-[280px] leading-relaxed">
          Real-time, one-to-one encrypted messaging with live online presence and Cloud Firestore synchronization.
        </p>
      </div>

      {/* Feature Pills */}
      <div className="grid grid-cols-3 gap-2 my-4">
        <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col items-center text-center">
          <Zap className="w-5 h-5 text-amber-400 mb-1" />
          <span className="text-[11px] font-semibold text-slate-200">Sub-second</span>
          <span className="text-[9px] text-slate-500">Live Sync</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col items-center text-center">
          <ShieldCheck className="w-5 h-5 text-purple-400 mb-1" />
          <span className="text-[11px] font-semibold text-slate-200">Firebase</span>
          <span className="text-[9px] text-slate-500">Auth & Rules</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col items-center text-center">
          <Users className="w-5 h-5 text-emerald-400 mb-1" />
          <span className="text-[11px] font-semibold text-slate-200">Presence</span>
          <span className="text-[9px] text-slate-500">Online Dot</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pb-4">
        {errorMsg && (
          <div className="p-2.5 text-xs text-red-300 bg-red-950/40 border border-red-800/50 rounded-xl leading-tight">
            {errorMsg}
          </div>
        )}

        {/* Primary Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn || isLoading}
          className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-white/10 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
        </button>

        {/* Quick Demo Switcher Divider */}
        {onDemoLogin && (
          <div className="pt-2">
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0d0d1a] px-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Or Quick Test Profile
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.uid}
                  onClick={() => onDemoLogin(acc)}
                  className="p-2 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 text-center transition-all cursor-pointer flex flex-col items-center"
                >
                  <img
                    src={acc.photoURL}
                    alt={acc.displayName}
                    className="w-7 h-7 rounded-full object-cover border border-purple-400/40"
                  />
                  <span className="text-[10px] font-semibold text-slate-200 mt-1 truncate max-w-full">
                    {acc.displayName.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
