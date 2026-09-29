import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../../types/chat';
import { soundManager } from '../../utils/audio';
import {
  ArrowLeft,
  Send,
  Smile,
  Image,
  CheckCheck,
  MoreVertical,
  Paperclip,
  Phone,
  Video,
  X,
} from 'lucide-react';

interface ChatDetailViewProps {
  currentUser: UserProfile;
  recipient: UserProfile;
  messages: ChatMessage[];
  onBack: () => void;
  onSendMessage: (text: string, mediaUrl?: string) => Promise<void>;
}

export const ChatDetailView: React.FC<ChatDetailViewProps> = ({
  currentUser,
  recipient,
  messages,
  onBack,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isSending]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text && !attachmentPreview) return;

    setIsSending(true);
    soundManager.playSendSound();

    try {
      const media = attachmentPreview || undefined;
      setInputText('');
      setAttachmentPreview(null);
      setShowEmojis(false);
      await onSendMessage(text, media);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const commonEmojis = ['😊', '😂', '🔥', '❤️', '👍', '🎉', '🚀', '🙌', '✨', '👋', '💯', '😎'];

  const sampleAttachments = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80'
  ];

  const formatMsgTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#090912] text-slate-100 overflow-hidden relative">
      {/* Top Header */}
      <div className="px-3 py-2.5 bg-[#121224]/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Recipient Profile & Status */}
          <div className="relative flex-shrink-0">
            {recipient.photoURL ? (
              <img
                src={recipient.photoURL}
                alt={recipient.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-bold text-sm flex items-center justify-center">
                {recipient.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#121224] ${
                recipient.status === 'online'
                  ? 'bg-emerald-500'
                  : recipient.status === 'away'
                  ? 'bg-amber-400'
                  : 'bg-slate-500'
              }`}
            />
          </div>

          <div className="min-w-0 ml-1">
            <h2 className="text-sm font-bold text-white truncate leading-tight">
              {recipient.displayName}
            </h2>
            <p className="text-[11px] flex items-center gap-1.5">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  recipient.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span
                className={
                  recipient.status === 'online' ? 'text-emerald-400 font-medium' : 'text-slate-400'
                }
              >
                {recipient.status === 'online' ? 'Active Now' : 'Offline'}
              </span>
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-slate-300">
          <button
            onClick={() => alert(`Calling ${recipient.displayName} via K118...`)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Audio Call"
          >
            <Phone className="w-4 h-4 text-purple-300" />
          </button>
          <button
            onClick={() => alert(`Starting video call with ${recipient.displayName}...`)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Video Call"
          >
            <Video className="w-4 h-4 text-purple-300" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Top Chat Welcome Encrypted Banner */}
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-purple-950/40 border border-purple-800/40 flex items-center justify-center mb-2">
            {recipient.photoURL ? (
              <img
                src={recipient.photoURL}
                alt={recipient.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-purple-300">
                {recipient.displayName.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-white">{recipient.displayName}</span>
          <span className="text-[11px] text-slate-400 max-w-[240px] mt-0.5">{recipient.bio}</span>
          <span className="mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.04] text-slate-500 border border-white/5">
            Messages are real-time & synced via Firestore
          </span>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.uid;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`max-w-[78%] rounded-2xl p-3 shadow-md text-xs relative ${
                  isMe
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-tr-xs shadow-purple-900/20'
                    : 'bg-[#1a1a2e] text-slate-100 rounded-tl-xs border border-white/5 shadow-black/30'
                }`}
              >
                {/* Media Attachment if any */}
                {msg.mediaUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden max-h-48 border border-white/10">
                    <img
                      src={msg.mediaUrl}
                      alt="Attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Message Text */}
                <p className="whitespace-pre-wrap break-words leading-relaxed text-[13px]">
                  {msg.text}
                </p>

                {/* Timestamp & Read Receipt */}
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
                    isMe ? 'text-purple-200/80' : 'text-slate-400'
                  }`}
                >
                  <span>{formatMsgTime(msg.timestamp)}</span>
                  {isMe && (
                    <CheckCheck
                      className={`w-3.5 h-3.5 ${
                        msg.read ? 'text-cyan-300' : 'text-purple-200/60'
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview Bar */}
      {attachmentPreview && (
        <div className="p-2 bg-[#121224] border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={attachmentPreview}
              alt="Preview"
              className="w-12 h-12 rounded-lg object-cover border border-purple-500/40"
            />
            <span className="text-xs text-slate-300 font-medium">Ready to attach image</span>
          </div>
          <button
            onClick={() => setAttachmentPreview(null)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker Popup */}
      {showEmojis && (
        <div className="p-2.5 bg-[#141428] border-t border-white/10 flex flex-wrap gap-2 justify-center">
          {commonEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setInputText((prev) => prev + emoji)}
              className="text-xl p-1.5 hover:scale-125 transition-transform cursor-pointer"
            >
              {emoji}
            </button>
          ))}
          <div className="w-full flex items-center justify-between pt-1 border-t border-white/5">
            <span className="text-[10px] text-slate-400">Quick Attach Photo:</span>
            <div className="flex gap-2">
              {sampleAttachments.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setAttachmentPreview(imgUrl)}
                  className="w-6 h-6 rounded border border-purple-400/40 overflow-hidden cursor-pointer"
                >
                  <img src={imgUrl} alt="Sample" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="p-3 bg-[#111122]/95 backdrop-blur-md border-t border-white/5">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* Emoji Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              showEmojis ? 'bg-purple-600/30 text-purple-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Quick Attachment */}
          <button
            type="button"
            onClick={() => {
              const randomAttach =
                sampleAttachments[Math.floor(Math.random() * sampleAttachments.length)];
              setAttachmentPreview(randomAttach);
            }}
            className="p-2 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Attach Image"
          >
            <Image className="w-5 h-5" />
          </button>

          {/* Message Input */}
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-[#1a1a2e] border border-white/5 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!inputText.trim() && !attachmentPreview) || isSending}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              inputText.trim() || attachmentPreview
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-900/50 hover:scale-105 active:scale-95'
                : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
