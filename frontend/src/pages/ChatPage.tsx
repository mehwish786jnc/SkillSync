import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Search,
  Hash,
  Pin,
  Phone,
  Video,
  MoreHorizontal,
  Plus,
  Smile,
  Paperclip,
  AtSign,
  ChevronDown,
  Users,
  Star,
  BellOff,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  reactions?: { emoji: string; count: number }[];
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  isChannel?: boolean;
  muted?: boolean;
  pinned?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const conversations: Conversation[] = [
  { id: 'general', name: 'general', avatar: '#', lastMessage: 'Sarah: Welcome to the team!', time: '2m', unread: 3, isChannel: true, pinned: true },
  { id: 'engineering', name: 'engineering', avatar: '#', lastMessage: 'James: PR merged for the API refactor', time: '15m', unread: 0, isChannel: true },
  { id: 'design', name: 'design', avatar: '#', lastMessage: 'Emily: New mockups are ready', time: '1h', unread: 1, isChannel: true },
  { id: 'sarah', name: 'Sarah Chen', avatar: 'SC', lastMessage: 'Sounds great, see you then!', time: '5m', unread: 2, online: true },
  { id: 'james', name: 'James Park', avatar: 'JP', lastMessage: "I'll review the PR tonight", time: '30m', unread: 0, online: true },
  { id: 'emily', name: 'Emily Zhao', avatar: 'EZ', lastMessage: 'Can you check the latest designs?', time: '2h', unread: 0, online: false },
  { id: 'marcus', name: 'Marcus Rivera', avatar: 'MR', lastMessage: 'The deployment went smoothly', time: '3h', unread: 0, online: false, muted: true },
  { id: 'priya', name: 'Priya Sharma', avatar: 'PS', lastMessage: 'Let me know about the meeting', time: '5h', unread: 0, online: true },
];

const messagesByConversation: Record<string, Message[]> = {
  general: [
    { id: 1, sender: 'Sarah Chen', avatar: 'SC', content: 'Hey everyone! Just pushed the new onboarding flow to staging. Would love some feedback when you get a chance.', timestamp: '9:15 AM', isMe: false, reactions: [{ emoji: '🎉', count: 3 }, { emoji: '👀', count: 2 }] },
    { id: 2, sender: 'James Park', avatar: 'JP', content: "Nice work Sarah! I'll take a look after lunch. The screenshots in the PR look great.", timestamp: '9:22 AM', isMe: false, reactions: [{ emoji: '👍', count: 1 }] },
    { id: 3, sender: 'You', avatar: 'AJ', content: "This looks awesome! I noticed a small layout issue on mobile - the CTA button overflows on smaller screens. I'll open a ticket.", timestamp: '9:30 AM', isMe: true },
    { id: 4, sender: 'Emily Zhao', avatar: 'EZ', content: 'The design system components are looking really polished. Great job on the consistency!', timestamp: '9:45 AM', isMe: false },
    { id: 5, sender: 'Sarah Chen', avatar: 'SC', content: "Thanks Alex! Good catch on the mobile issue. I'll fix that in the next commit.", timestamp: '9:48 AM', isMe: false },
    { id: 6, sender: 'Marcus Rivera', avatar: 'MR', content: "Quick update - I've set up the CI/CD pipeline for the staging environment. Deploys should be automatic now from the `staging` branch.", timestamp: '10:15 AM', isMe: false, reactions: [{ emoji: '🚀', count: 4 }] },
    { id: 7, sender: 'You', avatar: 'AJ', content: 'Amazing Marcus! That will save us a lot of time. Do we need to update the deployment docs?', timestamp: '10:20 AM', isMe: true },
    { id: 8, sender: 'Marcus Rivera', avatar: 'MR', content: "Already done! Check the wiki - I've updated the deployment guide with the new workflow.", timestamp: '10:22 AM', isMe: false, reactions: [{ emoji: '🙏', count: 2 }] },
    { id: 9, sender: 'Priya Sharma', avatar: 'PS', content: "Reminder: standup in 10 minutes. Please have your updates ready. We'll also discuss the Q3 roadmap priorities.", timestamp: '10:50 AM', isMe: false },
    { id: 10, sender: 'Sarah Chen', avatar: 'SC', content: 'Welcome to the team! 🎉', timestamp: '11:02 AM', isMe: false },
  ],
  sarah: [
    { id: 1, sender: 'Sarah Chen', avatar: 'SC', content: "Hey Alex! Do you have time for a quick sync about the onboarding project?", timestamp: '2:00 PM', isMe: false },
    { id: 2, sender: 'You', avatar: 'AJ', content: "Sure! I'm free after 3pm today. Want to hop on a call?", timestamp: '2:05 PM', isMe: true },
    { id: 3, sender: 'Sarah Chen', avatar: 'SC', content: 'Perfect, 3:30 works for me. I want to go over the user flow for the skill assessment feature.', timestamp: '2:08 PM', isMe: false },
    { id: 4, sender: 'You', avatar: 'AJ', content: "Sounds good. I'll pull up the Figma designs before the call.", timestamp: '2:10 PM', isMe: true },
    { id: 5, sender: 'Sarah Chen', avatar: 'SC', content: 'Sounds great, see you then!', timestamp: '2:12 PM', isMe: false, reactions: [{ emoji: '👍', count: 1 }] },
  ],
};

const aiResponses = [
  "That's a great point! I think we should also consider the edge cases for mobile users.",
  "I'll get that done by EOD. Let me check with the design team first.",
  "Good idea! I've been thinking about the same thing. Let's discuss in the next standup.",
  "Thanks for the update! The new CI/CD pipeline is going to be a game changer.",
  "I've reviewed the PR and left some comments. Overall it looks solid though!",
  "Let me loop in Emily on this - she had some thoughts about the UX flow.",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChatPage() {
  const [activeConvo, setActiveConvo] = useState('general');
  const [messages, setMessages] = useState<Record<string, Message[]>>(messagesByConversation);
  const [input, setInput] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeMessages = messages[activeConvo] ?? [];
  const activeConvoData = conversations.find((c) => c.id === activeConvo)!;

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages.length, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeConvo]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: 'You',
      avatar: 'AJ',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      isMe: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeConvo]: [...(prev[activeConvo] ?? []), newMsg],
    }));
    setInput('');

    // Simulate reply
    const responder = activeConvoData.isChannel
      ? ['Sarah Chen', 'James Park', 'Emily Zhao'][Math.floor(Math.random() * 3)]
      : activeConvoData.name;
    const responderAvatar = responder.split(' ').map((n) => n[0]).join('');

    setTypingUser(responder);

    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        sender: responder,
        avatar: responderAvatar,
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        isMe: false,
      };

      setMessages((prev) => ({
        ...prev,
        [activeConvo]: [...(prev[activeConvo] ?? []), reply],
      }));
      setTypingUser(null);
    }, 1500 + Math.random() * 1000);
  };

  const filteredConvos = conversations.filter((c) =>
    c.name.toLowerCase().includes(sidebarSearch.toLowerCase())
  );
  const pinnedConvos = filteredConvos.filter((c) => c.pinned);
  const channels = filteredConvos.filter((c) => c.isChannel && !c.pinned);
  const directMessages = filteredConvos.filter((c) => !c.isChannel);

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-xl border border-surface-200 dark:border-surface-800">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={`${
          mobileSidebar ? 'fixed inset-0 z-50 block' : 'hidden'
        } w-full flex-col border-r border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-950 md:relative md:flex md:w-80`}
      >
        {/* Sidebar header */}
        <div className="flex h-14 items-center justify-between border-b border-surface-100 px-4 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold">Messages</h2>
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {conversations.reduce((s, c) => s + c.unread, 0)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800">
              <Plus size={16} />
            </button>
            <button
              className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 md:hidden"
              onClick={() => setMobileSidebar(false)}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full rounded-lg border border-surface-200 bg-surface-50 py-1.5 pl-8 pr-3 text-xs outline-none transition-colors focus:border-primary-400 dark:border-surface-700 dark:bg-surface-900"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {/* Pinned */}
          {pinnedConvos.length > 0 && (
            <div className="mb-1">
              <p className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-surface-400">
                <Pin size={10} /> Pinned
              </p>
              {pinnedConvos.map((c) => (
                <ConvoItem key={c.id} convo={c} active={activeConvo === c.id} onClick={() => { setActiveConvo(c.id); setMobileSidebar(false); }} />
              ))}
            </div>
          )}

          {/* Channels */}
          {channels.length > 0 && (
            <div className="mb-1">
              <p className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-surface-400">
                <ChevronDown size={10} /> Channels
              </p>
              {channels.map((c) => (
                <ConvoItem key={c.id} convo={c} active={activeConvo === c.id} onClick={() => { setActiveConvo(c.id); setMobileSidebar(false); }} />
              ))}
            </div>
          )}

          {/* DMs */}
          {directMessages.length > 0 && (
            <div className="mb-1">
              <p className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-surface-400">
                <ChevronDown size={10} /> Direct Messages
              </p>
              {directMessages.map((c) => (
                <ConvoItem key={c.id} convo={c} active={activeConvo === c.id} onClick={() => { setActiveConvo(c.id); setMobileSidebar(false); }} />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Chat Panel ───────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col bg-white dark:bg-surface-950">
        {/* Chat header */}
        <div className="flex h-14 items-center justify-between border-b border-surface-100 px-4 dark:border-surface-800">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 md:hidden"
              onClick={() => setMobileSidebar(true)}
            >
              <Users size={16} />
            </button>
            {activeConvoData.isChannel ? (
              <div className="flex items-center gap-2">
                <Hash size={16} className="text-surface-400" />
                <span className="text-sm font-semibold">{activeConvoData.name}</span>
                <span className="hidden text-xs text-surface-400 sm:block">
                  · {activeConvoData.isChannel ? '8 members' : 'Active now'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-[10px] font-bold text-white">
                    {activeConvoData.avatar}
                  </div>
                  {activeConvoData.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-surface-950" />
                  )}
                </div>
                <div>
                  <span className="text-sm font-semibold">{activeConvoData.name}</span>
                  <p className="text-[10px] text-surface-400">
                    {activeConvoData.online ? 'Active now' : 'Last seen 2h ago'}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="hidden rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 sm:block">
              <Phone size={16} />
            </button>
            <button className="hidden rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 sm:block">
              <Video size={16} />
            </button>
            <button className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800">
              <Star size={16} />
            </button>
            <button className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6">
          <div className="mx-auto max-w-3xl space-y-0.5">
            {activeMessages.map((msg, i) => {
              const prevMsg = activeMessages[i - 1];
              const sameSender = prevMsg?.sender === msg.sender;
              const isFirstInGroup = !sameSender;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`group flex gap-3 rounded-lg px-2 py-0.5 transition-colors hover:bg-surface-50 dark:hover:bg-surface-900/50 ${
                    isFirstInGroup ? 'mt-4' : ''
                  }`}
                >
                  {/* Avatar or spacer */}
                  <div className="w-9 shrink-0">
                    {isFirstInGroup && (
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-[11px] font-bold ${
                          msg.isMe
                            ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white'
                            : 'bg-gradient-to-br from-surface-200 to-surface-300 text-surface-600 dark:from-surface-700 dark:to-surface-600 dark:text-surface-300'
                        }`}
                      >
                        {msg.avatar}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {isFirstInGroup && (
                      <div className="mb-0.5 flex items-baseline gap-2">
                        <span className={`text-sm font-semibold ${msg.isMe ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                          {msg.sender}
                        </span>
                        <span className="text-[10px] text-surface-400">{msg.timestamp}</span>
                      </div>
                    )}
                    <p className="text-[13px] leading-relaxed text-surface-700 dark:text-surface-300">
                      {msg.content}
                    </p>

                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {msg.reactions.map((r) => (
                          <span
                            key={r.emoji}
                            className="inline-flex items-center gap-1 rounded-full border border-surface-200 bg-surface-50 px-2 py-0.5 text-xs transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-surface-700 dark:bg-surface-800 dark:hover:border-primary-800 dark:hover:bg-primary-900/20"
                          >
                            {r.emoji} <span className="text-[10px] text-surface-500">{r.count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hover actions */}
                  <div className="hidden shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:flex group-hover:opacity-100">
                    <button className="rounded p-1 text-surface-400 hover:bg-surface-200 hover:text-surface-600 dark:hover:bg-surface-700 dark:hover:text-surface-300">
                      <Smile size={14} />
                    </button>
                    <button className="rounded p-1 text-surface-400 hover:bg-surface-200 hover:text-surface-600 dark:hover:bg-surface-700 dark:hover:text-surface-300">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing indicator */}
            <AnimatePresence>
              {typingUser && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-4 flex items-center gap-3 px-2 py-1"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-surface-200 to-surface-300 text-[11px] font-bold text-surface-600 dark:from-surface-700 dark:to-surface-600 dark:text-surface-300">
                    {typingUser.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 rounded-2xl bg-surface-100 px-3 py-2 dark:bg-surface-800">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-surface-400 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-surface-400 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-surface-400 [animation-delay:300ms]" />
                    </div>
                    <span className="text-xs text-surface-400">{typingUser} is typing...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={endRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-surface-100 px-4 py-3 dark:border-surface-800 lg:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 transition-colors focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/10 dark:border-surface-700 dark:bg-surface-900">
              <div className="flex items-center gap-0.5 pb-0.5">
                <button className="rounded p-1.5 text-surface-400 transition-colors hover:bg-surface-200 hover:text-surface-600 dark:hover:bg-surface-700">
                  <Plus size={16} />
                </button>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={`Message ${activeConvoData.isChannel ? '#' : ''}${activeConvoData.name}...`}
                className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-surface-400"
              />
              <div className="flex items-center gap-0.5 pb-0.5">
                <button className="rounded p-1.5 text-surface-400 transition-colors hover:bg-surface-200 hover:text-surface-600 dark:hover:bg-surface-700">
                  <AtSign size={16} />
                </button>
                <button className="rounded p-1.5 text-surface-400 transition-colors hover:bg-surface-200 hover:text-surface-600 dark:hover:bg-surface-700">
                  <Paperclip size={16} />
                </button>
                <button className="rounded p-1.5 text-surface-400 transition-colors hover:bg-surface-200 hover:text-surface-600 dark:hover:bg-surface-700">
                  <Smile size={16} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="ml-1 rounded-lg bg-primary-600 p-1.5 text-white transition-all hover:bg-primary-700 disabled:opacity-30 disabled:hover:bg-primary-600"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                      */
/* ------------------------------------------------------------------ */

function ConvoItem({
  convo,
  active,
  onClick,
}: {
  convo: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
        active
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
          : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800'
      }`}
    >
      {/* Avatar */}
      {convo.isChannel ? (
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${active ? 'bg-primary-100 text-primary-600 dark:bg-primary-800/30 dark:text-primary-400' : 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400'}`}>
          <Hash size={15} />
        </div>
      ) : (
        <div className="relative">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-surface-200 to-surface-300 text-[10px] font-bold text-surface-600 dark:from-surface-700 dark:to-surface-600 dark:text-surface-300">
            {convo.avatar}
          </div>
          {convo.online && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-surface-950" />
          )}
        </div>
      )}

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={`truncate text-xs font-semibold ${active ? '' : ''}`}>
            {convo.name}
          </span>
          <span className="shrink-0 text-[10px] text-surface-400">{convo.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="truncate text-[11px] text-surface-400">{convo.lastMessage}</p>
          <div className="flex shrink-0 items-center gap-1 pl-2">
            {convo.muted && <BellOff size={10} className="text-surface-300 dark:text-surface-600" />}
            {convo.unread > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[9px] font-bold text-white">
                {convo.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
