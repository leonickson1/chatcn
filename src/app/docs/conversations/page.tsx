"use client"

import { useState } from "react"
import Link from "next/link"
import { PreviewTabs } from "@/components/docs/preview-tabs"

const basicUsageCode = `import { FullMessenger } from "@/components/ui/chat"
import type { SidebarConversation } from "@/components/ui/chat"

const conversations: SidebarConversation[] = [
  {
    id: "conv-1",
    title: "Design Team",
    lastMessage: "Let's finalize the mockups today",
    lastMessageTime: "1m ago",
    avatar: "/avatars/design-team.png",
    unreadCount: 3,
    presence: "online",
  },
  {
    id: "conv-2",
    title: "Alice Chen",
    lastMessage: "Sounds good, talk later!",
    lastMessageTime: "1h ago",
    avatar: "/avatars/alice.png",
    unreadCount: 0,
    presence: "away",
  },
  {
    id: "conv-3",
    title: "Backend Guild",
    lastMessage: "Deployment is complete",
    lastMessageTime: "1d ago",
    avatar: "/avatars/backend.png",
    unreadCount: 0,
    presence: "offline",
  },
]

// FullMessenger includes a built-in sidebar with the conversation list
<FullMessenger
  currentUser={currentUser}
  conversations={conversations}
  activeConversationId="conv-1"
  onSelectConversation={(id) => console.log("Selected:", id)}
  messages={messages}
  onSend={handleSend}
/>`

const activeStateCode = `// The activeConversationId prop highlights the selected conversation
// in the sidebar with an accent background.

<FullMessenger
  currentUser={currentUser}
  conversations={conversations}
  activeConversationId="conv-1"
  onSelectConversation={(id) => {
    setActiveId(id)
    loadMessages(id)
  }}
  messages={messages}
  onSend={handleSend}
/>`

const unreadBadgeCode = `// Set unreadCount on a conversation to display a badge.
// The badge appears as a small pill with the count.
// Set to 0 or omit to hide the badge.

const conversation: SidebarConversation = {
  id: "conv-1",
  title: "Design Team",
  lastMessage: "New designs are ready",
  lastMessageTime: "Just now",
  unreadCount: 5, // Shows a "5" badge
}`

const presenceCode = `// The presence prop controls the colored dot on the avatar.
//   "online"  -> green dot
//   "away"    -> yellow dot
//   "offline" -> gray dot (or hidden)

const conversation: SidebarConversation = {
  id: "conv-1",
  title: "Alice Chen",
  lastMessage: "See you tomorrow!",
  lastMessageTime: "Just now",
  presence: "online", // Green dot on avatar
}`

const fullMessengerCode = `import { FullMessenger } from "@/components/ui/chat"

// FullMessenger combines the sidebar, message list, and composer
// into a complete messenger layout. It wraps everything in a
// ChatProvider internally, so you don't need to add one yourself.

<FullMessenger
  currentUser={currentUser}
  theme="lunar"
  conversations={conversations}
  activeConversationId={activeId}
  onSelectConversation={setActiveId}
  messages={messages}
  onSend={handleSend}
/>`

const demoCode = `// Interactive conversation list with presence, unread badges, and active state.
// Click an item to select it.

const conversations = [
  { id: "1", name: "Alex Chen", preview: "Let me update the PR...", time: "2m", presence: "online", unread: 3 },
  { id: "2", name: "Design Team", preview: "The new icons look great", time: "15m", presence: "group" },
  { id: "3", name: "Sara Kim", preview: "See you at the standup", time: "1h", presence: "away" },
  { id: "4", name: "Dan Lee", preview: "Merged! \u{1F389}", time: "3h", presence: "offline", unread: 1 },
  { id: "5", name: "Product Chat", preview: "Q2 roadmap discussion", time: "1d", presence: "group" },
]`

interface DemoConversation {
  id: string
  name: string
  preview: string
  time: string
  presence: "online" | "away" | "offline" | "group"
  unread?: number
}

function ConversationItem({ name, preview, time, presence, unread, isActive, onClick }: {
  name: string
  preview: string
  time: string
  presence: "online" | "away" | "offline" | "group"
  unread?: number
  isActive?: boolean
  onClick?: () => void
}) {
  const presenceDot = (p: string) => {
    if (p === "online") return "bg-emerald-500"
    if (p === "away") return "bg-amber-400"
    if (p === "offline") return "bg-zinc-300"
    return ""
  }

  const initials = (n: string) => {
    const parts = n.split(" ")
    if (parts.length >= 2) return parts[0][0] + parts[1][0]
    return n.slice(0, 2)
  }

  return (
    <button
      onClick={onClick}
      className={
        "flex items-center gap-3 px-4 py-3 text-left transition-colors w-full " +
        (isActive ? "bg-indigo-50" : "hover:bg-zinc-50")
      }
    >
      <div className="relative shrink-0">
        <div className={
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold " +
          (presence === "group" ? "bg-violet-100 text-violet-700" : "bg-zinc-100 text-zinc-600")
        }>
          {initials(name)}
        </div>
        {presence !== "group" && (
          <span className={
            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white " +
            presenceDot(presence)
          } />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={
            "text-[14px] font-medium truncate " +
            (unread ? "text-zinc-900" : "text-zinc-700")
          }>
            {name}
          </span>
          <span className="text-[12px] text-zinc-400 shrink-0 ml-2">{time}</span>
        </div>
        <p className={
          "text-[13px] truncate mt-0.5 " +
          (unread ? "text-zinc-600 font-medium" : "text-zinc-400")
        }>
          {preview}
        </p>
      </div>
      {unread && unread > 0 && (
        <span className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-indigo-500 text-white text-[11px] font-semibold">
          {unread}
        </span>
      )}
    </button>
  )
}

function ConversationsDemo() {
  const [conversations] = useState<DemoConversation[]>(() => [
    { id: "1", name: "Alex Chen", preview: "Let me update the PR...", time: "2m", presence: "online", unread: 3 },
    { id: "2", name: "Design Team", preview: "The new icons look great", time: "15m", presence: "group" },
    { id: "3", name: "Sara Kim", preview: "See you at the standup", time: "1h", presence: "away" },
    { id: "4", name: "Dan Lee", preview: "Merged! \u{1F389}", time: "3h", presence: "offline", unread: 1 },
    { id: "5", name: "Product Chat", preview: "Q2 roadmap discussion", time: "1d", presence: "group" },
  ])
  const [activeId, setActiveId] = useState("1")

  return (
    <div className="h-full flex flex-col">
    <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.10)] bg-white flex-1">
      <div className="flex flex-col h-full">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            name={conv.name}
            preview={conv.preview}
            time={conv.time}
            presence={conv.presence}
            unread={conv.unread}
            isActive={conv.id === activeId}
            onClick={() => setActiveId(conv.id)}
          />
        ))}
      </div>
    </div>
    </div>
  )
}

function BasicUsageDemo() {
  const [activeId, setActiveId] = useState(() => "conv-1")
  const [conversations] = useState(() => [
    { id: "conv-1", name: "Design Team", preview: "Let's finalize the mockups today", time: "1m", presence: "online" as const, unread: 3 },
    { id: "conv-2", name: "Alice Chen", preview: "Sounds good, talk later!", time: "1h", presence: "away" as const },
    { id: "conv-3", name: "Backend Guild", preview: "Deployment is complete", time: "1d", presence: "offline" as const },
  ])

  return (
    <div className="h-full p-4" style={{ background: "var(--chat-bg-main, #fff)" }}>
      <div className="rounded-xl border border-[rgba(0,0,0,0.10)] overflow-hidden bg-white">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            name={conv.name}
            preview={conv.preview}
            time={conv.time}
            presence={conv.presence}
            unread={conv.unread}
            isActive={conv.id === activeId}
            onClick={() => setActiveId(conv.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ActiveStateDemo() {
  const [activeId, setActiveId] = useState(() => "a-1")
  const [items] = useState(() => [
    { id: "a-1", name: "Alex Chen", preview: "Let me update the PR...", time: "2m", presence: "online" as const },
    { id: "a-2", name: "Sara Kim", preview: "See you at the standup", time: "1h", presence: "away" as const },
    { id: "a-3", name: "Dan Lee", preview: "Merged the fix", time: "3h", presence: "offline" as const },
  ])

  return (
    <div className="h-full p-4" style={{ background: "var(--chat-bg-main, #fff)" }}>
      <p className="text-[13px] text-zinc-500 mb-3">Click a row to change the active state:</p>
      <div className="rounded-xl border border-[rgba(0,0,0,0.10)] overflow-hidden bg-white">
        {items.map((item) => (
          <ConversationItem
            key={item.id}
            name={item.name}
            preview={item.preview}
            time={item.time}
            presence={item.presence}
            isActive={item.id === activeId}
            onClick={() => setActiveId(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

function UnreadBadgeDemo() {
  const [items] = useState(() => [
    { id: "u-1", name: "Design Team", preview: "New designs are ready", time: "5m", presence: "group" as const, unread: 5 },
    { id: "u-2", name: "Alex Chen", preview: "Can you review my PR?", time: "20m", presence: "online" as const, unread: 2 },
    { id: "u-3", name: "Sara Kim", preview: "All caught up!", time: "1h", presence: "away" as const, unread: 0 },
  ])

  return (
    <div className="h-full p-4" style={{ background: "var(--chat-bg-main, #fff)" }}>
      <div className="rounded-xl border border-[rgba(0,0,0,0.10)] overflow-hidden bg-white">
        {items.map((item) => (
          <ConversationItem
            key={item.id}
            name={item.name}
            preview={item.preview}
            time={item.time}
            presence={item.presence}
            unread={item.unread}
          />
        ))}
      </div>
    </div>
  )
}

function PresenceDotDemo() {
  const [items] = useState(() => [
    { id: "p-1", name: "Alice Chen", preview: "Available now", time: "Just now", presence: "online" as const },
    { id: "p-2", name: "Bob Smith", preview: "Stepped away", time: "10m", presence: "away" as const },
    { id: "p-3", name: "Carol Davis", preview: "Last seen yesterday", time: "1d", presence: "offline" as const },
  ])

  return (
    <div className="h-full p-4" style={{ background: "var(--chat-bg-main, #fff)" }}>
      <div className="rounded-xl border border-[rgba(0,0,0,0.10)] overflow-hidden bg-white">
        {items.map((item) => (
          <ConversationItem
            key={item.id}
            name={item.name}
            preview={item.preview}
            time={item.time}
            presence={item.presence}
          />
        ))}
      </div>
    </div>
  )
}

function FullMessengerDemo() {
  const [activeId, setActiveId] = useState(() => "fm-1")
  const [items] = useState(() => [
    { id: "fm-1", name: "Design Team", preview: "Let's finalize the mockups", time: "2m", presence: "group" as const, unread: 3 },
    { id: "fm-2", name: "Alex Chen", preview: "PR is ready for review", time: "15m", presence: "online" as const },
    { id: "fm-3", name: "Sara Kim", preview: "See you tomorrow!", time: "1h", presence: "away" as const },
  ])

  return (
    <div className="h-full flex" style={{ background: "var(--chat-bg-main, #fff)" }}>
      <div className="w-[260px] border-r border-[rgba(0,0,0,0.10)] overflow-y-auto bg-white">
        {items.map((item) => (
          <ConversationItem
            key={item.id}
            name={item.name}
            preview={item.preview}
            time={item.time}
            presence={item.presence}
            unread={item.unread}
            isActive={item.id === activeId}
            onClick={() => setActiveId(item.id)}
          />
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm">
        {items.find((i) => i.id === activeId)?.name} -- messages would appear here
      </div>
    </div>
  )
}

export default function ConversationsPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Conversations</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        Sidebar conversation list with presence indicators, unread badges, and search.
        Conversations power the left panel of a full messenger layout.
      </p>

      <div className="mt-6 mb-12">
        <PreviewTabs preview={<ConversationsDemo />} code={demoCode} height={390} />
      </div>

      {/* Basic Usage */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Basic Usage</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Pass an array of{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">SidebarConversation</code>{" "}
          objects to{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">FullMessenger</code>{" "}
          to render the conversation list with a built-in sidebar. Each conversation shows a title, last message preview,
          timestamp, and optional avatar.
        </p>
        <PreviewTabs preview={<BasicUsageDemo />} code={basicUsageCode} height={280} />
      </div>

      {/* Active State */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Active State</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Set{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">activeConversationId</code>{" "}
          to highlight the currently selected conversation. The active item receives an accent
          background to visually distinguish it from the rest of the list.
        </p>
        <PreviewTabs preview={<ActiveStateDemo />} code={activeStateCode} height={280} />
      </div>

      {/* Unread Badge */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Unread Badge</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">unreadCount</code>{" "}
          prop displays a small badge on the conversation row. Set it to{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">0</code>{" "}
          or omit it to hide the badge.
        </p>
        <PreviewTabs preview={<UnreadBadgeDemo />} code={unreadBadgeCode} height={250} />
      </div>

      {/* Presence Dot */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Presence Dot</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">presence</code>{" "}
          prop adds a small colored dot to the conversation avatar indicating the other
          participant{"'"}s online status.
        </p>
        <PreviewTabs preview={<PresenceDotDemo />} code={presenceCode} height={250} />
      </div>

      {/* FullMessenger Layout */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">FullMessenger Layout</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          For a complete messenger experience, use the{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">FullMessenger</code>{" "}
          component which combines the sidebar, message list, and composer into a single layout.
        </p>
        <PreviewTabs preview={<FullMessengerDemo />} code={fullMessengerCode} height={280} />
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/threads"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Threads
        </Link>
        <Link
          href="/docs/tickets"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Tickets &rarr;
        </Link>
      </div>
    </div>
  )
}
