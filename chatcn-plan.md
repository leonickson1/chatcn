# chatcn — The Complete Build Plan

## Beautiful chat components for React. Zero config. One command. Built for shadcn/ui.

---

## 1. Why This Will Get Stars

### The Landscape Is Fragmented and Mispositioned

Every existing chat component library for React has a critical flaw — they're all solving the wrong problem or solving it in the wrong way.

**assistant-ui** (8.9k stars) — Excellent but it's an AI chat library. Requires Vercel AI SDK or LangGraph. Built around LLM streaming, tool calls, and model providers. If you're building team messaging, customer support, a comments system, or social DMs, this is completely wrong for you. It's also heavy — real npm dependency, not copy-paste.

**shadcn-chat** by jakobhoeg (1.6k stars) — The closest thing to what chatcn should be, but it stopped short. Only ships ChatBubble, ChatInput, and an expandable chat window. No threads. No channels. No reactions. No typing indicators. No read receipts. No image/file messages. No message grouping. 8 open issues, stalled since early 2025. It proved the demand exists but didn't finish the job.

**llamaindex/chat-ui** — LLM-specific. Tied to LlamaIndex. Requires their streaming protocol.

**shadcn-chatbot-kit** by Blazity — AI chatbot only. Vercel AI SDK dependency. One monolithic `<Chat>` component with limited composability.

**chatscope/chat-ui-kit-react** — 1.4k stars but ancient CSS-in-JS styling. No Tailwind. No shadcn compatibility. Looks like 2019.

**MinChat, CometChat, PubNub** — Vendor-locked SaaS components that force their backend.

### The Gap

There is no **general-purpose, backend-agnostic, shadcn-native chat UI library** that handles the full spectrum of messaging patterns. Not just a chat bubble and an input box — the complete vocabulary of modern messaging:

Conversations. Threads. Channels. Group chats. DMs. Typing indicators. Read receipts. Reactions. Reply-to. File attachments. Image galleries. Voice messages. Link previews. System messages. Date separators. User presence. Unread badges. Message search. And the hundred micro-interactions that make chat feel alive.

Every SaaS app eventually needs messaging. Every developer dreads building it. **chatcn is the shadcn/ui component for messaging.**

```bash
npx shadcn@latest add https://chatcn.dev/r/chat.json
```

---

## 2. Core Component Architecture

### Philosophy: Composable Primitives, Not a Monolith

The number one mistake every chat library makes is shipping a single `<Chat>` mega-component with 80 props. chatcn follows the shadcn philosophy: composable primitives you own and customize. Every piece is a separate component. You assemble them like LEGO.

### Component Tree — Full Inventory

```
<ChatProvider>                          ← Context: current user, theme, config
│
├── <ChatLayout>                        ← Full-page layout (sidebar + main)
│   ├── <ChatSidebar>                   ← Conversation list panel
│   │   ├── <ChatSidebarHeader>         ← Search + new chat button
│   │   ├── <ChatConversationList>      ← Scrollable list of convos
│   │   │   └── <ChatConversationItem>  ← Single conversation preview
│   │   │       ├── <ChatAvatar>        ← User/group avatar
│   │   │       ├── <ChatPresence>      ← Online/offline dot
│   │   │       └── <ChatUnreadBadge>   ← Unread count
│   │   └── <ChatSidebarFooter>         ← User settings / status
│   │
│   └── <ChatMain>                      ← Active conversation area
│       ├── <ChatHeader>                ← Conversation title + actions
│       │   ├── <ChatAvatar>
│       │   ├── <ChatPresence>
│       │   ├── <ChatHeaderActions>     ← Call, search, pin, settings
│       │   └── <ChatTypingIndicator>   ← "Alex is typing..."
│       │
│       ├── <ChatMessages>              ← Scrollable message area
│       │   ├── <ChatDateSeparator>     ← "Tuesday, March 18"
│       │   ├── <ChatSystemMessage>     ← "Alex joined the group"
│       │   ├── <ChatMessageGroup>      ← Grouped consecutive messages
│       │   │   └── <ChatMessage>       ← Single message
│       │   │       ├── <ChatMessageAvatar>
│       │   │       ├── <ChatMessageContent>
│       │   │       │   ├── <ChatMessageText>       ← Text with markdown
│       │   │       │   ├── <ChatMessageImage>      ← Image with lightbox
│       │   │       │   ├── <ChatMessageFile>       ← File attachment card
│       │   │       │   ├── <ChatMessageVoice>      ← Audio waveform player
│       │   │       │   ├── <ChatMessageLink>       ← Rich link preview
│       │   │       │   ├── <ChatMessageCode>       ← Code block
│       │   │       │   └── <ChatMessageEmbed>      ← Video/tweet embed
│       │   │       ├── <ChatMessageReactions>      ← Emoji reactions bar
│       │   │       │   └── <ChatReaction>          ← Single reaction pill
│       │   │       ├── <ChatMessageActions>        ← Hover toolbar
│       │   │       │   (reply, react, edit, delete, pin, forward)
│       │   │       ├── <ChatMessageStatus>         ← Sent/Delivered/Read
│       │   │       ├── <ChatMessageTimestamp>       ← Time display
│       │   │       └── <ChatMessageReply>          ← Quoted reply preview
│       │   └── <ChatScrollAnchor>      ← "Scroll to bottom" FAB
│       │
│       ├── <ChatReplyPreview>          ← Reply-to bar above input
│       │
│       └── <ChatComposer>             ← Message input area
│           ├── <ChatComposerToolbar>   ← Attach, emoji, GIF, mention
│           ├── <ChatComposerInput>     ← Auto-growing textarea
│           ├── <ChatComposerSend>      ← Send button
│           └── <ChatComposerRecorder>  ← Voice recording button
│
├── <ChatThread>                        ← Thread / reply panel (slides in)
│   ├── <ChatThreadHeader>
│   ├── <ChatMessages>                  ← (reused)
│   └── <ChatComposer>                  ← (reused)
│
└── <ChatEmpty>                         ← Empty state: "No conversation selected"
```

### Why This Granularity Matters

A developer building Slack-style team chat uses `<ChatLayout>` with `<ChatSidebar>`. A developer embedding a support widget uses `<ChatMessages>` + `<ChatComposer>` without any sidebar. A developer building a comments section uses only `<ChatMessage>` components in a flat list. Every piece is independently useful.

---

## 3. Every Feature & Option — The Full Spec

### Message Types (7 Types)

Every modern chat app handles these. chatcn ships a renderer for each:

**1. Text Message**
Plain text with optional markdown rendering (bold, italic, code, links). Supports @mentions that render as highlighted pills. Auto-links URLs.

**2. Image Message**
Single image or gallery (2-4 images in a grid layout). Click opens a lightbox with swipe navigation. Lazy loading with blur-up placeholder. Handles aspect ratios gracefully (no layout shift).

**3. File Attachment**
Card with file icon (based on extension), file name, file size, and download button. Supports PDF preview on hover. Groups multiple files in a compact list.

**4. Voice Message**
Waveform visualization with play/pause, scrub bar, and duration. The waveform is generated from audio amplitude data (passed as a prop, not computed client-side). Playback speed toggle (1x, 1.5x, 2x).

**5. Link Preview**
Rich card with og:image, og:title, og:description scraped from the URL. The component receives preview data as props (the scraping happens server-side). Compact and full layouts.

**6. Code Block**
Syntax highlighted code block with language label, copy button, and line numbers. Wraps Shiki (lazy-loaded, same as diffcn). Collapsible for long blocks.

**7. System Message**
Centered, muted text for events: "Alex joined the channel", "Sara changed the group name", "Message pinned by Dan". Icon on the left. No avatar. No timestamp.

### Message States

```tsx
type MessageStatus = 
  | "sending"     // Clock icon, slightly transparent
  | "sent"        // Single check ✓
  | "delivered"   // Double check ✓✓
  | "read"        // Double check ✓✓ (blue/colored)
  | "failed"      // Red ! with retry button
```

Every message gets a subtle status indicator. For outgoing messages only (incoming messages don't show status). The transition between states should animate smoothly.

### Message Grouping

Consecutive messages from the same sender within a 2-minute window are "grouped" — only the first message shows the avatar and sender name. Subsequent messages are indented under it with reduced spacing. This is how Slack, Discord, and iMessage all work. It dramatically reduces visual noise.

```
┌─────────────────────────────────┐
│ 🟢 Alex Chen                 10:42 AM │
│ Hey, did you see the new PR?          │
│ The auth refactor looks solid         │
│ Only concern is the token refresh     │
│                                       │
│ 🟠 Sara Kim                  10:44 AM │
│ Yeah I reviewed it this morning       │
│ Left a couple of comments             │
└─────────────────────────────────┘
```

### Reactions

Each message can have reactions — emoji pills displayed below the content. Clicking an existing reaction toggles your vote (increment/decrement). Hovering a reaction shows who reacted. A "+" button opens an emoji picker to add a new reaction. Max 6-8 unique reactions per message before collapsing with "+3 more".

```
[😂 4] [🔥 2] [👍 12] [+]
```

### Reply-To (Quoting)

Clicking "Reply" on a message shows a compact quote preview above the composer. The original message is quoted inside the reply with a colored left bar, sender name, and truncated text. Clicking the quote scrolls to the original message with a flash highlight.

### Typing Indicator

The classic three bouncing dots animation. Supports multiple typers: "Alex is typing..." → "Alex and Sara are typing..." → "Several people are typing...". Renders at the bottom of the message list, above the composer.

### Read Receipts

For 1:1 chats: "Read at 3:42 PM" or blue double-check on the last read message. For group chats: small stacked avatars (max 3 + count) next to the last message each person has read. This component is opt-in — pass `showReadReceipts={true}`.

### Presence (Online/Offline)

A small colored dot on the avatar: green (online), yellow (away/idle), red (do not disturb), gray (offline). The `<ChatPresence>` component accepts a `status` prop and renders the appropriate indicator.

### Unread Badge

Red circle with count on conversation items. Supports "99+" for large counts. Distinct styling for mentions vs. regular unread ("@2" badge in a different color).

### Date Separators

Between messages on different days, a horizontal line with the date centered: "Today", "Yesterday", "Tuesday, March 18", "March 12, 2026". Uses relative dates for recent and absolute for older.

### Scroll Behavior & Anchoring

This is one of the hardest UX problems in chat. chatcn ships a `useAutoScroll` hook that handles:

- Auto-scroll to bottom on new messages (when user is already at bottom)
- Preserve scroll position when user has scrolled up (don't jump)
- "New messages ↓" floating button when there are unseen messages below
- Smooth scroll on click, instant scroll on initial load
- Scroll restoration when navigating between conversations
- Reverse-infinite-scroll for loading older messages (scroll up to load more)

### Emoji Picker

Two options — both supported:

1. **Built-in lightweight picker**: A simple grid of common emojis (no npm dependency). Covers 80% of use cases. Categorized tabs (Smileys, People, Nature, Food, Activities, Objects, Symbols).

2. **Emoji Mart integration**: For developers who want the full picker with search, skin tones, custom emojis. chatcn provides a `<ChatEmojiPicker adapter="emoji-mart">` that lazy-loads Emoji Mart.

### File Upload

Drag-and-drop zone that activates when dragging files over the chat area. The entire chat window becomes a drop target with a visual overlay. Also supports the paperclip button in the composer toolbar. Files show upload progress inline before the message is sent.

### Mentions (@)

Typing "@" opens a filtered user list popup anchored to the cursor position in the textarea. Arrow keys to navigate, Enter to select. Selected mentions render as highlighted pills in the composer and in sent messages.

### Search

`<ChatSearch>` is a command-palette-style overlay (inspired by cmdk) that searches across messages. Results show message snippet with highlighted match, sender, timestamp, and conversation name. Click a result to navigate to that message with a flash highlight.

---

## 4. Props API Design

### Root Provider

```tsx
<ChatProvider
  currentUser={{
    id: string
    name: string
    avatar?: string
    status?: "online" | "away" | "dnd" | "offline"
  }}
  theme="auto"                    // "light" | "dark" | "auto"
  locale="en"                     // Date/time localization
  dateFormat="relative"           // "relative" | "absolute" | "time-only"
  renderMarkdown={true}           // Enable markdown in messages
  enableReactions={true}
  enableThreads={true}
  enableReadReceipts={true}
  enableTypingIndicator={true}
  enablePresence={true}
  maxReactionsPerMessage={8}
  messageGroupingInterval={120}   // seconds — group messages within this window
>
```

### Message Data Shape

```tsx
interface ChatMessageData {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  
  // Content (one or more)
  text?: string                   // Plain text or markdown
  images?: { url: string; width: number; height: number; alt?: string }[]
  files?: { name: string; size: number; type: string; url: string }[]
  voice?: { url: string; duration: number; waveform: number[] }
  linkPreview?: { url: string; title: string; description: string; image?: string }
  code?: { language: string; code: string }
  
  // Metadata
  timestamp: Date | number
  status?: "sending" | "sent" | "delivered" | "read" | "failed"
  replyTo?: { id: string; senderName: string; text: string }
  reactions?: { emoji: string; userIds: string[]; count: number }[]
  isEdited?: boolean
  isPinned?: boolean
  isSystem?: boolean              // System message (joined, left, renamed)
  systemEvent?: string            // Event type for system messages
  
  // Mentions
  mentions?: { userId: string; name: string; offset: number; length: number }[]
}
```

### Key Component Props

```tsx
// Main message list
<ChatMessages
  messages={ChatMessageData[]}
  onLoadMore={() => Promise<void>}    // Reverse scroll pagination
  hasMore={boolean}                    // More messages to load
  isLoading={boolean}                  // Show loading skeleton
  onMessageClick={(msg) => void}
  onReactionAdd={(msgId, emoji) => void}
  onReactionRemove={(msgId, emoji) => void}
  onReply={(msg) => void}
  onEdit={(msg) => void}
  onDelete={(msgId) => void}
  onPin={(msgId) => void}
  onForward={(msg) => void}
  renderMessage={(msg) => ReactNode}   // Full custom renderer override
  renderSystemMessage={(msg) => ReactNode}
/>

// Composer
<ChatComposer
  onSend={(content: MessageContent) => void}
  onTyping={(isTyping: boolean) => void}
  onFileUpload={(files: File[]) => void}
  placeholder="Type a message..."
  maxLength={4000}
  enableEmoji={true}
  enableAttachments={true}
  enableVoice={true}
  enableMentions={true}
  mentionUsers={User[]}               // Users available for @mentions
  replyingTo={ChatMessageData | null}  // Currently replying to
  onCancelReply={() => void}
  disabled={boolean}
  autoFocus={boolean}
/>

// Conversation list
<ChatConversationList
  conversations={Conversation[]}
  activeId={string}
  onSelect={(id: string) => void}
  onSearch={(query: string) => void}
  renderItem={(convo) => ReactNode}    // Custom item renderer
/>

// Single conversation item
<ChatConversationItem
  id={string}
  title={string}
  avatar={string}
  lastMessage={string}
  lastMessageTime={Date}
  unreadCount={number}
  unreadMentions={number}
  isActive={boolean}
  isPinned={boolean}
  isMuted={boolean}
  presence="online" | "away" | "offline"
  isGroup={boolean}
  memberCount={number}
  typing={string[]}                    // Names of people typing
/>
```

---

## 5. Visual Design — Making It Sexy

### Design Philosophy

**"iMessage clarity meets Slack density."** The default theme should feel clean and airy like Apple Messages but support the information density of Slack when configured for work contexts. Two layout modes: **Comfortable** (spacious, like iMessage) and **Compact** (dense, like Slack/Discord).

### Chat Bubble Styles (3 Variants)

**Variant 1: Bubble (Default)**
Rounded rectangle bubbles. Outgoing = filled with `--primary` color, white text. Incoming = `bg-muted` with standard text. Tail/notch on the bubble is optional (enabled by default for 1:1, disabled for group). This is the WhatsApp/iMessage style.

**Variant 2: Flat / Slack-style**
No bubbles. Messages are left-aligned with a vertical color bar on the left (using the sender's assigned color). Sender name in bold above the message. Compact vertical spacing. Best for group chats and team messaging.

**Variant 3: Minimal**
No bubbles, no color bars. Just text with subtle sender labels and timestamps. Maximum content density. For comments sections and embedded contexts.

```tsx
<ChatMessages variant="bubble" />   // WhatsApp/iMessage style
<ChatMessages variant="flat" />     // Slack/Discord style
<ChatMessages variant="minimal" />  // Comments/embed style
```

### Color System

```css
/* Chat-specific tokens — all inherit from your shadcn theme */
--chat-bubble-outgoing: var(--primary);
--chat-bubble-outgoing-text: var(--primary-foreground);
--chat-bubble-incoming: var(--muted);
--chat-bubble-incoming-text: var(--foreground);

--chat-system: var(--muted-foreground);
--chat-timestamp: var(--muted-foreground);
--chat-link: var(--primary);

--chat-presence-online: oklch(0.72 0.19 145);     /* Green */
--chat-presence-away: oklch(0.75 0.15 85);         /* Yellow */
--chat-presence-dnd: oklch(0.63 0.20 25);          /* Red */
--chat-presence-offline: var(--muted-foreground);   /* Gray */

--chat-unread: oklch(0.63 0.20 25);                /* Red badge */
--chat-mention: var(--primary);                     /* Mention badge */

--chat-reaction-bg: var(--muted);
--chat-reaction-active-bg: var(--primary / 0.15);
--chat-reaction-active-border: var(--primary);

/* Message status */
--chat-status-sent: var(--muted-foreground);
--chat-status-read: var(--primary);
--chat-status-failed: oklch(0.63 0.20 25);

/* Dark mode adjusts automatically via shadcn theme variables */
```

### Key Visual Details

**1. Message Hover Actions**
When hovering over a message, a floating toolbar appears at the top-right corner of the message. Contains: Reply, React (opens emoji picker), More (dropdown: edit, delete, pin, forward). The toolbar uses a glass effect (`backdrop-blur-xl bg-background/80`) and slides in with a subtle fade animation. On mobile: long-press triggers the same actions as a bottom sheet.

**2. Typing Indicator Animation**
Three dots that pulse in sequence with a stagger delay. Each dot is 6px, uses `--muted-foreground` color. The animation is pure CSS (keyframes, no JS). The container appears with a height-expand animation so it doesn't cause layout jump.

```css
@keyframes typing-dot {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-4px); }
}
.dot:nth-child(1) { animation-delay: 0ms; }
.dot:nth-child(2) { animation-delay: 150ms; }
.dot:nth-child(3) { animation-delay: 300ms; }
```

**3. Read Receipt Avatars**
For group chats, tiny (16px) stacked avatar circles appear below the last message each person has read. Max 3 visible + "+N" overflow. They fade in when status updates.

**4. Reaction Pills**
Rounded pill shape: `[😂 4]`. Background is `bg-muted` by default, `bg-primary/15` with `border-primary` when the current user has reacted. Numbers use `tabular-nums`. Hover shows a tooltip with names: "Alex, Sara, and 2 others". The "+" button to add a new reaction is invisible until hover.

**5. Date Separator**
A full-width horizontal rule with the date text centered in a small pill. Background matches the chat background so the rule appears to pass "behind" the date. Text is 11px, uppercase, `tracking-widest`, `text-muted-foreground`.

```
───────── TUESDAY, MARCH 18 ─────────
```

**6. Image Gallery Layout**
Single image: full-width, rounded corners, max 400px wide. Two images: side by side, equal width. Three images: one large on left (66%), two stacked on right (33%). Four images: 2x2 grid. More than four: 2x2 grid with the last cell showing "+N" overlay. All images have a subtle inner shadow and rounded corners matching the bubble radius.

**7. Voice Message Waveform**
A horizontal bar with a waveform visualization (drawn using inline SVG, not canvas). Bars use the bubble color. Played portion fills with a brighter shade. Play/pause button on the left, duration on the right. Scrubbing by dragging. The waveform data is passed as a `number[]` prop — 40-60 amplitude values.

**8. Scroll-to-Bottom FAB**
A circular floating button that appears when the user has scrolled up. Shows unread count badge. Positioned bottom-right of the message area. Smooth bounce-in animation. Click scrolls to bottom with easing.

**9. Composer Auto-Resize**
The textarea grows from 1 line to a max of 6 lines as you type. Beyond 6 lines, it scrolls internally. The growth animation is smooth (not jumpy). Shift+Enter for newlines, Enter to send (configurable).

**10. Unread Marker Line**
When scrolling through conversation history, a red horizontal line with "New messages" label marks where unread messages begin. This line disappears after the user has scrolled past it.

### Responsive Behavior

- **Desktop (>1024px)**: Sidebar + main panel side by side. Thread panel slides in from the right.
- **Tablet (768-1024px)**: Sidebar collapses to icons-only. Click to expand as an overlay.
- **Mobile (<768px)**: Full-screen navigation. Conversation list → single conversation → thread. Back button in header. Composer sticks to bottom with keyboard avoidance.

The layout uses container queries (not viewport) so it works inside dashboards, modals, and sidebars.

---

## 6. What to Build vs. Wrap

| Concern | Approach | Package / Notes |
|---------|----------|-----------------|
| Message rendering | **Build** | Custom composable React tree |
| Markdown parsing | **Wrap** (optional) | `react-markdown` + `remark-gfm` (lazy) |
| Code highlighting | **Wrap** (optional) | `shiki` (lazy, same as diffcn) |
| Emoji picker | **Build** basic / **Wrap** full | Built-in grid OR `@emoji-mart/react` (lazy) |
| Auto-scroll logic | **Build** | Custom `useAutoScroll` hook with IntersectionObserver |
| Infinite scroll (history) | **Build** | Custom reverse scroll with `useInfiniteScroll` hook |
| Textarea auto-resize | **Build** | Custom hook, ~20 lines |
| Image lightbox | **Wrap** | `yet-another-react-lightbox` OR build minimal (dialog + img) |
| Voice waveform | **Build** | SVG-based, pure CSS animation |
| Mention popup | **Build** | Positioned popup + filtered list, inspired by cmdk |
| Link preview card | **Build** | Just a styled card — data comes from props |
| Date formatting | **Wrap** | `date-fns` (tree-shakeable) OR `dayjs` |
| Virtualization | **Wrap** (optional) | `@tanstack/react-virtual` for 10k+ message histories |
| Drag-and-drop upload | **Build** | Native HTML5 drag events, no library needed |
| Animations | **Build** | CSS transitions + keyframes. Framer Motion optional |
| Layout system | **Build** | CSS Grid + Container Queries |
| State management | **None** | chatcn is stateless — you pass data via props |

### Dependency Budget

```
Core (always loaded):
  chatcn components              ~18KB gzip
  CSS                            ~4KB gzip
  date-fns (formatRelative only) ~2KB gzip (tree-shaken)
  Total core:                    ~24KB gzip

Optional (lazy loaded on use):
  react-markdown + remark-gfm    ~12KB gzip
  shiki (code highlighting)      ~15KB gzip + grammars
  @emoji-mart/react              ~40KB gzip
  @tanstack/react-virtual        ~2KB gzip
```

### Critical Design Decision: Stateless Components

chatcn does NOT manage state. It does not hold messages in memory, it does not maintain WebSocket connections, it does not handle persistence. Every component receives data via props and emits events via callbacks.

This is deliberate. The developer's backend determines everything: REST API, WebSocket, Firebase, Supabase Realtime, Ably, PubNub, Convex, or plain polling. chatcn doesn't care. It renders what you give it and tells you what the user did.

```tsx
// chatcn doesn't care where messages come from
const { messages } = useMyBackend()  // Your code, your backend

<ChatMessages 
  messages={messages} 
  onSend={(content) => myBackend.sendMessage(content)}
  onReaction={(msgId, emoji) => myBackend.addReaction(msgId, emoji)}
/>
```

This is the opposite of CometChat/PubNub (which force their backend) and assistant-ui (which forces AI SDK). It's the same philosophy as shadcn/ui itself: render primitives, not application logic.

---

## 7. Hooks Library

chatcn ships several hooks that handle the tricky UX logic:

```tsx
// Auto-scroll: scroll to bottom on new messages, unless user scrolled up
const { containerRef, scrollToBottom, isAtBottom, newMessageCount } = useAutoScroll({
  messages,
  behavior: "smooth",           // "smooth" | "instant"
  threshold: 100,               // px from bottom to consider "at bottom"
})

// Reverse infinite scroll: load older messages when scrolling to top
const { sentinelRef, isLoading } = useInfiniteScroll({
  onLoadMore: async () => { /* fetch older messages */ },
  hasMore: boolean,
  direction: "up",
})

// Typing indicator: debounced typing state
const { isTyping, handleKeyDown } = useTypingIndicator({
  onTypingChange: (isTyping: boolean) => { /* notify backend */ },
  debounceMs: 2000,             // Stop typing after 2s of inactivity
})

// Textarea auto-resize
const { textareaRef, handleInput } = useAutoResize({
  minRows: 1,
  maxRows: 6,
})

// Message grouping: group consecutive same-sender messages
const groupedMessages = useMessageGroups(messages, {
  intervalMs: 120_000,          // 2-minute grouping window
  separateByDate: true,         // Insert date separators
})

// Keyboard shortcuts
useShortcut("mod+enter", handleSend)     // Cmd/Ctrl+Enter to send
useShortcut("escape", cancelReply)       // Escape to cancel reply
```

---

## 8. Pre-Built Layouts (Ready-to-Use Compositions)

For developers who want to move fast, chatcn ships complete layout compositions that assemble the primitives into common patterns:

### Layout 1: Full Messenger (Slack/Discord)

Sidebar with conversation list + main chat area + thread panel. Complete messaging application layout.

```tsx
import { FullMessenger } from "@/components/ui/chat"

<FullMessenger
  conversations={conversations}
  activeConversation={activeConvo}
  messages={messages}
  currentUser={currentUser}
  onSend={handleSend}
  onSelectConversation={handleSelect}
/>
```

### Layout 2: Embedded Chat Widget (Intercom-style)

Floating button in bottom-right corner. Click to expand a chat window. Perfect for customer support.

```tsx
import { ChatWidget } from "@/components/ui/chat"

<ChatWidget
  messages={messages}
  onSend={handleSend}
  position="bottom-right"
  title="Support"
  subtitle="We typically reply in minutes"
  greeting="Hi! How can we help?"
/>
```

### Layout 3: Inline Chat (Comments Section)

No sidebar, no header. Just a message list and composer embedded in a page. Perfect for document comments, activity feeds, or discussion threads.

```tsx
import { InlineChat } from "@/components/ui/chat"

<InlineChat
  messages={comments}
  onSend={handleComment}
  variant="minimal"
  placeholder="Add a comment..."
  maxHeight={600}
/>
```

### Layout 4: AI Chat (ChatGPT-style)

Single conversation, no sidebar, markdown rendering enabled, streaming support. This is the layout for AI assistants — but without forcing Vercel AI SDK. You handle streaming yourself.

```tsx
import { AIChat } from "@/components/ui/chat"

<AIChat
  messages={messages}
  onSend={handlePrompt}
  isStreaming={isStreaming}
  onStop={handleStop}
  placeholder="Ask me anything..."
  showSuggestions={true}
  suggestions={["Summarize this doc", "Write a test", "Explain this code"]}
/>
```

---

## 9. Registry & CLI Integration

### File Structure

Since chatcn has more components than diffcn, the registry supports both a single-file install and individual component installs:

```json
{
  "name": "chatcn",
  "items": [
    {
      "name": "chat",
      "title": "Chat (All Components)",
      "description": "Complete chat component library with messages, composer, conversations, and layouts.",
      "dependencies": ["date-fns"],
      "files": [
        { "path": "src/registry/chat.tsx", "target": "components/ui/chat.tsx" },
        { "path": "src/registry/chat-hooks.tsx", "target": "components/ui/chat-hooks.tsx" }
      ]
    },
    {
      "name": "chat-messages",
      "title": "Chat Messages (Standalone)",
      "description": "Message list with bubbles, grouping, reactions, and scroll handling.",
      "dependencies": ["date-fns"],
      "files": [
        { "path": "src/registry/chat-messages.tsx", "target": "components/ui/chat-messages.tsx" }
      ]
    },
    {
      "name": "chat-composer",
      "title": "Chat Composer (Standalone)",
      "description": "Message input with auto-resize, emoji, attachments, and mentions.",
      "files": [
        { "path": "src/registry/chat-composer.tsx", "target": "components/ui/chat-composer.tsx" }
      ]
    }
  ]
}
```

Install commands:
```bash
# Everything
npx shadcn@latest add https://chatcn.dev/r/chat.json

# Just messages
npx shadcn@latest add https://chatcn.dev/r/chat-messages.json

# Just the composer
npx shadcn@latest add https://chatcn.dev/r/chat-composer.json
```

---

## 10. Implementation Plan — 2-Day Sprint

### Day 1: Core Messaging Components

**Morning (4 hours)**

- [ ] Scaffold Next.js project with shadcn/ui
- [ ] Set up registry structure
- [ ] Define TypeScript interfaces: `ChatMessageData`, `Conversation`, `User`, `Reaction`
- [ ] Build `<ChatProvider>` context (current user, config)
- [ ] Build `<ChatMessage>` — the core unit:
  - Text rendering with auto-linking
  - Bubble variant (outgoing/incoming)
  - Flat variant (Slack-style)
  - Avatar, sender name, timestamp
- [ ] Build `<ChatMessageGroup>` — grouping consecutive same-sender messages
- [ ] Build `<ChatDateSeparator>` — date dividers
- [ ] Build `<ChatSystemMessage>` — joined/left/renamed events
- [ ] Build `<ChatMessages>` — scrollable container with `useAutoScroll`

**Afternoon (4 hours)**

- [ ] Build `<ChatComposer>` — auto-resizing textarea + send button
- [ ] Build `<ChatComposerToolbar>` — attach + emoji buttons
- [ ] Build `<ChatMessageActions>` — hover toolbar (reply, react, more)
- [ ] Build `<ChatMessageReactions>` — reaction pills
- [ ] Build `<ChatMessageStatus>` — sent/delivered/read indicators
- [ ] Build `<ChatMessageReply>` — quoted reply preview
- [ ] Build `<ChatReplyPreview>` — reply bar above composer
- [ ] Build `<ChatTypingIndicator>` — bouncing dots
- [ ] Wire all CSS variables for light + dark mode
- [ ] Test with realistic sample data (50+ messages, mixed types)

### Day 2: Layouts + Media + Polish + Docs

**Morning (4 hours)**

- [ ] Build `<ChatMessageImage>` — image rendering with gallery grid
- [ ] Build `<ChatMessageFile>` — file attachment card
- [ ] Build `<ChatMessageVoice>` — SVG waveform player
- [ ] Build `<ChatMessageLink>` — link preview card
- [ ] Build `<ChatMessageCode>` — code block with Shiki (lazy)
- [ ] Build `<ChatConversationList>` + `<ChatConversationItem>`
- [ ] Build `<ChatSidebar>` with search
- [ ] Build `<ChatLayout>` — sidebar + main panel
- [ ] Build `<ChatHeader>` with presence + actions
- [ ] Build `<ChatScrollAnchor>` — "scroll to bottom" FAB
- [ ] Implement `useInfiniteScroll` for loading message history

**Afternoon (4 hours)**

- [ ] Build pre-composed layouts: FullMessenger, ChatWidget, InlineChat, AIChat
- [ ] Build emoji picker (basic built-in grid)
- [ ] Mobile responsive: full-screen navigation, bottom sheet actions
- [ ] Build docs site with:
  - Hero: live interactive chat demo (dark mode)
  - Installation page
  - Examples for each layout
  - Component API reference
  - Theming guide
- [ ] Create demo GIF for README
- [ ] Deploy to Vercel
- [ ] Publish to GitHub

---

## 11. The Docs Site (chatcn.dev)

### Hero Concept

The hero IS the product — a fully working chat interface taking up the whole viewport. Two personas chatting back and forth with messages that animate in. The user can actually type and send messages (they go into a local demo state). Dark mode. Glassmorphic sidebar. The install command overlaid at the bottom:

```
chatcn
Beautiful chat components. Backend-agnostic. One command.

npx shadcn@latest add https://chatcn.dev/r/chat.json
```

### Demo Pages

1. **Messenger** — Full Slack-style layout with sidebar, conversations, threads
2. **Support Widget** — Intercom-style floating widget
3. **Comments** — Inline discussion thread
4. **AI Chat** — ChatGPT-style single conversation
5. **Playground** — Toggle every option: variant, reactions, read receipts, typing, themes

Each demo has real interactive chat with sample data. The user can send messages, add reactions, reply, switch conversations.

---

## 12. The Screenshot That Sells It

A dark-mode full messenger layout:
- Left sidebar showing 5-6 conversations with avatars, last message preview, unread badges, and online indicators
- Main panel showing a conversation with mixed message types: text bubbles, an image, a code block, reactions on one message, a reply-to quote, typing indicator at the bottom
- Glassmorphic header with presence dot and call/search icons
- Composer at the bottom with placeholder text and toolbar icons

This single screenshot on the README is 80% of the marketing. It needs to look like a production app, not a component demo.

---

## 13. Star Acceleration & Positioning

### Why chatcn Beats The Alternatives

| Feature | chatcn | assistant-ui | shadcn-chat | chatscope |
|---------|--------|-------------|-------------|-----------|
| Backend-agnostic | ✅ | ❌ (AI SDK) | ✅ | ✅ |
| shadcn CLI install | ✅ | ❌ (npm) | ✅ | ❌ |
| Copy-paste ownership | ✅ | ❌ | ✅ | ❌ |
| Message types (7+) | ✅ | ❌ (text only) | ❌ | Partial |
| Reactions | ✅ | ❌ | ❌ | ❌ |
| Threads | ✅ | ❌ | ❌ | ❌ |
| Read receipts | ✅ | ❌ | ❌ | ❌ |
| Typing indicator | ✅ | ✅ | ❌ | ✅ |
| Voice messages | ✅ | ❌ | ❌ | ❌ |
| Conversation list | ✅ | ❌ | ❌ | ✅ |
| Multiple variants | ✅ (3) | ❌ | ❌ | ❌ |
| Mobile responsive | ✅ | ✅ | Partial | Partial |
| Bundle size (core) | ~24KB | ~80KB+ | ~15KB | ~45KB |
| General-purpose | ✅ | ❌ (AI only) | ✅ | ✅ |
| Pre-built layouts | 4 | 1 | 1 | 0 |

### Launch Channels

- Twitter/X with demo GIF → tag @shadcn
- Reddit r/reactjs, r/webdev, r/nextjs
- Hacker News (Show HN)
- awesome-shadcn-ui PR
- Dev.to post: "I built the missing chat component for shadcn/ui"
- Product Hunt launch (for max day-1 visibility)

### README Structure

1. Hero screenshot (dark mode messenger layout, full width)
2. One-line description
3. Install command
4. Feature badges
5. 10-second code example showing a working chat
6. Links to 4 layout demos
7. "Why chatcn?" comparison table
8. API reference link

---

## 14. Future Scope (Post-Launch)

Ship without these. Add based on demand:

- **Message editing with history** — Edit messages and show "edited" label with diff on click
- **Pinned messages panel** — Sidebar showing all pinned messages in a conversation
- **Shared media gallery** — Grid of all images/files shared in a conversation
- **Voice/video call UI** — Call screen components (ringing, in-call, controls)
- **Message scheduling** — Schedule send with time picker
- **Message translation** — Inline translation toggle
- **Custom emoji / sticker packs** — Sticker panel with user-defined packs
- **E2E encryption indicators** — Lock icons and verification badges
- **Giphy/Tenor integration** — GIF picker with search
- **Svelte / Vue ports** — Community-driven

---

## 15. Naming & Branding

**Name:** `chatcn` — follows the `*cn` convention

**Tagline:** "Beautiful chat. Any backend. One command."

**Domain:** chatcn.dev

**Logo concept:** A speech bubble with rounded corners, containing two small horizontal lines (representing text). Clean geometric shape. Works at favicon size.

---

## Summary

The pitch in one sentence: **"The first chat component library for shadcn/ui that handles real messaging — not just AI chatbots — with reactions, threads, read receipts, voice messages, and four layout patterns, all in 24KB."**

The market is begging for this. assistant-ui proved there's massive demand (8.9k stars) but locked itself to AI. shadcn-chat proved the shadcn-native approach works (1.6k stars with just a bubble and an input). chatcn combines the ambition of assistant-ui with the simplicity of shadcn-chat, positioned for the 10x larger market of general-purpose messaging.

Build time: 2 days for a killer v1. Star potential: 3-8k in the first 6 months.
