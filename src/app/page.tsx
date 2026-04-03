"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  ChatProvider,
  ChatMessages,
  ChatComposer,
  ChatNestedThread,
  SupportTickets,
} from "@/components/ui/chat"
import type { ChatMessageData, ChatUser, TypingUser, ChatTheme, ThreadedMessage, SupportTicket } from "@/components/ui/chat"
import { Navbar } from "@/components/docs/navbar"
import {
  Check,
  Copy,
  Search,
  Phone,
  Paperclip,
  X,
  Headphones,
  MessageSquare,
  Star,
} from "lucide-react"

// ─── Sample data ──────────────────────────────────────────────────────────────

const currentUser: ChatUser = {
  id: "user-1",
  name: "You",
  status: "online",
}

const minute = 60_000
const hour = 60 * minute
const day = 24 * hour

// ─── Messaging Demo conversations ────────────────────────────────────────────

const conversations = [
  { id: "design-team", name: "Design System Team", preview: "Sara: Shipping it tomorrow", time: "3m", unread: 2, online: true, isGroup: true },
  { id: "alex", name: "Alex Chen", preview: "The PR is ready for review", time: "15m", unread: 0, online: true },
  { id: "sara", name: "Sara Kim", preview: "See you at standup!", time: "1h", unread: 0, online: false },
  { id: "product", name: "Product Chat", preview: "Q2 roadmap next week", time: "3h", unread: 5, online: false, isGroup: true },
  { id: "dan", name: "Dan Lee", preview: "Merged! \u{1F389}", time: "1d", unread: 0, online: true },
]

function createConvoMessages(now: number): Record<string, ChatMessageData[]> {
  return {
    "design-team": [
      {
        id: "sys-1",
        senderId: "system",
        senderName: "System",
        timestamp: now - day - 4 * hour,
        isSystem: true,
        text: "Alex Chen created this conversation",
      },
      {
        id: "msg-1",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - day - 3 * hour,
        text: "Hey! Have you had a chance to look at the new design system?",
        status: "read",
      },
      {
        id: "msg-2",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - day - 3 * hour + 15_000,
        text: "I pushed the updated Figma link to the channel",
        status: "read",
      },
      {
        id: "msg-3",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - day - 3 * hour + 2 * minute,
        text: "Yeah, just opened it. The component library looks incredible",
        status: "read",
      },
      {
        id: "msg-4",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - day - 3 * hour + 2 * minute + 10_000,
        text: "Love the new color tokens especially",
        status: "read",
        reactions: [
          { emoji: "\u{1F525}", userIds: ["user-2"], count: 1 },
          { emoji: "\u{1F4AF}", userIds: ["user-2", "user-3"], count: 2 },
        ],
      },
      {
        id: "msg-5",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 2 * hour,
        text: "Quick update \u2014 the auth refactor PR is ready for review",
        status: "read",
      },
      {
        id: "msg-6",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 2 * hour + 20_000,
        text: "Token refresh logic is completely rewritten. Much cleaner now",
        status: "read",
      },
      {
        id: "msg-7",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 2 * hour + 40_000,
        text: "Only concern is backwards compat with existing sessions \u2014 thoughts?",
        status: "read",
      },
      {
        id: "msg-8",
        senderId: "user-3",
        senderName: "Sara Kim",
        timestamp: now - hour - 30 * minute,
        text: "I reviewed it this morning. Left a couple of comments on the error handling paths",
        status: "read",
      },
      {
        id: "msg-9",
        senderId: "user-3",
        senderName: "Sara Kim",
        timestamp: now - hour - 30 * minute + 15_000,
        text: "Overall looks solid though \u{1F44D}",
        status: "read",
        reactions: [{ emoji: "\u{1F60A}", userIds: ["user-2"], count: 1 }],
      },
      {
        id: "msg-10",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 45 * minute,
        text: "For backwards compat \u2014 we can run both token formats in parallel for 30 days, then cut over.",
        status: "delivered",
        replyTo: {
          id: "msg-7",
          senderName: "Alex Chen",
          text: "Only concern is backwards compat with existing sessions \u2014 thoughts?",
        },
      },
      {
        id: "msg-11",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 44 * minute,
        text: "Let me write up a migration plan doc this afternoon",
        status: "delivered",
        reactions: [{ emoji: "\u{1F64C}", userIds: ["user-2", "user-3"], count: 2 }],
        readBy: [
          { userId: "user-2", name: "Alex Chen" },
          { userId: "user-3", name: "Sara Kim" },
        ],
      },
      // Rich media messages
      {
        id: "msg-12",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 30 * minute,
        text: "Here\u2019s the updated token validation logic:",
        status: "read",
        code: {
          language: "typescript",
          code: `async function validateToken(token: string) {\n  const decoded = jwt.verify(token, SECRET)\n  if (decoded.version === 2) {\n    return validateV2(decoded)\n  }\n  return validateV1(decoded) // legacy\n}`,
        },
      },
      {
        id: "msg-13",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 25 * minute,
        text: "And the migration plan doc",
        status: "read",
        files: [
          { name: "token-migration-plan.pdf", size: 245_000, type: "application/pdf", url: "#" },
        ],
      },
      {
        id: "msg-14",
        senderId: "user-3",
        senderName: "Sara Kim",
        timestamp: now - 20 * minute,
        text: "Here\u2019s the updated component preview:",
        status: "read",
        images: [
          { url: "https://placehold.co/600x400/6366F1/white?text=Design+System+v2", width: 600, height: 400, alt: "Design System v2 preview" },
        ],
      },
      {
        id: "msg-15",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 15 * minute,
        text: "Found this article on token migration patterns \u2014 really useful:",
        status: "read",
        linkPreview: {
          url: "https://example.com/token-migration-patterns",
          title: "Token Migration Patterns for Zero-Downtime Auth",
          description: "A comprehensive guide to migrating authentication tokens in production without disrupting active user sessions.",
          image: "",
        },
      },
      {
        id: "msg-16",
        senderId: "user-3",
        senderName: "Sara Kim",
        timestamp: now - 12 * minute,
        text: "Left a voice note about the rollout timeline:",
        status: "read",
        voice: {
          url: "#",
          duration: 14,
          waveform: [0.2, 0.4, 0.7, 1.0, 0.8, 0.5, 0.9, 0.6, 0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9, 0.3, 0.5, 0.7, 0.4, 0.2, 0.6, 0.8, 0.3, 0.5, 0.7],
        },
      },
      {
        id: "msg-17",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 10 * minute,
        text: "That\u2019s a great idea. Parallel token validation is the safest approach",
        status: "read",
      },
      {
        id: "msg-18",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 9 * minute,
        text: "I\u2019ll update the PR with a feature flag for the new token format in the meantime",
        status: "read",
        isPinned: true,
      },
      {
        id: "msg-19",
        senderId: "user-3",
        senderName: "Sara Kim",
        timestamp: now - 3 * minute,
        text: "Shipping it tomorrow \u{1F680}",
        status: "read",
      },
    ],
    "alex": [
      {
        id: "alex-1",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 2 * hour,
        text: "Hey, can you take a look at the PR when you get a chance?",
        status: "read",
      },
      {
        id: "alex-2",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - hour,
        text: "Sure, I'll review it after lunch",
        status: "read",
      },
      {
        id: "alex-3",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 15 * minute,
        text: "The PR is ready for review",
        status: "read",
      },
    ],
    "sara": [
      {
        id: "sara-1",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 3 * hour,
        text: "Are we still on for standup at 10?",
        status: "read",
      },
      {
        id: "sara-2",
        senderId: "user-3",
        senderName: "Sara Kim",
        timestamp: now - hour,
        text: "See you at standup!",
        status: "read",
      },
    ],
    "product": [
      {
        id: "prod-1",
        senderId: "user-4",
        senderName: "Jordan Taylor",
        timestamp: now - 5 * hour,
        text: "Team, we need to finalize the Q2 roadmap by end of week",
        status: "read",
      },
      {
        id: "prod-2",
        senderId: "user-5",
        senderName: "Morgan Rivera",
        timestamp: now - 4 * hour,
        text: "I'll have the analytics section done by Wednesday",
        status: "read",
      },
      {
        id: "prod-3",
        senderId: "user-4",
        senderName: "Jordan Taylor",
        timestamp: now - 3 * hour,
        text: "Q2 roadmap next week",
        status: "read",
      },
    ],
    "dan": [
      {
        id: "dan-1",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 2 * day,
        text: "The hotfix branch is ready to merge",
        status: "read",
      },
      {
        id: "dan-2",
        senderId: "user-6",
        senderName: "Dan Lee",
        timestamp: now - day,
        text: "Merged! \u{1F389}",
        status: "read",
        reactions: [{ emoji: "\u{1F389}", userIds: ["user-1"], count: 1 }],
      },
    ],
  }
}

// ─── MessagingDemo component ─────────────────────────────────────────────────

function MessagingDemo({ theme }: { theme: ChatTheme }) {
  const [activeConvo, setActiveConvo] = useState("design-team")
  const [messages, setMessages] = useState<Record<string, ChatMessageData[]>>(() => createConvoMessages(Date.now()))
  const [replyingTo, setReplyingTo] = useState<ChatMessageData | null>(null)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [sidebarSearch, setSidebarSearch] = useState("")
  const [msgSearch, setMsgSearch] = useState("")
  const [msgSearchOpen, setMsgSearchOpen] = useState(false)

  const activeConvoData = conversations.find((c) => c.id === activeConvo) || conversations[0]
  const activeMessages = useMemo(() => messages[activeConvo] || [], [messages, activeConvo])

  const filteredConversations = useMemo(() => {
    if (!sidebarSearch.trim()) return conversations
    const q = sidebarSearch.toLowerCase()
    return conversations.filter((c) => c.name.toLowerCase().includes(q))
  }, [sidebarSearch])

  const filteredMessages = useMemo(() => {
    if (!msgSearch.trim()) return activeMessages
    const q = msgSearch.toLowerCase()
    return activeMessages.filter((m) => m.text?.toLowerCase().includes(q))
  }, [activeMessages, msgSearch])

  const msgSearchCount = msgSearch.trim() ? filteredMessages.length : 0

  useEffect(() => {
    if (activeConvo !== "design-team") return
    const t1 = setTimeout(() => setTypingUsers([{ id: "user-2", name: "Alex" }]), 3000)
    const t2 = setTimeout(() => setTypingUsers([]), 6000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [activeConvo])

  const handleSend = useCallback(
    (text: string) => {
      const newMessage: ChatMessageData = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        timestamp: Date.now(),
        text,
        status: "sent",
        replyTo: replyingTo
          ? { id: replyingTo.id, senderName: replyingTo.senderName, text: replyingTo.text || "" }
          : undefined,
      }
      setMessages((prev) => ({
        ...prev,
        [activeConvo]: [...(prev[activeConvo] || []), newMessage],
      }))
      setReplyingTo(null)

      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [activeConvo]: (prev[activeConvo] || []).map((m) =>
            m.id === newMessage.id ? { ...m, status: "delivered" as const } : m
          ),
        }))
      }, 800)
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [activeConvo]: (prev[activeConvo] || []).map((m) =>
            m.id === newMessage.id ? { ...m, status: "read" as const } : m
          ),
        }))
      }, 2500)
    },
    [replyingTo, activeConvo]
  )

  const handleReactionAdd = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) => {
      const updated = { ...prev }
      for (const key of Object.keys(updated)) {
        updated[key] = updated[key].map((m) => {
          if (m.id !== messageId) return m
          const reactions = [...(m.reactions || [])]
          const existing = reactions.find((r) => r.emoji === emoji)
          if (existing) {
            if (existing.userIds.includes(currentUser.id)) return m
            existing.userIds.push(currentUser.id)
            existing.count++
          } else {
            reactions.push({ emoji, userIds: [currentUser.id], count: 1 })
          }
          return { ...m, reactions }
        })
      }
      return updated
    })
  }, [])

  const handleReactionRemove = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) => {
      const updated = { ...prev }
      for (const key of Object.keys(updated)) {
        updated[key] = updated[key].map((m) => {
          if (m.id !== messageId) return m
          const reactions = (m.reactions || [])
            .map((r) =>
              r.emoji !== emoji
                ? r
                : { ...r, userIds: r.userIds.filter((id) => id !== currentUser.id), count: r.count - 1 }
            )
            .filter((r) => r.count > 0)
          return { ...m, reactions }
        })
      }
      return updated
    })
  }, [])

  const handleReply = useCallback((message: ChatMessageData) => setReplyingTo(message), [])
  const handleDelete = useCallback(
    (messageId: string) =>
      setMessages((prev) => {
        const updated = { ...prev }
        for (const key of Object.keys(updated)) {
          updated[key] = updated[key].filter((m) => m.id !== messageId)
        }
        return updated
      }),
    []
  )
  const handlePin = useCallback(
    (messageId: string) =>
      setMessages((prev) => {
        const updated = { ...prev }
        for (const key of Object.keys(updated)) {
          updated[key] = updated[key].map((m) =>
            m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
          )
        }
        return updated
      }),
    []
  )

  return (
    <ChatProvider
      currentUser={currentUser}
      theme={theme}
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
      onReactionAdd={handleReactionAdd}
      onReactionRemove={handleReactionRemove}
      onReply={handleReply}
      onDelete={handleDelete}
      onPin={handlePin}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden md:flex w-[260px] shrink-0 border-r border-[var(--chat-border-strong)] bg-[var(--chat-bg-sidebar)] flex-col">
          {/* Search bar */}
          <div className="px-3 py-2 border-b border-[var(--chat-border)]">
            <div className="flex items-center gap-2 rounded-lg bg-[var(--chat-bg-main)] px-3 py-1.5">
              <Search className="size-3.5 text-[var(--chat-text-tertiary)]" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Search"
                className="flex-1 bg-transparent text-[13px] text-[var(--chat-text-primary)] placeholder:text-[var(--chat-text-tertiary)] outline-none"
              />
              {sidebarSearch && (
                <button onClick={() => setSidebarSearch("")} className="text-[var(--chat-text-tertiary)] hover:text-[var(--chat-text-primary)]">
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto py-1">
            {filteredConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveConvo(c.id); setReplyingTo(null); setMsgSearchOpen(false); setMsgSearch("") }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors"
                style={{
                  background: activeConvo === c.id ? "var(--chat-accent-soft)" : "transparent",
                }}
              >
                <div className="relative shrink-0">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[var(--chat-bubble-incoming)] text-[11px] font-semibold text-[var(--chat-text-primary)]">
                    {c.name.charAt(0)}
                  </div>
                  {c.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[var(--chat-bg-sidebar)] bg-[var(--chat-green)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between">
                    <span className="truncate text-[13px] font-semibold text-[var(--chat-text-primary)]">{c.name}</span>
                    <span className="text-[10px] text-[var(--chat-text-tertiary)] shrink-0 ml-1">{c.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="truncate text-[11px] text-[var(--chat-text-secondary)]">{c.preview}</span>
                    {c.unread > 0 && (
                      <span className="flex size-4 shrink-0 ml-1 items-center justify-center rounded-full bg-[var(--chat-red)] text-[9px] font-bold text-white">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
            {filteredConversations.length === 0 && (
              <div className="px-4 py-6 text-center text-[12px] text-[var(--chat-text-tertiary)]">
                No conversations found
              </div>
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-[var(--chat-bg-main)] min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[var(--chat-border)] bg-[var(--chat-bg-header)] px-4 py-2.5 backdrop-blur-[20px]">
            <div className="relative">
              <div className="flex size-9 items-center justify-center rounded-full bg-[var(--chat-bubble-incoming)] text-xs font-semibold text-[var(--chat-text-primary)]">
                {activeConvoData.name.charAt(0)}
              </div>
              {activeConvoData.online && (
                <div className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-[var(--chat-bg-main)] bg-[var(--chat-green)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-semibold text-[var(--chat-text-primary)] truncate block">{activeConvoData.name}</span>
              <span className="text-[11px] text-[var(--chat-text-secondary)]">
                {activeConvoData.isGroup ? "Alex, Sara, and you" : activeConvoData.online ? "Online" : "Last seen recently"}
              </span>
            </div>
            <div className="flex gap-1">
              <button className="size-8 flex items-center justify-center rounded-lg text-[var(--chat-text-secondary)] hover:bg-[var(--chat-accent-soft)]">
                <Phone className="size-4" />
              </button>
              <button
                onClick={() => { setMsgSearchOpen(!msgSearchOpen); if (msgSearchOpen) setMsgSearch("") }}
                className="size-8 flex items-center justify-center rounded-lg text-[var(--chat-text-secondary)] hover:bg-[var(--chat-accent-soft)]"
                style={{ background: msgSearchOpen ? "var(--chat-accent-soft)" : undefined }}
              >
                <Search className="size-4" />
              </button>
            </div>
          </div>

          {/* Message search bar */}
          {msgSearchOpen && (
            <div className="flex items-center gap-2 border-b border-[var(--chat-border)] bg-[var(--chat-bg-sidebar)] px-4 py-2">
              <Search className="size-3.5 text-[var(--chat-text-tertiary)]" />
              <input
                autoFocus
                type="text"
                value={msgSearch}
                onChange={(e) => setMsgSearch(e.target.value)}
                placeholder="Search in conversation..."
                className="flex-1 bg-transparent text-[13px] text-[var(--chat-text-primary)] placeholder:text-[var(--chat-text-tertiary)] outline-none"
              />
              {msgSearch.trim() && (
                <span className="text-[11px] text-[var(--chat-text-tertiary)]">
                  {msgSearchCount} result{msgSearchCount !== 1 ? "s" : ""}
                </span>
              )}
              <button
                onClick={() => { setMsgSearchOpen(false); setMsgSearch("") }}
                className="text-[var(--chat-text-tertiary)] hover:text-[var(--chat-text-primary)]"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* Messages + Composer */}
          <ChatMessages messages={msgSearch.trim() ? filteredMessages : activeMessages} typingUsers={activeConvo === "design-team" ? typingUsers : []} />
          <ChatComposer
            onSend={handleSend}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
          />
        </div>
      </div>
    </ChatProvider>
  )
}

// ─── SupportDemo component ──────────────────────────────────────────────────

function SupportDemo({ theme }: { theme: ChatTheme }) {
  const [messages, setMessages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    return [
      {
        id: "sup-1",
        senderId: "agent-1",
        senderName: "Support Agent",
        timestamp: now - 5 * minute,
        text: "Hi there! \u{1F44B} Welcome to Acme Support. How can I help you today?",
        status: "read",
      },
      {
        id: "sup-2",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 4 * minute,
        text: "I\u2019m having trouble with my subscription renewal. It says payment failed but my card is fine.",
        status: "read",
      },
      {
        id: "sup-3",
        senderId: "agent-1",
        senderName: "Support Agent",
        timestamp: now - 3 * minute,
        text: "I can see the issue \u2014 your card\u2019s expiration date was updated by your bank but our system still has the old one. Let me fix that for you.",
        status: "read",
      },
      {
        id: "sup-4",
        senderId: "agent-1",
        senderName: "Support Agent",
        timestamp: now - 2 * minute,
        text: "Done! I\u2019ve refreshed your payment method. The renewal should go through within the next few minutes. You\u2019ll get a confirmation email.",
        status: "read",
        reactions: [{ emoji: "\u{1F64F}", userIds: ["user-1"], count: 1 }],
      },
      {
        id: "sup-5",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - minute,
        text: "That was fast, thank you so much!",
        status: "delivered",
      },
    ]
  })
  const [rating, setRating] = useState<number | null>(null)

  const handleSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sup-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        timestamp: Date.now(),
        text,
        status: "sent",
      },
    ])
  }, [])

  return (
    <ChatProvider
      currentUser={currentUser}
      theme={theme}
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="flex-1 flex flex-col bg-[var(--chat-bg-main)] min-h-0" style={{ height: "100%" }}>
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--chat-border)] bg-[var(--chat-bg-header)] px-4 py-2.5 backdrop-blur-[20px]">
          <div className="flex size-9 items-center justify-center rounded-full bg-[var(--chat-accent)] text-white">
            <Headphones className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[14px] font-semibold text-[var(--chat-text-primary)]">Acme Support</span>
            <span className="text-[11px] text-[var(--chat-text-secondary)] block">Typically replies in minutes</span>
          </div>
          <div className="flex size-2 rounded-full bg-[var(--chat-green)]" />
        </div>

        <ChatMessages messages={messages} />

        {/* Satisfaction rating */}
        <div className="flex items-center justify-center gap-2 border-t border-[var(--chat-border)] bg-[var(--chat-bg-sidebar)] px-4 py-2.5">
          <span className="text-[12px] text-[var(--chat-text-secondary)]">Rate this conversation:</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className="size-4"
                  fill={rating !== null && n <= rating ? "var(--chat-orange)" : "none"}
                  stroke={rating !== null && n <= rating ? "var(--chat-orange)" : "var(--chat-text-tertiary)"}
                />
              </button>
            ))}
          </div>
          {rating && (
            <span className="text-[11px] text-[var(--chat-accent)] font-medium">Thanks!</span>
          )}
        </div>

        <ChatComposer onSend={handleSend} placeholder="Type a message..." />
      </div>
    </ChatProvider>
  )
}

// ─── ThreadDemo component ───────────────────────────────────────────────────

function ThreadDemo({ theme }: { theme: ChatTheme }) {
  const [threadMessages, setThreadMessages] = useState<ThreadedMessage[]>(() => {
    const now = Date.now()
    return [
      {
        id: "t-1",
        senderId: "user-4",
        senderName: "Jordan Taylor",
        timestamp: now - 2 * hour,
        text: "Should we switch from REST to tRPC for the new dashboard API? The type safety would be a huge win.",
        parentId: null,
        depth: 0,
        votes: 12,
        userVote: null,
        children: [
          {
            id: "t-2",
            senderId: "user-2",
            senderName: "Alex Chen",
            timestamp: now - hour - 45 * minute,
            text: "Strongly agree. We spent two days last sprint debugging a type mismatch between the frontend and API. tRPC would have caught that at build time.",
            parentId: "t-1",
            depth: 1,
            votes: 8,
            userVote: "up",
            children: [
              {
                id: "t-3",
                senderId: "user-3",
                senderName: "Sara Kim",
                timestamp: now - hour - 30 * minute,
                text: "The DX is great but what about the learning curve for the team? Not everyone is familiar with tRPC.",
                parentId: "t-2",
                depth: 2,
                votes: 5,
                userVote: null,
                children: [
                  {
                    id: "t-4",
                    senderId: "user-2",
                    senderName: "Alex Chen",
                    timestamp: now - hour,
                    text: "Fair point. We could start with one endpoint as a pilot and let people ramp up gradually.",
                    parentId: "t-3",
                    depth: 3,
                    votes: 6,
                    userVote: null,
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: "t-5",
            senderId: "user-5",
            senderName: "Morgan Rivera",
            timestamp: now - hour - 15 * minute,
            text: "I\u2019d also consider the migration effort. We have 40+ REST endpoints. A gradual approach makes more sense than a full rewrite.",
            parentId: "t-1",
            depth: 1,
            votes: 10,
            userVote: null,
            children: [],
          },
        ],
      },
    ]
  })

  const handleVote = useCallback((messageId: string, direction: "up" | "down") => {
    function updateVotes(msgs: ThreadedMessage[]): ThreadedMessage[] {
      return msgs.map((m) => {
        if (m.id === messageId) {
          const currentVote = m.userVote
          let newVote: "up" | "down" | null = direction
          let delta = 0
          if (currentVote === direction) {
            newVote = null
            delta = direction === "up" ? -1 : 1
          } else {
            if (currentVote === "up") delta = -1
            else if (currentVote === "down") delta = 1
            delta += direction === "up" ? 1 : -1
          }
          return { ...m, userVote: newVote, votes: (m.votes ?? 0) + delta, children: updateVotes(m.children) }
        }
        return { ...m, children: updateVotes(m.children) }
      })
    }
    setThreadMessages((prev) => updateVotes(prev))
  }, [])

  return (
    <ChatProvider
      currentUser={currentUser}
      theme={theme}
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="flex-1 flex flex-col bg-[var(--chat-bg-main)] min-h-0" style={{ height: "100%" }}>
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--chat-border)] bg-[var(--chat-bg-header)] px-4 py-2.5 backdrop-blur-[20px]">
          <div className="flex size-9 items-center justify-center rounded-full bg-[var(--chat-accent-soft)]">
            <MessageSquare className="size-4 text-[var(--chat-accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[14px] font-semibold text-[var(--chat-text-primary)]">REST vs tRPC</span>
            <span className="text-[11px] text-[var(--chat-text-secondary)] block">5 replies \u00B7 Engineering</span>
          </div>
        </div>

        {/* Thread content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <ChatNestedThread
            messages={threadMessages}
            showVotes
            onVote={handleVote}
          />
        </div>
      </div>
    </ChatProvider>
  )
}

// ─── TicketsDemo component ──────────────────────────────────────────────────

const ticketsList: SupportTicket[] = [
  { id: "TK-1042", subject: "Cannot export data to CSV", customerName: "Emma Wilson", status: "open", priority: "high", category: "Bug", createdAt: "10m ago" },
  { id: "TK-1041", subject: "Billing shows wrong amount", customerName: "James Park", status: "in-progress", priority: "urgent", category: "Billing", createdAt: "25m ago" },
  { id: "TK-1040", subject: "How to set up SSO?", customerName: "Priya Sharma", status: "open", priority: "medium", category: "Question", createdAt: "1h ago" },
  { id: "TK-1039", subject: "API rate limit too low", customerName: "Carlos Ruiz", status: "in-progress", priority: "medium", category: "Feature", createdAt: "2h ago" },
  { id: "TK-1038", subject: "Dashboard loads slowly", customerName: "Aisha Johnson", status: "resolved", priority: "low", category: "Bug", createdAt: "3h ago" },
  { id: "TK-1037", subject: "Need to add team members", customerName: "Liam O'Brien", status: "resolved", priority: "low", category: "Question", createdAt: "5h ago" },
]

function createTicketMessages(now: number): Record<string, ChatMessageData[]> {
  return {
    "TK-1042": [
      {
        id: "tk1042-1",
        senderId: "customer-emma",
        senderName: "Emma Wilson",
        timestamp: now - 10 * minute,
        text: "Hi, I'm trying to export my analytics data to CSV but the button just spins and nothing downloads. I've tried Chrome and Firefox.",
        status: "read",
      },
      {
        id: "tk1042-2",
        senderId: "agent-1",
        senderName: "Support Agent",
        timestamp: now - 8 * minute,
        text: "Hi Emma! Sorry about that. Let me check your account. Can you tell me roughly how many rows of data you're trying to export?",
        status: "read",
      },
      {
        id: "tk1042-3",
        senderId: "customer-emma",
        senderName: "Emma Wilson",
        timestamp: now - 7 * minute,
        text: "It's about 50,000 rows — the last 6 months of data.",
        status: "read",
      },
      {
        id: "tk1042-4",
        senderId: "agent-1",
        senderName: "Support Agent",
        timestamp: now - 5 * minute,
        text: "That's the issue — exports over 10k rows time out in the browser. I'm going to queue a background export for you. You'll get an email with the download link in about 2 minutes.",
        status: "read",
      },
      {
        id: "tk1042-sys",
        senderId: "system",
        senderName: "System",
        timestamp: now - 4 * minute,
        isSystem: true,
        text: "Priority changed from Medium to High",
      },
      {
        id: "tk1042-5",
        senderId: "customer-emma",
        senderName: "Emma Wilson",
        timestamp: now - 3 * minute,
        text: "Oh that's great! Will the background export include the same filters I had applied?",
        status: "read",
        reactions: [{ emoji: "\u{1F44D}", userIds: ["agent-1"], count: 1 }],
      },
    ],
    "TK-1041": [
      {
        id: "tk1041-1",
        senderId: "customer-james",
        senderName: "James Park",
        timestamp: now - 25 * minute,
        text: "My invoice shows $299 but I'm on the $199/mo plan. Can you check this?",
        status: "read",
        files: [
          { name: "invoice-march-2026.pdf", size: 142_000, type: "application/pdf", url: "#" },
        ],
      },
      {
        id: "tk1041-sys",
        senderId: "system",
        senderName: "System",
        timestamp: now - 24 * minute,
        isSystem: true,
        text: "Ticket assigned to Sarah from Billing Team",
      },
      {
        id: "tk1041-2",
        senderId: "agent-2",
        senderName: "Sarah (Billing)",
        timestamp: now - 20 * minute,
        text: "Hi James, I can see the discrepancy. It looks like an add-on for extra storage was applied on March 1st. Let me pull up the details.",
        status: "read",
      },
      {
        id: "tk1041-3",
        senderId: "agent-2",
        senderName: "Sarah (Billing)",
        timestamp: now - 18 * minute,
        text: "Found it — there was an automatic upgrade to 500GB storage that triggered a $100 add-on charge. I don't see this was authorized by you, so I'll issue a refund right away.",
        status: "read",
      },
      {
        id: "tk1041-4",
        senderId: "customer-james",
        senderName: "James Park",
        timestamp: now - 15 * minute,
        text: "Yes please! I definitely didn't authorize that. Can you also make sure it doesn't happen again next month?",
        status: "read",
      },
      {
        id: "tk1041-5",
        senderId: "agent-2",
        senderName: "Sarah (Billing)",
        timestamp: now - 12 * minute,
        text: "Absolutely. I've disabled the auto-upgrade and processed the $100 refund. It should appear on your statement within 3-5 business days.",
        status: "read",
        reactions: [{ emoji: "\u{1F64F}", userIds: ["customer-james"], count: 1 }],
      },
    ],
    "TK-1040": [
      {
        id: "tk1040-1",
        senderId: "customer-priya",
        senderName: "Priya Sharma",
        timestamp: now - hour,
        text: "We'd like to set up SSO with Okta for our team of 50. Is there a guide for this?",
        status: "read",
      },
      {
        id: "tk1040-2",
        senderId: "agent-1",
        senderName: "Support Agent",
        timestamp: now - 55 * minute,
        text: "Hi Priya! Yes, we have a step-by-step guide for Okta SSO integration. Here's what you'll need:",
        status: "read",
        linkPreview: {
          url: "https://docs.example.com/sso/okta-setup",
          title: "Okta SSO Setup Guide",
          description: "Step-by-step instructions for configuring SAML-based SSO with Okta for your organization.",
          image: "",
        },
      },
      {
        id: "tk1040-3",
        senderId: "agent-1",
        senderName: "Support Agent",
        timestamp: now - 54 * minute,
        text: "You'll need your Okta admin credentials and about 15 minutes. Let me know if you hit any snags!",
        status: "read",
      },
    ],
    "TK-1039": [
      {
        id: "tk1039-1",
        senderId: "customer-carlos",
        senderName: "Carlos Ruiz",
        timestamp: now - 2 * hour,
        text: "Our API integration is hitting the rate limit constantly. We're on the Pro plan — is there a way to increase it?",
        status: "read",
        code: {
          language: "json",
          code: `{\n  "error": "rate_limit_exceeded",\n  "limit": "1000/min",\n  "current": "1247/min",\n  "retry_after": 23\n}`,
        },
      },
      {
        id: "tk1039-2",
        senderId: "agent-1",
        senderName: "Support Agent",
        timestamp: now - hour - 45 * minute,
        text: "Hi Carlos! I can see you're consistently hitting the 1000/min limit. I've temporarily bumped you to 2500/min while we review a permanent increase.",
        status: "read",
      },
    ],
    "TK-1038": [
      {
        id: "tk1038-1",
        senderId: "customer-aisha",
        senderName: "Aisha Johnson",
        timestamp: now - 3 * hour,
        text: "The main dashboard is taking 15+ seconds to load. It used to be instant.",
        status: "read",
      },
      {
        id: "tk1038-2",
        senderId: "agent-1",
        senderName: "Support Agent",
        timestamp: now - 2 * hour - 45 * minute,
        text: "We identified a database query issue affecting dashboard load times. A fix was deployed 10 minutes ago. Can you try refreshing?",
        status: "read",
      },
      {
        id: "tk1038-3",
        senderId: "customer-aisha",
        senderName: "Aisha Johnson",
        timestamp: now - 2 * hour - 30 * minute,
        text: "Loading in under 2 seconds now. Thanks for the quick fix!",
        status: "read",
        reactions: [{ emoji: "\u{1F389}", userIds: ["agent-1"], count: 1 }],
      },
      {
        id: "tk1038-sys",
        senderId: "system",
        senderName: "System",
        timestamp: now - 2 * hour - 25 * minute,
        isSystem: true,
        text: "Ticket resolved by Support Agent",
      },
    ],
    "TK-1037": [
      {
        id: "tk1037-1",
        senderId: "customer-liam",
        senderName: "Liam O'Brien",
        timestamp: now - 5 * hour,
        text: "How do I add more team members to my workspace? I can't find the setting.",
        status: "read",
      },
      {
        id: "tk1037-2",
        senderId: "agent-1",
        senderName: "Support Agent",
        timestamp: now - 4 * hour - 50 * minute,
        text: "Go to Settings \u2192 Team \u2192 Invite Members. You can add up to 25 members on your current plan. Need a walkthrough?",
        status: "read",
      },
      {
        id: "tk1037-3",
        senderId: "customer-liam",
        senderName: "Liam O'Brien",
        timestamp: now - 4 * hour - 40 * minute,
        text: "Found it, thanks! Super easy.",
        status: "read",
      },
      {
        id: "tk1037-sys",
        senderId: "system",
        senderName: "System",
        timestamp: now - 4 * hour - 35 * minute,
        isSystem: true,
        text: "Ticket resolved by Support Agent",
      },
    ],
  }
}

function TicketsDemo({ theme }: { theme: ChatTheme }) {
  const [activeTicketId, setActiveTicketId] = useState("TK-1042")
  const [messages, setMessages] = useState<Record<string, ChatMessageData[]>>(() => createTicketMessages(Date.now()))

  const activeMessages = useMemo(() => messages[activeTicketId] || [], [messages, activeTicketId])

  const handleSend = useCallback(
    (text: string) => {
      const newMessage: ChatMessageData = {
        id: `tk-${Date.now()}`,
        senderId: currentUser.id,
        senderName: "Support Agent",
        timestamp: Date.now(),
        text,
        status: "sent",
      }
      setMessages((prev) => ({
        ...prev,
        [activeTicketId]: [...(prev[activeTicketId] || []), newMessage],
      }))
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [activeTicketId]: (prev[activeTicketId] || []).map((m) =>
            m.id === newMessage.id ? { ...m, status: "delivered" as const } : m
          ),
        }))
      }, 800)
    },
    [activeTicketId]
  )

  return (
    <SupportTickets
      currentUser={currentUser}
      theme={theme}
      tickets={ticketsList}
      activeTicketId={activeTicketId}
      onSelectTicket={setActiveTicketId}
      messages={activeMessages}
      onSend={handleSend}
    />
  )
}

// ─── Features data ────────────────────────────────────────────────────────────

const features = [
  {
    title: "4 Themes",
    description: "Lunar, Aurora, Ember, and Midnight. Light and dark modes built in.",
    gradient: "from-[#EEF2FF] to-[#E0E7FF]",
    preview: (
      <div className="flex items-center gap-2.5">
        <div className="size-6 rounded-full bg-[#6366F1] shadow-sm" title="Lunar" />
        <div className="size-6 rounded-full bg-[#14B8A6] shadow-sm" title="Aurora" />
        <div className="size-6 rounded-full bg-[#F97316] shadow-sm" title="Ember" />
        <div className="size-6 rounded-full bg-[#3B82F6] shadow-sm" title="Midnight" />
      </div>
    ),
  },
  {
    title: "Messaging",
    description: "Reactions, threads, read receipts, typing indicators, and reply-to.",
    gradient: "from-[#F0FDF4] to-[#DCFCE7]",
    preview: (
      <div className="flex w-full max-w-[180px] flex-col gap-1.5">
        <div className="self-start rounded-xl rounded-bl-sm bg-[#F4F4F5] px-3 py-1.5 text-[10px] text-[#52525B]">Hey, how&apos;s the project?</div>
        <div className="self-end rounded-xl rounded-br-sm bg-[#6366F1] px-3 py-1.5 text-[10px] text-white">Almost done!</div>
        <div className="mt-0.5 flex items-center gap-1 self-end">
          <span className="rounded-full border border-[#E4E4E7] bg-white px-1.5 py-0.5 text-[9px]">&#128077; 1</span>
        </div>
      </div>
    ),
  },
  {
    title: "Support Widget",
    description: "Customer support chat with agent routing, ratings, and quick replies.",
    gradient: "from-[#FDF4FF] to-[#FAE8FF]",
    preview: (
      <div className="flex w-full max-w-[180px] flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-[#6366F1] px-2 py-0.5 text-[9px] font-semibold text-white"><Headphones className="size-3 inline-block" /></span>
          <span className="text-[10px] text-[#52525B]">Support Agent</span>
        </div>
        <div className="self-start rounded-xl rounded-bl-sm bg-[#F4F4F5] px-3 py-1.5 text-[10px] text-[#52525B]">How can I help?</div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className="size-3" fill={n <= 4 ? "#F59E0B" : "none"} stroke={n <= 4 ? "#F59E0B" : "#A1A1AA"} />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "File Upload",
    description: "Drag-and-drop file sharing with previews, progress bars, and size limits.",
    gradient: "from-[#FFF7ED] to-[#FFEDD5]",
    preview: (
      <div className="flex w-full max-w-[180px] items-center gap-2.5">
        <Paperclip className="size-5 shrink-0 text-[#F97316]" />
        <div className="flex flex-col gap-0.5 rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5">
          <span className="text-[10px] font-medium text-[#18181B]">design-v2.fig</span>
          <span className="text-[9px] text-[#A1A1AA]">2.4 MB</span>
        </div>
      </div>
    ),
  },
  {
    title: "Search",
    description: "Command-palette search across messages with keyboard navigation.",
    gradient: "from-[#FEF3C7] to-[#FDE68A]",
    preview: (
      <div className="flex w-full max-w-[200px] items-center gap-2 rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5">
        <Search className="size-3.5 shrink-0 text-[#A1A1AA]" />
        <span className="text-[10px] text-[#A1A1AA]">Search messages...</span>
        <kbd className="ml-auto rounded border border-[#E4E4E7] px-1 py-0.5 text-[8px] font-medium text-[#A1A1AA]">ESC</kbd>
      </div>
    ),
  },
  {
    title: "Backend Agnostic",
    description: "Works with any stack. REST, GraphQL, WebSocket, or serverless.",
    gradient: "from-[#FAFAF9] to-[#F5F5F4]",
    preview: (
      <div className="flex items-center gap-1.5">
        <span className="rounded-full bg-[#6366F1]/10 px-2.5 py-1 text-[10px] font-semibold text-[#6366F1]">REST</span>
        <span className="rounded-full bg-[#14B8A6]/10 px-2.5 py-1 text-[10px] font-semibold text-[#14B8A6]">WS</span>
        <span className="rounded-full bg-[#F97316]/10 px-2.5 py-1 text-[10px] font-semibold text-[#F97316]">Firebase</span>
      </div>
    ),
  },
]

// ─── Demo code generators (theme-aware) ─────────────────────────────────────

function getMessagingCode(theme: ChatTheme) {
  return `"use client"

import { useState, useCallback } from "react"
import {
  ChatProvider,
  ChatMessages,
  ChatComposer,
} from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = {
  id: "user-1",
  name: "You",
  status: "online",
}

const initialMessages: ChatMessageData[] = [
  // System message
  {
    id: "sys-1",
    senderId: "system",
    senderName: "System",
    timestamp: new Date(Date.now() - 600000),
    isSystem: true,
    text: "Alex Chen created this conversation",
  },
  // Basic text with reactions
  {
    id: "1",
    senderId: "user-2",
    senderName: "Alex Chen",
    text: "Hey! Have you had a chance to look at the new design system?",
    timestamp: new Date(Date.now() - 500000),
    status: "read",
    reactions: [
      { emoji: "\\u{1F44D}", userIds: ["user-1"], count: 1 },
    ],
  },
  // Reply-to quote
  {
    id: "2",
    senderId: "user-1",
    senderName: "You",
    text: "Yeah! The component library looks incredible",
    timestamp: new Date(Date.now() - 400000),
    status: "delivered",
    replyTo: {
      id: "1",
      senderName: "Alex Chen",
      text: "Hey! Have you had a chance to look at the new design system?",
    },
    readBy: [
      { userId: "user-2", name: "Alex Chen" },
    ],
  },
  // Code block
  {
    id: "3",
    senderId: "user-2",
    senderName: "Alex Chen",
    text: "Here's the updated token validation:",
    timestamp: new Date(Date.now() - 300000),
    status: "read",
    code: {
      language: "typescript",
      code: \`async function validateToken(token: string) {
  const decoded = jwt.verify(token, SECRET)
  if (decoded.version === 2) {
    return validateV2(decoded)
  }
  return validateV1(decoded) // legacy
}\`,
    },
  },
  // File attachment
  {
    id: "4",
    senderId: "user-2",
    senderName: "Alex Chen",
    text: "And the migration plan doc",
    timestamp: new Date(Date.now() - 250000),
    status: "read",
    files: [
      {
        name: "token-migration-plan.pdf",
        size: 245000,
        type: "application/pdf",
        url: "/uploads/token-migration-plan.pdf",
      },
    ],
  },
  // Image
  {
    id: "5",
    senderId: "user-3",
    senderName: "Sara Kim",
    text: "Here's the updated component preview:",
    timestamp: new Date(Date.now() - 200000),
    status: "read",
    images: [
      {
        url: "/uploads/design-preview.png",
        width: 600,
        height: 400,
        alt: "Design System v2 preview",
      },
    ],
  },
  // Link preview
  {
    id: "6",
    senderId: "user-2",
    senderName: "Alex Chen",
    text: "Found this article on token migration — really useful:",
    timestamp: new Date(Date.now() - 150000),
    status: "read",
    linkPreview: {
      url: "https://example.com/token-migration-patterns",
      title: "Token Migration Patterns for Zero-Downtime Auth",
      description: "A comprehensive guide to migrating authentication tokens in production.",
      image: "https://example.com/og-image.png",
    },
  },
  // Voice message
  {
    id: "7",
    senderId: "user-3",
    senderName: "Sara Kim",
    text: "Left a voice note about the rollout timeline:",
    timestamp: new Date(Date.now() - 100000),
    status: "read",
    voice: {
      url: "/uploads/voice-note.webm",
      duration: 14,
      waveform: [0.2, 0.4, 0.7, 1.0, 0.8, 0.5, 0.9, 0.6, 0.3, 0.7,
                 0.5, 0.8, 0.4, 0.6, 0.9, 0.3, 0.5, 0.7, 0.4, 0.2],
    },
  },
  // Pinned message
  {
    id: "8",
    senderId: "user-1",
    senderName: "You",
    text: "Let's ship the new token format behind a feature flag first",
    timestamp: new Date(Date.now() - 50000),
    status: "delivered",
    isPinned: true,
    reactions: [
      { emoji: "\\u{1F680}", userIds: ["user-2", "user-3"], count: 2 },
    ],
  },
]

export default function MessagingApp() {
  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages)
  const [replyingTo, setReplyingTo] = useState<ChatMessageData | null>(null)

  const handleSend = useCallback(
    (text: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          senderId: currentUser.id,
          senderName: currentUser.name,
          text,
          timestamp: new Date(),
          status: "sent",
          replyTo: replyingTo
            ? { id: replyingTo.id, senderName: replyingTo.senderName, text: replyingTo.text || "" }
            : undefined,
        },
      ])
      setReplyingTo(null)
    },
    [replyingTo]
  )

  return (
    <ChatProvider
      currentUser={currentUser}
      theme="${theme}"
      onReply={(msg) => setReplyingTo(msg)}
      onReaction={(id, emoji) => {
        // Handle reaction add/remove
        console.log("Reaction:", id, emoji)
      }}
    >
      <div className="flex h-screen flex-col">
        <ChatMessages
          messages={messages}
          typingUsers={[]}
        />
        <ChatComposer
          onSend={handleSend}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          onFileUpload={(files) => {
            console.log("Files dropped:", files)
          }}
        />
      </div>
    </ChatProvider>
  )
}`
}

function getSupportCode(theme: ChatTheme) {
  return `"use client"

import { useState, useCallback } from "react"
import {
  ChatProvider,
  ChatMessages,
  ChatComposer,
} from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const customer: ChatUser = { id: "customer-1", name: "Customer" }

export default function SupportWidget() {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: "welcome",
      senderId: "agent-1",
      senderName: "Support Agent",
      text: "Hi there! \\u{1F44B} Welcome to Acme Support. How can I help you today?",
      timestamp: new Date(Date.now() - 300000),
      status: "read",
    },
    {
      id: "customer-1",
      senderId: "customer-1",
      senderName: "Customer",
      text: "I'm having trouble with my subscription renewal. It says payment failed but my card is fine.",
      timestamp: new Date(Date.now() - 240000),
      status: "read",
    },
    {
      id: "agent-2",
      senderId: "agent-1",
      senderName: "Support Agent",
      text: "I can see the issue — your card's expiration date was updated by your bank but our system still has the old one. Let me fix that for you.",
      timestamp: new Date(Date.now() - 180000),
      status: "read",
    },
    {
      id: "agent-3",
      senderId: "agent-1",
      senderName: "Support Agent",
      text: "Done! I've refreshed your payment method. The renewal should go through within the next few minutes. You'll get a confirmation email.",
      timestamp: new Date(Date.now() - 120000),
      status: "read",
      reactions: [
        { emoji: "\\u{1F44D}", userIds: ["customer-1"], count: 1 },
      ],
    },
    {
      id: "customer-2",
      senderId: "customer-1",
      senderName: "Customer",
      text: "That was fast, thank you so much!",
      timestamp: new Date(Date.now() - 60000),
      status: "read",
    },
  ])
  const [rating, setRating] = useState(0)

  const handleSend = useCallback((text: string) => {
    // Add customer message
    const customerMsg: ChatMessageData = {
      id: \`msg-\${Date.now()}\`,
      senderId: customer.id,
      senderName: customer.name,
      text,
      timestamp: new Date(),
      status: "sent",
    }
    setMessages((prev) => [...prev, customerMsg])

    // Simulate agent response after 1s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: \`agent-\${Date.now()}\`,
          senderId: "agent-1",
          senderName: "Support Agent",
          text: "Thanks for reaching out! Let me look into that for you.",
          timestamp: new Date(),
          status: "read",
        },
      ])
    }, 1000)
  }, [])

  return (
    <ChatProvider currentUser={customer} theme="${theme}">
      <div className="w-[400px] h-[600px] flex flex-col rounded-2xl border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b bg-[var(--chat-bg-header)] px-4 py-3">
          <div className="relative">
            <div className="size-9 rounded-full bg-[var(--chat-accent-soft)] flex items-center justify-center">
              <span className="text-sm font-semibold text-[var(--chat-accent)]">A</span>
            </div>
            <div className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[var(--chat-text-primary)]">
              Acme Support
            </p>
            <p className="text-[11px] text-[var(--chat-text-tertiary)]">
              Typically replies in minutes
            </p>
          </div>
        </div>

        {/* Messages */}
        <ChatMessages messages={messages} />

        {/* Rating bar */}
        <div className="flex items-center justify-center gap-1 border-t px-4 py-2">
          <span className="text-[11px] text-[var(--chat-text-tertiary)] mr-2">
            Rate this conversation:
          </span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)}>
              <span style={{ color: n <= rating ? "#F59E0B" : "#D4D4D8" }}>★</span>
            </button>
          ))}
        </div>

        {/* Composer */}
        <ChatComposer onSend={handleSend} placeholder="Type a message..." />
      </div>
    </ChatProvider>
  )
}`
}

function getThreadCode(theme: ChatTheme) {
  return `"use client"

import { useState, useCallback } from "react"
import { ChatProvider, ChatNestedThread } from "@/components/ui/chat"
import type { ChatUser, ThreadedMessage } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

const initialThreads: ThreadedMessage[] = [
  {
    id: "t-1",
    senderId: "user-4",
    senderName: "Jordan Taylor",
    text: "Should we switch from REST to tRPC for the new dashboard API? The type safety would be a huge win.",
    timestamp: new Date(Date.now() - 7200000),
    parentId: null,
    depth: 0,
    votes: 12,
    userVote: null,
    children: [
      {
        id: "t-2",
        senderId: "user-2",
        senderName: "Alex Chen",
        text: "Strongly agree. We spent two days last sprint debugging a type mismatch between the frontend and API. tRPC would have caught that at build time.",
        timestamp: new Date(Date.now() - 6300000),
        parentId: "t-1",
        depth: 1,
        votes: 8,
        userVote: "up" as const,
        children: [
          {
            id: "t-3",
            senderId: "user-3",
            senderName: "Sara Kim",
            text: "The DX is great but what about the learning curve for the team? Not everyone is familiar with tRPC.",
            timestamp: new Date(Date.now() - 5400000),
            parentId: "t-2",
            depth: 2,
            votes: 5,
            userVote: null,
            children: [
              {
                id: "t-4",
                senderId: "user-2",
                senderName: "Alex Chen",
                text: "Fair point. We could start with one endpoint as a pilot and let people ramp up gradually.",
                timestamp: new Date(Date.now() - 3600000),
                parentId: "t-3",
                depth: 3,
                votes: 6,
                userVote: null,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "t-5",
        senderId: "user-5",
        senderName: "Morgan Rivera",
        text: "I'd also consider the migration effort. We have 40+ REST endpoints. A gradual approach makes more sense than a full rewrite.",
        timestamp: new Date(Date.now() - 4500000),
        parentId: "t-1",
        depth: 1,
        votes: 10,
        userVote: null,
        children: [],
      },
    ],
  },
]

export default function ThreadView() {
  const [messages, setMessages] = useState<ThreadedMessage[]>(initialThreads)

  // Insert a reply into the nested tree
  const handleReply = useCallback((parentId: string, text: string) => {
    const newReply: ThreadedMessage = {
      id: crypto.randomUUID(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date(),
      parentId,
      depth: 0,
      votes: 0,
      userVote: null,
      children: [],
    }

    function insertReply(msgs: ThreadedMessage[]): ThreadedMessage[] {
      return msgs.map((msg) => {
        if (msg.id === parentId) {
          return { ...msg, children: [...msg.children, newReply] }
        }
        return { ...msg, children: insertReply(msg.children) }
      })
    }

    setMessages((prev) => insertReply(prev))
  }, [])

  // Toggle votes with proper up/down logic
  const handleVote = useCallback((messageId: string, direction: "up" | "down") => {
    function updateVotes(msgs: ThreadedMessage[]): ThreadedMessage[] {
      return msgs.map((m) => {
        if (m.id === messageId) {
          const currentVote = m.userVote
          let newVote: "up" | "down" | null = direction
          let delta = 0

          if (currentVote === direction) {
            // Undo vote
            newVote = null
            delta = direction === "up" ? -1 : 1
          } else {
            // Remove old vote, apply new
            if (currentVote === "up") delta = -1
            else if (currentVote === "down") delta = 1
            delta += direction === "up" ? 1 : -1
          }

          return {
            ...m,
            userVote: newVote,
            votes: (m.votes ?? 0) + delta,
            children: updateVotes(m.children),
          }
        }
        return { ...m, children: updateVotes(m.children) }
      })
    }
    setMessages((prev) => updateVotes(prev))
  }, [])

  return (
    <ChatProvider currentUser={currentUser} theme="${theme}">
      <div className="h-screen overflow-y-auto p-4">
        <ChatNestedThread
          messages={messages}
          onReply={handleReply}
          showVotes
          onVote={handleVote}
        />
      </div>
    </ChatProvider>
  )
}`
}

function getTicketsCode(theme: ChatTheme) {
  return `"use client"

import { useState, useCallback, useMemo } from "react"
import { SupportTickets } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData, SupportTicket } from "@/components/ui/chat"

const agent: ChatUser = { id: "agent-1", name: "Support Agent", status: "online" }

const tickets: SupportTicket[] = [
  {
    id: "TK-1042",
    subject: "Cannot export data to CSV",
    customerName: "Emma Wilson",
    status: "open",
    priority: "high",
    category: "Bug",
    createdAt: "10m ago",
  },
  {
    id: "TK-1041",
    subject: "Billing shows wrong amount",
    customerName: "James Park",
    status: "in-progress",
    priority: "urgent",
    category: "Billing",
    createdAt: "25m ago",
  },
  {
    id: "TK-1040",
    subject: "How to set up SSO?",
    customerName: "Priya Sharma",
    status: "open",
    priority: "medium",
    category: "Question",
    createdAt: "1h ago",
  },
]

const ticketMessages: Record<string, ChatMessageData[]> = {
  "TK-1042": [
    {
      id: "tk1042-1",
      senderId: "customer-emma",
      senderName: "Emma Wilson",
      text: "I'm trying to export analytics data to CSV but the button just spins.",
      timestamp: new Date(Date.now() - 600000),
      status: "read",
    },
    {
      id: "tk1042-2",
      senderId: "agent-1",
      senderName: "Support Agent",
      text: "How many rows are you exporting? Exports over 10k rows time out in the browser.",
      timestamp: new Date(Date.now() - 480000),
      status: "read",
    },
    {
      id: "tk1042-sys",
      senderId: "system",
      senderName: "System",
      timestamp: new Date(Date.now() - 240000),
      isSystem: true,
      text: "Priority changed from Medium to High",
    },
  ],
  "TK-1041": [
    {
      id: "tk1041-1",
      senderId: "customer-james",
      senderName: "James Park",
      text: "My invoice shows $299 but I'm on the $199/mo plan.",
      timestamp: new Date(Date.now() - 1500000),
      status: "read",
      files: [
        { name: "invoice-march-2026.pdf", size: 142000, type: "application/pdf", url: "#" },
      ],
    },
    {
      id: "tk1041-sys",
      senderId: "system",
      senderName: "System",
      timestamp: new Date(Date.now() - 1440000),
      isSystem: true,
      text: "Ticket assigned to Sarah from Billing Team",
    },
  ],
}

export default function TicketsDemoPage() {
  const [activeTicketId, setActiveTicketId] = useState("TK-1042")
  const [messages, setMessages] = useState(ticketMessages)

  const activeMessages = useMemo(
    () => messages[activeTicketId] || [],
    [messages, activeTicketId]
  )

  const handleSend = useCallback(
    (text: string) => {
      setMessages((prev) => ({
        ...prev,
        [activeTicketId]: [
          ...(prev[activeTicketId] || []),
          {
            id: crypto.randomUUID(),
            senderId: agent.id,
            senderName: agent.name,
            text,
            timestamp: new Date(),
            status: "sent" as const,
          },
        ],
      }))
    },
    [activeTicketId]
  )

  // SupportTickets handles the entire layout:
  // ticket sidebar, filter tabs, status/priority badges, and chat area.
  return (
    <SupportTickets
      currentUser={agent}
      theme="${theme}"
      tickets={tickets}
      activeTicketId={activeTicketId}
      onSelectTicket={setActiveTicketId}
      messages={activeMessages}
      onSend={handleSend}
    />
  )
}`
}

function DemoCodeBlock({ mode, theme }: { mode: "messaging" | "support" | "thread" | "tickets"; theme: ChatTheme }) {
  const [showCode, setShowCode] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  const code = mode === "messaging"
    ? getMessagingCode(theme)
    : mode === "support"
    ? getSupportCode(theme)
    : mode === "tickets"
    ? getTicketsCode(theme)
    : getThreadCode(theme)

  const fileName = mode === "messaging"
    ? "messaging-app.tsx"
    : mode === "support"
    ? "support-widget.tsx"
    : mode === "tickets"
    ? "support-tickets.tsx"
    : "thread-view.tsx"

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowCode(!showCode)}
        className="mx-auto flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors hover:bg-[#F4F4F5]"
        style={{ borderColor: "#E4E4E7", color: "#71717A" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
        {showCode ? "Hide Code" : "View Code"}
      </button>

      {showCode && (
        <div className="relative mt-3 overflow-hidden rounded-xl border" style={{ borderColor: "#E4E4E7" }}>
          <div className="flex items-center justify-between border-b px-4 py-2" style={{ borderColor: "#1a1a1a", background: "#111111" }}>
            <span className="text-[12px] font-medium text-[#A1A1AA]">
              {fileName}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code)
                setCodeCopied(true)
                setTimeout(() => setCodeCopied(false), 2000)
              }}
              className="rounded-md px-2 py-1 text-[11px] font-medium text-[#A1A1AA] transition-colors hover:bg-[rgba(255,255,255,0.1)] hover:text-[#FAFAFA]"
            >
              {codeCopied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto overflow-y-auto p-4 text-[13px] leading-relaxed" style={{ maxHeight: 520, background: "#0a0a0a" }}>
            <code className="font-mono" style={{ color: "#ffffff" }}>{code}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

// ─── Install command ──────────────────────────────────────────────────────────

const INSTALL_CMD = "npx shadcn@latest add https://raw.githubusercontent.com/leonickson1/chatcn/main/public/r/chat.json"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [demoMode, setDemoMode] = useState<"messaging" | "support" | "thread" | "tickets">("messaging")
  const [demoTheme, setDemoTheme] = useState<ChatTheme>("lunar")
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(INSTALL_CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const themes: ChatTheme[] = ["lunar", "aurora", "ember", "midnight"]
  const modes = [
    { key: "messaging" as const, label: "Messaging" },
    { key: "support" as const, label: "Support" },
    { key: "tickets" as const, label: "Tickets" },
    { key: "thread" as const, label: "Thread" },
  ]

  return (
    <div data-chat-theme="lunar" className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-24 pb-10 md:pt-32 md:pb-14">
        {/* Subtle gradient background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.08), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            style={{ color: "#18181B" }}
          >
            Beautiful chat, made simple
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
            style={{ color: "#71717A" }}
          >
            Ready-to-use, customizable chat components for React. Built on React. Styled with
            Tailwind. 4 themes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center justify-center rounded-lg px-8 text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ background: "#6366F1" }}
            >
              Get Started
            </Link>
            <Link
              href="/docs/messages"
              className="inline-flex h-11 items-center justify-center rounded-lg border px-8 text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: "#E4E4E7", color: "#18181B" }}
            >
              View Components
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Demo Section ─────────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-4xl">
          {/* Section heading */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#18181B" }}>
              Try it out
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#71717A" }}>
              A fully interactive chat demo. Switch themes, send messages, react.
            </p>
          </div>

          {/* Mode tabs */}
          <div className="mb-4 flex justify-center">
            <div
              className="inline-flex flex-wrap justify-center gap-1 rounded-lg border p-1"
              style={{ borderColor: "#E4E4E7", background: "#FAFAFA" }}
            >
              {modes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setDemoMode(m.key)}
                  className="rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors"
                  style={{
                    background: demoMode === m.key ? "#6366F1" : "transparent",
                    color: demoMode === m.key ? "#FFFFFF" : "#71717A",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme tabs */}
          <div className="mb-4 flex justify-center">
            <div
              className="inline-flex flex-wrap justify-center items-center gap-1 rounded-lg border p-1"
              style={{ borderColor: "#E4E4E7", background: "#FAFAFA" }}
            >
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setDemoTheme(t)}
                  className="rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors"
                  style={{
                    background: demoTheme === t ? "#6366F1" : "transparent",
                    color: demoTheme === t ? "#FFFFFF" : "#71717A",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Demo container */}
          <div
            data-chat-theme={demoTheme}
            className="overflow-hidden rounded-2xl border shadow-lg h-[500px] md:h-[650px]"
            style={{ borderColor: "#E4E4E7" }}
          >
            {demoMode === "messaging" ? (
              <MessagingDemo theme={demoTheme} />
            ) : demoMode === "support" ? (
              <SupportDemo theme={demoTheme} />
            ) : demoMode === "tickets" ? (
              <TicketsDemo theme={demoTheme} />
            ) : (
              <ThreadDemo theme={demoTheme} />
            )}
          </div>

          {/* Code snippet for current mode */}
          <DemoCodeBlock mode={demoMode} theme={demoTheme} />
        </div>
      </section>

      {/* ── Feature Grid ──────────────────────────────────────────────────── */}
      <section className="border-t px-4 py-24" style={{ borderColor: "#F4F4F5" }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#18181B" }}>
              Everything you need for chat
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#71717A" }}>
              Production-ready components with thoughtful defaults.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white p-6 transition-all hover:border-[#6366F1]/20 hover:shadow-lg hover:shadow-[#6366F1]/5 hover:-translate-y-0.5"
              >
                <div className={`mb-4 flex h-20 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                  {feature.preview}
                </div>
                <h3 className="text-[15px] font-semibold text-[#18181B]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#71717A]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Install Section ───────────────────────────────────────────────── */}
      <section className="border-t px-4 py-24" style={{ borderColor: "#F4F4F5" }}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#18181B" }}>
            Get started in one command
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#71717A" }}>
            Install the chat component into your project via the shadcn CLI.
          </p>

          <div className="mt-8 flex justify-center px-4">
            <div
              className="group relative flex max-w-full items-center gap-3 overflow-x-auto rounded-xl border px-5 py-3.5"
              style={{ borderColor: "#E4E4E7", background: "#FAFAFA" }}
            >
              <code
                className="shrink-0 text-[13px] font-mono whitespace-nowrap"
                style={{ color: "#18181B" }}
              >
                {INSTALL_CMD}
              </code>
              <button
                onClick={handleCopy}
                className="flex size-8 items-center justify-center rounded-md border transition-colors hover:bg-gray-100"
                style={{ borderColor: "#E4E4E7" }}
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="size-3.5" style={{ color: "#22C55E" }} />
                ) : (
                  <Copy className="size-3.5" style={{ color: "#71717A" }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t px-4 py-16" style={{ borderColor: "#F4F4F5" }}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 sm:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-1">
              <span className="text-[15px] font-bold tracking-tight" style={{ color: "#18181B" }}>
                chatcn
              </span>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "#71717A" }}>
                Free &amp; open-source chat components for React.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-3 text-[13px] font-semibold" style={{ color: "#18181B" }}>
                Product
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Documentation", href: "/docs" },
                  { label: "Components", href: "/docs/messages" },
                  { label: "Themes", href: "/docs/theming" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] transition-colors hover:underline"
                      style={{ color: "#71717A" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="mb-3 text-[13px] font-semibold" style={{ color: "#18181B" }}>
                Community
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "GitHub", href: "https://github.com/leonickson1/chatcn" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-[13px] transition-colors hover:underline"
                      style={{ color: "#71717A" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-3 text-[13px] font-semibold" style={{ color: "#18181B" }}>
                Resources
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Getting Started", href: "/docs" },
                  { label: "API Reference", href: "/docs/api-reference" },
                  { label: "Security", href: "/docs/security" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] transition-colors hover:underline"
                      style={{ color: "#71717A" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-6" style={{ borderColor: "#F4F4F5" }}>
            <p className="text-center text-[12px]" style={{ color: "#A1A1AA" }}>
              chatcn — Free &amp; open-source chat components for React.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
