# chatcn — Full Features Coverage Audit

## Every use case. Every gap identified. Every gap filled.

---

## 1. Use Case Matrix — What chatcn Covers

| Use Case | Covered? | Components Used | Notes |
|---|---|---|---|
| **1:1 Messaging (WhatsApp/iMessage)** | ✅ | ChatMessages + ChatComposer + ChatHeader | Bubbles, read receipts, typing, reactions |
| **Group Chat (Slack channels)** | ✅ | Full ChatLayout with sidebar | Presence, unread, mentions, multi-typer |
| **AI Chat (ChatGPT/Claude style)** | ✅ | AIChat layout + streaming | **NEW: Streaming section below** |
| **AI Companion/Character Chat** | ✅ | AIChat + custom avatar/personality | Streaming + suggested replies |
| **Customer Support Widget** | ✅ | ChatWidget (floating) | Intercom-style expand/collapse |
| **Comments Section** | ✅ | InlineChat layout | Flat list, no sidebar, minimal variant |
| **Discussion Threads (Reddit-style)** | ✅ | **NEW: ChatThread with nesting** | Nested replies, vote counts |
| **Message Board / Forum** | ✅ | **NEW: ChatBoard layout** | Topic list → thread view |
| **Code Review Comments** | ✅ | InlineChat + code block rendering | Reply-to with line references |
| **Collaborative Doc Comments** | ✅ | **NEW: ChatAnnotation component** | Anchored to page elements |
| **Live Stream Chat (Twitch)** | ✅ | ChatMessages (compact, no sidebar) | Fast scroll, badges, emotes |
| **Email Thread View** | Partial | ChatMessages (grouped by sender) | Not primary use case |

---

## 2. AI Chat & Streaming — THE BIG GAP (Now Filled)

The original plan mentioned an "AIChat layout" but never specced streaming. This is the most critical feature for 2026. Every AI product needs it.

### The Problem With Streaming

When an LLM streams tokens, the message grows character by character. Naive rendering causes:
- Layout thrashing (message height recalculates on every token)
- Scroll jank (auto-scroll fights with layout recalculation)
- Markdown rendering breaks mid-stream (incomplete code fences, half-formed tables)
- Cursor jumping if the user is reading above

chatcn solves all of these.

### Streaming Components

```tsx
<ChatStreamingMessage
  content={streamingText}        // The growing text string
  isStreaming={true}             // Currently receiving tokens
  renderMarkdown={true}          // Parse markdown (handles incomplete blocks)
  
  // Smooth text animation
  animation="fade"               // "none" | "fade" | "typewriter"
  
  // Streaming-specific UI
  showCursor={true}              // Blinking cursor at the end during stream
  cursorStyle="block"            // "block" | "line" | "dot"
/>
```

### How Streaming Rendering Works

```tsx
// chatcn provides a useStreaming hook that wraps ANY streaming source
const { displayText, isStreaming } = useStreaming({
  // Option 1: Direct text prop (you manage the stream yourself)
  text: streamingContent,
  
  // Option 2: ReadableStream (from fetch or any source)
  stream: response.body,
  
  // Option 3: Vercel AI SDK compatible (pass messages directly)
  messages: aiSdkMessages,
  
  // Smooth rendering options
  chunkSize: 3,                  // Render N characters at a time (smooths jank)
  interval: 16,                  // ms between renders (~60fps)
})

// Then render with chatcn's message component
<ChatMessage 
  role="assistant"
  content={displayText}
  isStreaming={isStreaming}
/>
```

### Streaming Markdown (The Hard Problem)

When markdown streams in, you get incomplete blocks:

```
Token 1-50:   "Here's some code:\n```typescript\nconst x"
Token 51-80:  " = 42;\nconsole.log(x);\n```\n\nAnd that"
Token 81-100: "'s how variables work."
```

At token 50, the code fence is open. A naive markdown renderer will break.

chatcn's `<ChatStreamingMarkdown>` handles this:

```tsx
<ChatStreamingMarkdown
  content={growingText}
  isStreaming={isStreaming}
>
  {/* Uses a forked react-markdown that: */}
  {/* 1. Detects unclosed code fences and temporarily closes them */}
  {/* 2. Buffers incomplete table rows until they're complete */}
  {/* 3. Renders partial lists without breaking structure */}
  {/* 4. Shows a blinking cursor at the insertion point */}
</ChatStreamingMarkdown>
```

### Streaming-Specific UI Elements

**Stop Button**
```tsx
<ChatStopButton 
  onStop={handleStop}
  label="Stop generating"        // Or just an icon
/>
// Renders as a pill button below the streaming message
// Disappears when streaming ends
// Keyboard shortcut: Escape
```

**Regenerate Button**
```tsx
<ChatRegenerateButton
  onRegenerate={handleRegenerate}
  label="Regenerate response"
/>
// Appears after a complete AI message
// Replaces the last assistant message with a new stream
```

**Thinking/Reasoning Indicator**
```tsx
<ChatThinkingBlock
  content={thinkingText}         // Optional: show reasoning (like Claude)
  isExpanded={false}             // Collapsed by default
  label="Thinking..."
/>
// Collapsible block that shows the AI's reasoning process
// Styled differently from message content (muted, monospace)
// Automatically collapses when the main response starts
```

**Suggested Replies / Quick Actions**
```tsx
<ChatSuggestions
  suggestions={[
    "Explain this further",
    "Show me an example", 
    "Translate to Spanish"
  ]}
  onSelect={(suggestion) => handleSend(suggestion)}
/>
// Horizontal scrollable pill buttons below the last AI message
// Disappear when the user types
// Keyboard: Tab to focus, Enter to select
```

**Feedback Buttons (RLHF)**
```tsx
<ChatFeedback
  messageId={msg.id}
  onFeedback={(type) => handleFeedback(msg.id, type)}
  type="thumbs"                  // "thumbs" | "rating" | "custom"
/>
// 👍 👎 buttons below AI messages
// Click triggers callback + visual confirmation
// Optional: expands to a text input for detailed feedback
```

**Token/Cost Counter**
```tsx
<ChatTokenCount
  inputTokens={1250}
  outputTokens={847}
  model="claude-sonnet-4.6"
/>
// Small muted text below AI message: "1,250 → 847 tokens · Sonnet 4.6"
// Optional, for developer/power-user tools
```

### AI Chat Layout (Complete Spec)

```tsx
import { AIChat, ChatSuggestions, ChatFeedback } from "@/components/ui/chat"

<AIChat
  messages={messages}
  onSend={handleSend}
  
  // Streaming
  isStreaming={isStreaming}
  streamingContent={partialText}
  onStop={handleStop}
  
  // AI-specific
  showSuggestions={true}
  suggestions={["Summarize", "Explain", "Example"]}
  showFeedback={true}
  onFeedback={handleFeedback}
  showRegenerate={true}
  onRegenerate={handleRegenerate}
  showThinking={true}
  thinkingContent={thinkingText}
  
  // Appearance
  assistantName="Claude"
  assistantAvatar="/claude-avatar.svg"
  placeholder="Ask me anything..."
  emptyState={<WelcomeScreen />}  // Custom empty state component
  
  // Model selector (optional)
  models={["Sonnet 4.6", "Opus 4.6", "Haiku 4.5"]}
  selectedModel="Sonnet 4.6"
  onModelChange={handleModelChange}
/>
```

### Backend Agnostic Streaming

chatcn does NOT require Vercel AI SDK. It works with ANY streaming source:

```tsx
// With Vercel AI SDK
const { messages, status } = useChat()
<AIChat messages={messages} isStreaming={status === "streaming"} />

// With raw fetch + ReadableStream
const stream = await fetch("/api/chat", { method: "POST" })
const reader = stream.body.getReader()
// Feed chunks to chatcn via state updates

// With WebSocket
ws.onmessage = (e) => setStreamingText(prev => prev + e.data)
<AIChat streamingContent={streamingText} isStreaming={wsOpen} />

// With Anthropic SDK directly
const stream = await anthropic.messages.stream({ ... })
for await (const chunk of stream) {
  setStreamingText(prev => prev + chunk.delta?.text || "")
}

// With OpenAI SDK
const stream = await openai.chat.completions.create({ stream: true, ... })
for await (const chunk of stream) {
  setStreamingText(prev => prev + chunk.choices[0]?.delta?.content || "")
}
```

---

## 3. Threading & Replies — Complete Spec

### Reply-To (Inline Quote)

Already specced in original plan. Works like WhatsApp/Telegram — click reply, a quote appears above the composer, send references the original.

### Thread Panel (Slack-Style)

A separate panel that opens from the right side showing a focused sub-conversation:

```tsx
<ChatThread
  parentMessage={originalMessage}    // The message that started the thread
  replies={threadReplies}            // Array of reply messages
  onSend={handleThreadReply}
  onClose={handleCloseThread}
  
  // Thread header shows: parent message preview + reply count
  // Thread has its own ChatMessages + ChatComposer
  // Thread panel slides in from the right (on desktop)
  // On mobile, thread is a full-screen push navigation
/>
```

Layout:
```
┌──────────────┬──────────────────────┬─────────────┐
│   Sidebar    │    Main Conversation  │   Thread    │
│   320px      │    flex: 1            │   400px     │
│              │                       │   slide-in  │
└──────────────┴──────────────────────┴─────────────┘
```

### Nested Threading (Reddit/Forum Style)

For discussion boards and comment systems, chatcn supports nested replies with visual indentation:

```tsx
<ChatNestedThread
  messages={threadedMessages}       // Tree structure, not flat array
  maxDepth={5}                       // Max nesting level before "Continue thread →"
  onReply={(parentId) => {}}
  onVote={(msgId, direction) => {}}  // Upvote/downvote (optional)
  showVotes={true}                   // Show vote counts
  sortBy="votes"                     // "votes" | "newest" | "oldest"
  collapsible={true}                 // Allow collapsing sub-threads
/>
```

Message tree structure:
```tsx
interface ThreadedMessage extends ChatMessageData {
  parentId: string | null           // null = top-level
  children: ThreadedMessage[]       // Nested replies
  depth: number                     // 0, 1, 2, 3...
  votes?: number                    // Net vote count
  userVote?: "up" | "down" | null   // Current user's vote
  isCollapsed?: boolean
}
```

Visual rendering:
```
Alex: Has anyone tried the new API?                    ↑3 ↓
├── Sara: Yeah, it's great for streaming               ↑5 ↓
│   ├── Dan: Agreed, the docs could be better though   ↑2 ↓
│   │   └── Sara: PRs welcome :)                       ↑1 ↓
│   └── Alex: What model are you using?                ↑0 ↓
├── Mike: I found a bug with token counting            ↑1 ↓
│   └── [2 more replies — click to expand]
└── Reply...
```

Indentation: each depth level indents 24px with a thin vertical connector line (`border-left: 2px solid var(--chat-border)`).

---

## 4. Message Board / Forum Layout — NEW

For apps that need topic-based discussions (like GitHub Discussions, Discourse, or Reddit):

```tsx
<ChatBoard
  topics={topics}                    // List of discussion topics
  activeTopic={activeTopic}          // Currently viewed topic
  onSelectTopic={(id) => {}}
  onCreateTopic={() => {}}
>
  {/* Topic list view (when no topic selected) */}
  <ChatBoardTopicList>
    <ChatBoardTopic
      title="API rate limiting proposal"
      author="Alex"
      replyCount={14}
      lastActivity={Date}
      isPinned={true}
      tags={["feature", "api"]}
    />
  </ChatBoardTopicList>

  {/* Thread view (when topic selected) */}
  <ChatNestedThread 
    messages={topicMessages}
    showVotes={true}
  />
</ChatBoard>
```

---

## 5. Forwarding — Complete Spec

Forward a message to another conversation or user:

```tsx
<ChatForwardDialog
  message={messageToForward}         // The message being forwarded
  conversations={allConversations}   // Available forward targets
  onForward={(targetIds) => {}}      // Can forward to multiple targets
  onCancel={() => {}}
  
  // Shows: message preview + searchable conversation list + multi-select
  // Optional: "Add a message" text input to include a note with the forward
/>
```

The forwarded message renders in the target conversation with a "Forwarded from [Name]" label and a slightly different visual treatment (indented with a forwarding icon).

```tsx
// Forwarded message data shape
interface ForwardedMessage extends ChatMessageData {
  isForwarded: true
  originalSender: { name: string; avatar?: string }
  forwardedBy: { name: string }
  forwardNote?: string               // Optional note added when forwarding
}
```

---

## 6. Message Editing — Complete Spec

```tsx
// Trigger edit mode
<ChatMessage
  message={msg}
  onEdit={(msg) => setEditingMessage(msg)}
/>

// When editing, the composer switches to edit mode
<ChatComposer
  editingMessage={editingMessage}    // Pre-fills composer with message text
  onSave={(newContent) => {}}        // Save edit
  onCancelEdit={() => {}}            // Cancel (Escape key)
  
  // Visual: composer has a yellow/amber top bar: "Editing message · Cancel"
  // The original message in the list shows a yellow highlight while editing
/>

// Edited messages show "(edited)" label
<ChatMessage
  message={{ ...msg, isEdited: true, editedAt: Date }}
  // Shows: subtle "(edited)" text next to timestamp
  // Optional: click "(edited)" to see edit history
/>
```

---

## 7. Message Deletion — Complete Spec

```tsx
// Delete options
<ChatMessage
  message={msg}
  onDelete={(msgId, type) => {}}
  // type: "for-me" | "for-everyone"
/>

// Deleted message placeholder (when deleted for everyone)
<ChatDeletedMessage
  deletedBy="Alex"
  deletedAt={Date}
/>
// Renders as: "🚫 Alex deleted this message" in muted italic text
// Same position in the message list, preserves thread structure

// Deleted for-me: message simply disappears from the user's view
```

---

## 8. Pinning — Complete Spec

```tsx
// Pin a message
<ChatMessage
  message={msg}
  onPin={(msgId) => {}}
  isPinned={msg.isPinned}
  // Pinned messages show a small pin icon in the top-right corner
  // Pin icon color: var(--chat-orange)
/>

// Pinned messages panel (slides in from right, like thread panel)
<ChatPinnedPanel
  pinnedMessages={pinnedMsgs}
  onUnpin={(msgId) => {}}
  onJumpTo={(msgId) => {}}          // Scroll to original message location
  onClose={() => {}}
/>
```

---

## 9. Search — Complete Spec

```tsx
<ChatSearch
  onSearch={(query) => Promise<SearchResult[]>}
  onSelect={(result) => {}}          // Navigate to message
  onClose={() => {}}
  
  // Opens as a command-palette overlay (Cmd+K / Ctrl+K)
  // Shows: search input + filtered results
  // Each result: message snippet (match highlighted), sender, time, conversation name
  // Click result → closes search, scrolls to message, flashes highlight
/>

interface SearchResult {
  messageId: string
  conversationId: string
  conversationName: string
  senderName: string
  snippet: string                    // Text with <mark> around matches
  timestamp: Date
}
```

---

## 10. File Sharing & Media — All Types

| Type | Component | Features |
|---|---|---|
| **Image** | `<ChatMessageImage>` | Gallery grid, lightbox, lazy load, blur placeholder |
| **Video** | `<ChatMessageVideo>` | Inline player, play on hover, thumbnail |
| **File** | `<ChatMessageFile>` | Icon by extension, name, size, download button |
| **Voice** | `<ChatMessageVoice>` | SVG waveform, play/pause, scrub, speed control |
| **PDF** | `<ChatMessageFile>` | File card with PDF icon + page count |
| **Code snippet** | `<ChatMessageCode>` | Syntax highlighting, copy, language label |
| **Link preview** | `<ChatMessageLink>` | OG card with image, title, description |
| **Location** | `<ChatMessageLocation>` | Static map image + "Open in Maps" link |
| **Contact card** | `<ChatMessageContact>` | Name, phone, email, "Add contact" button |
| **Poll** | `<ChatMessagePoll>` | Question + options + vote counts + user vote |
| **GIF** | `<ChatMessageImage>` | Auto-plays, no audio, treated as image variant |
| **Sticker** | `<ChatMessageSticker>` | Larger display, no bubble background |

---

## 11. Presence & Status — Complete System

```tsx
type UserPresence = 
  | "online"                        // Green dot
  | "away"                          // Yellow dot (idle > 5 min)
  | "dnd"                           // Red dot (do not disturb)
  | "offline"                       // Gray dot
  | "invisible"                     // No dot shown to others

// Custom status message
interface UserStatus {
  presence: UserPresence
  statusText?: string               // "In a meeting" / "On vacation"
  statusEmoji?: string              // "🏖️"
  clearAt?: Date                    // Auto-clear time
}

<ChatPresence 
  status={user.presence}
  statusText={user.statusText}
  statusEmoji={user.statusEmoji}
  size="sm"                         // "sm" (10px) | "md" (12px) | "lg" (16px)
/>
```

---

## 12. Keyboard Shortcuts — Full Map

| Shortcut | Action |
|---|---|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Escape` | Cancel reply / cancel edit / close thread / close search |
| `Cmd/Ctrl + K` | Open search |
| `Cmd/Ctrl + /` | Open keyboard shortcuts help |
| `↑` (in empty composer) | Edit last sent message |
| `Tab` | Focus next suggestion pill |
| `@` | Open mention picker |
| `:` | Open emoji autocomplete (`:fire:` → 🔥) |

---

## 13. Events & Callbacks — Complete API

Every user action emits a callback. The developer's backend handles the logic:

```tsx
<ChatProvider
  // Message lifecycle
  onSend={(content: MessageContent) => Promise<void>}
  onEdit={(messageId: string, newContent: string) => Promise<void>}
  onDelete={(messageId: string, type: "for-me" | "for-everyone") => Promise<void>}
  onForward={(messageId: string, targetIds: string[]) => Promise<void>}
  onPin={(messageId: string) => Promise<void>}
  onUnpin={(messageId: string) => Promise<void>}
  
  // Reactions
  onReactionAdd={(messageId: string, emoji: string) => Promise<void>}
  onReactionRemove={(messageId: string, emoji: string) => Promise<void>}
  
  // Threads
  onThreadOpen={(messageId: string) => void}
  onThreadReply={(parentId: string, content: MessageContent) => Promise<void>}
  
  // Media
  onFileUpload={(files: File[]) => Promise<UploadResult[]>}
  onFileDownload={(fileId: string) => void}
  
  // Conversation
  onConversationSelect={(id: string) => void}
  onConversationCreate={() => void}
  onConversationMute={(id: string) => void}
  onConversationDelete={(id: string) => void}
  
  // Presence
  onTypingStart={() => void}
  onTypingStop={() => void}
  onPresenceChange={(status: UserPresence) => void}
  
  // Search
  onSearch={(query: string) => Promise<SearchResult[]>}
  
  // AI-specific
  onStop={() => void}
  onRegenerate={(messageId: string) => void}
  onFeedback={(messageId: string, type: "positive" | "negative", text?: string) => void}
  onSuggestionSelect={(suggestion: string) => void}
  
  // History
  onLoadMore={() => Promise<void>}  // Infinite scroll (older messages)
  
  // Voting (for nested threads / message boards)
  onVote={(messageId: string, direction: "up" | "down") => void}
/>
```

---

## 14. Pre-Built Layouts — Updated to 6

| Layout | Use Case | Components Assembled |
|---|---|---|
| **FullMessenger** | Slack/Discord team messaging | Sidebar + Main + Thread panel |
| **ChatWidget** | Intercom-style support widget | Floating button → expand → chat |
| **InlineChat** | Comments section, embedded discussions | Messages + Composer, no sidebar |
| **AIChat** | ChatGPT/Claude-style AI conversation | Single convo + streaming + suggestions + feedback |
| **ChatBoard** | Forum/discussion board (Reddit-style) | Topic list → nested thread with votes |
| **LiveChat** | Twitch/YouTube live stream chat | Compact, fast-scroll, badges, no replies |

Each layout is a pre-composed arrangement of the primitive components. The developer can use a layout as-is or disassemble it and rearrange the pieces.

---

## 15. Final Feature Checklist

### Messaging Core
- [x] Text messages with markdown
- [x] Message grouping (same sender, time window)
- [x] Date separators
- [x] System messages (joined, left, renamed)
- [x] Reply-to (inline quote)
- [x] Forwarding with forward dialog
- [x] Editing with "(edited)" label
- [x] Deletion with placeholder
- [x] Pinning with pinned panel
- [x] Search with command palette

### Media & Content
- [x] Image (single + gallery grid + lightbox)
- [x] Video (inline player)
- [x] File attachment (icon + download)
- [x] Voice message (waveform + player)
- [x] Code block (syntax highlighted)
- [x] Link preview (OG card)
- [x] Location sharing
- [x] Contact card
- [x] Poll
- [x] GIF / sticker

### Social & Interaction
- [x] Reactions (emoji pills)
- [x] @Mentions with user picker
- [x] Emoji picker (built-in + Emoji Mart)
- [x] Typing indicator (single + multi)
- [x] Read receipts (1:1 + group)
- [x] Presence (online/away/dnd/offline)
- [x] Custom status text + emoji
- [x] Unread badge (count + mentions)

### Threading & Structure
- [x] Flat thread (Slack-style side panel)
- [x] Nested thread (Reddit-style with indentation)
- [x] Vote counts (up/down) for nested threads
- [x] Collapsible sub-threads
- [x] Topic/board list for forum layout

### AI-Specific
- [x] Token-by-token streaming
- [x] Streaming markdown (handles incomplete blocks)
- [x] Blinking cursor during stream
- [x] Stop generating button
- [x] Regenerate button
- [x] Thinking/reasoning block (collapsible)
- [x] Suggested replies / quick actions
- [x] Feedback buttons (thumbs up/down)
- [x] Model selector
- [x] Token count display
- [x] Welcome/empty state

### UX & Polish
- [x] Auto-scroll with smart anchoring
- [x] Reverse infinite scroll (load history)
- [x] Scroll-to-bottom FAB with unread count
- [x] Unread message marker line
- [x] Keyboard shortcuts (full map)
- [x] Drag-and-drop file upload
- [x] Composer auto-resize (1-6 lines)
- [x] Mobile responsive (full-screen navigation)
- [x] Three themes (Lunar / Aurora / Ember)
- [x] Dark mode for all themes
- [x] Accessibility (WCAG 2.1 AA)
- [x] Reduced motion support
- [x] RTL support

### Developer Experience
- [x] shadcn CLI install (one command)
- [x] Zero runtime state (stateless, prop-driven)
- [x] Backend agnostic (works with any stack)
- [x] AI SDK agnostic (works with any streaming source)
- [x] TypeScript (full type coverage)
- [x] 6 pre-built layouts
- [x] Every action exposed as a callback
- [x] CSS variable theming
- [x] Copy-paste code ownership

---

## Summary

chatcn now covers every messaging pattern a developer would encounter:

**Human-to-human messaging** → FullMessenger layout with reactions, threads, read receipts, typing indicators, file sharing, forwarding, editing, deleting, pinning, search.

**AI chat / LLM interfaces** → AIChat layout with streaming (token-by-token with no jank), streaming markdown (handles incomplete code blocks), stop/regenerate, thinking blocks, suggested replies, feedback buttons, model selector. Works with ANY streaming source — not locked to Vercel AI SDK.

**Discussion forums / message boards** → ChatBoard layout with nested threading, vote counts, collapsible sub-threads, topic lists, sorting by votes/newest/oldest.

**Comments sections** → InlineChat layout with minimal variant, flat or nested replies, optional voting.

**Live stream chat** → LiveChat layout optimized for high-speed message flow.

**Customer support** → ChatWidget layout with Intercom-style floating expand/collapse.

The developer installs one library and builds any of these by choosing a layout and wiring up their backend callbacks. No feature is missing. No use case is uncovered.
