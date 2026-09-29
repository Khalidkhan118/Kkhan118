import React, { useState } from 'react';
import { UserProfile } from '../../types/chat';
import { ArrowLeft, Search, MessageSquare, UserCheck, Sparkles } from 'lucide-react';

interface FriendsViewProps {
  currentUser: UserProfile;
  friends: UserProfile[];
  onBack: () => void;
  onSelectFriend: (friend: UserProfile) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  currentUser,
  friends,
  onBack,
  onSelectFriend,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'online'>('all');

  const otherUsers = friends.filter((u) => u.uid !== currentUser.uid);

  const filteredUsers = otherUsers.filter((u) => {
    const matchesQuery =
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'online' && u.status === 'online');
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#090912] text-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#111122]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-white">Find Contacts & Friends</h2>
        </div>
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col overflow-hidden">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#171728] border border-white/5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            All Contacts ({otherUsers.length})
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              filter === 'online'
                ? 'bg-emerald-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Online Only ({otherUsers.filter((u) => u.status === 'online').length})
          </button>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No contacts match your criteria.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.uid}
                className="p-3 rounded-2xl bg-[#141426] border border-white/5 flex items-center justify-between gap-3 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-purple-800 text-white font-bold flex items-center justify-center text-sm">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#141426] ${
                        user.status === 'online'
                          ? 'bg-emerald-500'
                          : user.status === 'away'
                          ? 'bg-amber-400'
                          : 'bg-slate-500'
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{user.displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <p className="text-[10px] text-purple-300/70 truncate italic mt-0.5">
                      "{user.bio}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectFriend(user)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
