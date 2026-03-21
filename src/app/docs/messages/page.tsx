"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChatProvider,
  ChatMessages,
} from "@/components/ui/chat"
import type { ChatMessageData, ChatUser } from "@/components/ui/chat"
import { PreviewTabs } from "@/components/docs/preview-tabs"

const demoUser: ChatUser = { id: "user-1", name: "You", status: "online" }

function BasicMessagesDemo() {
  const [messages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    const minute = 60_000
    return [
      {
        id: "basic-1",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 5 * minute,
        text: "Hey! Have you tried the new chat components?",
        status: "read" as const,
      },
      {
        id: "basic-2",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 4 * minute,
        text: "Yes! They look amazing. Love the message grouping.",
        status: "delivered" as const,
      },
      {
        id: "basic-3",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 3 * minute,
        text: "Right? And the theming system is really flexible.",
        status: "read" as const,
      },
    ]
  })

  return (
    <ChatProvider currentUser={demoUser} theme="lunar" className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}

function GroupedMessagesDemo() {
  const [messages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    return [
      {
        id: "grp-1",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 180_000,
        text: "The PR is ready for review",
        status: "read" as const,
      },
      {
        id: "grp-2",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 170_000,
        text: "Token refresh is completely rewritten",
        status: "read" as const,
      },
      {
        id: "grp-3",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 160_000,
        text: "Much cleaner now",
        status: "read" as const,
      },
      {
        id: "grp-4",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 120_000,
        text: "Nice! I'll take a look this afternoon.",
        status: "delivered" as const,
      },
      {
        id: "grp-5",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 110_000,
        text: "Any areas I should focus on?",
        status: "delivered" as const,
      },
    ]
  })

  return (
    <ChatProvider currentUser={demoUser} theme="lunar" className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}

function ReplyDemo() {
  const [messages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    const minute = 60_000
    return [
      {
        id: "reply-1",
        senderId: "user-2",
        senderName: "Alex",
        timestamp: now - 10 * minute,
        text: "What about backwards compatibility with existing sessions?",
        status: "read" as const,
      },
      {
        id: "reply-2",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 8 * minute,
        text: "We can run both token formats in parallel for 30 days, then cut over.",
        status: "delivered" as const,
        replyTo: {
          id: "reply-1",
          senderName: "Alex",
          text: "What about backwards compatibility with existing sessions?",
        },
      },
      {
        id: "reply-3",
        senderId: "user-2",
        senderName: "Alex",
        timestamp: now - 6 * minute,
        text: "That's a great idea. Parallel validation is the safest approach.",
        status: "read" as const,
      },
    ]
  })

  return (
    <ChatProvider currentUser={demoUser} theme="lunar" className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}

function SystemMessagesDemo() {
  const [messages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    const minute = 60_000
    return [
      {
        id: "sys-1",
        senderId: "system",
        senderName: "System",
        timestamp: now - 30 * minute,
        isSystem: true,
        text: "Alex Chen created this conversation",
      },
      {
        id: "sys-2",
        senderId: "user-2",
        senderName: "Alex Chen",
        timestamp: now - 25 * minute,
        text: "Welcome to the team channel!",
        status: "read" as const,
      },
      {
        id: "sys-3",
        senderId: "system",
        senderName: "System",
        timestamp: now - 20 * minute,
        isSystem: true,
        text: "Sara Kim joined the conversation",
      },
      {
        id: "sys-4",
        senderId: "user-3",
        senderName: "Sara Kim",
        timestamp: now - 15 * minute,
        text: "Thanks for the invite!",
        status: "read" as const,
      },
    ]
  })

  return (
    <ChatProvider currentUser={demoUser} theme="lunar" className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}

function DateSeparatorDemo() {
  const [messages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    const day = 86_400_000
    const minute = 60_000
    return [
      {
        id: "date-1",
        senderId: "user-2",
        senderName: "Alex",
        timestamp: now - 2 * day,
        text: "Let me know when you're free to discuss the roadmap.",
        status: "read" as const,
      },
      {
        id: "date-2",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - day - 2 * minute,
        text: "How about tomorrow morning?",
        status: "read" as const,
      },
      {
        id: "date-3",
        senderId: "user-2",
        senderName: "Alex",
        timestamp: now - day,
        text: "Perfect, 10am works for me.",
        status: "read" as const,
      },
      {
        id: "date-4",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 30 * minute,
        text: "Great meeting today! I'll send the notes.",
        status: "delivered" as const,
      },
    ]
  })

  return (
    <ChatProvider currentUser={demoUser} theme="lunar" className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}

const basicCode = `import { ChatProvider, ChatMessages } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

const messages: ChatMessageData[] = [
  {
    id: "1",
    senderId: "user-2",
    senderName: "Alice",
    timestamp: Date.now() - 60000,
    text: "Hey! Have you tried the new chat components?",
    status: "read",
  },
  {
    id: "2",
    senderId: "user-1",
    senderName: "You",
    timestamp: Date.now() - 30000,
    text: "Yes! They look amazing.",
    status: "delivered",
  },
]

export function MyChat() {
  return (
    <ChatProvider currentUser={currentUser} theme="lunar">
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}`

const groupingCode = `import { ChatProvider, ChatMessages } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

// Messages from the same sender within 2 minutes are grouped automatically.
const messages: ChatMessageData[] = [
  {
    id: "1",
    senderId: "user-2",
    senderName: "Alex Chen",
    timestamp: Date.now() - 180000,
    text: "The PR is ready for review",
    status: "read",
  },
  {
    id: "2",
    senderId: "user-2",
    senderName: "Alex Chen",
    timestamp: Date.now() - 170000,
    text: "Token refresh is completely rewritten",
    status: "read",
  },
  {
    id: "3",
    senderId: "user-2",
    senderName: "Alex Chen",
    timestamp: Date.now() - 160000,
    text: "Much cleaner now",
    status: "read",
  },
]

export function GroupedChat() {
  return (
    <ChatProvider
      currentUser={currentUser}
      theme="lunar"
      messageGroupingInterval={120} // seconds (default: 120)
    >
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}`

const replyCode = `import { ChatProvider, ChatMessages } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

const messages: ChatMessageData[] = [
  {
    id: "1",
    senderId: "user-2",
    senderName: "Alex",
    timestamp: Date.now() - 120000,
    text: "What about backwards compat?",
    status: "read",
  },
  {
    id: "2",
    senderId: "user-1",
    senderName: "You",
    timestamp: Date.now() - 60000,
    text: "We can run both formats in parallel.",
    status: "delivered",
    replyTo: {
      id: "1",
      senderName: "Alex",
      text: "What about backwards compat?",
    },
  },
]

export function ReplyChat() {
  return (
    <ChatProvider currentUser={currentUser} theme="lunar">
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}`

const dateSeparatorCode = `import { ChatProvider, ChatMessages } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

// Date separators are inserted automatically when messages span different days.
const messages: ChatMessageData[] = [
  {
    id: "1",
    senderId: "user-2",
    senderName: "Alex",
    timestamp: Date.now() - 2 * 86_400_000, // 2 days ago
    text: "Let me know when you're free.",
    status: "read",
  },
  {
    id: "2",
    senderId: "user-1",
    senderName: "You",
    timestamp: Date.now() - 86_400_000, // Yesterday
    text: "How about tomorrow morning?",
    status: "read",
  },
  {
    id: "3",
    senderId: "user-1",
    senderName: "You",
    timestamp: Date.now(), // Today
    text: "Great meeting today!",
    status: "delivered",
  },
]

export function DateSeparatorChat() {
  return (
    <ChatProvider currentUser={currentUser} theme="lunar">
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}`

const systemCode = `import { ChatProvider, ChatMessages } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

const messages: ChatMessageData[] = [
  {
    id: "sys-1",
    senderId: "system",
    senderName: "System",
    timestamp: Date.now() - 120000,
    isSystem: true,
    text: "Alex Chen created this conversation",
  },
  {
    id: "msg-1",
    senderId: "user-2",
    senderName: "Alex Chen",
    timestamp: Date.now() - 60000,
    text: "Welcome to the team channel!",
    status: "read",
  },
]

export function SystemMessageChat() {
  return (
    <ChatProvider currentUser={currentUser} theme="lunar">
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}`

export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Messages</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        The message system handles rendering, grouping, timestamps, reactions, replies, and more.
        Pass an array of{" "}
        <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatMessageData</code>{" "}
        to{" "}
        <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatMessages</code>{" "}
        and everything is handled automatically.
      </p>

      {/* Basic Messages */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Basic Messages</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The simplest usage: pass messages and a current user. Outgoing messages (matching{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">currentUser.id</code>)
          align right, incoming messages align left.
        </p>
        <PreviewTabs
          preview={<BasicMessagesDemo />}
          code={basicCode}
          height={260}
        />
      </div>

      {/* Message Grouping */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Message Grouping</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Consecutive messages from the same sender within a configurable time window (default: 2 minutes)
          are automatically grouped. Grouped messages share an avatar and have tighter spacing.
        </p>
        <PreviewTabs
          preview={<GroupedMessagesDemo />}
          code={groupingCode}
          height={300}
        />
      </div>

      {/* Reply-to Quotes */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Reply-to Quotes</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Add a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">replyTo</code>{" "}
          object to any message to show a quoted reply above the message bubble.
        </p>
        <PreviewTabs
          preview={<ReplyDemo />}
          code={replyCode}
          height={280}
        />
      </div>

      {/* System Messages */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">System Messages</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Set{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">isSystem: true</code>{" "}
          on a message to render it as a centered system notification. These are used for events
          like &quot;user joined&quot; or &quot;conversation created&quot;.
        </p>
        <PreviewTabs
          preview={<SystemMessagesDemo />}
          code={systemCode}
          height={280}
        />
      </div>

      {/* Date Separators */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Date Separators</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Date separators are automatically inserted between messages from different days.
          No configuration needed — just pass messages with different date timestamps and the
          separators appear.
        </p>
        <PreviewTabs
          preview={<DateSeparatorDemo />}
          code={dateSeparatorCode}
          height={320}
        />
      </div>

      {/* Message Data Shape */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Message Data Shape</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Each message is a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatMessageData</code>{" "}
          object with these key fields:
        </p>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Field</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              {[
                ["id", "string", "Unique message identifier"],
                ["senderId", "string", "ID of the sender (matched against currentUser.id)"],
                ["senderName", "string", "Display name"],
                ["text", "string?", "Message text content"],
                ["timestamp", "Date | number", "When the message was sent"],
                ["status", '"sending" | "sent" | "delivered" | "read" | "failed"', "Delivery status (outgoing only)"],
                ["replyTo", "{ id, senderName, text }?", "Quoted reply reference"],
                ["reactions", "{ emoji, userIds, count }[]?", "Reaction data"],
                ["isSystem", "boolean?", "Render as centered system event"],
                ["senderAvatar", "string?", "URL for the sender's avatar image"],
                ["readBy", "{ userId, name, avatar? }[]?", "Users who have read this message"],
                ["systemEvent", "{ type, data? }?", "Structured data for system event messages"],
                ["isPinned", "boolean?", "Show pin indicator"],
                ["isEdited", "boolean?", "Show edited label"],
              ].map(([field, type, desc], i) => (
                <tr key={field} className={i < 10 ? "border-b border-[rgba(0,0,0,0.04)]" : ""}>
                  <td className="px-4 py-2.5">
                    <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">{field}</code>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{type}</td>
                  <td className="px-4 py-2.5">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/theming"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Theming
        </Link>
        <Link
          href="/docs/composer"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Composer &rarr;
        </Link>
      </div>
    </div>
  )
}
