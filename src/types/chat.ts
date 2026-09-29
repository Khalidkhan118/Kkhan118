export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  status: PresenceStatus;
  bio: string;
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  recipientId: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'text' | 'image' | 'audio';
  read: boolean;
  timestamp: string; // ISO string
}

export interface ChatRoomData {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageSenderId: string;
  lastMessageTimestamp: string;
  unreadCount?: number;
  updatedAt?: string;
}
