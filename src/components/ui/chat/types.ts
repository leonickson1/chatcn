export interface ChatUser {
  id: string
  name: string
  avatar?: string
  status?: "online" | "away" | "dnd" | "offline"
}

export interface ChatMessageData {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string

  // Content
  text?: string
  images?: { url: string; width: number; height: number; alt?: string }[]
  files?: { name: string; size: number; type: string; url: string }[]
  voice?: { url: string; duration: number; waveform: number[] }
  linkPreview?: {
    url: string
    title: string
    description: string
    image?: string
  }
  code?: { language: string; code: string }

  // Metadata
  timestamp: Date | number
  status?: "sending" | "sent" | "delivered" | "read" | "failed"
  replyTo?: { id: string; senderName: string; text: string }
  reactions?: { emoji: string; userIds: string[]; count: number }[]
  isEdited?: boolean
  isPinned?: boolean
  isSystem?: boolean
  systemEvent?: string

  // Read receipts (group chat) — list of users who have read up to this message
  readBy?: { userId: string; name: string; avatar?: string }[]
}

export interface ChatConfig {
  currentUser: ChatUser
  dateFormat?: "relative" | "absolute" | "time-only"
  messageGroupingInterval?: number // seconds, default 120

  // Callbacks
  onReactionAdd?: (messageId: string, emoji: string) => void
  onReactionRemove?: (messageId: string, emoji: string) => void
  onReply?: (message: ChatMessageData) => void
  onEdit?: (message: ChatMessageData) => void
  onDelete?: (messageId: string) => void
  onPin?: (messageId: string) => void
}

/** A group of consecutive messages from the same sender within the grouping interval */
export interface MessageGroup {
  senderId: string
  senderName: string
  senderAvatar?: string
  messages: ChatMessageData[]
  isOutgoing: boolean
}

/** Items that can appear in the message list */
export type MessageListItem =
  | { type: "group"; group: MessageGroup }
  | { type: "date"; date: Date; label: string }
  | { type: "system"; message: ChatMessageData }

/** Typing state for one or more users */
export interface TypingUser {
  id: string
  name: string
  avatar?: string
}

/** Available built-in themes */
export type ChatTheme = "lunar" | "aurora" | "ember" | "midnight"
