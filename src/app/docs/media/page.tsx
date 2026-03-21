"use client"

import Link from "next/link"
import { PreviewTabs } from "@/components/docs/preview-tabs"
import {
  Play,
  Download,
  FileText,
  Copy,
  ExternalLink,
  Camera,
  Image,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Mock Visual Previews                                               */
/* ------------------------------------------------------------------ */

function ImageMessagePreview() {
  return (
    <div data-chat-theme="lunar" className="flex justify-start w-full max-w-[380px]">
      <div
        className="rounded-2xl rounded-tl-md px-3 py-2.5 max-w-[340px]"
        style={{ background: "var(--chat-bubble-incoming)", color: "var(--chat-text-primary)" }}
      >
        <div className="w-[320px] h-[200px] rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center mb-2">
          <Camera className="w-10 h-10 text-white/70" />
        </div>
        <p className="text-[14px] leading-relaxed">Check out this view!</p>
        <p className="text-[11px] mt-1 opacity-50">2:34 PM</p>
      </div>
    </div>
  )
}

function ImageGalleryPreview() {
  const gradients = [
    "from-rose-400 to-orange-400",
    "from-cyan-400 to-blue-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-yellow-500",
  ]
  return (
    <div data-chat-theme="lunar" className="flex justify-start w-full max-w-[380px]">
      <div
        className="rounded-2xl rounded-tl-md px-3 py-2.5 max-w-[340px]"
        style={{ background: "var(--chat-bubble-incoming)", color: "var(--chat-text-primary)" }}
      >
        <div className="grid grid-cols-2 gap-1.5 w-[320px]">
          {gradients.map((g, i) => (
            <div
              key={i}
              className={`relative h-[96px] rounded-lg bg-gradient-to-br ${g} flex items-center justify-center`}
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image className="w-6 h-6 text-white/60" />
              {i === 3 && (
                <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">+2</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-[14px] mt-2 leading-relaxed">Photos from the trip</p>
        <p className="text-[11px] mt-1 opacity-50">3:12 PM</p>
      </div>
    </div>
  )
}

function FileAttachmentPreview() {
  const files = [
    { name: "quarterly-report.pdf", size: "2.4 MB" },
    { name: "budget-summary.xlsx", size: "890 KB" },
  ]
  return (
    <div data-chat-theme="lunar" className="flex flex-col gap-2 w-full max-w-[380px]">
      {files.map((f, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border px-4 py-3"
          style={{
            background: "var(--chat-bg-sidebar)",
            borderColor: "var(--chat-border-strong)",
            color: "var(--chat-text-primary)",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--chat-accent-soft)" }}
          >
            <FileText className="w-5 h-5" style={{ color: "var(--chat-accent)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium truncate">{f.name}</p>
            <p className="text-[12px] opacity-50">{f.size}</p>
          </div>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
            style={{ background: "var(--chat-accent-soft)" }}
          >
            <Download className="w-4 h-4" style={{ color: "var(--chat-accent)" }} />
          </button>
        </div>
      ))}
    </div>
  )
}

function VoiceMessagePreview() {
  const bars = [0.3, 0.5, 0.8, 0.6, 0.4, 0.9, 0.7, 0.5, 0.3, 0.6, 0.8, 0.4, 0.7, 0.5, 0.3, 0.6, 0.9, 0.4, 0.5, 0.3, 0.7, 0.6, 0.4, 0.8, 0.5]
  return (
    <div data-chat-theme="lunar" className="flex justify-start w-full max-w-[340px]">
      <div
        className="rounded-2xl rounded-tl-md px-3 py-3 w-[280px] flex items-center gap-3"
        style={{ background: "var(--chat-bubble-incoming)", color: "var(--chat-text-primary)" }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--chat-accent)" }}
        >
          <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
        </div>
        <div className="flex-1 flex items-center gap-[2px] h-8">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full"
              style={{
                height: `${h * 100}%`,
                background: "var(--chat-accent)",
                opacity: 0.6 + h * 0.4,
              }}
            />
          ))}
        </div>
        <span className="text-[12px] shrink-0 opacity-60 tabular-nums">0:42</span>
      </div>
    </div>
  )
}

function CodeBlockPreview() {
  const codeLines = [
    { text: "export function debounce<T extends (...args: any[]) => void>(", color: "#93C5FD" },
    { text: "  fn: T,", color: "#E5E7EB" },
    { text: "  delay: number", color: "#E5E7EB" },
    { text: "): T {", color: "#93C5FD" },
    { text: "  let timer: ReturnType<typeof setTimeout>", color: "#FDE68A" },
    { text: "  return ((...args) => {", color: "#E5E7EB" },
    { text: "    clearTimeout(timer)", color: "#A5B4FC" },
    { text: "    timer = setTimeout(() => fn(...args), delay)", color: "#A5B4FC" },
    { text: "  }) as T", color: "#E5E7EB" },
    { text: "}", color: "#93C5FD" },
  ]
  return (
    <div data-chat-theme="lunar" className="flex justify-start w-full max-w-[440px]">
      <div
        className="rounded-2xl rounded-tl-md overflow-hidden max-w-[420px] w-full"
        style={{ background: "var(--chat-bubble-incoming)", color: "var(--chat-text-primary)" }}
      >
        <div className="px-3 pt-2.5 pb-1.5">
          <p className="text-[14px]">Here&apos;s the fix:</p>
        </div>
        <div className="relative rounded-xl mx-2 mb-2 overflow-hidden" style={{ background: "#18181B" }}>
          <div className="flex items-center justify-between px-3 pt-2 pb-1">
            <span className="text-[11px] font-medium text-zinc-500">typescript</span>
            <button className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/10 transition-colors">
              <Copy className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
          <pre className="px-3 pb-3 text-[13px] leading-relaxed overflow-x-auto" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
            <code>
              {codeLines.map((line, i) => (
                <div key={i} style={{ color: line.color }}>{line.text}</div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function LinkPreviewCardPreview() {
  return (
    <div data-chat-theme="lunar" className="flex justify-start w-full max-w-[380px]">
      <div
        className="rounded-2xl rounded-tl-md px-3 py-2.5 max-w-[360px]"
        style={{ background: "var(--chat-bubble-incoming)", color: "var(--chat-text-primary)" }}
      >
        <p className="text-[14px] mb-2">Have you seen this?</p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: "var(--chat-bg-sidebar)", borderColor: "var(--chat-border-strong)" }}
        >
          <div className="w-full aspect-video bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <ExternalLink className="w-8 h-8 text-white/50" />
          </div>
          <div className="px-3 py-2.5">
            <p className="text-[11px] opacity-50 mb-0.5">example.com</p>
            <p className="text-[14px] font-semibold leading-snug">Building Modern Chat UIs</p>
            <p className="text-[12px] opacity-60 leading-relaxed mt-1">
              A comprehensive guide to real-time messaging interfaces, covering WebSocket patterns, optimistic updates, and accessible design.
            </p>
          </div>
        </div>
        <p className="text-[11px] mt-1.5 opacity-50">4:05 PM</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Code strings for the Code tab                                      */
/* ------------------------------------------------------------------ */

const imageMessageCode = `const message: ChatMessageData = {
  id: "1",
  senderId: "user-2",
  senderName: "Alice",
  timestamp: Date.now(),
  text: "Check out this view!",
  images: [
    {
      url: "/uploads/landscape.jpg",
      width: 1200,
      height: 800,
      alt: "Mountain landscape at sunset",
    },
  ],
}`

const imageGalleryCode = `const message: ChatMessageData = {
  id: "2",
  senderId: "user-2",
  senderName: "Alice",
  timestamp: Date.now(),
  text: "Photos from the trip",
  images: [
    { url: "/uploads/photo1.jpg", width: 600, height: 400, alt: "Beach" },
    { url: "/uploads/photo2.jpg", width: 600, height: 400, alt: "Sunset" },
    { url: "/uploads/photo3.jpg", width: 600, height: 400, alt: "Mountains" },
    { url: "/uploads/photo4.jpg", width: 600, height: 400, alt: "Forest" },
    { url: "/uploads/photo5.jpg", width: 600, height: 400, alt: "Lake" },
    { url: "/uploads/photo6.jpg", width: 600, height: 400, alt: "River" },
  ],
}`

const fileAttachmentCode = `const message: ChatMessageData = {
  id: "3",
  senderId: "user-1",
  senderName: "You",
  timestamp: Date.now(),
  text: "Here are the documents",
  files: [
    {
      name: "quarterly-report.pdf",
      size: 2516582,     // bytes — formatted automatically
      type: "application/pdf",
      url: "/uploads/quarterly-report.pdf",
    },
    {
      name: "budget-summary.xlsx",
      size: 911360,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      url: "/uploads/budget-summary.xlsx",
    },
  ],
}`

const voiceMessageCode = `const message: ChatMessageData = {
  id: "4",
  senderId: "user-2",
  senderName: "Alice",
  timestamp: Date.now(),
  voice: {
    url: "/uploads/voice-memo.webm",
    duration: 42,          // seconds
    waveform: [
      0.3, 0.5, 0.8, 0.6, 0.4, 0.9, 0.7, 0.5,
      0.3, 0.6, 0.8, 0.4, 0.7, 0.5, 0.3, 0.6,
      0.9, 0.4, 0.5, 0.3, 0.7, 0.6, 0.4, 0.8, 0.5,
    ],
  },
}`

const codeBlockCodeStr = `const message: ChatMessageData = {
  id: "5",
  senderId: "user-1",
  senderName: "You",
  timestamp: Date.now(),
  text: "Here's the fix:",
  code: {
    language: "typescript",
    code: \`export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}\`,
  },
}`

const linkPreviewCode = `const message: ChatMessageData = {
  id: "6",
  senderId: "user-2",
  senderName: "Alice",
  timestamp: Date.now(),
  text: "Have you seen this?",
  linkPreview: {
    url: "https://example.com/article",
    title: "Building Modern Chat UIs",
    description:
      "A comprehensive guide to real-time messaging interfaces, covering WebSocket patterns, optimistic updates, and accessible design.",
    image: "https://example.com/og-image.png",
  },
}`

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function MediaPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Media</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        Rich content in messages -- images, files, voice messages, code blocks, and link previews.
        Each media type is an optional prop on{" "}
        <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatMessageData</code>{" "}
        and renders automatically when present. Below are visual previews of each type.
      </p>

      {/* ---- Image Message ---- */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Image Message</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Attach a single image to a message using the{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">images</code>{" "}
          array. The image displays inline inside the message bubble with rounded corners and the text below.
        </p>
        <PreviewTabs preview={<ImageMessagePreview />} code={imageMessageCode} height={360} centered />
      </div>

      {/* ---- Image Gallery ---- */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Image Gallery</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          When multiple images are attached, they render in a grid layout. If there are more images
          than fit in the grid, the last cell shows a &quot;+N&quot; overlay indicating how many
          additional photos are available.
        </p>
        <PreviewTabs preview={<ImageGalleryPreview />} code={imageGalleryCode} height={340} centered />
      </div>

      {/* ---- File Attachments ---- */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">File Attachments</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">files</code>{" "}
          prop renders downloadable file cards showing the file name, formatted size, and a download button.
          Multiple files stack vertically.
        </p>
        <PreviewTabs preview={<FileAttachmentPreview />} code={fileAttachmentCode} height={220} centered />
      </div>

      {/* ---- Voice Message ---- */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Voice Message</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">voice</code>{" "}
          prop renders an audio player with a waveform visualization, a play button, and the duration.
          Provide a{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">waveform</code>{" "}
          array of normalized amplitudes (0 to 1) for the bar visualization.
        </p>
        <PreviewTabs preview={<VoiceMessagePreview />} code={voiceMessageCode} height={160} centered />
      </div>

      {/* ---- Code Block ---- */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Code Block</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">code</code>{" "}
          prop renders a syntax-highlighted code block with a language label and copy button.
          The block uses a dark background with monospace font and appears inside the message bubble.
        </p>
        <PreviewTabs preview={<CodeBlockPreview />} code={codeBlockCodeStr} height={380} centered />
      </div>

      {/* ---- Link Preview ---- */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Link Preview</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">linkPreview</code>{" "}
          prop renders an Open Graph-style card below the message text, showing the OG image, domain, title, and description.
        </p>
        <PreviewTabs preview={<LinkPreviewCardPreview />} code={linkPreviewCode} height={420} centered />
      </div>

      {/* ---- Navigation ---- */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/conversations"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Conversations
        </Link>
        <Link
          href="/docs/presence"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Presence &rarr;
        </Link>
      </div>
    </div>
  )
}
