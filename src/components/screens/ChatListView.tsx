import React, { useState } from 'react';
import { UserProfile, ChatRoomData } from '../../types/chat';
import { K118Logo } from '../K118Logo';
import { Search, Plus, UserPlus, Settings, MessageSquare, Circle } from 'lucide-react';
import regeneratedImage from '../../assets/images/regenerated_image_1790200824450.jpg';

interface ChatListViewProps {
  currentUser: UserProfile;
  friends: UserProfile[];
  chatRooms: ChatRoomData[];
  onSelectFriend: (friend: UserProfile) => void;
  onOpenProfile: () => void;
  onOpenFriends: () => void;
}

export const ChatListView: React.FC<ChatListViewProps> = ({
  currentUser,
  friends,
  chatRooms,
  onSelectFriend,
  onOpenProfile,
  onOpenFriends,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(
    (f) =>
      f.uid !== currentUser.uid &&
      (f.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const onlineFriends = filteredFriends.filter((f) => f.status === 'online');

  // Helper to format timestamps nicely
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0b14] text-slate-100 overflow-hidden">
      {/* Top App Bar */}
      <div className="px-4 pt-2 pb-3 bg-[#111122]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <K118Logo size="sm" showOnlineDot={true} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">K118</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-medium">
                Compose
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Online Chat</p>
          </div>
        </div>

        {/* User avatar + Profile & Friends Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFriends}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Discover Friends"
          >
            <UserPlus className="w-4 h-4 text-purple-300" />
          </button>

          <button
            onClick={onOpenProfile}
            className="relative group p-0.5 rounded-full ring-2 ring-purple-500/40 hover:ring-purple-400 transition-all cursor-pointer"
            title="My Profile"
          >
            <img
              src={currentUser.photoURL && !currentUser.photoURL.includes('photo-1535713875002-d1d0cf377fde') ? currentUser.photoURL : regeneratedImage}
              alt={currentUser.displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#111122] ${
                currentUser.status === 'online'
                  ? 'bg-emerald-500'
                  : currentUser.status === 'away'
                  ? 'bg-amber-400'
                  : 'bg-slate-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search friends or messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#171728] border border-white/5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        {/* Online Now Horizontal Tray */}
        {onlineFriends.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online Now ({onlineFriends.length})
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {onlineFriends.map((friend) => (
                <button
                  key={friend.uid}
                  onClick={() => onSelectFriend(friend)}
                  className="flex flex-col items-center min-w-[58px] max-w-[64px] group cursor-pointer"
                >
                  <div className="relative">
                    {friend.photoURL ? (
                      <img
                        src={friend.photoURL}
                        alt={friend.displayName}
                        className="w-13 h-13 rounded-full object-cover ring-2 ring-emerald-500/60 group-hover:ring-emerald-400 transition-all"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-full bg-purple-800 text-white font-bold flex items-center justify-center ring-2 ring-emerald-500/60">
                        {friend.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#0b0b14]" />
                  </div>
                  <span className="mt-1.5 text-[11px] text-slate-300 font-medium truncate w-full text-center group-hover:text-white">
                    {friend.displayName.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              Conversations ({filteredFriends.length})
            </span>
          </div>

          {filteredFriends.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 rounded-full bg-purple-950/40 border border-purple-800/40 flex items-center justify-center mb-3">
                <MessageSquare className="w-7 h-7 text-purple-400" />
              </div>
              <p className="text-sm font-semibold text-slate-200">No conversations yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                {searchQuery ? `No friends match "${searchQuery}"` : 'Tap the + button to invite or discover registered contacts.'}
              </p>
              <button
                onClick={onOpenFriends}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-md"
              >
                Find Friends
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredFriends.map((friend) => {
                // Find chat room summary if exists
                const room = chatRooms.find((r) => r.participants.includes(friend.uid));
                const lastMsg = room?.lastMessage || friend.bio || 'Tap to chat';
                const timeStr = formatTime(room?.lastMessageTimestamp);

                return (
                  <button
                    key={friend.uid}
                    onClick={() => onSelectFriend(friend)}
                    className="w-full p-2.5 rounded-2xl hover:bg-[#161629] active:bg-[#1c1c34] transition-all flex items-center gap-3 text-left group cursor-pointer border border-transparent hover:border-white/5"
                  >
                    {/* Friend Avatar with status badge */}
                    <div className="relative flex-shrink-0">
                      {friend.photoURL ? (
                        <img
                          src={friend.photoURL}
                          alt={friend.displayName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-700 to-indigo-800 text-white font-bold text-base flex items-center justify-center">
                          {friend.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0b0b14] ${
                          friend.status === 'online'
                            ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                            : friend.status === 'away'
                            ? 'bg-amber-400'
                            : 'bg-slate-500'
                        }`}
                        title={friend.status}
                      />
                    </div>

                    {/* Friend Name + Last Message */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                          {friend.displayName}
                        </span>
                        {timeStr && (
                          <span className="text-[10px] text-slate-500 flex-shrink-0 ml-2">
                            {timeStr}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-slate-400 truncate pr-2">
                          {lastMsg}
                        </p>
                        {friend.status === 'online' && !room && (
                          <span className="text-[10px] text-emerald-400 flex-shrink-0 font-medium">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-6 right-6 z-30">
        <button
          onClick={onOpenFriends}
          className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 text-white flex items-center justify-center shadow-xl shadow-purple-900/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="New Chat"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
