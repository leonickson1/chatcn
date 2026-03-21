import Link from "next/link"

const features = [
  {
    title: "4 Built-in Themes",
    description: "Lunar, Aurora, Ember, and Midnight. Each with light and dark mode, fully customizable via CSS variables.",
  },
  {
    title: "Rich Messaging",
    description: "Messages, reactions, threads, read receipts, typing indicators, file sharing, and media previews.",
  },
  {
    title: "Accessible by Default",
    description: "Keyboard navigation, screen reader support, and reduced motion preferences built in.",
  },
  {
    title: "Composable Architecture",
    description: "Mix and match components. Use ChatMessages alone, or compose a full messenger layout.",
  },
  {
    title: "5 Pre-built Blocks",
    description: "Full Messenger, Chat Widget, Inline Chat, Chat Board, and Live Chat. Install with one command.",
  },
  {
    title: "Backend Agnostic",
    description: "Works with any backend. Bring your own data layer, or use Vercel AI SDK, Anthropic, OpenAI, and more.",
  },
]

export default function DocsPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Introduction</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        Beautiful, accessible chat components. Copy and paste into your apps. Built with React, Tailwind CSS, and Radix UI.
      </p>

      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Why chatcn?</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Chat interfaces are one of the most common UI patterns, yet there are no good component
          libraries for them. You end up building from scratch every time — handling message grouping,
          timestamps, read receipts, reactions, reply threads, typing indicators, and dozens of edge
          cases.
        </p>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          chatcn gives you production-ready chat components that you own. Not a dependency — actual
          source code you can read, modify, and extend. Like{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">shadcn/ui</code>{" "}
          but for chat.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Complete Messaging Toolkit</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          chatcn gives you everything you need for production chat UIs:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[15px] text-[#71717A] leading-relaxed mb-4">
          <li>
            <strong className="text-[#18181B]">Messaging:</strong> Message grouping, avatars, reactions, replies,
            typing indicators, read receipts, pinned messages, and more.
          </li>
          <li>
            <strong className="text-[#18181B]">Media:</strong> Image previews, file attachments, code blocks,
            and link previews rendered inside message bubbles.
          </li>
          <li>
            <strong className="text-[#18181B]">Layouts:</strong> Full Messenger, Chat Widget, Inline Chat,
            Chat Board, and Live Chat — ready to drop in.
          </li>
        </ul>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          The{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">ChatProvider</code> context
          wraps everything, so theming and configuration apply consistently.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-[28px] font-bold text-[#18181B] mb-4">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-[rgba(0,0,0,0.10)] p-5"
            >
              <h3 className="text-[15px] font-semibold text-[#18181B] mb-1.5">
                {feature.title}
              </h3>
              <p className="text-[13px] text-[#71717A] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-end border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/installation"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          Installation &rarr;
        </Link>
      </div>
    </div>
  )
}
