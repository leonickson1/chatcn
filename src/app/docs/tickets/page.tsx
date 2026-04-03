"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { PreviewTabs } from "@/components/docs/preview-tabs"
import {
  ChatProvider,
  ChatMessages,
  ChatComposer,
  SupportTickets,
  TicketStatusBadge,
  TicketPriorityBadge,
  TicketFilterTabs,
} from "@/components/ui/chat"
import type {
  ChatMessageData,
  ChatUser,
  SupportTicket,
  TicketStatus,
  TicketPriority,
} from "@/components/ui/chat"

// ─── Shared data ─────────────────────────────────────────────────────────────

const agent: ChatUser = { id: "agent-1", name: "Support Agent", status: "online" }

const sampleTickets: SupportTicket[] = [
  { id: "TK-1042", subject: "Cannot export data to CSV", customerName: "Emma Wilson", status: "open", priority: "high", category: "Bug", createdAt: "10m ago" },
  { id: "TK-1041", subject: "Billing shows wrong amount", customerName: "James Park", status: "in-progress", priority: "urgent", category: "Billing", createdAt: "25m ago", assignee: "Sarah" },
  { id: "TK-1040", subject: "How to set up SSO?", customerName: "Priya Sharma", status: "open", priority: "medium", category: "Question", createdAt: "1h ago" },
  { id: "TK-1039", subject: "API rate limit too low", customerName: "Carlos Ruiz", status: "in-progress", priority: "medium", category: "Feature", createdAt: "2h ago" },
  { id: "TK-1038", subject: "Dashboard loads slowly", customerName: "Aisha Johnson", status: "resolved", priority: "low", category: "Bug", createdAt: "3h ago" },
]

const minute = 60_000
const hour = 60 * minute

function createSampleMessages(): Record<string, ChatMessageData[]> {
  const now = Date.now()
  return {
    "TK-1042": [
      { id: "tk1042-1", senderId: "customer-emma", senderName: "Emma Wilson", timestamp: now - 10 * minute, text: "Hi, I'm trying to export my analytics data to CSV but the button just spins and nothing downloads.", status: "read" },
      { id: "tk1042-2", senderId: "agent-1", senderName: "Support Agent", timestamp: now - 8 * minute, text: "Hi Emma! Can you tell me roughly how many rows of data you're trying to export?", status: "read" },
      { id: "tk1042-3", senderId: "customer-emma", senderName: "Emma Wilson", timestamp: now - 7 * minute, text: "About 50,000 rows — the last 6 months.", status: "read" },
      { id: "tk1042-4", senderId: "agent-1", senderName: "Support Agent", timestamp: now - 5 * minute, text: "That's the issue — exports over 10k rows time out in the browser. I'll queue a background export for you. You'll get an email with the download link.", status: "read" },
      { id: "tk1042-sys", senderId: "system", senderName: "System", timestamp: now - 4 * minute, isSystem: true, text: "Priority changed from Medium to High" },
    ],
    "TK-1041": [
      { id: "tk1041-1", senderId: "customer-james", senderName: "James Park", timestamp: now - 25 * minute, text: "My invoice shows $299 but I'm on the $199/mo plan. Can you check this?", status: "read", files: [{ name: "invoice-march-2026.pdf", size: 142_000, type: "application/pdf", url: "#" }] },
      { id: "tk1041-sys", senderId: "system", senderName: "System", timestamp: now - 24 * minute, isSystem: true, text: "Ticket assigned to Sarah from Billing Team" },
      { id: "tk1041-2", senderId: "agent-2", senderName: "Sarah (Billing)", timestamp: now - 20 * minute, text: "Hi James, I can see the discrepancy. An add-on for extra storage was applied. I'll issue a refund right away.", status: "read" },
    ],
    "TK-1040": [
      { id: "tk1040-1", senderId: "customer-priya", senderName: "Priya Sharma", timestamp: now - hour, text: "We'd like to set up SSO with Okta for our team of 50. Is there a guide?", status: "read" },
      { id: "tk1040-2", senderId: "agent-1", senderName: "Support Agent", timestamp: now - 55 * minute, text: "Hi Priya! Yes, we have a step-by-step guide. You'll need your Okta admin credentials and about 15 minutes.", status: "read", linkPreview: { url: "https://docs.example.com/sso/okta-setup", title: "Okta SSO Setup Guide", description: "Step-by-step instructions for configuring SAML-based SSO with Okta.", image: "" } },
    ],
    "TK-1039": [
      { id: "tk1039-1", senderId: "customer-carlos", senderName: "Carlos Ruiz", timestamp: now - 2 * hour, text: "Our API integration is hitting the rate limit constantly.", status: "read", code: { language: "json", code: `{\n  "error": "rate_limit_exceeded",\n  "limit": "1000/min",\n  "current": "1247/min"\n}` } },
      { id: "tk1039-2", senderId: "agent-1", senderName: "Support Agent", timestamp: now - hour - 45 * minute, text: "I've temporarily bumped you to 2500/min while we review a permanent increase.", status: "read" },
    ],
    "TK-1038": [
      { id: "tk1038-1", senderId: "customer-aisha", senderName: "Aisha Johnson", timestamp: now - 3 * hour, text: "The main dashboard is taking 15+ seconds to load.", status: "read" },
      { id: "tk1038-2", senderId: "agent-1", senderName: "Support Agent", timestamp: now - 2 * hour - 45 * minute, text: "We identified a database query issue. A fix was deployed 10 minutes ago — can you try refreshing?", status: "read" },
      { id: "tk1038-3", senderId: "customer-aisha", senderName: "Aisha Johnson", timestamp: now - 2 * hour - 30 * minute, text: "Loading in under 2 seconds now. Thanks!", status: "read", reactions: [{ emoji: "\u{1F389}", userIds: ["agent-1"], count: 1 }] },
      { id: "tk1038-sys", senderId: "system", senderName: "System", timestamp: now - 2 * hour - 25 * minute, isSystem: true, text: "Ticket resolved by Support Agent" },
    ],
  }
}

// ─── Code strings ────────────────────────────────────────────────────────────

const basicUsageCode = `import { SupportTickets } from "@/components/ui/chat"
import type { SupportTicket, ChatUser, ChatMessageData } from "@/components/ui/chat"

const agent: ChatUser = { id: "agent-1", name: "Support Agent" }

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
]

<SupportTickets
  currentUser={agent}
  theme="lunar"
  tickets={tickets}
  activeTicketId={activeId}
  onSelectTicket={setActiveId}
  messages={messages}
  onSend={handleSend}
/>`

const ticketTypeCode = `interface SupportTicket {
  id: string               // Display ID, e.g. "TK-1042"
  subject: string          // Ticket subject line
  customerName: string     // Customer name in sidebar
  customerAvatar?: string  // Optional avatar URL
  status: TicketStatus     // "open" | "in-progress" | "resolved"
  priority: TicketPriority // "low" | "medium" | "high" | "urgent"
  category?: string        // Category tag, e.g. "Bug", "Billing"
  tags?: string[]          // Additional tags
  createdAt: string        // Pre-formatted timestamp
  updatedAt?: string       // Last update time
  lastMessage?: string     // Preview snippet for sidebar
  unreadCount?: number     // Unread badge count
  assignee?: string        // Assigned agent name
}`

const statusBadgeCode = `import { TicketStatusBadge } from "@/components/ui/chat"

// Renders a colored pill with icon for each status:
//   "open"        → orange dot + "Open"
//   "in-progress" → blue clock + "In Progress"
//   "resolved"    → green check + "Resolved"

<TicketStatusBadge status="open" />
<TicketStatusBadge status="in-progress" />
<TicketStatusBadge status="resolved" />`

const priorityBadgeCode = `import { TicketPriorityBadge } from "@/components/ui/chat"

// Renders a colored pill with alert icon for each priority:
//   "urgent" → red
//   "high"   → orange
//   "medium" → accent/blue
//   "low"    → gray

<TicketPriorityBadge priority="urgent" />
<TicketPriorityBadge priority="high" />
<TicketPriorityBadge priority="medium" />
<TicketPriorityBadge priority="low" />`

const filterTabsCode = `import { TicketFilterTabs } from "@/components/ui/chat"
import type { TicketStatus } from "@/components/ui/chat"

const [filter, setFilter] = useState<TicketStatus | "all">("all")

// Renders a row of filter tabs: All | Open | Active | Resolved
// The active tab is highlighted with the accent color.

<TicketFilterTabs value={filter} onChange={setFilter} />`

// ─── Demo components ─────────────────────────────────────────────────────────

function FullTicketsDemo() {
  const [activeId, setActiveId] = useState("TK-1042")
  const [allMessages, setAllMessages] = useState(() => createSampleMessages())

  const activeMessages = useMemo(() => allMessages[activeId] || [], [allMessages, activeId])

  const handleSend = useCallback((text: string) => {
    setAllMessages((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] || []),
        {
          id: `msg-${Date.now()}`,
          senderId: agent.id,
          senderName: agent.name,
          text,
          timestamp: Date.now(),
          status: "sent" as const,
        },
      ],
    }))
  }, [activeId])

  return (
    <SupportTickets
      currentUser={agent}
      theme="lunar"
      tickets={sampleTickets}
      activeTicketId={activeId}
      onSelectTicket={setActiveId}
      messages={activeMessages}
      onSend={handleSend}
    />
  )
}

function StatusBadgeDemo() {
  return (
    <ChatProvider currentUser={agent} theme="lunar">
      <div className="flex flex-wrap items-center gap-3 p-6">
        <TicketStatusBadge status="open" />
        <TicketStatusBadge status="in-progress" />
        <TicketStatusBadge status="resolved" />
      </div>
    </ChatProvider>
  )
}

function PriorityBadgeDemo() {
  return (
    <ChatProvider currentUser={agent} theme="lunar">
      <div className="flex flex-wrap items-center gap-3 p-6">
        <TicketPriorityBadge priority="urgent" />
        <TicketPriorityBadge priority="high" />
        <TicketPriorityBadge priority="medium" />
        <TicketPriorityBadge priority="low" />
      </div>
    </ChatProvider>
  )
}

function FilterTabsDemo() {
  const [filter, setFilter] = useState<TicketStatus | "all">("all")
  return (
    <ChatProvider currentUser={agent} theme="lunar">
      <div className="p-6">
        <TicketFilterTabs value={filter} onChange={setFilter} />
        <p className="mt-4 text-[13px] text-[var(--chat-text-secondary)]">
          Active filter: <code className="rounded bg-[var(--chat-accent-soft)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--chat-accent)]">{filter}</code>
        </p>
      </div>
    </ChatProvider>
  )
}

function TicketTypeDemo() {
  return (
    <ChatProvider currentUser={agent} theme="lunar">
      <div className="p-6">
        <div className="rounded-lg border border-[var(--chat-border)] bg-[var(--chat-bg-sidebar)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-[var(--chat-text-tertiary)]">TK-1042</span>
            <TicketStatusBadge status="open" />
            <TicketPriorityBadge priority="high" />
          </div>
          <p className="text-[14px] font-semibold text-[var(--chat-text-primary)]">Cannot export data to CSV</p>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-[var(--chat-text-secondary)]">
            <span>Emma Wilson</span>
            <span>&middot;</span>
            <span className="rounded-full bg-[var(--chat-accent-soft)] px-1.5 py-0 text-[10px] font-medium text-[var(--chat-text-secondary)]">Bug</span>
            <span>&middot;</span>
            <span>10m ago</span>
          </div>
        </div>
      </div>
    </ChatProvider>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TicketsPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Support Tickets</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        A complete help desk layout with ticket queue sidebar, status filters, priority badges,
        and per-ticket chat. Built on{" "}
        <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatMessages</code>{" "}
        and{" "}
        <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatComposer</code>.
      </p>

      <div className="mt-6 mb-12">
        <PreviewTabs preview={<FullTicketsDemo />} code={basicUsageCode} height={600} />
      </div>

      {/* SupportTicket Type */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">SupportTicket Type</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">SupportTicket</code>{" "}
          interface defines all the data for a single ticket. Timestamps are pre-formatted strings
          so you control the display format.
        </p>
        <PreviewTabs preview={<TicketTypeDemo />} code={ticketTypeCode} height={180} centered />
      </div>

      {/* Status Badge */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Status Badge</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">TicketStatusBadge</code>{" "}
          renders a colored pill with an icon for each ticket status. Colors use theme CSS variables
          so they adapt to any theme.
        </p>
        <PreviewTabs preview={<StatusBadgeDemo />} code={statusBadgeCode} height={100} centered />
      </div>

      {/* Priority Badge */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Priority Badge</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">TicketPriorityBadge</code>{" "}
          renders a colored pill with an alert icon for each priority level.
        </p>
        <PreviewTabs preview={<PriorityBadgeDemo />} code={priorityBadgeCode} height={100} centered />
      </div>

      {/* Filter Tabs */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Filter Tabs</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">TicketFilterTabs</code>{" "}
          is a controlled component that renders status filter tabs. Pass{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">value</code>{" "}
          and{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">onChange</code>{" "}
          to control the active filter.
        </p>
        <PreviewTabs preview={<FilterTabsDemo />} code={filterTabsCode} height={140} centered />
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/conversations"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Conversations
        </Link>
        <Link
          href="/docs/media"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Media &rarr;
        </Link>
      </div>
    </div>
  )
}
