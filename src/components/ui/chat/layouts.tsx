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
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  User,
  Tag,
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
  const showingConvo = !!activeConvo

  return (
    <ChatProvider
      currentUser={currentUser}
      theme={theme}
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        className={cn("flex flex-1 min-h-0 bg-[var(--chat-bg-app)]", className)}
        style={{ height: "100%" }}
      >
        {/* Sidebar — hidden on mobile when viewing a conversation */}
        <aside
          className={cn(
            "flex flex-col border-r border-[var(--chat-border-strong)] bg-[var(--chat-bg-sidebar)] min-h-0",
            showingConvo ? "hidden md:flex md:w-80 md:shrink-0" : "flex w-full md:w-80 md:shrink-0"
          )}
        >
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

        {/* Main panel — hidden on mobile when no conversation selected */}
        <main
          className={cn(
            "flex min-h-0 flex-1 flex-col bg-[var(--chat-bg-main)]",
            !showingConvo && "hidden md:flex"
          )}
        >
          {activeConvo ? (
            <>
              <ChatHeader
                title={activeConvo.title}
                subtitle={subtitle || (activeConvo.isGroup ? "Group" : undefined)}
                avatar={
                  <>
                    {/* Mobile-only back button */}
                    <button
                      onClick={() => onSelectConversation("")}
                      className="mr-1 text-[var(--chat-text-secondary)] hover:text-[var(--chat-text-primary)] md:hidden"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <div className="relative">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[var(--chat-bubble-incoming)] text-sm font-semibold text-[var(--chat-text-primary)]">
                        {activeConvo.title.charAt(0).toUpperCase()}
                      </div>
                      {activeConvo.presence === "online" && (
                        <div className="absolute -bottom-0.5 -right-0.5 size-[10px] rounded-full border-2 border-[var(--chat-bg-main)] bg-[var(--chat-green)]" />
                      )}
                    </div>
                  </>
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

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT 7: SupportTickets (Help desk / ticket queue)
// ═══════════════════════════════════════════════════════════════════════════════

type TicketStatus = "open" | "in-progress" | "resolved"
type TicketPriority = "low" | "medium" | "high" | "urgent"

interface SupportTicket {
  id: string
  subject: string
  customerName: string
  customerAvatar?: string
  status: TicketStatus
  priority: TicketPriority
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt?: string
  lastMessage?: string
  unreadCount?: number
  assignee?: string
}

interface SupportTicketsProps {
  currentUser: ChatUser
  theme?: ChatTheme
  tickets: SupportTicket[]
  activeTicketId?: string
  onSelectTicket: (id: string) => void
  messages: ChatMessageData[]
  typingUsers?: TypingUser[]
  onSend: (text: string) => void
  statusFilter?: TicketStatus | "all"
  onStatusFilterChange?: (status: TicketStatus | "all") => void
  title?: string
  className?: string
}

// ─── Internal helpers ────────────────────────────────────────────────────────

const ticketStatusConfig: Record<TicketStatus, { icon: typeof Circle; label: string; color: string }> = {
  open: { icon: Circle, label: "Open", color: "var(--chat-orange)" },
  "in-progress": { icon: Clock, label: "In Progress", color: "var(--chat-accent)" },
  resolved: { icon: CheckCircle2, label: "Resolved", color: "var(--chat-green)" },
}

const ticketPriorityColors: Record<TicketPriority, string> = {
  urgent: "var(--chat-red)",
  high: "var(--chat-orange)",
  medium: "var(--chat-accent)",
  low: "var(--chat-text-tertiary)",
}

function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const cfg = ticketStatusConfig[status]
  const Icon = cfg.icon
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
      style={{
        background: `color-mix(in srgb, ${cfg.color} 15%, transparent)`,
        color: cfg.color,
      }}
    >
      <Icon className="size-3" />
      {cfg.label}
    </span>
  )
}

function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const color = ticketPriorityColors[priority]
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
      style={{
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color,
      }}
    >
      <AlertCircle className="size-3" />
      {priority}
    </span>
  )
}

function TicketFilterTabs({
  value,
  onChange,
}: {
  value: TicketStatus | "all"
  onChange: (v: TicketStatus | "all") => void
}) {
  const tabs: { key: TicketStatus | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "in-progress", label: "Active" },
    { key: "resolved", label: "Resolved" },
  ]
  return (
    <div className="flex gap-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="rounded-md px-2 py-1 text-[10px] font-medium transition-colors"
          style={{
            background: value === t.key ? "var(--chat-accent-soft)" : "transparent",
            color: value === t.key ? "var(--chat-accent)" : "var(--chat-text-tertiary)",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

function TicketItem({
  ticket,
  isActive,
  onClick,
}: {
  ticket: SupportTicket
  isActive: boolean
  onClick: () => void
}) {
  const StatusIcon = ticketStatusConfig[ticket.status].icon
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-2.5 border-b border-[var(--chat-border)] px-3 py-2.5 text-left transition-colors",
        isActive ? "bg-[var(--chat-accent-soft)]" : "hover:bg-[var(--chat-accent-soft)]"
      )}
    >
      <StatusIcon
        className="mt-0.5 size-3.5 shrink-0"
        style={{ color: ticketStatusConfig[ticket.status].color }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-mono text-[var(--chat-text-tertiary)]">{ticket.id}</span>
          <span className="shrink-0 text-[9px] text-[var(--chat-text-tertiary)]">{ticket.createdAt}</span>
        </div>
        <p className="mt-0.5 truncate text-[12px] font-medium leading-snug text-[var(--chat-text-primary)]">
          {ticket.subject}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[10px] text-[var(--chat-text-secondary)]">{ticket.customerName}</span>
          <span
            className="rounded-full px-1.5 py-0 text-[9px] font-medium"
            style={{
              background: `color-mix(in srgb, ${ticketPriorityColors[ticket.priority]} 15%, transparent)`,
              color: ticketPriorityColors[ticket.priority],
            }}
          >
            {ticket.priority}
          </span>
          {ticket.category && (
            <span className="rounded-full bg-[var(--chat-accent-soft)] px-1.5 py-0 text-[9px] font-medium text-[var(--chat-text-secondary)]">
              {ticket.category}
            </span>
          )}
        </div>
      </div>
      {(ticket.unreadCount ?? 0) > 0 && (
        <span className="mt-1 flex size-[16px] shrink-0 items-center justify-center rounded-full bg-[var(--chat-red)] text-[9px] font-bold text-white">
          {ticket.unreadCount! > 99 ? "99+" : ticket.unreadCount}
        </span>
      )}
    </button>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

function SupportTickets({
  currentUser,
  theme = "lunar",
  tickets,
  activeTicketId,
  onSelectTicket,
  messages,
  typingUsers,
  onSend,
  statusFilter: controlledFilter,
  onStatusFilterChange,
  title = "Support Tickets",
  className,
}: SupportTicketsProps) {
  const [internalFilter, setInternalFilter] = React.useState<TicketStatus | "all">("all")
  const filter = controlledFilter ?? internalFilter
  const setFilter = onStatusFilterChange ?? setInternalFilter

  const filteredTickets = filter === "all" ? tickets : tickets.filter((t) => t.status === filter)
  const activeTicket = tickets.find((t) => t.id === activeTicketId)

  const openCount = tickets.filter((t) => t.status === "open").length
  const activeCount = tickets.filter((t) => t.status === "in-progress").length

  const showingTicket = !!activeTicket

  return (
    <ChatProvider
      currentUser={currentUser}
      theme={theme}
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        className={cn("flex flex-1 min-h-0 bg-[var(--chat-bg-app)]", className)}
        style={{ height: "100%" }}
      >
        {/* ── Ticket sidebar ── */}
        {/* Mobile: full-width list when no ticket selected, hidden when viewing one */}
        {/* Desktop: always visible at w-[280px] */}
        <aside
          className={cn(
            "flex flex-col border-r border-[var(--chat-border-strong)] bg-[var(--chat-bg-sidebar)] min-h-0",
            showingTicket
              ? "hidden md:flex md:w-[280px] md:shrink-0"
              : "flex w-full md:w-[280px] md:shrink-0"
          )}
        >
          {/* Sidebar header */}
          <div className="shrink-0 border-b border-[var(--chat-border)] px-3 py-2.5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="size-4 text-[var(--chat-accent)]" />
                <span className="text-[14px] font-semibold text-[var(--chat-text-primary)]">{title}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {openCount > 0 && (
                  <span className="rounded-full bg-[var(--chat-accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--chat-accent)]">
                    {openCount} open
                  </span>
                )}
                {activeCount > 0 && (
                  <span className="rounded-full bg-[var(--chat-accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--chat-text-secondary)]">
                    {activeCount} active
                  </span>
                )}
              </div>
            </div>
            <TicketFilterTabs value={filter} onChange={setFilter} />
          </div>

          {/* Ticket list — scrollable */}
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.map((ticket) => (
              <TicketItem
                key={ticket.id}
                ticket={ticket}
                isActive={ticket.id === activeTicketId}
                onClick={() => onSelectTicket(ticket.id)}
              />
            ))}
            {filteredTickets.length === 0 && (
              <div className="px-4 py-6 text-center text-[12px] text-[var(--chat-text-tertiary)]">
                No tickets found
              </div>
            )}
          </div>
        </aside>

        {/* ── Main panel ── */}
        {/* Mobile: hidden when no ticket selected, full-width when viewing one */}
        {/* Desktop: always visible as flex-1 */}
        <main
          className={cn(
            "flex min-h-0 flex-1 flex-col bg-[var(--chat-bg-main)]",
            !showingTicket && "hidden md:flex"
          )}
        >
          {activeTicket ? (
            <>
              {/* Header with mobile back button */}
              <div className="shrink-0 flex items-center gap-3 border-b border-[var(--chat-border)] bg-[var(--chat-bg-header)] px-4 py-2.5 backdrop-blur-[20px] backdrop-saturate-[180%]">
                {/* Mobile back */}
                <button
                  onClick={() => onSelectTicket("")}
                  className="mr-1 text-[var(--chat-text-secondary)] hover:text-[var(--chat-text-primary)] md:hidden"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <div className="flex size-9 items-center justify-center rounded-full bg-[var(--chat-accent-soft)]">
                  <User className="size-4 text-[var(--chat-accent)]" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[14px] font-semibold tracking-[-0.02em] text-[var(--chat-text-primary)]">
                    {activeTicket.subject}
                  </span>
                  <span className="truncate text-[11px] text-[var(--chat-text-secondary)]">
                    {activeTicket.id} · {activeTicket.customerName}
                  </span>
                </div>
                <div className="hidden items-center gap-1.5 sm:flex">
                  <TicketStatusBadge status={activeTicket.status} />
                  <TicketPriorityBadge priority={activeTicket.priority} />
                </div>
              </div>
              <ChatMessages messages={messages} typingUsers={typingUsers} />
              <ChatComposer onSend={onSend} placeholder="Reply to ticket..." />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <Ticket className="mx-auto mb-3 size-12 text-[var(--chat-text-tertiary)]" />
                <p className="text-[15px] font-medium text-[var(--chat-text-secondary)]">Select a ticket</p>
              </div>
            </div>
          )}
        </main>
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
  SupportTickets,
  TicketStatusBadge,
  TicketPriorityBadge,
  TicketFilterTabs,
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
  TicketStatus,
  TicketPriority,
  SupportTicket,
  SupportTicketsProps,
}
