"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  X,
  Search,
  Pin,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Trash2,
  Check,
} from "lucide-react"
import type { ChatMessageData } from "./types"
import { formatTimestamp } from "./hooks"

// ─── ChatForwardDialog ────────────────────────────────────────────────────────

interface Conversation {
  id: string
  title: string
  avatar?: string
}

interface ChatForwardDialogProps {
  message: ChatMessageData
  conversations: Conversation[]
  onForward: (targetIds: string[]) => void
  onCancel: () => void
  className?: string
}

function ChatForwardDialog({
  message,
  conversations,
  onForward,
  onCancel,
  className,
}: ChatForwardDialogProps) {
  const [query, setQuery] = React.useState("")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  )

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50", className)}>
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-[var(--chat-border-strong)] bg-[var(--chat-bg-sidebar)] shadow-[var(--chat-shadow-lg)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--chat-border)] px-4 py-3">
          <span className="text-[14px] font-semibold text-[var(--chat-text-primary)]">Forward message</span>
          <button onClick={onCancel} className="text-[var(--chat-text-tertiary)] hover:text-[var(--chat-text-primary)]">
            <X className="size-4" />
          </button>
        </div>

        {/* Preview */}
        <div className="border-b border-[var(--chat-border)] px-4 py-2">
          <span className="text-[12px] font-semibold text-[var(--chat-text-secondary)]">{message.senderName}</span>
          <p className="truncate text-[13px] text-[var(--chat-text-tertiary)]">{message.text}</p>
        </div>

        {/* Search */}
        <div className="border-b border-[var(--chat-border)] px-4 py-2">
          <div className="flex items-center gap-2 rounded-lg bg-[var(--chat-bg-main)] px-3 py-1.5">
            <Search className="size-3.5 text-[var(--chat-text-tertiary)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-[13px] text-[var(--chat-text-primary)] placeholder:text-[var(--chat-text-tertiary)] outline-none"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="max-h-60 overflow-y-auto">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                selected.has(c.id) ? "bg-[var(--chat-accent-soft)]" : "hover:bg-[var(--chat-accent-soft)]"
              )}
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-[var(--chat-bubble-incoming)] text-[11px] font-semibold text-[var(--chat-text-secondary)]">
                {c.title.charAt(0).toUpperCase()}
              </div>
              <span className="flex-1 text-[14px] text-[var(--chat-text-primary)]">{c.title}</span>
              {selected.has(c.id) && <Check className="size-4 text-[var(--chat-accent)]" />}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-[var(--chat-border)] px-4 py-3">
          <button onClick={onCancel} className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[var(--chat-text-secondary)] hover:bg-[var(--chat-accent-soft)]">
            Cancel
          </button>
          <button
            onClick={() => onForward(Array.from(selected))}
            disabled={selected.size === 0}
            className="rounded-lg bg-[var(--chat-accent)] px-3 py-1.5 text-[13px] font-medium text-white disabled:opacity-40"
          >
            Forward{selected.size > 0 ? ` (${selected.size})` : ""}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ChatEditComposer (inline edit mode) ──────────────────────────────────────

interface ChatEditComposerProps {
  message: ChatMessageData
  onSave: (messageId: string, newText: string) => void
  onCancel: () => void
  className?: string
}

function ChatEditComposer({
  message,
  onSave,
  onCancel,
  className,
}: ChatEditComposerProps) {
  const [value, setValue] = React.useState(message.text || "")

  return (
    <div className={cn("border-t border-[var(--chat-border)]", className)}>
      {/* Edit bar */}
      <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-1.5">
        <span className="text-[12px] font-semibold text-amber-500">Editing message</span>
        <button onClick={onCancel} className="ml-auto text-[12px] text-[var(--chat-text-secondary)] hover:text-[var(--chat-text-primary)]">
          Cancel
        </button>
      </div>
      <div className="flex items-end gap-2 bg-[var(--chat-bg-composer)] px-3 py-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSave(message.id, value.trim()) }
            if (e.key === "Escape") onCancel()
          }}
          rows={1}
          autoFocus
          className="flex-1 resize-none rounded-[20px] border border-[var(--chat-border)] bg-[var(--chat-bg-sidebar)] px-4 py-2 text-[15px] text-[var(--chat-text-primary)] outline-none"
        />
        <button
          onClick={() => onSave(message.id, value.trim())}
          disabled={!value.trim()}
          className="flex size-8 items-center justify-center rounded-full bg-[var(--chat-accent)] text-white disabled:opacity-40"
        >
          <Check className="size-4" />
        </button>
      </div>
    </div>
  )
}

// ─── ChatDeletedMessage (placeholder) ─────────────────────────────────────────

interface ChatDeletedMessageProps {
  deletedBy?: string
  className?: string
}

function ChatDeletedMessage({ deletedBy, className }: ChatDeletedMessageProps) {
  return (
    <div className={cn("my-2 flex justify-center", className)}>
      <span className="rounded-lg bg-[var(--chat-bg-sidebar)] px-3 py-1.5 text-[13px] italic text-[var(--chat-text-tertiary)]">
        <Trash2 className="mr-1.5 inline size-3" />
        {deletedBy ? `${deletedBy} deleted this message` : "This message was deleted"}
      </span>
    </div>
  )
}

// ─── ChatPinnedPanel ──────────────────────────────────────────────────────────

interface ChatPinnedPanelProps {
  pinnedMessages: ChatMessageData[]
  onUnpin: (messageId: string) => void
  onJumpTo: (messageId: string) => void
  onClose: () => void
  className?: string
}

function ChatPinnedPanel({
  pinnedMessages,
  onUnpin,
  onJumpTo,
  onClose,
  className,
}: ChatPinnedPanelProps) {
  return (
    <div className={cn("flex h-full w-80 flex-col border-l border-[var(--chat-border-strong)] bg-[var(--chat-bg-sidebar)]", className)}>
      <div className="flex items-center justify-between border-b border-[var(--chat-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Pin className="size-4 text-[var(--chat-orange)]" />
          <span className="text-[14px] font-semibold text-[var(--chat-text-primary)]">
            Pinned Messages ({pinnedMessages.length})
          </span>
        </div>
        <button onClick={onClose} className="text-[var(--chat-text-tertiary)] hover:text-[var(--chat-text-primary)]">
          <X className="size-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {pinnedMessages.map((msg) => (
          <div
            key={msg.id}
            className="border-b border-[var(--chat-border)] px-4 py-3 transition-colors hover:bg-[var(--chat-accent-soft)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[var(--chat-text-secondary)]">{msg.senderName}</span>
              <span className="text-[10px] text-[var(--chat-text-tertiary)]">
                {formatTimestamp(new Date(msg.timestamp))}
              </span>
            </div>
            <p className="mt-0.5 line-clamp-2 text-[13px] text-[var(--chat-text-primary)]">{msg.text}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <button onClick={() => onJumpTo(msg.id)} className="text-[11px] text-[var(--chat-accent)] hover:underline">
                Jump to message
              </button>
              <button onClick={() => onUnpin(msg.id)} className="text-[11px] text-[var(--chat-text-tertiary)] hover:text-[var(--chat-red)]">
                Unpin
              </button>
            </div>
          </div>
        ))}
        {pinnedMessages.length === 0 && (
          <div className="flex h-32 items-center justify-center text-[13px] text-[var(--chat-text-tertiary)]">
            No pinned messages
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ChatNestedThread ─────────────────────────────────────────────────────────

interface ThreadedMessage extends ChatMessageData {
  parentId: string | null
  children: ThreadedMessage[]
  depth: number
  votes?: number
  userVote?: "up" | "down" | null
  isCollapsed?: boolean
}

interface ChatNestedThreadProps {
  messages: ThreadedMessage[]
  maxDepth?: number
  onReply?: (parentId: string) => void
  onVote?: (messageId: string, direction: "up" | "down") => void
  showVotes?: boolean
  className?: string
}

function ChatNestedThread({
  messages,
  maxDepth = 5,
  onReply,
  onVote,
  showVotes = false,
  className,
}: ChatNestedThreadProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {messages.map((msg) => (
        <ThreadMessage
          key={msg.id}
          message={msg}
          maxDepth={maxDepth}
          onReply={onReply}
          onVote={onVote}
          showVotes={showVotes}
        />
      ))}
    </div>
  )
}

function ThreadMessage({
  message,
  maxDepth,
  onReply,
  onVote,
  showVotes,
}: {
  message: ThreadedMessage
  maxDepth: number
  onReply?: (parentId: string) => void
  onVote?: (messageId: string, direction: "up" | "down") => void
  showVotes: boolean
}) {
  const [collapsed, setCollapsed] = React.useState(message.isCollapsed ?? false)
  const atMaxDepth = message.depth >= maxDepth

  return (
    <div style={{ paddingLeft: Math.min(message.depth, maxDepth) * 24 }}>
      <div className="group flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--chat-accent-soft)]">
        {/* Thread connector line */}
        {message.depth > 0 && (
          <div className="mt-1 h-full w-0.5 shrink-0 bg-[var(--chat-border)]" />
        )}

        {/* Vote buttons */}
        {showVotes && (
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            <button
              onClick={() => onVote?.(message.id, "up")}
              className={cn("size-5 rounded text-[var(--chat-text-tertiary)] hover:text-[var(--chat-accent)]", message.userVote === "up" && "text-[var(--chat-accent)]")}
            >
              <ArrowUp className="size-3.5 mx-auto" />
            </button>
            <span className="text-[11px] font-semibold tabular-nums text-[var(--chat-text-secondary)]">
              {message.votes ?? 0}
            </span>
            <button
              onClick={() => onVote?.(message.id, "down")}
              className={cn("size-5 rounded text-[var(--chat-text-tertiary)] hover:text-[var(--chat-red)]", message.userVote === "down" && "text-[var(--chat-red)]")}
            >
              <ArrowDown className="size-3.5 mx-auto" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[var(--chat-text-primary)]">{message.senderName}</span>
            <span className="text-[11px] text-[var(--chat-text-tertiary)]">
              {formatTimestamp(new Date(message.timestamp))}
            </span>
          </div>
          <p className="text-[14px] leading-relaxed text-[var(--chat-text-primary)]">{message.text}</p>
          <div className="mt-1 flex items-center gap-3">
            {!atMaxDepth && (
              <button onClick={() => onReply?.(message.id)} className="text-[11px] font-medium text-[var(--chat-text-secondary)] hover:text-[var(--chat-accent)]">
                Reply
              </button>
            )}
            {message.children.length > 0 && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center gap-0.5 text-[11px] font-medium text-[var(--chat-text-secondary)] hover:text-[var(--chat-text-primary)]"
              >
                {collapsed ? <ChevronRight className="size-3" /> : <ChevronDown className="size-3" />}
                {message.children.length} {message.children.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {!collapsed && message.children.length > 0 && (
        <div className="border-l-2 border-[var(--chat-border)] ml-3">
          {message.children.map((child) => (
            <ThreadMessage
              key={child.id}
              message={child}
              maxDepth={maxDepth}
              onReply={onReply}
              onVote={onVote}
              showVotes={showVotes}
            />
          ))}
        </div>
      )}

      {atMaxDepth && message.children.length > 0 && (
        <button className="ml-6 mt-1 text-[11px] text-[var(--chat-accent)] hover:underline">
          Continue thread \u2192
        </button>
      )}
    </div>
  )
}

// ─── ChatSearch ───────────────────────────────────────────────────────────────

interface SearchResult {
  messageId: string
  conversationId?: string
  conversationName?: string
  senderName: string
  snippet: string
  timestamp: Date | number
}

interface ChatSearchProps {
  onSearch: (query: string) => SearchResult[] | Promise<SearchResult[]>
  onSelect: (result: SearchResult) => void
  onClose: () => void
  className?: string
}

function ChatSearch({ onSearch, onSelect, onClose, className }: ChatSearchProps) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timeout = setTimeout(async () => {
      const r = await onSearch(query)
      setResults(r)
    }, 200)
    return () => clearTimeout(timeout)
  }, [query, onSearch])

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div className={cn("fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50", className)}>
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[var(--chat-border-strong)] bg-[var(--chat-bg-sidebar)] shadow-[var(--chat-shadow-lg)]">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--chat-border)] px-4 py-3">
          <Search className="size-4 text-[var(--chat-text-tertiary)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 bg-transparent text-[15px] text-[var(--chat-text-primary)] placeholder:text-[var(--chat-text-tertiary)] outline-none"
          />
          <kbd className="rounded border border-[var(--chat-border)] px-1.5 py-0.5 text-[10px] text-[var(--chat-text-tertiary)]">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.messageId}
              onClick={() => { onSelect(r); onClose() }}
              className="flex w-full flex-col gap-0.5 border-b border-[var(--chat-border)] px-4 py-2.5 text-left transition-colors hover:bg-[var(--chat-accent-soft)]"
            >
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[var(--chat-text-primary)]">{r.senderName}</span>
                {r.conversationName && (
                  <span className="text-[11px] text-[var(--chat-text-tertiary)]">in {r.conversationName}</span>
                )}
                <span className="ml-auto text-[11px] text-[var(--chat-text-tertiary)]">
                  {formatTimestamp(new Date(r.timestamp))}
                </span>
              </div>
              <p className="truncate text-[13px] text-[var(--chat-text-secondary)]">{r.snippet}</p>
            </button>
          ))}
          {query.trim() && results.length === 0 && (
            <div className="flex h-20 items-center justify-center text-[13px] text-[var(--chat-text-tertiary)]">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  ChatForwardDialog,
  ChatEditComposer,
  ChatDeletedMessage,
  ChatPinnedPanel,
  ChatNestedThread,
  ChatSearch,
}
export type {
  Conversation,
  ChatForwardDialogProps,
  ChatEditComposerProps,
  ChatDeletedMessageProps,
  ChatPinnedPanelProps,
  ThreadedMessage,
  ChatNestedThreadProps,
  SearchResult,
  ChatSearchProps,
}
