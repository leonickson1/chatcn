"use client"

import { useState } from "react"
import Link from "next/link"
import type { ChatTheme } from "@/components/ui/chat"

const themes: ChatTheme[] = ["lunar", "aurora", "ember", "midnight"]

const themeDescriptions: Record<ChatTheme, string> = {
  lunar: "Calm midnight workspace. Indigo accent with Zinc neutrals.",
  aurora: "Soft morning light. Teal accent with warm ivory tones.",
  ember: "Dense and fast. Orange accent with flat Slate design.",
  midnight: "True OLED black. Blue accent, pure void aesthetic.",
}

const cssVariables = [
  { variable: "--chat-bg-app", description: "Application background" },
  { variable: "--chat-bg-sidebar", description: "Sidebar / secondary surface" },
  { variable: "--chat-bg-main", description: "Main content area background" },
  { variable: "--chat-bg-header", description: "Header background (supports frosted glass)" },
  { variable: "--chat-bg-composer", description: "Composer area background" },
  { variable: "--chat-bubble-outgoing", description: "Outgoing message bubble color" },
  { variable: "--chat-bubble-outgoing-text", description: "Outgoing message text color" },
  { variable: "--chat-bubble-incoming", description: "Incoming message bubble color" },
  { variable: "--chat-bubble-incoming-text", description: "Incoming message text color" },
  { variable: "--chat-accent", description: "Primary accent color (links, buttons, active states)" },
  { variable: "--chat-accent-soft", description: "Soft accent (hover backgrounds, highlights)" },
  { variable: "--chat-green", description: "Online status / success" },
  { variable: "--chat-orange", description: "Away status / warning" },
  { variable: "--chat-red", description: "Error / destructive actions" },
  { variable: "--chat-text-primary", description: "Primary text color" },
  { variable: "--chat-text-secondary", description: "Secondary text (subtitles, metadata)" },
  { variable: "--chat-text-tertiary", description: "Tertiary text (placeholders, hints)" },
  { variable: "--chat-border", description: "Subtle border color" },
  { variable: "--chat-border-strong", description: "Visible border color" },
  { variable: "--chat-bubble-radius", description: "Border radius for message bubbles" },
  { variable: "--chat-bubble-radius-grouped", description: "Corner radius for grouped messages" },
  { variable: "--chat-input-radius", description: "Border radius for composer input" },
  { variable: "--chat-spacing-messages", description: "Vertical gap between message groups" },
  { variable: "--chat-spacing-grouped", description: "Vertical gap within grouped messages" },
  { variable: "--chat-shadow-sm", description: "Small shadow (subtle elevation)" },
  { variable: "--chat-shadow-md", description: "Medium shadow (cards, popovers)" },
  { variable: "--chat-shadow-lg", description: "Large shadow (modals, overlays)" },
  { variable: "--chat-shadow-toolbar", description: "Toolbar shadow on hover" },
  { variable: "--chat-ease", description: "Default easing curve for animations" },
  { variable: "--chat-duration-fast", description: "Fast animation duration" },
  { variable: "--chat-duration-normal", description: "Normal animation duration" },
]

const customThemeCode = `/* Add to your globals.css */
[data-chat-theme="custom"] {
  --chat-bg-app:              #F8F9FA;
  --chat-bg-sidebar:          #FFFFFF;
  --chat-bg-main:             #FFFFFF;
  --chat-bg-header:           rgba(255, 255, 255, 0.80);
  --chat-bg-composer:         rgba(255, 255, 255, 0.85);

  --chat-bubble-outgoing:     #7C3AED;
  --chat-bubble-outgoing-text: #FFFFFF;
  --chat-bubble-incoming:     #F3F4F6;
  --chat-bubble-incoming-text: #111827;

  --chat-accent:              #7C3AED;
  --chat-accent-soft:         rgba(124, 58, 237, 0.08);
  --chat-green:               #10B981;
  --chat-orange:              #F59E0B;
  --chat-red:                 #EF4444;

  --chat-text-primary:        #111827;
  --chat-text-secondary:      #6B7280;
  --chat-text-tertiary:       #9CA3AF;
  --chat-border:              rgba(0, 0, 0, 0.06);
  --chat-border-strong:       rgba(0, 0, 0, 0.12);

  --chat-bubble-radius:       16px;
  --chat-input-radius:        24px;
  --chat-spacing-messages:    14px;
}`

const customOverrideCode = `import { ChatProvider, ChatMessages } from "@/components/ui/chat"

// Override specific CSS variables via the style prop
<ChatProvider
  currentUser={currentUser}
  theme="lunar"
  style={{
    "--chat-accent": "#8B5CF6",
    "--chat-accent-soft": "rgba(139, 92, 246, 0.08)",
  } as React.CSSProperties}
>
  <ChatMessages messages={messages} />
</ChatProvider>`

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

export default function ThemingPage() {
  const [activeTheme, setActiveTheme] = useState<ChatTheme>("lunar")

  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Theming</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        chatcn ships with 4 built-in themes. Each theme defines a complete set of CSS variables that
        control every visual aspect of the chat interface.
      </p>

      {/* Theme Comparison Demo */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Theme Comparison</h2>
        <div className="flex gap-1 mb-4 rounded-lg border border-[rgba(0,0,0,0.10)] bg-[#F4F4F5] p-1 w-fit">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTheme(t)}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                activeTheme === t
                  ? "bg-white text-[#18181B] shadow-sm"
                  : "text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <p className="text-[13px] text-[#71717A] mb-3">{themeDescriptions[activeTheme]}</p>

        <div className="rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/5 p-6">
          <p className="text-[15px] text-[#18181B]">
            <strong>See all themes in action</strong> — Visit the{" "}
            <Link href="/" className="text-[#6366F1] font-medium hover:underline">homepage</Link>{" "}
            to try the interactive theme comparison with the full messenger and AI chat demos.
          </p>
        </div>
      </div>

      {/* Usage */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Usage</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Set the theme via the{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">theme</code>{" "}
          prop on{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatProvider</code>:
        </p>
        <CodeBlock code={`import { ChatProvider, ChatMessages, ChatComposer } from "@/components/ui/chat"
import type { ChatUser, ChatMessageData } from "@/components/ui/chat"

const user: ChatUser = { id: "user-1", name: "You", status: "online" }

<ChatProvider
  currentUser={user}
  theme="aurora"
  style={{ height: "100%", display: "flex", flexDirection: "column" }}
>
  <div className="flex-1 flex flex-col bg-[var(--chat-bg-main)]">
    <ChatMessages messages={messages} />
    <ChatComposer onSend={(text) => console.log(text)} />
  </div>
</ChatProvider>`} />
      </div>

      {/* Theme Comparison Table */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Theme Properties</h2>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Property</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Lunar</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Aurora</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Ember</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Midnight</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Accent</td>
                <td className="px-4 py-2.5">Indigo</td>
                <td className="px-4 py-2.5">Teal</td>
                <td className="px-4 py-2.5">Orange</td>
                <td className="px-4 py-2.5">Blue</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Mood</td>
                <td className="px-4 py-2.5">Calm workspace</td>
                <td className="px-4 py-2.5">Soft morning</td>
                <td className="px-4 py-2.5">Dense & fast</td>
                <td className="px-4 py-2.5">OLED void</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Bubble Style</td>
                <td className="px-4 py-2.5">Filled (indigo)</td>
                <td className="px-4 py-2.5">Outlined (teal wash)</td>
                <td className="px-4 py-2.5">Flat + left border</td>
                <td className="px-4 py-2.5">Transparent</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Bubble Radius</td>
                <td className="px-4 py-2.5">14px</td>
                <td className="px-4 py-2.5">18px</td>
                <td className="px-4 py-2.5">0px</td>
                <td className="px-4 py-2.5">16px</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Shadows</td>
                <td className="px-4 py-2.5">Subtle</td>
                <td className="px-4 py-2.5">Warm</td>
                <td className="px-4 py-2.5">None</td>
                <td className="px-4 py-2.5">None</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Dark Mode</td>
                <td className="px-4 py-2.5">Yes</td>
                <td className="px-4 py-2.5">Yes</td>
                <td className="px-4 py-2.5">Yes</td>
                <td className="px-4 py-2.5">Dark only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Theme */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Custom Themes</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Create your own theme by defining a new{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">[data-chat-theme=&quot;your-name&quot;]</code>{" "}
          block in your CSS with all the required variables:
        </p>
        <CodeBlock code={customThemeCode} />
        <p className="text-[15px] text-[#71717A] leading-relaxed mt-4 mb-4">
          Or override specific variables inline via the{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">style</code>{" "}
          prop. Here is a purple accent override:
        </p>
        <CodeBlock code={customOverrideCode} />
        <p className="text-[15px] text-[#71717A] leading-relaxed mt-4 mb-4">
          For a full custom theme, pass the theme name to{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatProvider</code>:
        </p>
        <CodeBlock code={`import { ChatProvider, ChatMessages, ChatComposer } from "@/components/ui/chat"
import type { ChatUser, ChatTheme } from "@/components/ui/chat"

const user: ChatUser = { id: "user-1", name: "You", status: "online" }

<ChatProvider
  currentUser={user}
  theme={"custom" as ChatTheme}
  style={{ height: "100%", display: "flex", flexDirection: "column" }}
>
  <div className="flex-1 flex flex-col bg-[var(--chat-bg-main)]">
    <ChatMessages messages={messages} />
    <ChatComposer onSend={(text) => console.log(text)} />
  </div>
</ChatProvider>`} />
      </div>

      {/* CSS Variables Reference */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">CSS Variables Reference</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Every theme must define these CSS custom properties. They are applied via the{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">data-chat-theme</code>{" "}
          attribute.
        </p>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Variable</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              {cssVariables.map((v, i) => (
                <tr key={v.variable} className={i < cssVariables.length - 1 ? "border-b border-[rgba(0,0,0,0.04)]" : ""}>
                  <td className="px-4 py-2.5">
                    <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">
                      {v.variable}
                    </code>
                  </td>
                  <td className="px-4 py-2.5">{v.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/installation"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Installation
        </Link>
        <Link
          href="/docs/messages"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Messages &rarr;
        </Link>
      </div>
    </div>
  )
}
