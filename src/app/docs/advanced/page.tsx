"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { PreviewTabs } from "@/components/docs/preview-tabs"
import {
  ChatProvider,
  ChatMessages,
  ChatComposer,
} from "@/components/ui/chat"
import type { ChatMessageData, ChatUser } from "@/components/ui/chat"

const useAutoScrollCode = `import { useAutoScroll } from "@/components/ui/chat"

function MessageList() {
  const { containerRef, scrollToBottom, isAtBottom, unseenCount } =
    useAutoScroll(messages)

  return (
    <div ref={containerRef} className="overflow-y-auto h-full">
      {messages.map((msg) => (
        <Message key={msg.id} data={msg} />
      ))}

      {!isAtBottom && unseenCount > 0 && (
        <button onClick={scrollToBottom}>
          {unseenCount} new messages
        </button>
      )}
    </div>
  )
}`

const useAutoResizeCode = `import { useAutoResize } from "@/components/ui/chat"

function Composer() {
  const { textareaRef, resize } = useAutoResize({ maxRows: 6 })

  return (
    <textarea
      ref={textareaRef}
      onChange={(e) => {
        setText(e.target.value)
        resize()
      }}
      rows={1}
      placeholder="Type a message..."
    />
  )
}`

const useTypingIndicatorCode = `import { useTypingIndicator } from "@/components/ui/chat"

function Composer({ onTypingChange }: {
  onTypingChange: (typing: boolean) => void
}) {
  const { isTyping, handleKeyDown, stopTyping } = useTypingIndicator({
    debounceMs: 1500,
    onTypingChange,
  })

  return (
    <textarea
      onKeyDown={handleKeyDown}
      onBlur={stopTyping}
      placeholder="Type a message..."
    />
  )
}`

const virtualScrollCode = `import { useVirtualizer } from "@tanstack/react-virtual"

function VirtualizedMessages({ messages }: { messages: ChatMessageData[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 20,
  })

  return (
    <div ref={parentRef} className="overflow-y-auto h-full">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: virtualRow.start,
              height: virtualRow.size,
            }}
          >
            <Message data={messages[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}`

const interactiveDemoCodeString = `import { useState, useCallback } from "react"
import {
  ChatProvider, ChatMessages, ChatComposer,
  useAutoScroll, useAutoResize, useTypingIndicator,
} from "@/components/ui/chat"

function InteractiveDemo() {
  const [messages, setMessages] = useState(initialMessages)
  const [isUserTyping, setIsUserTyping] = useState(false)

  // useAutoScroll — auto-scrolls on new messages,
  // shows FAB + unread count when scrolled up
  // (built into ChatMessages)

  // useAutoResize — textarea grows as you type
  // multi-line text (built into ChatComposer)

  // useTypingIndicator — debounced typing state
  // (built into ChatComposer via onTyping)

  const handleSend = (text: string) => {
    setMessages(prev => [...prev, {
      id: \`msg-\${Date.now()}\`,
      senderId: "user-1",
      senderName: "You",
      text,
      timestamp: new Date(),
      status: "delivered",
    }])
  }

  return (
    <ChatProvider currentUser={currentUser} theme="lunar">
      <ChatMessages messages={messages}
        typingUsers={isUserTyping ? [{ id: "user-1", name: "You" }] : []}
      />
      <ChatComposer onSend={handleSend}
        onTyping={setIsUserTyping}
      />
    </ChatProvider>
  )
}`

const demoUser: ChatUser = {
  id: "user-1",
  name: "You",
}

function createMessages(now: number): ChatMessageData[] {
  const conversation: { sender: "user-1" | "user-2"; text: string }[] = [
    { sender: "user-2", text: "Hey! Have you tried the new hooks?" },
    { sender: "user-1", text: "Not yet, which ones?" },
    { sender: "user-2", text: "useAutoScroll is really smooth" },
    { sender: "user-1", text: "Does it handle the scroll-to-bottom FAB?" },
    { sender: "user-2", text: "Yep, with an unread count badge too" },
    { sender: "user-1", text: "Nice! What about the composer?" },
    { sender: "user-2", text: "useAutoResize grows the textarea automatically" },
    { sender: "user-1", text: "That sounds great, let me try it out" },
  ]
  return conversation.map((msg, i) => ({
    id: `msg-${i + 1}`,
    senderId: msg.sender,
    senderName: msg.sender === "user-1" ? "You" : "Bot",
    text: msg.text,
    timestamp: new Date(now - (conversation.length - i) * 60000),
    status: "delivered" as const,
  }))
}

function InteractiveDemo() {
  const [messages, setMessages] = useState<ChatMessageData[]>(() => createMessages(Date.now()))
  const [isUserTyping, setIsUserTyping] = useState(false)
  const botCounterRef = useRef(0)

  const handleSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-out-${Date.now()}`,
        senderId: "user-1",
        senderName: "You",
        text,
        timestamp: new Date(),
        status: "delivered" as const,
      },
    ])
  }, [])

  const handleAddBotMessage = useCallback(() => {
    botCounterRef.current += 1
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-bot-${Date.now()}`,
        senderId: "user-2",
        senderName: "Bot",
        text: `Incoming message #${botCounterRef.current}`,
        timestamp: new Date(),
        status: "delivered" as const,
      },
    ])
  }, [])

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="relative overflow-hidden flex flex-col flex-1"
      >
        <ChatProvider currentUser={demoUser} theme="lunar" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5] px-4 py-2">
            <span className="text-[14px] font-semibold text-[#18181B]">
              Hooks Demo
            </span>
            <button
              onClick={handleAddBotMessage}
              className="rounded-md bg-[#6366F1] px-2.5 py-1 text-[12px] font-medium text-white transition-colors hover:bg-[#4F46E5]"
            >
              Add message
            </button>
          </div>

          {/* Messages area with hook labels */}
          <div className="relative flex flex-1 flex-col overflow-hidden min-h-0">
            <ChatMessages
              messages={messages}
              typingUsers={
                isUserTyping
                  ? [{ id: "user-1", name: "You" }]
                  : []
              }
            />

            {/* useAutoScroll label — near bottom-right where the FAB appears */}
            <span className="pointer-events-none absolute bottom-16 right-16 z-10 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
              useAutoScroll
            </span>

            {/* useTypingIndicator label — appears when user is typing */}
            {isUserTyping && (
              <span className="pointer-events-none absolute bottom-14 left-14 z-10 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                useTypingIndicator
              </span>
            )}
          </div>

          {/* Composer with hook label */}
          <div className="relative">
            <ChatComposer
              onSend={handleSend}
              onTyping={setIsUserTyping}
              placeholder="Type a message..."
            />
            {/* useAutoResize label — near the composer */}
            <span className="pointer-events-none absolute top-1 right-14 z-10 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
              useAutoResize
            </span>
          </div>
        </ChatProvider>
      </div>
    </div>
  )
}

function AutoResizeDemo() {
  const [text, setText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = "auto"
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-[320px]">
        <label className="text-[12px] text-[#A1A1AA] mb-1.5 block">Try typing multiple lines:</label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          rows={1}
          placeholder="Type a message..."
          className="w-full rounded-lg border px-3 py-2 text-[14px] outline-none resize-none transition-all"
          style={{
            borderColor: "rgba(0,0,0,0.12)",
            color: "#18181B",
            overflow: "hidden",
          }}
        />
        <span className="text-[11px] text-[#A1A1AA] mt-1 block">
          Grows up to ~6 rows, then scrolls
        </span>
      </div>
    </div>
  )
}

function TypingIndicatorDemo() {
  const [isTyping, setIsTyping] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleKeyDown = () => {
    setIsTyping(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setIsTyping(false), 1500)
  }

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-[320px]">
        <input
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Start typing..."
          className="w-full rounded-lg border px-3 py-2 text-[14px] outline-none"
          style={{ borderColor: "rgba(0,0,0,0.12)", color: "#18181B" }}
        />
        <div className="mt-2 h-5 flex items-center">
          {isTyping ? (
            <span className="text-[12px] text-[#6366F1] font-medium">User is typing...</span>
          ) : (
            <span className="text-[12px] text-[#A1A1AA]">Not typing</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdvancedPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Advanced</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        Hooks, keyboard shortcuts, and performance optimization. These utilities
        handle the finer details of building a production chat interface &mdash;
        scroll behavior, auto-resizing textareas, typing indicators, and more.
      </p>

      {/* Interactive Hooks Demo */}
      <div className="mt-8 mb-4">
        <PreviewTabs
          preview={<InteractiveDemo />}
          code={interactiveDemoCodeString}
          height={500}
        />
      </div>

      {/* useAutoScroll */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">useAutoScroll</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Keeps the message list scrolled to the bottom when new messages arrive, but only
          if the user hasn&apos;t scrolled up. Returns a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">containerRef</code>{" "}
          to attach to the scroll container,{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">scrollToBottom</code>{" "}
          to imperatively jump down,{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">isAtBottom</code>{" "}
          for UI logic, and{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">unseenCount</code>{" "}
          to show a badge.
        </p>
        <div className="mt-4">
          <PreviewTabs
            preview={
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <code className="text-[14px] font-mono text-[#6366F1]">useAutoScroll(messages)</code>
                  <div className="mt-3 flex gap-2 flex-wrap justify-center">
                    <span className="px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">containerRef</span>
                    <span className="px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">scrollToBottom()</span>
                    <span className="px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">isAtBottom</span>
                    <span className="px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">unseenCount</span>
                  </div>
                </div>
              </div>
            }
            code={useAutoScrollCode}
            height={120}
            centered
          />
        </div>
      </div>

      {/* useAutoResize */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">useAutoResize</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Automatically grows and shrinks a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">&lt;textarea&gt;</code>{" "}
          to fit its content, up to a configurable{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">maxRows</code>{" "}
          limit. Returns a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">textareaRef</code>{" "}
          and a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">resize</code>{" "}
          function you call after each content change.
        </p>
        <div className="mt-4">
          <PreviewTabs
            preview={<AutoResizeDemo />}
            code={useAutoResizeCode}
            height={160}
            centered
          />
        </div>
      </div>

      {/* useTypingIndicator */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">useTypingIndicator</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Tracks whether the local user is actively typing and debounces the signal. Returns{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">isTyping</code>{" "}
          (current state),{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">handleKeyDown</code>{" "}
          (attach to the textarea),{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">stopTyping</code>{" "}
          (force stop), and accepts a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">debounceMs</code>{" "}
          config (default 1500ms).
        </p>
        <div className="mt-4">
          <PreviewTabs
            preview={<TypingIndicatorDemo />}
            code={useTypingIndicatorCode}
            height={160}
            centered
          />
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Keyboard Shortcuts</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The composer and message list respond to these keyboard shortcuts by default:
        </p>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Shortcut</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Action</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">Enter</code>
                </td>
                <td className="px-4 py-2.5">Send the current message</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">Shift+Enter</code>
                </td>
                <td className="px-4 py-2.5">Insert a newline without sending</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">Escape</code>
                </td>
                <td className="px-4 py-2.5">Cancel the active reply</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">&uarr;</code>{" "}
                  in empty composer
                </td>
                <td className="px-4 py-2.5">Edit your last sent message</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Virtual Scrolling */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Virtual Scrolling</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          For conversations with 10,000+ messages, rendering every DOM node will degrade
          performance. We recommend{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">@tanstack/react-virtual</code>{" "}
          for windowed rendering. It only mounts the messages visible in the viewport plus a
          configurable overscan buffer.
        </p>
        <div className="mt-4">
          <PreviewTabs
            preview={
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <code className="text-[14px] font-mono text-[#6366F1]">@tanstack/react-virtual</code>
                  <div className="mt-3 flex gap-2 flex-wrap justify-center">
                    <span className="px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">useVirtualizer</span>
                    <span className="px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">estimateSize: 72</span>
                    <span className="px-2 py-1 rounded bg-[#F4F4F5] text-[12px]">overscan: 20</span>
                  </div>
                </div>
              </div>
            }
            code={virtualScrollCode}
            height={120}
            centered
          />
        </div>
      </div>

      {/* Security Utilities */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Security Utilities</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          chatcn includes a handful of security helpers for sanitizing user-generated content:
        </p>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Utility</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">sanitizeUrl</code>
                </td>
                <td className="px-4 py-2.5">
                  Strips <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">javascript:</code> and data URIs from user-submitted links, returning a safe href or an empty string.
                </td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">validateFile</code>
                </td>
                <td className="px-4 py-2.5">
                  Checks a File object against allowed MIME types and a max size limit. Returns an error string or null.
                </td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">isValidEmoji</code>
                </td>
                <td className="px-4 py-2.5">
                  Validates that a string is a single Unicode emoji sequence, preventing injection of arbitrary text in reaction pickers.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">stripBidiOverrides</code>
                </td>
                <td className="px-4 py-2.5">
                  Removes Unicode bidirectional override characters (U+202A&ndash;U+202E, U+2066&ndash;U+2069) that can be used for text spoofing attacks.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/search"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Search
        </Link>
        <Link
          href="/docs/security"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Security &rarr;
        </Link>
      </div>
    </div>
  )
}
