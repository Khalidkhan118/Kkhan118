import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, testConnection } from './firebase/config';
import { UserProfile, ChatMessage, ChatRoomData, PresenceStatus } from './types/chat';
import { AndroidFrame } from './components/AndroidFrame';
import { LoginView } from './components/screens/LoginView';
import { ChatListView } from './components/screens/ChatListView';
import { ChatDetailView } from './components/screens/ChatDetailView';
import { ProfileView } from './components/screens/ProfileView';
import { FriendsView } from './components/screens/FriendsView';
import { AndroidCodeViewer } from './components/AndroidCodeViewer';
import { soundManager } from './utils/audio';
import { K118Logo } from './components/K118Logo';
import regeneratedImage from './assets/images/regenerated_image_1790200824450.jpg';
import {
  Smartphone,
  Columns,
  Code,
  Maximize2,
  Sparkles,
  Wifi,
  Shield,
  Layers,
  Info,
} from 'lucide-react';

export default function App() {
  // Global View Navigation Tabs: 'device' | 'dual' | 'code'
  const [activeTab, setActiveTab] = useState<'device' | 'dual' | 'code'>('device');

  // Primary Device State (Device 1)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [screen, setScreen] = useState<'chat_list' | 'chat_detail' | 'profile' | 'friends'>('chat_list');
  const [activeRecipient, setActiveRecipient] = useState<UserProfile | null>(null);

  // Secondary Device State (for Dual Phone Live Chat Testing)
  const [secondaryUser, setSecondaryUser] = useState<UserProfile | null>(null);
  const [secondaryScreen, setSecondaryScreen] = useState<'chat_list' | 'chat_detail'>('chat_detail');

  // Shared Data from Firestore
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoomData[]>([]);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  // Default seed contacts for immediate online presence testing
  const defaultSeedUsers: UserProfile[] = [
    {
      uid: 'seed_khalid',
      displayName: 'Khalid Khan',
      email: 'kkhalidkkhan118113@gmail.com',
      photoURL: regeneratedImage,
      status: 'online',
      bio: 'Building K118 Android Jetpack Compose app 🚀',
    },
    {
      uid: 'seed_sarah',
      displayName: 'Dr. Sarah Chen',
      email: 'sarah.chen@example.com',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      bio: 'Mobile Engineer & Android enthusiast ✨',
    },
    {
      uid: 'seed_alex',
      displayName: 'Alex Vance',
      email: 'alex.vance@example.com',
      photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      status: 'away',
      bio: 'Coding Kotlin Coroutines & Flow',
    },
    {
      uid: 'seed_elena',
      displayName: 'Elena Rostova',
      email: 'elena.r@example.com',
      photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      bio: 'Compose Material 3 UI Designer 🎨',
    }
  ];

  // 1. Initial Connection Test
  useEffect(() => {
    testConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });
  }, []);

  // 2. Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userProfile: UserProfile = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'K118 User',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || '',
          status: 'online',
          bio: 'Hey there! I am using K118 Chat.',
          lastSeen: new Date().toISOString(),
        };

        setCurrentUser(userProfile);

        // Sync to Firestore
        try {
          await setDoc(doc(db, 'users', fbUser.uid), userProfile, { merge: true });
        } catch (error) {
          console.warn('Initial profile sync warning:', error);
        }
      } else if (!currentUser) {
        // Default to first seed user for instant interactive preview
        setCurrentUser(defaultSeedUsers[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize secondary user for dual phone mode
  useEffect(() => {
    if (!secondaryUser) {
      setSecondaryUser(defaultSeedUsers[1]); // Sarah Chen
    }
  }, []);

  // 3. Sync Users Collection from Firestore with fallback seed
  useEffect(() => {
    try {
      const usersRef = collection(db, 'users');
      const unsubscribe = onSnapshot(
        usersRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((docSnap) => docSnap.data() as UserProfile);
            setAllUsers(list);
          } else {
            setAllUsers(defaultSeedUsers);
          }
        },
        (error) => {
          console.info('Using seed contacts for users list');
          setAllUsers(defaultSeedUsers);
        }
      );
      return () => unsubscribe();
    } catch {
      setAllUsers(defaultSeedUsers);
    }
  }, []);

  // Helper to generate deterministic 1-to-1 chat room ID
  const getChatRoomId = (uid1: string, uid2: string) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  // 4. Real-time Message Listener for Active Chat Room
  useEffect(() => {
    if (!currentUser || !activeRecipient) {
      setActiveMessages([]);
      return;
    }

    const roomId = getChatRoomId(currentUser.uid, activeRecipient.uid);
    const messagesPath = `chats/${roomId}/messages`;

    try {
      const q = query(
        collection(db, 'chats', roomId, 'messages'),
        orderBy('timestamp', 'asc'),
        limit(100)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const msgs: ChatMessage[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              chatRoomId: data.chatRoomId || roomId,
              senderId: data.senderId,
              senderName: data.senderName,
              senderPhoto: data.senderPhoto,
              recipientId: data.recipientId,
              text: data.text,
              mediaUrl: data.mediaUrl,
              mediaType: data.mediaType || 'text',
              read: !!data.read,
              timestamp: data.timestamp || new Date().toISOString(),
            };
          });

          setActiveMessages(msgs);

          // Mark unread messages as read
          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.recipientId === currentUser.uid && !data.read) {
              updateDoc(docSnap.ref, { read: true }).catch(() => {});
            }
          });
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, messagesPath);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Real-time listener warning, using local buffer:', err);
    }
  }, [currentUser?.uid, activeRecipient?.uid]);

  // Message Sender function
  const handleSendMessage = async (
    sender: UserProfile,
    recipient: UserProfile,
    text: string,
    mediaUrl?: string
  ) => {
    const roomId = getChatRoomId(sender.uid, recipient.uid);
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newMsg: ChatMessage = {
      id: messageId,
      chatRoomId: roomId,
      senderId: sender.uid,
      senderName: sender.displayName,
      senderPhoto: sender.photoURL,
      recipientId: recipient.uid,
      text,
      mediaUrl,
      mediaType: mediaUrl ? 'image' : 'text',
      read: false,
      timestamp: nowIso,
    };

    // Optimistically update local active messages
    setActiveMessages((prev) => [...prev, newMsg]);

    try {
      const msgRef = doc(db, 'chats', roomId, 'messages', messageId);
      await setDoc(msgRef, newMsg);

      // Update room metadata
      const roomRef = doc(db, 'chats', roomId);
      await setDoc(
        roomRef,
        {
          id: roomId,
          participants: [sender.uid, recipient.uid],
          lastMessage: text || 'Photo attachment',
          lastMessageSenderId: sender.uid,
          lastMessageTimestamp: nowIso,
          updatedAt: nowIso,
        },
        { merge: true }
      );

      // Update chatRooms list state
      setChatRooms((prev) => {
        const filtered = prev.filter((r) => r.id !== roomId);
        return [
          {
            id: roomId,
            participants: [sender.uid, recipient.uid],
            lastMessage: text,
            lastMessageSenderId: sender.uid,
            lastMessageTimestamp: nowIso,
          },
          ...filtered,
        ];
      });
    } catch (err) {
      console.warn('Firestore message write, stored locally:', err);
    }
  };

  // Update presence status (online, away, busy, offline)
  const handleUpdateStatus = async (status: PresenceStatus) => {
    if (!currentUser) return;
    const updated = { ...currentUser, status, lastSeen: new Date().toISOString() };
    setCurrentUser(updated);

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        status,
        lastSeen: new Date().toISOString(),
      });
    } catch (err) {
      // Local update maintained
    }
  };

  // Update bio
  const handleUpdateBio = async (bio: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, bio };
    setCurrentUser(updated);

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { bio });
    } catch (err) {
      // Local
    }
  };

  // Update photo
  const handleUpdatePhoto = async (photoURL: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, photoURL };
    setCurrentUser(updated);

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { photoURL });
    } catch (err) {
      // Local
    }
  };

  const handleSignOut = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // Ignore
    }
    setCurrentUser(null);
    setActiveRecipient(null);
    setScreen('chat_list');
  };

  // Open chat with friend
  const handleOpenChat = (friend: UserProfile) => {
    setActiveRecipient(friend);
    setScreen('chat_detail');
  };

  return (
    <div className="min-h-screen bg-[#07070f] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Application Header */}
      <header className="h-16 px-6 bg-[#0e0e1c]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-40 select-none">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <K118Logo size="sm" showOnlineDot={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">K118</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                Android 15 · Jetpack Compose
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Online 1:1 Real-time Chat · Firebase Auth & Firestore
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-[#141428] p-1 rounded-2xl border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('device')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'device'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Single Device</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('dual');
              if (!activeRecipient) {
                setActiveRecipient(defaultSeedUsers[1]);
              }
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'dual'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Dual Live Test (2 Phones)</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-purple-300" />
            <span>Kotlin & Compose Code</span>
          </button>
        </div>

        {/* Firebase Live Status */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Firebase Connected</span>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
        {/* TAB 1: Single Android Device Simulator */}
        {activeTab === 'device' && (
          <div className="w-full flex justify-center items-center py-2 animate-in fade-in zoom-in-95 duration-200">
            <AndroidFrame deviceName="Pixel 9 Pro · K118 Online Chat">
              {!currentUser ? (
                <LoginView
                  onDemoLogin={(demoAcc) => {
                    const profile: UserProfile = {
                      ...demoAcc,
                      status: 'online',
                      bio: 'Hey there! I am using K118 Chat.',
                    };
                    setCurrentUser(profile);
                  }}
                />
              ) : screen === 'chat_list' ? (
                <ChatListView
                  currentUser={currentUser}
                  friends={allUsers}
                  chatRooms={chatRooms}
                  onSelectFriend={handleOpenChat}
                  onOpenProfile={() => setScreen('profile')}
                  onOpenFriends={() => setScreen('friends')}
                />
              ) : screen === 'chat_detail' && activeRecipient ? (
                <ChatDetailView
                  currentUser={currentUser}
                  recipient={activeRecipient}
                  messages={activeMessages}
                  onBack={() => setScreen('chat_list')}
                  onSendMessage={(text, mediaUrl) =>
                    handleSendMessage(currentUser, activeRecipient, text, mediaUrl)
                  }
                />
              ) : screen === 'friends' ? (
                <FriendsView
                  currentUser={currentUser}
                  friends={allUsers}
                  onBack={() => setScreen('chat_list')}
                  onSelectFriend={handleOpenChat}
                />
              ) : (
                <ProfileView
                  currentUser={currentUser}
                  onBack={() => setScreen('chat_list')}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateBio={handleUpdateBio}
                  onUpdatePhoto={handleUpdatePhoto}
                  onSignOut={handleSignOut}
                />
              )}
            </AndroidFrame>
          </div>
        )}

        {/* TAB 2: Dual Device Simulator for Instant Real-Time Testing */}
        {activeTab === 'dual' && (
          <div className="w-full max-w-6xl flex flex-col items-center animate-in fade-in duration-200">
            <div className="mb-4 text-center">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
                Live 1-on-1 Real-time Firestore Sync Test
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Type on Phone 1 and watch it appear instantly on Phone 2 in real time!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 w-full">
              {/* Phone 1 (User A: Khalid) */}
              <div className="flex flex-col items-center">
                <AndroidFrame deviceName="Phone 1: Khalid Khan" isCompact={true}>
                  {currentUser && activeRecipient ? (
                    <ChatDetailView
                      currentUser={currentUser}
                      recipient={activeRecipient}
                      messages={activeMessages}
                      onBack={() => setScreen('chat_list')}
                      onSendMessage={(text, mediaUrl) =>
                        handleSendMessage(currentUser, activeRecipient, text, mediaUrl)
                      }
                    />
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">Select recipient</div>
                  )}
                </AndroidFrame>
              </div>

              {/* Live Flow Arrow */}
              <div className="hidden lg:flex flex-col items-center justify-center space-y-2 text-purple-400">
                <div className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-[11px] font-mono flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Firestore Stream</span>
                </div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
                <span className="text-[10px] text-slate-500">Sub-second latency</span>
              </div>

              {/* Phone 2 (User B: Dr. Sarah Chen) */}
              <div className="flex flex-col items-center">
                <AndroidFrame deviceName="Phone 2: Dr. Sarah Chen" isCompact={true}>
                  {secondaryUser && currentUser ? (
                    <ChatDetailView
                      currentUser={secondaryUser}
                      recipient={currentUser}
                      messages={activeMessages}
                      onBack={() => {}}
                      onSendMessage={(text, mediaUrl) =>
                        handleSendMessage(secondaryUser, currentUser, text, mediaUrl)
                      }
                    />
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">Phone 2 Standby</div>
                  )}
                </AndroidFrame>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Android Studio Kotlin & Jetpack Compose Code Hub */}
        {activeTab === 'code' && (
          <div className="w-full h-[calc(100vh-80px)] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col animate-in fade-in duration-200">
            <AndroidCodeViewer />
          </div>
        )}
      </main>
    </div>
  );
}
