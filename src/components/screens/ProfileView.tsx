import React, { useState } from 'react';
import { UserProfile, PresenceStatus } from '../../types/chat';
import {
  ArrowLeft,
  Camera,
  Check,
  Edit2,
  LogOut,
  Mail,
  User,
  Shield,
  Sparkles,
} from 'lucide-react';
import regeneratedImage from '../../assets/images/regenerated_image_1790200824450.jpg';

interface ProfileViewProps {
  currentUser: UserProfile;
  onBack: () => void;
  onUpdateStatus: (status: PresenceStatus) => Promise<void>;
  onUpdateBio: (bio: string) => Promise<void>;
  onUpdatePhoto: (photoURL: string) => Promise<void>;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onBack,
  onUpdateStatus,
  onUpdateBio,
  onUpdatePhoto,
  onSignOut,
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio || '');
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  const statusOptions: { value: PresenceStatus; label: string; color: string; desc: string }[] = [
    { value: 'online', label: 'Online', color: 'bg-emerald-500', desc: 'Visible and active in chat' },
    { value: 'away', label: 'Away', color: 'bg-amber-400', desc: 'Temporarily stepped away' },
    { value: 'busy', label: 'Do Not Disturb', color: 'bg-red-500', desc: 'Busy with other tasks' },
    { value: 'offline', label: 'Appear Offline', color: 'bg-slate-500', desc: 'Hide active status' },
  ];

  const presetPhotos = [
    regeneratedImage,
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  ];

  const handleSaveBio = async () => {
    setIsSavingBio(true);
    try {
      await onUpdateBio(bioInput);
      setIsEditingBio(false);
    } finally {
      setIsSavingBio(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#090912] text-slate-100 overflow-y-auto">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-[#111122]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-white">User Profile</h2>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Avatar & Display Name */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL.includes('photo-1535713875002-d1d0cf377fde') ? regeneratedImage : currentUser.photoURL}
                alt={currentUser.displayName}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-600/30 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center ring-4 ring-purple-600/30">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Change photo button */}
            <button
              onClick={() => setShowPhotoPicker(!showPhotoPicker)}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg border-2 border-[#090912] transition-transform hover:scale-110 cursor-pointer"
              title="Change Avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Picker Drawer */}
          {showPhotoPicker && (
            <div className="mt-3 p-3 bg-[#16162a] border border-purple-500/20 rounded-2xl w-full max-w-[280px]">
              <span className="text-[11px] font-semibold text-purple-300 block mb-2">
                Choose Profile Avatar:
              </span>
              <div className="flex gap-2 justify-center">
                {presetPhotos.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onUpdatePhoto(url);
                      setShowPhotoPicker(false);
                    }}
                    className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-purple-400 transition-all hover:scale-110 cursor-pointer"
                  >
                    <img src={url} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <h3 className="mt-3 text-lg font-bold text-white flex items-center gap-1.5">
            {currentUser.displayName}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            {currentUser.email}
          </p>
        </div>

        {/* Presence Status Selector */}
        <div className="p-4 rounded-2xl bg-[#141426] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Presence Status
            </span>
            <span className="text-[10px] text-purple-400 font-medium">Real-time Sync</span>
          </div>

          <div className="space-y-1.5">
            {statusOptions.map((opt) => {
              const isSelected = currentUser.status === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onUpdateStatus(opt.value)}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-900/30 border border-purple-500/40'
                      : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${opt.color} flex-shrink-0`} />
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-slate-500">{opt.desc}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Bio */}
        <div className="p-4 rounded-2xl bg-[#141426] border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Status Message / Bio
            </span>
            <button
              onClick={() => {
                if (isEditingBio) handleSaveBio();
                else setIsEditingBio(true);
              }}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {isEditingBio ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {isSavingBio ? 'Saving...' : 'Save'}
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </>
              )}
            </button>
          </div>

          {isEditingBio ? (
            <textarea
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              rows={2}
              maxLength={200}
              className="w-full p-2.5 bg-[#1b1b32] border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
          ) : (
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{currentUser.bio || 'Available to chat on K118.'}"
            </p>
          )}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onSignOut}
          className="w-full py-3 px-4 rounded-xl bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/20 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of K118</span>
        </button>
      </div>
    </div>
  );
};
