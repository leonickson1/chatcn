import Link from "next/link"

export default function APIReferencePage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">API Reference</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        Complete props and types reference for all chatcn components. Every prop listed
        below is fully typed &mdash; hover over any component in your editor to see the
        full type signature.
      </p>

      {/* ChatProvider */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">ChatProvider</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The root context provider. Wrap your entire chat UI in{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatProvider</code>{" "}
          to supply theme, user, and callback configuration to all child components.
        </p>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Prop</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Default</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">currentUser</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">ChatUser</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&mdash;</td>
                <td className="px-4 py-2.5">The currently authenticated user object</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">theme</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">ChatTheme</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&quot;lunar&quot;</td>
                <td className="px-4 py-2.5">Visual theme applied to all child components</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">dateFormat</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">string</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&quot;relative&quot;</td>
                <td className="px-4 py-2.5">Date display format: &quot;relative&quot;, &quot;absolute&quot;, or a custom format string</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">messageGroupingInterval</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">number</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">120000</td>
                <td className="px-4 py-2.5">Max milliseconds between messages to group them under one sender header</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">onEdit</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">(id: string, text: string) =&gt; void</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&mdash;</td>
                <td className="px-4 py-2.5">Called when a user edits a message</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">onDelete</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">(id: string) =&gt; void</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&mdash;</td>
                <td className="px-4 py-2.5">Called when a user deletes a message</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">onReaction</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">(id: string, emoji: string) =&gt; void</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&mdash;</td>
                <td className="px-4 py-2.5">Called when a user adds or removes a reaction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ChatMessages */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">ChatMessages</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Renders the scrollable message list with grouping, read receipts, and typing indicators.
        </p>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Prop</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Default</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">messages</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">ChatMessageData[]</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">[]</td>
                <td className="px-4 py-2.5">Array of message objects to render</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">typingUsers</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">ChatUser[]</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">[]</td>
                <td className="px-4 py-2.5">Users currently typing, shown as a typing indicator</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">className</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">string</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&mdash;</td>
                <td className="px-4 py-2.5">Additional CSS classes for the scroll container</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">onLoadMore</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">() =&gt; void</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&mdash;</td>
                <td className="px-4 py-2.5">Called when the user scrolls to the top to load older messages</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">hasMore</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">boolean</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">false</td>
                <td className="px-4 py-2.5">Whether there are more messages to load (shows a spinner when true)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ChatComposer */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">ChatComposer</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The message input area with auto-resize, file upload, and reply support.
        </p>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Prop</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Default</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">onSend</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">(text: string) =&gt; void</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&mdash;</td>
                <td className="px-4 py-2.5">Called when the user sends a message</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">onTyping</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">(isTyping: boolean) =&gt; void</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&mdash;</td>
                <td className="px-4 py-2.5">Called when the user&apos;s typing state changes</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">onFileUpload</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">(files: File[]) =&gt; void</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&mdash;</td>
                <td className="px-4 py-2.5">Called when files are dropped or selected via the attachment button</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">placeholder</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">string</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&quot;Type a message...&quot;</td>
                <td className="px-4 py-2.5">Placeholder text shown in the empty textarea</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">disabled</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">boolean</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">false</td>
                <td className="px-4 py-2.5">Disables the composer input and send button</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">replyingTo</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">ChatMessageData | null</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">null</td>
                <td className="px-4 py-2.5">Message being replied to, shown as a preview above the input</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">onCancelReply</code>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12px]">() =&gt; void</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">&mdash;</td>
                <td className="px-4 py-2.5">Called when the user dismisses the reply preview</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ChatMessageData */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">ChatMessageData</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The core data type representing a single message. Used throughout the library.
        </p>
        <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 font-mono text-[13px] overflow-x-auto">
          <code>{`interface ChatMessageData {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: Date | number
  text?: string
  status: "sending" | "sent" | "delivered" | "read" | "failed"
  replyTo?: {
    id: string
    senderName: string
    text: string
  }
  reactions?: {
    emoji: string
    userIds: string[]
    count: number
  }[]
  attachments?: {
    id: string
    type: "image" | "file" | "audio" | "video"
    url: string
    name: string
    size?: number
    mimeType?: string
  }[]
  images?: { url: string; alt?: string }[]
  files?: { url: string; name: string; size?: number }[]
  voice?: { url: string; duration: number }
  linkPreview?: { url: string; title?: string; image?: string }
  code?: { language: string; content: string }
  readBy?: { userId: string; name: string; avatar?: string }[]
  systemEvent?: { type: string; data?: Record<string, unknown> }
  isEdited?: boolean
  isDeleted?: boolean
  isSystem?: boolean
  isPinned?: boolean
}`}</code>
        </pre>
      </div>

      {/* ChatTheme */}
      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">ChatTheme</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The union type for built-in theme names. Pass one of these to{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatProvider</code>&apos;s{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">theme</code>{" "}
          prop, or cast a custom string for your own theme.
        </p>
        <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 font-mono text-[13px] overflow-x-auto">
          <code>{`type ChatTheme = "lunar" | "aurora" | "ember" | "midnight"`}</code>
        </pre>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/theming"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Theming
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
