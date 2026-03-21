"use client"

import Link from "next/link"
import { useState } from "react"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="absolute right-3 top-3 rounded-md bg-[rgba(255,255,255,0.1)] px-2 py-1 text-[11px] font-medium text-[#A1A1AA] transition-colors hover:bg-[rgba(255,255,255,0.15)] hover:text-[#FAFAFA]"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  )
}

const installCmd = `npx shadcn@latest add https://raw.githubusercontent.com/leonickson1/chatcn/main/public/r/chat.json`

const quickStartCode = `import {
  ChatProvider,
  ChatMessages,
  ChatComposer,
} from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const currentUser: ChatUser = {
  id: "user-1",
  name: "You",
  status: "online",
}

const messages: ChatMessageData[] = [
  {
    id: "1",
    senderId: "user-2",
    senderName: "Alice",
    text: "Hey! How are you?",
    timestamp: Date.now() - 60000,
    status: "read",
  },
  {
    id: "2",
    senderId: "user-1",
    senderName: "You",
    text: "Doing great! Working on the new chat UI.",
    timestamp: Date.now() - 30000,
    status: "delivered",
  },
]

export default function MyChatPage() {
  return (
    <ChatProvider currentUser={currentUser} theme="lunar">
      <div className="flex h-screen flex-col">
        <ChatMessages messages={messages} />
        <ChatComposer onSend={(text) => console.log(text)} />
      </div>
    </ChatProvider>
  )
}`

const tailwindConfigCode = `/* app/globals.css */
/* Tailwind CSS v4 uses CSS-based configuration. */
/* The chatcn installer automatically adds theme   */
/* variables to your globals.css. No tailwind.config needed. */

@import "tailwindcss";

/* chatcn theme variables are injected below this line */`

export default function InstallationPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Installation</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        Get chatcn up and running in your Next.js project in under a minute.
      </p>

      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Prerequisites</h2>
        <ul className="list-disc pl-6 space-y-2 text-[15px] text-[#71717A] leading-relaxed mb-4">
          <li>
            <strong className="text-[#18181B]">Next.js 14+</strong> with App Router
          </li>
          <li>
            <strong className="text-[#18181B]">React 18+</strong>
          </li>
          <li>
            <strong className="text-[#18181B]">Tailwind CSS 4+</strong> configured in your project
          </li>
          <li>
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">shadcn/ui</code>{" "}
            initialized (chatcn builds on top of it)
          </li>
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Install</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Run the init command to set up chatcn in your project. This installs the chat components,
          theme CSS variables, and required dependencies.
        </p>
        <CodeBlock code={installCmd} />
      </div>

      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Project Structure</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          After installation, your project will have these new files:
        </p>
        <CodeBlock
          code={`src/
  components/
    ui/
      chat/
        chat.tsx          # Core chat components
        features.tsx      # Extended features
        layouts.tsx       # Pre-built layout blocks
        hooks.ts          # Utility hooks
        types.ts          # TypeScript types
        security.ts       # Sanitization utilities
        index.ts          # Barrel exports
  app/
    globals.css           # Theme CSS variables added here`}
        />
      </div>

      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Quick Start</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Here is a minimal example to get a working chat interface. Wrap your page with{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatProvider</code>,
          then use{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatMessages</code>{" "}
          and{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatComposer</code>.
        </p>
        <CodeBlock code={quickStartCode} />
      </div>

      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Tailwind Configuration</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          chatcn uses Tailwind CSS v4 for styling. Tailwind v4 uses CSS-based configuration &mdash;
          no <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">tailwind.config.ts</code>{" "}
          needed. The installer adds theme variables to your globals.css automatically:
        </p>
        <CodeBlock code={tailwindConfigCode} />
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Introduction
        </Link>
        <Link
          href="/docs/theming"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Theming &rarr;
        </Link>
      </div>
    </div>
  )
}
