"use client"

import { useState } from "react"
import Link from "next/link"
import { PreviewTabs } from "@/components/docs/preview-tabs"

const chatMessages = [
  { id: "m1", sender: "Alex Chen", text: "The PR is ready for review", time: "2:30 PM" },
  { id: "m2", sender: "Sara Kim", text: "I reviewed it this morning", time: "1:45 PM" },
  { id: "m3", sender: "Alex Chen", text: "Token refresh is rewritten", time: "11:20 AM" },
  { id: "m4", sender: "You", text: "Looks good, merging now!", time: "11:25 AM" },
]

function BasicUsageDemo() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const searchResults = searchQuery.trim()
    ? chatMessages.filter(
        (m) =>
          m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.sender.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  return (
    <div className="h-full flex flex-col">
      <div
        className="w-full rounded-xl border overflow-hidden flex flex-col"
        style={{
          height: 350,
          borderColor: "var(--chat-border-strong, rgba(0,0,0,0.12))",
          background: "var(--chat-bg-main, #fff)",
        }}
      >
        {/* Chat header */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 border-b"
          style={{ borderColor: "var(--chat-border, rgba(0,0,0,0.06))" }}
        >
          <div
            className="flex items-center justify-center rounded-full text-[11px] font-semibold flex-shrink-0"
            style={{ width: 32, height: 32, background: "#EEF2FF", color: "#6366F1" }}
          >
            DT
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[13px] font-semibold" style={{ color: "var(--chat-text-primary, #18181B)" }}>Design Team</span>
            <span className="text-[10px] block" style={{ color: "var(--chat-text-tertiary, #A1A1AA)" }}>Alex, Sara, and you</span>
          </div>
          <button
            onClick={() => { setSearchOpen(!searchOpen); if (searchOpen) setSearchQuery("") }}
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 32,
              height: 32,
              color: "var(--chat-text-secondary, #71717A)",
              background: searchOpen ? "var(--chat-accent-soft, #EEF2FF)" : undefined,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div
            className="flex items-center gap-2 px-4 py-2 border-b"
            style={{
              borderColor: "var(--chat-border, rgba(0,0,0,0.06))",
              background: "var(--chat-bg-sidebar, #F4F4F5)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--chat-text-tertiary, #A1A1AA)", flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in conversation..."
              className="flex-1 bg-transparent outline-none text-[13px]"
              style={{ color: "var(--chat-text-primary, #18181B)" }}
            />
            {searchQuery.trim() && (
              <span className="text-[11px]" style={{ color: "var(--chat-text-tertiary, #A1A1AA)" }}>
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </span>
            )}
            <button
              onClick={() => { setSearchOpen(false); setSearchQuery("") }}
              style={{ color: "var(--chat-text-tertiary, #A1A1AA)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
          {(searchOpen && searchQuery.trim() ? searchResults : chatMessages).map((msg) => {
            const isYou = msg.sender === "You"
            return (
              <div key={msg.id} className={`flex flex-col ${isYou ? "items-end" : "items-start"}`}>
                {!isYou && (
                  <span className="text-[10px] font-medium mb-0.5" style={{ color: "var(--chat-text-tertiary, #A1A1AA)" }}>{msg.sender}</span>
                )}
                <div
                  className="rounded-2xl px-3 py-1.5 text-[13px] max-w-[80%]"
                  style={{
                    background: isYou ? "#6366F1" : "var(--chat-bubble-incoming, #F4F4F5)",
                    color: isYou ? "#fff" : "var(--chat-text-primary, #18181B)",
                    borderBottomRightRadius: isYou ? 4 : undefined,
                    borderBottomLeftRadius: !isYou ? 4 : undefined,
                  }}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] mt-0.5" style={{ color: "var(--chat-text-tertiary, #A1A1AA)" }}>{msg.time}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const allResults = [
  {
    id: "1",
    sender: "Alex Chen",
    conversation: "Design Team",
    snippet: "The PR is ready for review",
    time: "2:30 PM",
  },
  {
    id: "2",
    sender: "Sara Kim",
    conversation: "General",
    snippet: "I reviewed it this morning",
    time: "1:45 PM",
  },
  {
    id: "3",
    sender: "Alex Chen",
    conversation: "Design Team",
    snippet: "Token refresh is rewritten",
    time: "11:20 AM",
  },
]

function SearchDemo() {
  const [query, setQuery] = useState("")

  const filtered = query.trim()
    ? allResults.filter(
        (r) =>
          r.snippet.toLowerCase().includes(query.toLowerCase()) ||
          r.sender.toLowerCase().includes(query.toLowerCase()) ||
          r.conversation.toLowerCase().includes(query.toLowerCase())
      )
    : allResults

  return (
    <div className="h-full flex flex-col items-center justify-center">
    <div
      className="w-full max-w-[420px] rounded-xl border overflow-hidden flex flex-col"
      style={{
        height: 350,
        borderColor: "var(--chat-border-strong, rgba(0,0,0,0.12))",
        background: "var(--chat-bg-main, #fff)",
      }}
    >
      {/* Search input */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-b"
        style={{ borderColor: "var(--chat-border, rgba(0,0,0,0.06))" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--chat-text-tertiary, #A1A1AA)", flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages..."
          className="flex-1 bg-transparent outline-none text-[14px]"
          style={{
            color: "var(--chat-text-primary, #18181B)",
          }}
        />
        <kbd
          className="text-[10px] font-medium px-1.5 py-0.5 rounded border"
          style={{
            borderColor: "var(--chat-border-strong, rgba(0,0,0,0.12))",
            color: "var(--chat-text-tertiary, #A1A1AA)",
            background: "var(--chat-bg-sidebar, #F4F4F5)",
          }}
        >
          ESC
        </kbd>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div
            className="flex items-center justify-center h-full text-[13px]"
            style={{ color: "var(--chat-text-tertiary, #A1A1AA)" }}
          >
            No results found
          </div>
        ) : (
          filtered.map((result) => (
            <div
              key={result.id}
              className="flex items-start gap-3 px-3 py-3 cursor-pointer transition-colors"
              style={{
                borderBottom: "1px solid var(--chat-border, rgba(0,0,0,0.06))",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--chat-bg-hover, rgba(0,0,0,0.03))"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
              }}
            >
              {/* Avatar */}
              <div
                className="flex items-center justify-center rounded-full text-[11px] font-semibold flex-shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  background: "var(--chat-bubble-incoming, #F4F4F5)",
                  color: "var(--chat-text-primary, #18181B)",
                }}
              >
                {result.sender
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="text-[13px] font-medium truncate"
                      style={{ color: "var(--chat-text-primary, #18181B)" }}
                    >
                      {result.sender}
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--chat-text-tertiary, #A1A1AA)" }}
                    >
                      in {result.conversation}
                    </span>
                  </div>
                  <span
                    className="text-[11px] flex-shrink-0"
                    style={{ color: "var(--chat-text-tertiary, #A1A1AA)" }}
                  >
                    {result.time}
                  </span>
                </div>
                <p
                  className="text-[13px] mt-0.5 truncate"
                  style={{ color: "var(--chat-text-secondary, #71717A)" }}
                >
                  {result.snippet}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  )
}

const searchDemoCode = `import { useState } from "react"
import { ChatSearch } from "@/components/ui/chat"
import type { SearchResult } from "@/components/ui/chat"

const allResults: SearchResult[] = [
  { messageId: "m1", conversationId: "c1", conversationName: "Design Team",
    senderName: "Alex Chen", snippet: "The PR is ready for review", timestamp: Date.now() - 60000 },
  { messageId: "m2", conversationId: "c2", conversationName: "General",
    senderName: "Sara Kim", snippet: "I reviewed it this morning", timestamp: Date.now() - 120000 },
  { messageId: "m3", conversationId: "c1", conversationName: "Design Team",
    senderName: "Alex Chen", snippet: "Token refresh is rewritten", timestamp: Date.now() - 180000 },
]

function SearchPanel() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  return (
    <ChatSearch
      onSearch={(query) =>
        allResults.filter((r) =>
          r.snippet.toLowerCase().includes(query.toLowerCase()) ||
          r.senderName.toLowerCase().includes(query.toLowerCase())
        )
      }
      onSelect={(result) => {
        console.log("Navigate to:", result.conversationId, result.messageId)
        setIsOpen(false)
      }}
      onClose={() => setIsOpen(false)}
    />
  )
}`

const basicUsageCode = `import { ChatSearch } from "@/components/ui/chat"

function SearchPanel() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ChatSearch
      onSearch={async (query) => {
        const res = await fetch(\`/api/search?q=\${query}\`)
        return res.json()
      }}
      onSelect={(result) => {
        navigateToMessage(result.conversationId, result.messageId)
        setIsOpen(false)
      }}
      onClose={() => setIsOpen(false)}
    />
  )
}`

const searchResultCode = `interface SearchResult {
  messageId: string
  conversationId?: string
  conversationName?: string
  senderName: string
  snippet: string       // matched text with highlights
  timestamp: Date | number
}`

const keyboardShortcutCode = `import { useEffect } from "react"

function App() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      {searchOpen && (
        <ChatSearch
          onSearch={handleSearch}
          onSelect={handleSelect}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  )
}`

export default function SearchPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Search</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        Command-palette style search across messages. The{" "}
        <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatSearch</code>{" "}
        component provides a full-text search overlay with keyboard navigation,
        highlighted snippets, and instant navigation to matched messages.
      </p>

      <div className="mt-6 mb-8">
        <PreviewTabs preview={<SearchDemo />} code={searchDemoCode} height={390} />
      </div>

      {/* Basic Usage */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Basic Usage</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatSearch</code>{" "}
          component takes three callback props:{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">onSearch</code>{" "}
          to fetch results,{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">onSelect</code>{" "}
          to handle a chosen result, and{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">onClose</code>{" "}
          to dismiss the overlay.
        </p>
        <div className="mt-4">
          <PreviewTabs
            preview={<BasicUsageDemo />}
            code={basicUsageCode}
            height={390}
          />
        </div>
      </div>

      {/* SearchResult Data Shape */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">SearchResult Data Shape</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">onSearch</code>{" "}
          callback should return an array of{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">SearchResult</code>{" "}
          objects. Each result contains enough context to display a preview and navigate to the
          original message.
        </p>
        <div className="mt-4">
          <PreviewTabs
            preview={
              <div className="h-full flex items-center justify-center p-6">
                <div className="w-full max-w-[360px] space-y-2">
                  {[
                    { sender: "Alex Chen", channel: "Design Team", snippet: "The new layout looks great!", time: "2:30 PM" },
                    { sender: "Sara Kim", channel: "General", snippet: "Meeting moved to Thursday", time: "11:15 AM" },
                  ].map((r) => (
                    <div key={r.sender} className="flex items-start gap-3 rounded-lg border px-3 py-2.5" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                      <div className="flex items-center justify-center rounded-full text-[10px] font-semibold flex-shrink-0" style={{ width: 28, height: 28, background: "#F4F4F5" }}>
                        {r.sender.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-medium text-[#18181B]">{r.sender}</span>
                          <span className="text-[10px] text-[#A1A1AA]">{r.time}</span>
                        </div>
                        <p className="text-[11px] text-[#71717A] truncate">{r.snippet}</p>
                        <span className="text-[10px] text-[#A1A1AA]">in {r.channel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
            code={searchResultCode}
            height={200}
            centered
          />
        </div>
      </div>

      {/* Keyboard Shortcut */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Keyboard Shortcut</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          By convention, use{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">Cmd+K</code>{" "}
          (macOS) /{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">Ctrl+K</code>{" "}
          (Windows/Linux) to open search, and{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">Escape</code>{" "}
          to close it. The component handles Escape internally, but you need to wire up the
          open shortcut yourself.
        </p>
        <div className="mt-4">
          <PreviewTabs
            preview={
              <div className="h-full flex items-center justify-center p-6">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <kbd className="inline-flex items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.12)] bg-[#F4F4F5] px-3 py-2 text-[14px] font-medium text-[#18181B] shadow-sm">
                      <span className="text-[16px]">&#8984;</span>K
                    </kbd>
                    <span className="text-[10px] text-[#A1A1AA]">macOS</span>
                  </div>
                  <span className="text-[14px] text-[#A1A1AA]">/</span>
                  <div className="flex flex-col items-center gap-1.5">
                    <kbd className="inline-flex items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.12)] bg-[#F4F4F5] px-3 py-2 text-[14px] font-medium text-[#18181B] shadow-sm">
                      Ctrl+K
                    </kbd>
                    <span className="text-[10px] text-[#A1A1AA]">Windows / Linux</span>
                  </div>
                </div>
              </div>
            }
            code={keyboardShortcutCode}
            height={140}
            centered
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/presence"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Presence
        </Link>
        <Link
          href="/docs/advanced"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Advanced &rarr;
        </Link>
      </div>
    </div>
  )
}
