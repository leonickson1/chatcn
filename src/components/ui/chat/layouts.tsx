"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  MessageSquare,
  Search,
  Phone,
  X,
  ChevronLeft,
  Plus,
  Minimize2,
  Pin,
} from "lucide-react"
import type { ChatMessageData, ChatUser, ChatTheme, TypingUser } from "./types"
import { ChatProvider } from "./chat"
import { ChatMessages, ChatComposer } from "./chat"

// ─── Shared: ChatHeader ───────────────────────────────────────────────────────

interface ChatHeaderProps {
  title: string
  subtitle?: string
  avatar?: React.ReactNode
  actions?: React.ReactNode
  onBack?: () => void
  className?: string
}

function ChatHeader({ title, subtitle, avatar, actions, onBack, className }: ChatHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-10 flex items-center gap-3 border-b border-[var(--chat-border)] bg-[var(--chat-bg-header)] px-4 py-3 backdrop-blur-[20px] backdrop-saturate-[180%]", className)}>
      {onBack && (
        <button onClick={onBack} className="mr-1 text-[var(--chat-text-secondary)] hover:text-[var(--chat-text-primary)]">
          <ChevronLeft className="size-5" />
        </button>
      )}
      {avatar}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[var(--chat-text-primary)]">{title}</span>
        {subtitle && <span className="truncate text-[12px] text-[var(--chat-text-secondary)]">{subtitle}</span>}
      </div>
      {actions}
    </header>
  )
}

// ─── Shared: Sidebar conversation item ────────────────────────────────────────

interface SidebarConversation {
  id: string
  title: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  presence?: "online" | "away" | "offline"
  isGroup?: boolean
}

function ConversationItem({
  convo,
  isActive,
  onClick,
}: {
  convo: SidebarConversation
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "mx-1 flex w-[calc(100%-8px)] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
        isActive ? "bg-[var(--chat-accent-soft)]" : "hover:bg-[var(--chat-accent-soft)]"
      )}
    >
      <div className="relative shrink-0">
        <div className="flex size-11 items-center justify-center rounded-full bg-[var(--chat-bubble-incoming)] text-[13px] font-semibold text-[var(--chat-text-secondary)]">
          {convo.title.charAt(0).toUpperCase()}
        </div>
        {convo.presence === "online" && (
          <div className="absolute -bottom-0.5 -right-0.5 size-[10px] rounded-full border-2 border-[var(--chat-bg-sidebar)] bg-[var(--chat-green)]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="truncate text-[15px] font-semibold text-[var(--chat-text-primary)]">{convo.title}</span>
          {convo.lastMessageTime && (
            <span className="ml-2 shrink-0 text-[11px] text-[var(--chat-text-tertiary)]">{convo.lastMessageTime}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="truncate text-[13px] text-[var(--chat-text-secondary)]">{convo.lastMessage}</span>
          {(convo.unreadCount ?? 0) > 0 && (
            <span className="ml-2 flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--chat-red)] text-[11px] font-bold text-white">
              {convo.unreadCount! > 99 ? "99+" : convo.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT 1: FullMessenger (Slack/Discord)
// ═══════════════════════════════════════════════════════════════════════════════

interface FullMessengerProps {
  currentUser: ChatUser
  theme?: ChatTheme
  conversations: SidebarConversation[]
  activeConversationId?: string
  onSelectConversation: (id: string) => void
  messages: ChatMessageData[]
  typingUsers?: TypingUser[]
  onSend: (text: string) => void
  title?: string
  subtitle?: string
  className?: string
}

function FullMessenger({
  currentUser,
  theme = "lunar",
  conversations,
  activeConversationId,
  onSelectConversation,
  messages,
  typingUsers,
  onSend,
  title = "Messages",
  subtitle,
  className,
}: FullMessengerProps) {
  const activeConvo = conversations.find((c) => c.id === activeConversationId)

  return (
    <ChatProvider currentUser={currentUser} theme={theme}>
      <div className={cn("flex h-full bg-[var(--chat-bg-app)]", className)}>
        {/* Sidebar — 320px */}
        <aside className="flex w-80 shrink-0 flex-col border-r border-[var(--chat-border-strong)] bg-[var(--chat-bg-sidebar)]">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[15px] font-semibold text-[var(--chat-text-primary)]">{title}</span>
            <button className="text-[var(--chat-text-secondary)] hover:text-[var(--chat-text-primary)]">
              <Plus className="size-5" />
            </button>
          </div>
          {/* Search */}
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2 rounded-[10px] bg-[var(--chat-bg-main)] px-3 py-2 opacity-50">
              <Search className="size-3.5" />
              <span className="text-[14px] text-[var(--chat-text-tertiary)]">Search</span>
            </div>
          </div>
          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto py-1">
            {conversations.map((c) => (
              <ConversationItem
                key={c.id}
                convo={c}
                isActive={c.id === activeConversationId}
                onClick={() => onSelectConversation(c.id)}
              />
            ))}
          </div>
        </aside>

        {/* Main panel */}
        <main className="flex flex-1 flex-col bg-[var(--chat-bg-main)]">
          {activeConvo ? (
            <>
              <ChatHeader
                title={activeConvo.title}
                subtitle={subtitle || (activeConvo.isGroup ? "Group" : undefined)}
                avatar={
                  <div className="relative">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[var(--chat-bubble-incoming)] text-sm font-semibold text-[var(--chat-text-primary)]">
                      {activeConvo.title.charAt(0).toUpperCase()}
                    </div>
                    {activeConvo.presence === "online" && (
                      <div className="absolute -bottom-0.5 -right-0.5 size-[10px] rounded-full border-2 border-[var(--chat-bg-main)] bg-[var(--chat-green)]" />
                    )}
                  </div>
                }
                actions={
                  <div className="flex items-center gap-1">
                    <button className="flex size-8 items-center justify-center rounded-lg text-[var(--chat-text-secondary)] hover:bg-[var(--chat-accent-soft)]"><Phone className="size-4" /></button>
                    <button className="flex size-8 items-center justify-center rounded-lg text-[var(--chat-text-secondary)] hover:bg-[var(--chat-accent-soft)]"><Search className="size-4" /></button>
                    <button className="flex size-8 items-center justify-center rounded-lg text-[var(--chat-text-secondary)] hover:bg-[var(--chat-accent-soft)]"><Pin className="size-4" /></button>
                  </div>
                }
              />
              <ChatMessages messages={messages} typingUsers={typingUsers} />
              <ChatComposer onSend={onSend} />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-3 size-12 text-[var(--chat-text-tertiary)]" />
                <p className="text-[15px] font-medium text-[var(--chat-text-secondary)]">Select a conversation</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </ChatProvider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT 2: ChatWidget (Intercom-style floating)
// ═══════════════════════════════════════════════════════════════════════════════

interface ChatWidgetProps {
  currentUser: ChatUser
  theme?: ChatTheme
  messages: ChatMessageData[]
  onSend: (text: string) => void
  title?: string
  subtitle?: string
  greeting?: string
  position?: "bottom-right" | "bottom-left"
  className?: string
}

function ChatWidget({
  currentUser,
  theme = "lunar",
  messages,
  onSend,
  title = "Support",
  subtitle = "We typically reply in minutes",
  position = "bottom-right",
  className,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <ChatProvider currentUser={currentUser} theme={theme}>
      <div className={cn("fixed z-50", position === "bottom-right" ? "bottom-5 right-5" : "bottom-5 left-5", className)}>
        {/* Chat window */}
        {isOpen && (
          <div className="mb-3 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--chat-border-strong)] bg-[var(--chat-bg-main)] shadow-[var(--chat-shadow-lg)]">
            <ChatHeader
              title={title}
              subtitle={subtitle}
              avatar={
                <div className="flex size-9 items-center justify-center rounded-full bg-[var(--chat-accent)] text-[12px] font-bold text-white">
                  <MessageSquare className="size-4" />
                </div>
              }
              actions={
                <button onClick={() => setIsOpen(false)} className="text-[var(--chat-text-secondary)] hover:text-[var(--chat-text-primary)]">
                  <Minimize2 className="size-4" />
                </button>
              }
            />
            <ChatMessages messages={messages} />
            <ChatComposer onSend={onSend} placeholder="Type a message..." />
          </div>
        )}

        {/* FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex size-14 items-center justify-center rounded-full bg-[var(--chat-accent)] text-white shadow-[var(--chat-shadow-lg)] transition-transform hover:scale-105 active:scale-95"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? <X className="size-6" /> : <MessageSquare className="size-6" />}
        </button>
      </div>
    </ChatProvider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT 3: InlineChat (Comments section)
// ═══════════════════════════════════════════════════════════════════════════════

interface InlineChatProps {
  currentUser: ChatUser
  theme?: ChatTheme
  messages: ChatMessageData[]
  onSend: (text: string) => void
  placeholder?: string
  maxHeight?: number
  className?: string
}

function InlineChat({
  currentUser,
  theme = "lunar",
  messages,
  onSend,
  placeholder = "Add a comment...",
  maxHeight = 600,
  className,
}: InlineChatProps) {
  return (
    <ChatProvider currentUser={currentUser} theme={theme}>
      <div className={cn("flex flex-col overflow-hidden rounded-xl border border-[var(--chat-border-strong)] bg-[var(--chat-bg-main)]", className)} style={{ maxHeight }}>
        <ChatMessages messages={messages} />
        <ChatComposer onSend={onSend} placeholder={placeholder} />
      </div>
    </ChatProvider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT 5: ChatBoard (Forum/Discussion)
// ═══════════════════════════════════════════════════════════════════════════════

interface Topic {
  id: string
  title: string
  author: string
  replyCount: number
  lastActivity: string
  isPinned?: boolean
  tags?: string[]
}

interface ChatBoardProps {
  currentUser: ChatUser
  theme?: ChatTheme
  topics: Topic[]
  activeTopic?: Topic
  onSelectTopic: (id: string) => void
  onBack?: () => void
  children?: React.ReactNode
  className?: string
}

function ChatBoard({
  currentUser,
  theme = "lunar",
  topics,
  activeTopic,
  onSelectTopic,
  onBack,
  children,
  className,
}: ChatBoardProps) {
  return (
    <ChatProvider currentUser={currentUser} theme={theme}>
      <div className={cn("flex h-full flex-col bg-[var(--chat-bg-main)]", className)}>
        {activeTopic ? (
          <>
            <ChatHeader title={activeTopic.title} subtitle={`${activeTopic.replyCount} replies`} onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mx-auto max-w-3xl">{children}</div>
            </div>
          </>
        ) : (
          <>
            <ChatHeader title="Discussions" actions={
              <button className="flex size-8 items-center justify-center rounded-lg bg-[var(--chat-accent)] text-white"><Plus className="size-4" /></button>
            } />
            <div className="flex-1 overflow-y-auto">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  className="flex w-full items-start gap-3 border-b border-[var(--chat-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--chat-accent-soft)]"
                >
                  {t.isPinned && <Pin className="mt-0.5 size-3.5 shrink-0 text-[var(--chat-orange)]" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-[var(--chat-text-primary)]">{t.title}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-[12px] text-[var(--chat-text-secondary)]">
                      <span>{t.author}</span>
                      <span>\u00B7</span>
                      <span>{t.replyCount} replies</span>
                      <span>\u00B7</span>
                      <span>{t.lastActivity}</span>
                    </div>
                    {t.tags && t.tags.length > 0 && (
                      <div className="mt-1 flex gap-1">
                        {t.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-[var(--chat-accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--chat-accent)]">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </ChatProvider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT 6: LiveChat (Twitch/YouTube live stream)
// ═══════════════════════════════════════════════════════════════════════════════

interface LiveChatProps {
  currentUser: ChatUser
  theme?: ChatTheme
  messages: ChatMessageData[]
  onSend: (text: string) => void
  title?: string
  viewerCount?: number
  className?: string
}

function LiveChat({
  currentUser,
  theme = "ember",
  messages,
  onSend,
  title = "Live Chat",
  viewerCount,
  className,
}: LiveChatProps) {
  return (
    <ChatProvider currentUser={currentUser} theme={theme} messageGroupingInterval={0}>
      <div className={cn("flex h-full flex-col bg-[var(--chat-bg-main)]", className)}>
        <div className="flex items-center justify-between border-b border-[var(--chat-border)] px-3 py-2">
          <span className="text-[14px] font-semibold text-[var(--chat-text-primary)]">{title}</span>
          {viewerCount !== undefined && (
            <span className="flex items-center gap-1 text-[12px] text-[var(--chat-text-secondary)]">
              <span className="size-1.5 rounded-full bg-[var(--chat-red)]" />
              {viewerCount.toLocaleString()} watching
            </span>
          )}
        </div>
        <ChatMessages messages={messages} />
        <ChatComposer onSend={onSend} placeholder="Send a message..." />
      </div>
    </ChatProvider>
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────

const ChatConversationItem = ConversationItem

export {
  ChatHeader,
  ChatConversationItem,
  FullMessenger,
  ChatWidget,
  InlineChat,
  ChatBoard,
  LiveChat,
}
export type {
  ChatHeaderProps,
  SidebarConversation,
  FullMessengerProps,
  ChatWidgetProps,
  InlineChatProps,
  Topic,
  ChatBoardProps,
  LiveChatProps,
}
