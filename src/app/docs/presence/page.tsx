"use client"

import Link from "next/link"
import { ChatProvider, ChatMessages } from "@/components/ui/chat"
import { PreviewTabs } from "@/components/docs/preview-tabs"

const presenceColors: Record<string, string> = {
  online: "#22C55E",
  away: "#EAB308",
  dnd: "#EF4444",
  offline: "#A1A1AA",
}

const presenceUsers = [
  { name: "Alice", status: "online", initial: "A", bg: "#E0E7FF" },
  { name: "Bob", status: "away", initial: "B", bg: "#FEF3C7" },
  { name: "Carol", status: "dnd", initial: "C", bg: "#FCE7F3" },
  { name: "Dave", status: "offline", initial: "D", bg: "#E5E7EB" },
]

function PresenceDotsDemo() {
  return (
    <div className="h-full flex items-center justify-center p-6 gap-6">
      {presenceUsers.map((user) => (
        <div key={user.name} className="flex flex-col items-center gap-1.5">
          <div className="relative">
            <div
              className="flex items-center justify-center rounded-full text-[15px] font-semibold"
              style={{
                width: 44,
                height: 44,
                background: user.bg,
                color: "#18181B",
              }}
            >
              {user.initial}
            </div>
            <div
              className="absolute"
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: presenceColors[user.status],
                border: "2px solid #fff",
                bottom: 0,
                right: 0,
              }}
            />
          </div>
          <span className="text-xs text-[#71717A]">{user.name}</span>
          <span className="text-[10px] text-[#A1A1AA]">{user.status}</span>
        </div>
      ))}
    </div>
  )
}

function TypingDemo() {
  return (
    <ChatProvider
      currentUser={{ id: "user-1", name: "You" }}
      theme="lunar"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        className="flex-1 flex flex-col bg-[var(--chat-bg-main)] border rounded-xl overflow-hidden"
        style={{ borderColor: "var(--chat-border)" }}
      >
        <ChatMessages
          messages={[]}
          typingUsers={[{ id: "user-2", name: "Alex" }]}
        />
      </div>
    </ChatProvider>
  )
}

const presenceDotsCode = `const presenceColors = {
  online: "#22C55E",
  away: "#EAB308",
  dnd: "#EF4444",
  offline: "#A1A1AA",
}

const users = [
  { name: "Alice", status: "online", initial: "A", bg: "#E0E7FF" },
  { name: "Bob",   status: "away",   initial: "B", bg: "#FEF3C7" },
  { name: "Carol", status: "dnd",    initial: "C", bg: "#FCE7F3" },
  { name: "Dave",  status: "offline",initial: "D", bg: "#E5E7EB" },
]

// Each avatar is a 44px circle with a 10px presence dot
// positioned bottom-right with a 2px white border.
<div className="flex gap-6">
  {users.map((u) => (
    <div key={u.name} className="relative">
      <div
        className="flex items-center justify-center rounded-full text-[15px] font-semibold"
        style={{ width: 44, height: 44, background: u.bg }}
      >
        {u.initial}
      </div>
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: presenceColors[u.status],
          border: "2px solid #fff",
        }}
      />
    </div>
  ))}
</div>`

const typingDemoCode = `import { ChatProvider, ChatMessages } from "@/components/ui/chat"

<ChatProvider
  currentUser={{ id: "user-1", name: "You" }}
  theme="lunar"
>
  <div className="h-[200px] flex flex-col bg-[var(--chat-bg-main)]">
    <ChatMessages
      messages={[]}
      typingUsers={[{ id: "user-2", name: "Alex" }]}
    />
  </div>
</ChatProvider>`

const presenceDotsCodeBlock = `import type { ChatUser } from "@/components/ui/chat"

const users: ChatUser[] = [
  { id: "user-1", name: "Alice",  status: "online"  }, // Green dot
  { id: "user-2", name: "Bob",    status: "away"     }, // Yellow dot
  { id: "user-3", name: "Carol",  status: "dnd"      }, // Red dot (do not disturb)
  { id: "user-4", name: "Dave",   status: "offline"  }, // Gray dot or hidden
]

// The status field on ChatUser controls the presence dot
// displayed next to the user's avatar throughout the UI.`

const typingIndicatorCode = `import { ChatTypingIndicator } from "@/components/ui/chat"
import type { TypingUser } from "@/components/ui/chat"

// Single user typing
const typing: TypingUser[] = [
  { id: "user-2", name: "Alice" },
]
// Renders: "Alice is typing..."

// Two users typing
const typingTwo: TypingUser[] = [
  { id: "user-2", name: "Alice" },
  { id: "user-3", name: "Bob" },
]
// Renders: "Alice and Bob are typing..."

// Three or more users typing
const typingMany: TypingUser[] = [
  { id: "user-2", name: "Alice" },
  { id: "user-3", name: "Bob" },
  { id: "user-4", name: "Carol" },
]
// Renders: "Several people are typing..."

<ChatTypingIndicator users={typing} />`

const readReceiptsCode = `import type { ChatMessageData } from "@/components/ui/chat"

const message: ChatMessageData = {
  id: "1",
  senderId: "user-1",
  senderName: "You",
  timestamp: Date.now(),
  text: "Meeting at 3pm tomorrow",
  status: "read",

  // readBy is an array of users who have read the message.
  // Rendered as stacked mini avatars below the message.
  readBy: [
    { userId: "user-2", name: "Alice", avatar: "/avatars/alice.png" },
    { userId: "user-3", name: "Bob",   avatar: "/avatars/bob.png" },
    { userId: "user-4", name: "Carol", avatar: "/avatars/carol.png" },
  ],
}`

const useTypingIndicatorCode = `import { useTypingIndicator } from "@/components/ui/chat"

function ChatInput() {
  const { setTyping } = useTypingIndicator({
    // Debounce delay in ms — typing state resets after
    // this duration of inactivity (default: 2000)
    debounceMs: 2000,

    // Called when typing state changes
    onTypingChange: (isTyping: boolean) => {
      // Send typing status to your backend
      socket.emit("typing", { isTyping })
    },
  })

  return (
    <input
      onChange={(e) => {
        // Call setTyping() on each keystroke.
        // The hook handles debouncing automatically.
        setTyping()
      }}
    />
  )
}`

export default function PresencePage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Presence & Status</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        Online indicators, typing indicators, and read receipts. These features bring real-time
        awareness to your chat interface, letting users know who is online, who is typing, and
        who has seen their messages.
      </p>

      {/* Presence Dots */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Presence Dots</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">status</code>{" "}
          field on{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatUser</code>{" "}
          controls the colored presence dot shown next to avatars. Four states are supported:{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">&quot;online&quot;</code>,{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">&quot;away&quot;</code>,{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">&quot;dnd&quot;</code>, and{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">&quot;offline&quot;</code>.
        </p>
        <div className="mt-4 mb-6">
          <PreviewTabs preview={<PresenceDotsDemo />} code={presenceDotsCode} height={160} centered />
        </div>
        <div className="mt-4">
          <PreviewTabs
            preview={
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <code className="text-[14px] font-mono text-[#6366F1]">ChatUser.status</code>
                  <div className="mt-3 flex gap-3 justify-center">
                    {[
                      { label: "online", color: "#22C55E" },
                      { label: "away", color: "#EAB308" },
                      { label: "dnd", color: "#EF4444" },
                      { label: "offline", color: "#A1A1AA" },
                    ].map((s) => (
                      <span key={s.label} className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                        {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            }
            code={presenceDotsCodeBlock}
            height={120}
            centered
          />
        </div>
      </div>

      {/* Typing Indicator */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Typing Indicator</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatTypingIndicator</code>{" "}
          component displays an animated indicator with contextual text. It adapts its message
          based on the number of typing users: a single name, two names joined with
          &quot;and&quot;, or &quot;Several people are typing&quot; for three or more.
        </p>
        <div className="mt-4 mb-6">
          <PreviewTabs preview={<TypingDemo />} code={typingDemoCode} height={240} />
        </div>
        <div className="mt-4">
          <PreviewTabs
            preview={
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center space-y-3">
                  <code className="text-[14px] font-mono text-[#6366F1]">ChatTypingIndicator</code>
                  <div className="flex flex-col gap-1.5 text-[12px] text-[#71717A]">
                    <span className="px-2 py-1 rounded bg-[#F4F4F5]">{'"Alice is typing..."'}</span>
                    <span className="px-2 py-1 rounded bg-[#F4F4F5]">{'"Alice and Bob are typing..."'}</span>
                    <span className="px-2 py-1 rounded bg-[#F4F4F5]">{'"Several people are typing..."'}</span>
                  </div>
                </div>
              </div>
            }
            code={typingIndicatorCode}
            height={180}
            centered
          />
        </div>
      </div>

      {/* Read Receipts */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Read Receipts</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Add a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">readBy</code>{" "}
          array to a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatMessageData</code>{" "}
          object to render stacked mini avatars below the message bubble, showing who has read
          the message.
        </p>
        <div className="mt-4">
          <PreviewTabs
            preview={
              <div className="h-full flex items-center justify-center p-6">
                <div className="flex flex-col items-end gap-2">
                  <div className="rounded-2xl rounded-br-md px-4 py-2.5 text-[14px]" style={{ background: "#6366F1", color: "#fff" }}>
                    Meeting at 3pm tomorrow
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#A1A1AA] mr-1">Read by</span>
                    {[
                      { initial: "A", bg: "#E0E7FF" },
                      { initial: "B", bg: "#FEF3C7" },
                      { initial: "C", bg: "#FCE7F3" },
                    ].map((u, i) => (
                      <div
                        key={u.initial}
                        className="flex items-center justify-center rounded-full text-[9px] font-semibold border-2 border-white"
                        style={{ width: 22, height: 22, background: u.bg, marginLeft: i > 0 ? -6 : 0 }}
                      >
                        {u.initial}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
            code={readReceiptsCode}
            height={160}
            centered
          />
        </div>
      </div>

      {/* useTypingIndicator Hook */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">useTypingIndicator Hook</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">useTypingIndicator</code>{" "}
          hook provides debounced typing state management. Call{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">setTyping()</code>{" "}
          on each keystroke and the hook automatically debounces and fires a callback when the
          typing state changes.
        </p>
        <div className="mt-4">
          <PreviewTabs
            preview={
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <code className="text-[14px] font-mono text-[#6366F1]">useTypingIndicator(options)</code>
                  <div className="mt-3 flex gap-2 flex-wrap justify-center">
                    <span className="px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">setTyping()</span>
                    <span className="px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">debounceMs: 2000</span>
                    <span className="px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">onTypingChange</span>
                  </div>
                </div>
              </div>
            }
            code={useTypingIndicatorCode}
            height={120}
            centered
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/media"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Media
        </Link>
        <Link
          href="/docs/search"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Search &rarr;
        </Link>
      </div>
    </div>
  )
}
