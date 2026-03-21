"use client"

import {
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react"
import {
  isToday,
  isYesterday,
  format,
  isSameDay,
  differenceInSeconds,
} from "date-fns"
import type { ChatMessageData, MessageListItem, MessageGroup } from "./types"

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatDateLabel(date: Date): string {
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"
  const now = new Date()
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diffDays < 7) return format(date, "EEEE") // "Tuesday"
  if (date.getFullYear() === now.getFullYear())
    return format(date, "MMMM d") // "March 18"
  return format(date, "MMMM d, yyyy") // "March 18, 2026"
}

export function formatTimestamp(date: Date): string {
  return format(date, "h:mm a") // "10:42 AM"
}

// ─── Message grouping ─────────────────────────────────────────────────────────

export function groupMessages(
  messages: ChatMessageData[],
  currentUserId: string,
  intervalSeconds: number = 120
): MessageListItem[] {
  if (messages.length === 0) return []

  const items: MessageListItem[] = []
  let currentGroup: MessageGroup | null = null
  let lastDate: Date | null = null

  for (const msg of messages) {
    const msgDate = new Date(msg.timestamp)

    // System messages break groups
    if (msg.isSystem) {
      if (currentGroup) {
        items.push({ type: "group", group: currentGroup })
        currentGroup = null
      }

      // Insert date separator if needed
      if (!lastDate || !isSameDay(lastDate, msgDate)) {
        items.push({ type: "date", date: msgDate, label: formatDateLabel(msgDate) })
        lastDate = msgDate
      }

      items.push({ type: "system", message: msg })
      continue
    }

    // Insert date separator if needed
    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      if (currentGroup) {
        items.push({ type: "group", group: currentGroup })
        currentGroup = null
      }
      items.push({ type: "date", date: msgDate, label: formatDateLabel(msgDate) })
      lastDate = msgDate
    }

    // Check if message should continue the current group
    const shouldGroup =
      currentGroup &&
      currentGroup.senderId === msg.senderId &&
      currentGroup.messages.length > 0 &&
      differenceInSeconds(
        msgDate,
        new Date(
          currentGroup.messages[currentGroup.messages.length - 1].timestamp
        )
      ) <= intervalSeconds

    if (shouldGroup && currentGroup) {
      currentGroup.messages.push(msg)
    } else {
      if (currentGroup) {
        items.push({ type: "group", group: currentGroup })
      }
      currentGroup = {
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderAvatar: msg.senderAvatar,
        messages: [msg],
        isOutgoing: msg.senderId === currentUserId,
      }
    }
  }

  if (currentGroup) {
    items.push({ type: "group", group: currentGroup })
  }

  return items
}

// ─── Auto-scroll hook ─────────────────────────────────────────────────────────

export function useAutoScroll(
  messages: ChatMessageData[],
  opts?: { threshold?: number }
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [unseenCount, setUnseenCount] = useState(0)
  const prevLengthRef = useRef(messages.length)
  const threshold = opts?.threshold ?? 100

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const el = containerRef.current
      if (!el) return
      el.scrollTo({ top: el.scrollHeight, behavior })
      setUnseenCount(0)
    },
    []
  )

  // Track scroll position
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight
      const atBottom = distanceFromBottom <= threshold
      setIsAtBottom(atBottom)
      if (atBottom) setUnseenCount(0)
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [threshold])

  // Auto-scroll when new messages arrive and user is at bottom
  useEffect(() => {
    const newCount = messages.length - prevLengthRef.current
    prevLengthRef.current = messages.length

    if (newCount <= 0) return

    if (isAtBottom) {
      scrollToBottom("smooth")
    } else {
      setUnseenCount((c) => c + newCount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length])

  // Scroll to bottom on mount
  useEffect(() => {
    scrollToBottom("instant")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { containerRef, scrollToBottom, isAtBottom, unseenCount } as const
}

// ─── Auto-resize textarea hook ────────────────────────────────────────────────

export function useAutoResize(opts?: { maxRows?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const maxRows = opts?.maxRows ?? 6

  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    const lineHeight = parseInt(getComputedStyle(el).lineHeight) || 22
    const maxHeight = lineHeight * maxRows
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [maxRows])

  return { textareaRef, resize } as const
}

// ─── Typing indicator hook ────────────────────────────────────────────────────

export function useTypingIndicator(opts?: {
  onTypingChange?: (isTyping: boolean) => void
  debounceMs?: number
}) {
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const debounceMs = opts?.debounceMs ?? 2000

  const handleKeyDown = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
      opts?.onTypingChange?.(true)
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      opts?.onTypingChange?.(false)
    }, debounceMs)
  }, [isTyping, debounceMs, opts])

  const stopTyping = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsTyping(false)
    opts?.onTypingChange?.(false)
  }, [opts])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { isTyping, handleKeyDown, stopTyping } as const
}
