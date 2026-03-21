"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import {
  ChatProvider,
  ChatMessages,
  ChatComposer,
} from "@/components/ui/chat"
import type { ChatMessageData, ChatUser } from "@/components/ui/chat"
import { PreviewTabs } from "@/components/docs/preview-tabs"

const demoUser: ChatUser = { id: "user-1", name: "You", status: "online" }

function ComposerDemo() {
  const [messages, setMessages] = useState<ChatMessageData[]>(() => {
    const now = Date.now()
    return [
      {
        id: "comp-1",
        senderId: "user-2",
        senderName: "Alex",
        timestamp: now - 120_000,
        text: "Try typing a message below!",
        status: "read" as const,
      },
    ]
  })

  const [replyingTo, setReplyingTo] = useState<ChatMessageData | null>(null)

  const handleSend = useCallback(
    (text: string) => {
      const newMsg: ChatMessageData = {
        id: `msg-${Date.now()}`,
        senderId: "user-1",
        senderName: "You",
        timestamp: Date.now(),
        text,
        status: "sent" as const,
        replyTo: replyingTo
          ? { id: replyingTo.id, senderName: replyingTo.senderName, text: replyingTo.text || "" }
          : undefined,
      }
      setMessages((prev) => [...prev, newMsg])
      setReplyingTo(null)
    },
    [replyingTo]
  )

  return (
    <ChatProvider
      currentUser={demoUser}
      theme="lunar"
      onReply={(msg) => setReplyingTo(msg)}
      className="h-full flex flex-col"
    >
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
        <ChatComposer
          onSend={handleSend}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>
    </ChatProvider>
  )
}

function BasicUsageDemo() {
  const [messages, setMessages] = useState<ChatMessageData[]>(() => [])

  const handleSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        senderId: "user-1",
        senderName: "You",
        timestamp: Date.now(),
        text,
        status: "sent" as const,
      },
    ])
  }, [])

  return (
    <ChatProvider
      currentUser={demoUser}
      theme="lunar"
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--chat-bg-main)]">
        <ChatMessages messages={messages} />
        <ChatComposer onSend={handleSend} />
      </div>
    </ChatProvider>
  )
}

function AttachmentDemo() {
  return (
    <ChatProvider
      currentUser={demoUser}
      theme="lunar"
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="h-full flex flex-col justify-end bg-[var(--chat-bg-main)]">
        <ChatComposer
          onSend={() => {}}
          onFileUpload={(files) => {
            console.log("Files:", files)
          }}
          placeholder="Click the + button to see attachments..."
        />
      </div>
    </ChatProvider>
  )
}

function ReplyModeDemo() {
  const [replyingTo] = useState<ChatMessageData>(() => ({
    id: "reply-demo-1",
    senderId: "user-2",
    senderName: "Alex",
    timestamp: Date.now() - 60_000,
    text: "Should we migrate to the new API version?",
    status: "read" as const,
  }))
  const [dismissed, setDismissed] = useState(false)

  return (
    <ChatProvider
      currentUser={demoUser}
      theme="lunar"
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="h-full flex flex-col justify-end bg-[var(--chat-bg-main)]">
        <ChatComposer
          onSend={() => setDismissed(true)}
          replyingTo={dismissed ? null : replyingTo}
          onCancelReply={() => setDismissed(true)}
          placeholder="Type a reply..."
        />
      </div>
    </ChatProvider>
  )
}

function DragDropDemo() {
  return (
    <ChatProvider
      currentUser={demoUser}
      theme="lunar"
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="h-full flex flex-col justify-end bg-[var(--chat-bg-main)]">
        <ChatComposer
          onSend={() => {}}
          onFileUpload={(files) => {
            console.log("Dropped files:", files)
          }}
          placeholder="Try dragging a file here..."
        />
      </div>
    </ChatProvider>
  )
}

function AutoResizeDemo() {
  return (
    <ChatProvider
      currentUser={demoUser}
      theme="lunar"
      className="h-full flex flex-col"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="h-full flex flex-col justify-end bg-[var(--chat-bg-main)]">
        <ChatComposer
          onSend={() => {}}
          placeholder="Try typing multiple lines here..."
        />
      </div>
    </ChatProvider>
  )
}

const basicUsageCode = `"use client"

import { useState, useCallback } from "react"
import { ChatProvider, ChatMessages, ChatComposer } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

export function MyChat() {
  const [messages, setMessages] = useState<ChatMessageData[]>([])

  const handleSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        timestamp: Date.now(),
        text,
        status: "sent",
      },
    ])
  }, [])

  return (
    <ChatProvider currentUser={currentUser} theme="lunar">
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
        <ChatComposer onSend={handleSend} />
      </div>
    </ChatProvider>
  )
}`

const attachmentCode = `"use client"

import { useState, useCallback } from "react"
import { ChatProvider, ChatMessages, ChatComposer } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

export function ChatWithAttachments() {
  const [messages, setMessages] = useState<ChatMessageData[]>([])

  const handleSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        timestamp: Date.now(),
        text,
        status: "sent",
      },
    ])
  }, [])

  return (
    <ChatProvider currentUser={currentUser} theme="lunar">
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
        <ChatComposer
          onSend={handleSend}
          onFileUpload={(files) => {
            console.log("Files:", files)
          }}
        />
      </div>
    </ChatProvider>
  )
}`

const replyModeCode = `"use client"

import { useState, useCallback } from "react"
import { ChatProvider, ChatMessages, ChatComposer } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = { id: "user-1", name: "You" }

export function ChatWithReplies() {
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [replyingTo, setReplyingTo] = useState<ChatMessageData | null>(null)

  const handleSend = useCallback(
    (text: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          senderId: currentUser.id,
          senderName: currentUser.name,
          timestamp: Date.now(),
          text,
          status: "sent",
          replyTo: replyingTo
            ? { id: replyingTo.id, senderName: replyingTo.senderName, text: replyingTo.text || "" }
            : undefined,
        },
      ])
      setReplyingTo(null)
    },
    [replyingTo]
  )

  return (
    <ChatProvider
      currentUser={currentUser}
      theme="lunar"
      onReply={(msg) => setReplyingTo(msg)}
    >
      <div className="h-[500px] flex flex-col">
        <ChatMessages messages={messages} />
        <ChatComposer
          onSend={handleSend}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>
    </ChatProvider>
  )
}`

const dragDropCode = `// Drag-and-drop is built into ChatComposer.
// When a user drags files over the composer, a drop overlay appears.
// Dropped files show as previews with remove buttons before sending.
//
// Just provide an onFileUpload callback — no extra config needed.

import { ChatProvider, ChatComposer } from "@/components/ui/chat"

<ChatComposer
  onSend={handleSend}
  onFileUpload={(files: File[]) => {
    // files is an array of File objects from the drop event
    // Upload them to your server, or attach to the next message
    files.forEach((file) => {
      console.log(file.name, file.size, file.type)
    })
  }}
/>

// Also works with the + button menu (Photos, Files options)
// and with paste from clipboard`

const autoResizeCode = `// The composer textarea auto-resizes as you type.
// It starts at 1 line and grows up to a maximum height.
// This is built-in — no configuration needed.
//
// If you need auto-resize in a custom textarea, you can
// use the useAutoResize hook directly:

import { useRef } from "react"
import { useAutoResize } from "@/components/ui/chat"

export function CustomTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useAutoResize(textareaRef)

  return <textarea ref={textareaRef} className="w-full resize-none" />
}`

export default function ComposerPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Composer</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        The{" "}
        <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatComposer</code>{" "}
        component provides a full-featured message input with auto-resize, attachment menu,
        reply preview, and keyboard shortcuts.
      </p>

      {/* Live Demo */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Live Demo</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Try typing a message and pressing Enter to send. Right-click a message to reply to it.
        </p>
        <div className="border border-[rgba(0,0,0,0.10)] rounded-xl overflow-hidden" style={{ height: 380 }}>
          <ComposerDemo />
        </div>
      </div>

      {/* Basic Usage */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Basic Usage</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          At minimum, provide an{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">onSend</code>{" "}
          callback. The composer handles the input state internally.
        </p>
        <PreviewTabs preview={<BasicUsageDemo />} code={basicUsageCode} height={300} />
      </div>

      {/* Attachment Menu */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Attachment Menu</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The composer includes a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">+</code>{" "}
          button that opens a popout menu for attachments. Click it in the demo above to see it in action.
        </p>
        <PreviewTabs preview={<AttachmentDemo />} code={attachmentCode} height={200} />
      </div>

      {/* Drag & Drop */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Drag & Drop</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The composer has built-in drag-and-drop support. Drag any file over the input area and a
          drop overlay appears. Dropped files render as removable previews (with thumbnails for images)
          before the message is sent. This works alongside the{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">+</code>{" "}
          button menu and clipboard paste.
        </p>
        <PreviewTabs preview={<DragDropDemo />} code={dragDropCode} height={200} />
      </div>

      {/* Reply Mode */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Reply Mode</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          When replying to a message, the composer shows a preview of the quoted message above the input.
          The user can dismiss the reply with the X button.
        </p>
        <PreviewTabs preview={<ReplyModeDemo />} code={replyModeCode} height={220} />
      </div>

      {/* Auto-Resize */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Auto-Resize</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The textarea automatically grows as you type multi-line messages, up to a configurable max height.
          This behavior is built-in and requires no additional configuration.
        </p>
        <PreviewTabs preview={<AutoResizeDemo />} code={autoResizeCode} height={200} />
      </div>

      {/* Props Table */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Props</h2>
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
                ["onSend", "(text: string) => void", "Called when user sends a message"],
                ["replyingTo", "ChatMessageData | null", "Message being replied to (shows preview)"],
                ["onCancelReply", "() => void", "Called when reply is dismissed"],
                ["onFileUpload", "(files: File[]) => void", "Called when files are selected or dropped"],
                ["onTyping", "(isTyping: boolean) => void", "Called when typing state changes"],
                ["placeholder", "string", "Input placeholder text (default: 'Type a message...')"],
                ["onVoiceRecord", "() => void", "Called when mic button is clicked (shows mic icon when composer is empty)"],
                ["disabled", "boolean", "Disable the composer"],
              ].map(([prop, type, desc], i, arr) => (
                <tr key={prop} className={i < arr.length - 1 ? "border-b border-[rgba(0,0,0,0.04)]" : ""}>
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
          href="/docs/messages"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Messages
        </Link>
        <Link
          href="/docs/reactions"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Reactions &rarr;
        </Link>
      </div>
    </div>
  )
}
