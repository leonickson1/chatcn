"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import {
  ChatNestedThread,
} from "@/components/ui/chat"
import type { ThreadedMessage } from "@/components/ui/chat"
import { PreviewTabs } from "@/components/docs/preview-tabs"

const flatThreadCode = `import { ChatNestedThread } from "@/components/ui/chat"
import type { ThreadedMessage } from "@/components/ui/chat"

const messages: ThreadedMessage[] = [
  {
    id: "parent-1",
    senderId: "user-2",
    senderName: "Alice",
    timestamp: Date.now() - 300000,
    text: "Should we migrate to the new API version?",
    status: "read",
    parentId: null,
    depth: 0,
    votes: 0,
    children: [
      {
        id: "reply-1",
        senderId: "user-1",
        senderName: "You",
        timestamp: Date.now() - 240000,
        text: "I think so. The new endpoints are much cleaner.",
        status: "delivered",
        parentId: "parent-1",
        depth: 1,
        votes: 0,
        children: [],
      },
      {
        id: "reply-2",
        senderId: "user-3",
        senderName: "Bob",
        timestamp: Date.now() - 180000,
        text: "Agreed. Let's plan the migration for next sprint.",
        status: "read",
        parentId: "parent-1",
        depth: 1,
        votes: 0,
        children: [],
      },
    ],
  },
]

<ChatNestedThread messages={messages} />`

const nestedThreadCode = `import { ChatNestedThread } from "@/components/ui/chat"
import type { ThreadedMessage } from "@/components/ui/chat"

const messages: ThreadedMessage[] = [
  {
    id: "root-1",
    senderId: "user-2",
    senderName: "Alice",
    timestamp: Date.now() - 600000,
    text: "What's the best approach for caching?",
    parentId: null,
    depth: 0,
    votes: 5,
    children: [
      {
        id: "child-1",
        senderId: "user-1",
        senderName: "You",
        timestamp: Date.now() - 500000,
        text: "Redis for hot data, CDN for static assets.",
        parentId: "root-1",
        depth: 1,
        votes: 3,
        children: [
          {
            id: "child-1-1",
            senderId: "user-3",
            senderName: "Bob",
            timestamp: Date.now() - 400000,
            text: "Don't forget to set TTLs!",
            parentId: "child-1",
            depth: 2,
            votes: 2,
            children: [],
          },
        ],
      },
      {
        id: "child-2",
        senderId: "user-4",
        senderName: "Carol",
        timestamp: Date.now() - 450000,
        text: "We could also look into stale-while-revalidate.",
        parentId: "root-1",
        depth: 1,
        votes: 1,
        children: [],
      },
    ],
  },
]

// Nested threads indent each level and support voting
<ChatNestedThread messages={messages} showVotes onVote={handleVote} />`

const dataShapeCode = `interface ThreadedMessage {
  id: string
  senderId: string
  senderName: string
  timestamp: Date | number
  text: string

  // Threading fields
  parentId: string | null  // null for root messages
  children: ThreadedMessage[]
  depth: number            // 0 = root, 1 = first reply level, etc.

  // Voting
  votes?: number
  userVote?: "up" | "down" | null
  isCollapsed?: boolean
}`

const demoCode = `import { ChatNestedThread } from "@/components/ui/chat"
import type { ThreadedMessage } from "@/components/ui/chat"

const messages: ThreadedMessage[] = [
  {
    id: "root-1",
    senderId: "user-2",
    senderName: "Alice",
    timestamp: Date.now() - 600000,
    text: "Has anyone tried the new streaming API?",
    parentId: null,
    depth: 0,
    votes: 5,
    children: [
      {
        id: "child-1",
        senderId: "user-3",
        senderName: "Bob",
        timestamp: Date.now() - 500000,
        text: "Yeah, it's great for real-time updates",
        parentId: "root-1",
        depth: 1,
        votes: 3,
        children: [
          {
            id: "child-1-1",
            senderId: "user-4",
            senderName: "Carol",
            timestamp: Date.now() - 400000,
            text: "Agreed, docs could be better though",
            parentId: "child-1",
            depth: 2,
            votes: 1,
            children: [],
          },
        ],
      },
      {
        id: "child-2",
        senderId: "user-5",
        senderName: "Dan",
        timestamp: Date.now() - 450000,
        text: "I found a bug with token counting",
        parentId: "root-1",
        depth: 1,
        votes: 2,
        children: [],
      },
    ],
  },
]

<ChatNestedThread messages={messages} showVotes onVote={handleVote} />`

function ThreadDemo() {
  const [messages, setMessages] = useState<ThreadedMessage[]>(() => {
    const now = Date.now()
    return [
      {
        id: "root-1",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 600000,
        text: "Has anyone tried the new streaming API?",
        status: "read" as const,
        parentId: null,
        depth: 0,
        votes: 5,
        children: [
          {
            id: "child-1",
            senderId: "user-3",
            senderName: "Bob",
            timestamp: now - 500000,
            text: "Yeah, it's great for real-time updates",
            status: "read" as const,
            parentId: "root-1",
            depth: 1,
            votes: 3,
            children: [
              {
                id: "child-1-1",
                senderId: "user-4",
                senderName: "Carol",
                timestamp: now - 400000,
                text: "Agreed, docs could be better though",
                status: "read" as const,
                parentId: "child-1",
                depth: 2,
                votes: 1,
                children: [],
              },
            ],
          },
          {
            id: "child-2",
            senderId: "user-5",
            senderName: "Dan",
            timestamp: now - 450000,
            text: "I found a bug with token counting",
            status: "read" as const,
            parentId: "root-1",
            depth: 1,
            votes: 2,
            children: [],
          },
        ],
      },
    ]
  })

  const handleVote = useCallback((messageId: string, direction: "up" | "down") => {
    function updateVotes(msgs: ThreadedMessage[]): ThreadedMessage[] {
      return msgs.map((msg) => {
        if (msg.id === messageId) {
          const currentVotes = msg.votes ?? 0
          const wasUp = msg.userVote === "up"
          const wasDown = msg.userVote === "down"
          let newVotes = currentVotes
          let newUserVote: "up" | "down" | null = direction

          if (direction === "up") {
            if (wasUp) { newVotes -= 1; newUserVote = null }
            else if (wasDown) { newVotes += 2; }
            else { newVotes += 1; }
          } else {
            if (wasDown) { newVotes += 1; newUserVote = null }
            else if (wasUp) { newVotes -= 2; }
            else { newVotes -= 1; }
          }

          return { ...msg, votes: newVotes, userVote: newUserVote, children: updateVotes(msg.children) }
        }
        return { ...msg, children: updateVotes(msg.children) }
      })
    }
    setMessages((prev) => updateVotes(prev))
  }, [])

  return (
    <div className="h-full overflow-y-auto rounded-xl border border-[rgba(0,0,0,0.10)] p-4 bg-white">
      <ChatNestedThread messages={messages} showVotes onVote={handleVote} />
    </div>
  )
}

function FlatThreadDemo() {
  const [messages] = useState<ThreadedMessage[]>(() => {
    const now = Date.now()
    return [
      {
        id: "flat-root",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 300000,
        text: "Should we migrate to the new API version?",
        status: "read" as const,
        parentId: null,
        depth: 0,
        votes: 0,
        children: [
          {
            id: "flat-reply-1",
            senderId: "user-1",
            senderName: "You",
            timestamp: now - 240000,
            text: "I think so. The new endpoints are much cleaner.",
            status: "delivered" as const,
            parentId: "flat-root",
            depth: 1,
            votes: 0,
            children: [],
          },
          {
            id: "flat-reply-2",
            senderId: "user-3",
            senderName: "Bob",
            timestamp: now - 180000,
            text: "Agreed. Let's plan the migration for next sprint.",
            status: "read" as const,
            parentId: "flat-root",
            depth: 1,
            votes: 0,
            children: [],
          },
        ],
      },
    ]
  })

  return (
    <div className="h-full overflow-y-auto p-4 bg-white">
      <ChatNestedThread messages={messages} />
    </div>
  )
}

function CollapsibleThreadDemo() {
  const [messages, setMessages] = useState<ThreadedMessage[]>(() => {
    const now = Date.now()
    return [
      {
        id: "coll-root",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 600000,
        text: "What's the best approach for caching?",
        status: "read" as const,
        parentId: null,
        depth: 0,
        votes: 5,
        children: [
          {
            id: "coll-child-1",
            senderId: "user-1",
            senderName: "You",
            timestamp: now - 500000,
            text: "Redis for hot data, CDN for static assets.",
            status: "read" as const,
            parentId: "coll-root",
            depth: 1,
            votes: 3,
            children: [
              {
                id: "coll-child-1-1",
                senderId: "user-3",
                senderName: "Bob",
                timestamp: now - 400000,
                text: "Don't forget to set TTLs!",
                status: "read" as const,
                parentId: "coll-child-1",
                depth: 2,
                votes: 2,
                children: [],
              },
            ],
          },
          {
            id: "coll-child-2",
            senderId: "user-4",
            senderName: "Carol",
            timestamp: now - 450000,
            text: "We could also look into stale-while-revalidate.",
            status: "read" as const,
            parentId: "coll-root",
            depth: 1,
            votes: 1,
            children: [],
          },
        ],
      },
    ]
  })

  const handleVote = useCallback((messageId: string, direction: "up" | "down") => {
    function updateVotes(msgs: ThreadedMessage[]): ThreadedMessage[] {
      return msgs.map((msg) => {
        if (msg.id === messageId) {
          const currentVotes = msg.votes ?? 0
          const wasUp = msg.userVote === "up"
          const wasDown = msg.userVote === "down"
          let newVotes = currentVotes
          let newUserVote: "up" | "down" | null = direction

          if (direction === "up") {
            if (wasUp) { newVotes -= 1; newUserVote = null }
            else if (wasDown) { newVotes += 2; }
            else { newVotes += 1; }
          } else {
            if (wasDown) { newVotes += 1; newUserVote = null }
            else if (wasUp) { newVotes -= 2; }
            else { newVotes -= 1; }
          }

          return { ...msg, votes: newVotes, userVote: newUserVote, children: updateVotes(msg.children) }
        }
        return { ...msg, children: updateVotes(msg.children) }
      })
    }
    setMessages((prev) => updateVotes(prev))
  }, [])

  return (
    <div className="h-full overflow-y-auto p-4 bg-white">
      <ChatNestedThread messages={messages} showVotes onVote={handleVote} />
    </div>
  )
}

function DataShapeDemo() {
  const [messages] = useState<ThreadedMessage[]>(() => {
    const now = Date.now()
    return [
      {
        id: "ds-root",
        senderId: "user-2",
        senderName: "Alice",
        timestamp: now - 300000,
        text: "Example root message (parentId: null, depth: 0)",
        status: "read" as const,
        parentId: null,
        depth: 0,
        votes: 2,
        children: [
          {
            id: "ds-child",
            senderId: "user-3",
            senderName: "Bob",
            timestamp: now - 200000,
            text: "First-level reply (depth: 1)",
            status: "read" as const,
            parentId: "ds-root",
            depth: 1,
            votes: 1,
            children: [
              {
                id: "ds-grandchild",
                senderId: "user-4",
                senderName: "Carol",
                timestamp: now - 100000,
                text: "Nested reply (depth: 2)",
                status: "read" as const,
                parentId: "ds-child",
                depth: 2,
                votes: 0,
                children: [],
              },
            ],
          },
        ],
      },
    ]
  })

  return (
    <div className="h-full overflow-y-auto p-4 bg-white">
      <ChatNestedThread messages={messages} showVotes />
    </div>
  )
}

export default function ThreadsPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Threads</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        Flat and nested threading for conversations. Use flat threads for simple reply chains and
        nested threads for Reddit-style indented discussions with voting.
      </p>

      <div className="mt-6 mb-12">
        <PreviewTabs preview={<ThreadDemo />} code={demoCode} height={440} />
      </div>

      {/* Flat Thread */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Flat Thread</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatNestedThread</code>{" "}
          component can render a flat thread by using a single nesting level. This is the
          simplest threading model, similar to Slack-style threads.
        </p>
        <PreviewTabs preview={<FlatThreadDemo />} code={flatThreadCode} height={300} />
      </div>

      {/* Nested Thread */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Nested Thread</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatNestedThread</code>{" "}
          component supports indented sub-threads, collapsible branches, and vote counts.
          Each reply level is indented further, and threads can be collapsed to focus on
          top-level discussion.
        </p>
        <PreviewTabs preview={<CollapsibleThreadDemo />} code={nestedThreadCode} height={350} />
      </div>

      {/* Data Shape */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">ThreadedMessage Data Shape</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ThreadedMessage</code>{" "}
          interface extends the base message fields with threading-specific properties:
        </p>
        <PreviewTabs preview={<DataShapeDemo />} code={dataShapeCode} height={280} />
        <div className="mt-6 overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
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
                ["parentId", "string | null", "ID of the parent message, null for root"],
                ["children", "ThreadedMessage[]", "Array of child replies"],
                ["depth", "number", "Nesting level (0 = root)"],
                ["votes", "number?", "Optional net vote count for the message"],
                ["userVote", '"up" | "down" | null?', "Current user's vote direction"],
                ["isCollapsed", "boolean?", "Whether this thread branch is collapsed"],
              ].map(([field, type, desc], i, arr) => (
                <tr key={field} className={i < arr.length - 1 ? "border-b border-[rgba(0,0,0,0.04)]" : ""}>
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
          href="/docs/reactions"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Reactions
        </Link>
        <Link
          href="/docs/conversations"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Conversations &rarr;
        </Link>
      </div>
    </div>
  )
}
