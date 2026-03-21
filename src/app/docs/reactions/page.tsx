"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import {
  ChatProvider,
  ChatMessages,
} from "@/components/ui/chat"
import type { ChatMessageData, ChatUser } from "@/components/ui/chat"
import { PreviewTabs } from "@/components/docs/preview-tabs"

const basicUsageCode = `import { ChatProvider, ChatMessages } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

const messages: ChatMessageData[] = [
  {
    id: "1",
    senderId: "user-2",
    senderName: "Alice",
    timestamp: Date.now() - 60000,
    text: "This new design is incredible!",
    status: "read",
    reactions: [
      { emoji: "\u{1F525}", userIds: ["user-1", "user-3"], count: 2 },
      { emoji: "\u{1F44D}", userIds: ["user-3"], count: 1 },
    ],
  },
]

export function ReactionsChat() {
  return (
    <ChatProvider currentUser={currentUser} theme="lunar">
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}`

const highlightCode = `import { ChatProvider, ChatMessages } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

// When currentUser.id is included in a reaction's userIds,
// that reaction pill is visually highlighted.
const currentUser: ChatUser = { id: "user-1", name: "You" }

const messages: ChatMessageData[] = [
  {
    id: "1",
    senderId: "user-2",
    senderName: "Alice",
    timestamp: Date.now(),
    text: "Ship it!",
    status: "read",
    reactions: [
      // Highlighted for user-1 (current user reacted)
      { emoji: "\u{1F680}", userIds: ["user-1", "user-2"], count: 2 },
      // NOT highlighted for user-1
      { emoji: "\u{2764}\u{FE0F}", userIds: ["user-3"], count: 1 },
    ],
  },
]

export function HighlightedReactions() {
  return (
    <ChatProvider currentUser={currentUser} theme="lunar">
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}`

const callbacksCode = `"use client"

import { useState, useCallback } from "react"
import { ChatProvider, ChatMessages } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

export function ReactionsWithCallbacks() {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: "1",
      senderId: "user-2",
      senderName: "Alice",
      timestamp: Date.now(),
      text: "Great work!",
      status: "read",
      reactions: [{ emoji: "\u{1F525}", userIds: ["user-2"], count: 1 }],
    },
  ])

  const handleReactionAdd = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg
        const reactions = [...(msg.reactions ?? [])]
        const idx = reactions.findIndex((r) => r.emoji === emoji)
        if (idx >= 0) {
          const r = reactions[idx]
          if (!r.userIds.includes(currentUser.id)) {
            reactions[idx] = { ...r, userIds: [...r.userIds, currentUser.id], count: r.count + 1 }
          }
        } else {
          reactions.push({ emoji, userIds: [currentUser.id], count: 1 })
        }
        return { ...msg, reactions }
      })
    )
  }, [])

  const handleReactionRemove = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg
        const reactions = (msg.reactions ?? [])
          .map((r) => {
            if (r.emoji !== emoji) return r
            const userIds = r.userIds.filter((id) => id !== currentUser.id)
            return { ...r, userIds, count: userIds.length }
          })
          .filter((r) => r.count > 0)
        return { ...msg, reactions }
      })
    )
  }, [])

  return (
    <ChatProvider
      currentUser={currentUser}
      theme="lunar"
      onReactionAdd={handleReactionAdd}
      onReactionRemove={handleReactionRemove}
    >
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}`

const demoCode = `"use client"

import { useState, useCallback } from "react"
import { ChatProvider, ChatMessages } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You", status: "online" }

const initialMessages: ChatMessageData[] = [
  {
    id: "r1",
    senderId: "user-2",
    senderName: "Alice",
    timestamp: Date.now() - 180000,
    text: "This new API is incredible",
    status: "read",
    reactions: [
      { emoji: "\u{1F525}", userIds: ["user-2"], count: 1 },
      { emoji: "\u{1F4AF}", userIds: ["user-2", "user-3"], count: 2 },
    ],
  },
  {
    id: "r2",
    senderId: "user-1",
    senderName: "You",
    timestamp: Date.now() - 120000,
    text: "Right? The DX is so clean",
    status: "delivered",
    reactions: [
      { emoji: "\u{1F44D}", userIds: ["user-2"], count: 1 },
    ],
  },
  {
    id: "r3",
    senderId: "user-2",
    senderName: "Alice",
    timestamp: Date.now() - 60000,
    text: "Shipping it tomorrow",
    status: "read",
    reactions: [
      { emoji: "\u{1F680}", userIds: ["user-1", "user-2"], count: 2 },
      { emoji: "\u{1F389}", userIds: ["user-2"], count: 1 },
    ],
  },
]

export function ReactionsDemo() {
  const [messages, setMessages] = useState(initialMessages)

  const handleReactionAdd = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg
        const reactions = [...(msg.reactions ?? [])]
        const idx = reactions.findIndex((r) => r.emoji === emoji)
        if (idx >= 0) {
          const r = reactions[idx]
          if (!r.userIds.includes(currentUser.id)) {
            reactions[idx] = { ...r, userIds: [...r.userIds, currentUser.id], count: r.count + 1 }
          }
        } else {
          reactions.push({ emoji, userIds: [currentUser.id], count: 1 })
        }
        return { ...msg, reactions }
      })
    )
  }, [])

  const handleReactionRemove = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg
        const reactions = (msg.reactions ?? [])
          .map((r) => {
            if (r.emoji !== emoji) return r
            const userIds = r.userIds.filter((id) => id !== currentUser.id)
            return { ...r, userIds, count: userIds.length }
          })
          .filter((r) => r.count > 0)
        return { ...msg, reactions }
      })
    )
  }, [])

  return (
    <ChatProvider
      currentUser={currentUser}
      theme="lunar"
      onReactionAdd={handleReactionAdd}
      onReactionRemove={handleReactionRemove}
    >
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}`

function BasicUsageDemo() {
  const [messages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    return [
      {
        id: "1",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 60000,
        text: "This new design is incredible!",
        status: "read" as const,
        reactions: [
          { emoji: "\u{1F525}", userIds: ["user-1", "user-3"], count: 2 },
          { emoji: "\u{1F44D}", userIds: ["user-3"], count: 1 },
        ],
      },
    ]
  })

  return (
    <ChatProvider
      currentUser={{ id: "user-1", name: "You" }}
      theme="lunar"
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}

function HighlightDemo() {
  const [messages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    return [
      {
        id: "1",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now,
        text: "Ship it!",
        status: "read" as const,
        reactions: [
          { emoji: "\u{1F680}", userIds: ["user-1", "user-2"], count: 2 },
          { emoji: "\u{2764}\u{FE0F}", userIds: ["user-3"], count: 1 },
        ],
      },
    ]
  })

  return (
    <ChatProvider
      currentUser={{ id: "user-1", name: "You" }}
      theme="lunar"
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}

function CallbacksDemo() {
  const [messages, setMessages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    return [
      {
        id: "1",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 60000,
        text: "Great work!",
        status: "read" as const,
        reactions: [{ emoji: "\u{1F525}", userIds: ["user-2"], count: 1 }],
      },
      {
        id: "2",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 30000,
        text: "Thanks! Let's ship it",
        status: "delivered" as const,
        reactions: [{ emoji: "\u{1F680}", userIds: ["user-2"], count: 1 }],
      },
    ]
  })

  const handleReactionAdd = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg
        const reactions = [...(msg.reactions ?? [])]
        const idx = reactions.findIndex((r) => r.emoji === emoji)
        if (idx >= 0) {
          const r = reactions[idx]
          if (!r.userIds.includes("user-1")) {
            reactions[idx] = { ...r, userIds: [...r.userIds, "user-1"], count: r.count + 1 }
          }
        } else {
          reactions.push({ emoji, userIds: ["user-1"], count: 1 })
        }
        return { ...msg, reactions }
      })
    )
  }, [])

  const handleReactionRemove = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg
        const reactions = (msg.reactions ?? [])
          .map((r) => {
            if (r.emoji !== emoji) return r
            const userIds = r.userIds.filter((id) => id !== "user-1")
            return { ...r, userIds, count: userIds.length }
          })
          .filter((r) => r.count > 0)
        return { ...msg, reactions }
      })
    )
  }, [])

  return (
    <ChatProvider
      currentUser={{ id: "user-1", name: "You" }}
      theme="lunar"
      onReactionAdd={handleReactionAdd}
      onReactionRemove={handleReactionRemove}
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}

const demoUser: ChatUser = { id: "user-1", name: "You", status: "online" }

function ReactionsDemo() {
  const [messages, setMessages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    return [
      {
        id: "r1",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 180000,
        text: "This new API is incredible",
        status: "read" as const,
        reactions: [
          { emoji: "\u{1F525}", userIds: ["user-2"], count: 1 },
          { emoji: "\u{1F4AF}", userIds: ["user-2", "user-3"], count: 2 },
        ],
      },
      {
        id: "r2",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 120000,
        text: "Right? The DX is so clean",
        status: "delivered" as const,
        reactions: [
          { emoji: "\u{1F44D}", userIds: ["user-2"], count: 1 },
        ],
      },
      {
        id: "r3",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 60000,
        text: "Shipping it tomorrow",
        status: "read" as const,
        reactions: [
          { emoji: "\u{1F680}", userIds: ["user-1", "user-2"], count: 2 },
          { emoji: "\u{1F389}", userIds: ["user-2"], count: 1 },
        ],
      },
      {
        id: "r4",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 45000,
        text: "Let's get it reviewed first",
        status: "delivered" as const,
        reactions: [
          { emoji: "\u{1F44D}", userIds: ["user-2"], count: 1 },
        ],
      },
      {
        id: "r5",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 30000,
        text: "Already on it! Tests are passing",
        status: "read" as const,
        reactions: [
          { emoji: "\u{2705}", userIds: ["user-1", "user-2"], count: 2 },
          { emoji: "\u{1F4AA}", userIds: ["user-2"], count: 1 },
        ],
      },
      {
        id: "r6",
        senderId: "user-1",
        senderName: "You",
        timestamp: now - 15000,
        text: "Amazing work, this is going to be huge",
        status: "delivered" as const,
        reactions: [
          { emoji: "\u{2764}\u{FE0F}", userIds: ["user-2"], count: 1 },
          { emoji: "\u{1F525}", userIds: ["user-2"], count: 1 },
        ],
      },
    ]
  })

  const handleReactionAdd = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg
        const reactions = [...(msg.reactions ?? [])]
        const idx = reactions.findIndex((r) => r.emoji === emoji)
        if (idx >= 0) {
          const r = reactions[idx]
          if (!r.userIds.includes("user-1")) {
            reactions[idx] = { ...r, userIds: [...r.userIds, "user-1"], count: r.count + 1 }
          }
        } else {
          reactions.push({ emoji, userIds: ["user-1"], count: 1 })
        }
        return { ...msg, reactions }
      })
    )
  }, [])

  const handleReactionRemove = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg
        const reactions = (msg.reactions ?? [])
          .map((r) => {
            if (r.emoji !== emoji) return r
            const userIds = r.userIds.filter((id) => id !== "user-1")
            return { ...r, userIds, count: userIds.length }
          })
          .filter((r) => r.count > 0)
        return { ...msg, reactions }
      })
    )
  }, [])

  return (
    <ChatProvider
      currentUser={demoUser}
      theme="lunar"
      onReactionAdd={handleReactionAdd}
      onReactionRemove={handleReactionRemove}
      className="h-full flex flex-col"
    >
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
      </div>
    </ChatProvider>
  )
}

export default function ReactionsPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Reactions</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        Emoji reaction pills displayed below messages. Reactions show an emoji, a count, and
        visually highlight when the current user has reacted.
      </p>

      <div className="mt-6 mb-12">
        <PreviewTabs preview={<ReactionsDemo />} code={demoCode} height={340} />
      </div>

      {/* Basic Usage */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Basic Usage</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Add a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">reactions</code>{" "}
          array to any{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatMessageData</code>{" "}
          object. Each reaction includes an emoji, the list of user IDs who reacted, and a count.
        </p>
        <div className="mt-4">
          <PreviewTabs preview={<BasicUsageDemo />} code={basicUsageCode} height={200} />
        </div>
      </div>

      {/* Current User Highlight */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Current User Highlight</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Reactions where{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">userIds</code>{" "}
          includes{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">currentUser.id</code>{" "}
          are rendered with a highlighted style (accent border and background) so the user can
          quickly see which reactions they have already added.
        </p>
        <div className="mt-4">
          <PreviewTabs preview={<HighlightDemo />} code={highlightCode} height={200} />
        </div>
      </div>

      {/* Adding Reactions */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Adding Reactions</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Use the{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">onReactionAdd</code>{" "}
          and{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">onReactionRemove</code>{" "}
          callbacks on{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatProvider</code>{" "}
          to handle toggling reactions. These fire when the current user clicks a reaction pill or
          picks an emoji from the reaction picker.
        </p>
        <div className="mt-4">
          <PreviewTabs preview={<CallbacksDemo />} code={callbacksCode} height={280} />
        </div>
      </div>

      {/* Reaction Shape */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Reaction Shape</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Each item in the{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">reactions</code>{" "}
          array has the following shape:
        </p>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Prop</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              {[
                ["emoji", "string", "The emoji character (e.g. \"\u{1F525}\", \"\u{1F44D}\")"],
                ["userIds", "string[]", "IDs of users who added this reaction"],
                ["count", "number", "Total number of users who reacted with this emoji"],
              ].map(([prop, type, desc], i) => (
                <tr key={prop} className={i < 2 ? "border-b border-[rgba(0,0,0,0.04)]" : ""}>
                  <td className="px-4 py-2.5">
                    <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">{prop}</code>
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
          href="/docs/composer"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Composer
        </Link>
        <Link
          href="/docs/threads"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Threads &rarr;
        </Link>
      </div>
    </div>
  )
}
