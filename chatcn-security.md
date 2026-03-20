# chatcn — Security Addendum

## Everything a developer needs to know to ship chatcn safely.

This document covers every security concern for a frontend chat component library. Even though chatcn is stateless (no backend, no persistence), it renders user-generated content — which is the #1 attack vector on the web.

---

## 1. XSS Prevention — The Big One

Cross-site scripting is the primary threat. Users type messages. Those messages render in other users' browsers. If you render unsanitized HTML, you're handing attackers the keys.

### 1.1 Plain Text Messages

**Rule: Never use `dangerouslySetInnerHTML` for message text. Ever.**

All plain text message content must render through React's JSX text nodes, which auto-escape HTML entities. This is the default and it's safe:

```tsx
// ✅ SAFE — React escapes <script> etc. automatically
<p>{message.text}</p>

// ❌ DANGEROUS — Never do this with user content
<p dangerouslySetInnerHTML={{ __html: message.text }} />
```

chatcn must enforce this in every text rendering path: message bubbles, sender names, conversation titles, file names, link preview titles, system messages — anywhere user-supplied strings appear.

### 1.2 Markdown Rendering

When `renderMarkdown={true}`, chatcn passes message text through `react-markdown`. This is where XSS risk spikes.

**Mitigations (all required):**

```tsx
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// ✅ react-markdown is safe by default — it does NOT render raw HTML
// But we must explicitly block it in case of plugin misconfiguration
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  // CRITICAL: Never enable rehypeRaw or any raw HTML plugins
  // rehypePlugins={[rehypeRaw]}  ← NEVER ADD THIS
  
  // Allowlist specific HTML elements that markdown can produce
  allowedElements={[
    "p", "strong", "em", "code", "pre", "a", "ul", "ol", "li",
    "blockquote", "h1", "h2", "h3", "h4", "h5", "h6", "hr",
    "table", "thead", "tbody", "tr", "th", "td", "del", "br"
  ]}
  
  // Override link rendering to enforce security
  components={{
    a: ({ href, children }) => (
      <a
        href={sanitizeUrl(href)}           // See URL sanitization below
        target="_blank"
        rel="noopener noreferrer"          // Prevent tab-napping
        onClick={(e) => {
          // Optional: warn before navigating to external links
        }}
      >
        {children}
      </a>
    ),
    // Override code blocks to prevent injection via language names
    code: ({ className, children }) => {
      const language = className?.replace("language-", "") || ""
      const safeLang = language.replace(/[^a-zA-Z0-9-]/g, "") // Alphanumeric only
      return <code className={`language-${safeLang}`}>{children}</code>
    }
  }}
>
  {message.text}
</ReactMarkdown>
```

**Key rules:**
- NEVER add `rehype-raw` or any plugin that passes raw HTML through
- NEVER add `rehype-sanitize` as a replacement for proper allowlisting (it's been bypassed before)
- Always override the `<a>` renderer to sanitize URLs
- Always override `<code>` to sanitize language class names

### 1.3 Auto-Linking URLs

When chatcn auto-links URLs in plain text messages (detecting `https://...` patterns), the generated `<a>` tags must be sanitized:

```tsx
function sanitizeUrl(url: string | undefined): string {
  if (!url) return "#"
  
  // Only allow http, https, and mailto protocols
  const allowed = /^(https?:\/\/|mailto:)/i
  if (!allowed.test(url.trim())) {
    return "#"  // Block javascript:, data:, vbscript:, etc.
  }
  
  return url
}
```

**Blocked protocols:**
- `javascript:` — Classic XSS vector (`javascript:alert(1)`)
- `data:` — Can embed executable content (`data:text/html,<script>...`)
- `vbscript:` — Legacy IE vector
- `blob:` — Can reference attacker-controlled content
- Any protocol not explicitly `http://`, `https://`, or `mailto:`

### 1.4 Mentions (@)

Mention rendering inserts user names into messages. User names are user-controlled content.

```tsx
// ✅ SAFE — render mention as a React text node
<span className="chat-mention">@{mention.name}</span>

// ❌ DANGEROUS — if name contains HTML
<span dangerouslySetInnerHTML={{ __html: `@${mention.name}` }} />
```

Mention names must be treated as untrusted text. Even though your app's backend should validate usernames, chatcn cannot assume the backend did its job.

### 1.5 Code Blocks (Shiki)

When using Shiki for syntax highlighting, the output is pre-tokenized HTML. Shiki itself is safe (it generates `<span>` tokens with class names), but:

- The `language` prop must be validated against Shiki's known language list
- The code content must NOT be pre-processed or interpreted before passing to Shiki
- Shiki's output is the one case where `dangerouslySetInnerHTML` is acceptable — but ONLY for Shiki's own output, never for user text

```tsx
// ✅ Shiki generates safe HTML — this is okay
const html = shiki.codeToHtml(code, { lang: validatedLanguage })
<div dangerouslySetInnerHTML={{ __html: html }} />

// But validate the language first
const VALID_LANGUAGES = new Set(["javascript", "typescript", "python", ...])
const validatedLanguage = VALID_LANGUAGES.has(lang) ? lang : "text"
```

---

## 2. Content Security Policy (CSP) Considerations

chatcn should work with strict CSP headers. This means:

### 2.1 No Inline Styles via JavaScript

All styling must use Tailwind classes or CSS variables. Never generate style strings from user content:

```tsx
// ❌ DANGEROUS — user could inject CSS that exfiltrates data
<div style={{ background: userProvidedColor }}>

// ✅ SAFE — use predefined CSS variable tokens
<div className="bg-chat-bubble-incoming">
```

### 2.2 No eval() or new Function()

chatcn must never use `eval()`, `new Function()`, or `setTimeout(string)`. This is obvious but worth documenting since some animation libraries use these internally.

### 2.3 Image Sources

User avatar URLs and message image URLs are user-controlled. CSP `img-src` directives will govern what loads. chatcn should:

- Document that developers need to configure CSP `img-src` for their image hosting domains
- Provide an `imageFallback` prop for when images fail to load (broken avatar, missing image)
- Never use `<img>` `onerror` handlers that execute arbitrary code

```tsx
// ✅ Safe image with fallback
<img 
  src={avatarUrl} 
  alt={userName}
  onError={(e) => {
    e.currentTarget.src = "/fallback-avatar.png"  // Static, known-safe URL
  }}
/>
```

---

## 3. File Upload Security

chatcn renders file attachments and handles drag-and-drop upload UX. The actual upload goes to the developer's backend, but chatcn must enforce frontend validation:

### 3.1 File Type Validation

```tsx
const ALLOWED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  documents: ["application/pdf", "text/plain", "text/csv"],
  archives: ["application/zip"],
  // Explicitly NO: .exe, .bat, .cmd, .scr, .js, .html, .svg, .xml
}

const BLOCKED_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".scr", ".pif", ".com",  // Executables
  ".js", ".jsx", ".ts", ".tsx", ".mjs",              // Scripts
  ".html", ".htm", ".xhtml",                          // HTML (XSS)
  ".svg",                                              // SVG (embedded JS)
  ".xml", ".xsl", ".xslt",                            // XML (XXE)
  ".hta", ".vbs", ".vbe", ".wsf", ".wsh",             // Windows script
  ".ps1", ".psm1",                                     // PowerShell
  ".sh", ".bash",                                      // Shell scripts
])

function validateFile(file: File): { valid: boolean; error?: string } {
  // Check extension
  const ext = "." + file.name.split(".").pop()?.toLowerCase()
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `File type ${ext} is not allowed` }
  }
  
  // Check MIME type (but don't trust it alone — MIME can be spoofed)
  // This is defense in depth, not the sole check
  
  // Check file size
  const MAX_SIZE = 25 * 1024 * 1024  // 25MB default
  if (file.size > MAX_SIZE) {
    return { valid: false, error: "File exceeds maximum size of 25MB" }
  }
  
  return { valid: true }
}
```

**CRITICAL: SVG files must be blocked.** SVGs can contain `<script>` tags, `onload` handlers, and foreign objects that execute JavaScript. Never allow SVG uploads in a chat context. If SVG display is needed, it must be sanitized server-side with a tool like DOMPurify or served with `Content-Type: image/svg+xml` and strict CSP.

### 3.2 File Name Sanitization

File names are user-controlled and displayed in the UI:

```tsx
function sanitizeFileName(name: string): string {
  // Remove path traversal
  const stripped = name.replace(/[/\\]/g, "_")
  // Remove null bytes
  const noNull = stripped.replace(/\0/g, "")
  // Truncate to prevent UI overflow attacks
  const truncated = noNull.length > 100 ? noNull.slice(0, 97) + "..." : noNull
  // The name is rendered as a React text node (auto-escaped), but sanitize anyway
  return truncated
}
```

### 3.3 Image Rendering Security

User-uploaded images can be attack vectors:

- **EXIF data**: Images may contain GPS coordinates, camera info, or embedded thumbnails. chatcn should document that the backend should strip EXIF before serving. The frontend cannot strip EXIF.
- **Image bombs**: A 1x1 pixel PNG that decompresses to 64GB. chatcn should set `max-width` and `max-height` CSS constraints, but the real defense is backend image processing.
- **Polyglot files**: Files that are valid both as images and as HTML/JS. Only the backend can detect these.

chatcn's responsibility: render images with constrained dimensions and display errors gracefully if loading fails.

---

## 4. Link Preview Security

`<ChatMessageLink>` renders rich previews with title, description, and image from Open Graph metadata. All three fields are fetched from external URLs.

### 4.1 Server-Side Only

**chatcn must NEVER fetch link previews client-side.** This would expose:
- **SSRF** (Server-Side Request Forgery) if done from the backend incorrectly
- **Data exfiltration** if the preview URL is a tracking pixel
- **IP exposure** if the client fetches directly

Link preview data must be passed as props (pre-fetched by the developer's backend):

```tsx
// ✅ Backend fetches OG metadata, passes to chatcn as props
<ChatMessageLink
  url="https://example.com/article"
  title={ogTitle}         // Pre-fetched by backend
  description={ogDesc}    // Pre-fetched by backend
  image={ogImage}         // Pre-fetched by backend
/>
```

### 4.2 Preview Content Sanitization

Even pre-fetched OG metadata is attacker-controlled (the linked site controls its own meta tags):

```tsx
// Title and description: render as plain text (React auto-escapes)
<h3>{preview.title}</h3>
<p>{preview.description}</p>

// Image: validate URL protocol
<img src={sanitizeUrl(preview.image)} alt="" />

// URL display: show the hostname, not the full URL (prevents misleading long URLs)
<span className="text-muted-foreground text-xs">
  {new URL(preview.url).hostname}
</span>
```

---

## 5. Emoji & Reaction Security

### 5.1 Emoji Injection

Reactions use emoji characters. If reactions are stored as arbitrary strings (not validated), attackers could inject non-emoji content:

```tsx
// ✅ Validate that a reaction is actually an emoji
function isValidEmoji(str: string): boolean {
  // Use a regex that matches Unicode emoji sequences
  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(\u200D(\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*$/u
  return emojiRegex.test(str) && str.length <= 20  // Max length to prevent abuse
}

// Before rendering a reaction
if (!isValidEmoji(reaction.emoji)) return null
```

### 5.2 Reaction Count Manipulation

chatcn renders reaction counts from props. Display logic should handle:
- Negative counts (display 0)
- Extremely large counts (cap display at "999+")
- Zero counts (don't render the pill)

---

## 6. Denial of Service (Client-Side)

### 6.1 Message Bomb

An attacker sends a message with 100,000 characters or 10,000 lines. Without protection, this freezes the browser during rendering.

**Mitigations:**

```tsx
const MAX_MESSAGE_LENGTH = 10_000   // Characters
const MAX_MESSAGE_LINES = 200       // Lines before "Show more"

function TruncatedMessage({ text }: { text: string }) {
  const truncated = text.length > MAX_MESSAGE_LENGTH
    ? text.slice(0, MAX_MESSAGE_LENGTH) + "…"
    : text
  
  const lines = truncated.split("\n")
  const needsCollapse = lines.length > MAX_MESSAGE_LINES
  
  // Show first N lines with a "Show more" button
  // ...
}
```

### 6.2 Reaction Bomb

An attacker adds thousands of unique reactions to a single message.

**Mitigation:** `maxReactionsPerMessage` prop (default 8). After the limit, show "+N more" and block new additions in the UI.

### 6.3 Conversation Bomb

The conversation list receives thousands of items.

**Mitigation:** Virtualize `<ChatConversationList>` with `@tanstack/react-virtual` when items > 100. Document this in the performance guide.

### 6.4 Image Gallery Bomb

A message with 500 images.

**Mitigation:** Cap gallery grid at 4 visible images + "+N" overlay. The lightbox can show all, but the inline render is capped.

### 6.5 Typing Indicator Spam

Rapidly toggling typing state to annoy users.

**Mitigation:** The `useTypingIndicator` hook debounces outgoing typing signals (2 second minimum interval). For incoming indicators, chatcn renders whatever the backend sends — rate limiting is the backend's job.

---

## 7. Privacy Considerations

### 7.1 Read Receipts

Read receipts expose when a user read a message. This is a privacy-sensitive feature.

- Default: `enableReadReceipts={false}` — opt-in, not opt-out
- Document clearly that enabling read receipts means users can see when their messages were read
- The developer's app should provide users with a setting to disable their own read receipts

### 7.2 Presence / Online Status

Presence indicators (`<ChatPresence>`) show when someone is online. Same privacy concern.

- Default: `enablePresence={false}` — opt-in
- Document that presence data should be user-controllable

### 7.3 Typing Indicator

Typing indicators reveal that someone is composing a message, even if they never send it.

- Default: `enableTypingIndicator={true}` (this is expected UX in most chat apps)
- Document that developers should let users opt out

### 7.4 Avatar URLs

Avatar URLs can be tracking pixels. If Alice's avatar is `https://tracker.evil.com/pixel.png?user=bob`, Bob's browser fetches that URL when viewing Alice's message, leaking Bob's IP and timing.

**Mitigation options (document these for developers):**
- Proxy all avatar images through your own CDN/backend
- Use CSP `img-src` to restrict image origins
- Provide a default avatar component that renders initials instead of fetching an image

### 7.5 Link Click Tracking

When a user clicks a link in a message, the destination site knows they clicked. `target="_blank"` with `rel="noopener noreferrer"` prevents the destination from accessing `window.opener` but does NOT prevent tracking.

Document that developers should consider:
- Link click confirmation dialogs for external URLs
- Proxying links through their backend to strip referrer headers

---

## 8. Accessibility as Security

Accessibility issues can become security issues when they prevent users from understanding what's happening:

### 8.1 Spoofed Sender Names

If sender names aren't visually distinct, an attacker could name themselves "System" or "Admin" and send messages that look like system messages.

**Mitigation:** System messages (`<ChatSystemMessage>`) must have a clearly different visual treatment from user messages — different layout, centered, no avatar, distinct styling. Never render user messages in the system message style based on the sender's name.

### 8.2 Homoglyph Attacks in Usernames

An attacker creates a username "Аdmin" (Cyrillic "А") to impersonate "Admin" (Latin "A"). This is a backend validation concern, but chatcn can help:

- Render usernames in a font with good Unicode coverage that makes homoglyphs more distinguishable
- Document that backends should normalize Unicode in usernames

### 8.3 Right-to-Left Override (RLO)

The Unicode character U+202E (Right-to-Left Override) can make text appear reversed, disguising malicious filenames: `photo_\u202Eexe.jpg` appears as `photo_gpj.exe`.

**Mitigation:** Strip bidirectional override characters from displayed text:

```tsx
function stripBidiOverrides(text: string): string {
  // Remove LRO, RLO, LRE, RLE, PDF, LRI, RLI, FSI, PDI
  return text.replace(/[\u202A-\u202E\u2066-\u2069]/g, "")
}
```

Apply this to: file names, sender names, conversation titles, and any user-provided string displayed in the UI.

---

## 9. Security Defaults — The Checklist

chatcn ships with these security defaults. Developers can loosen them but must do so explicitly:

| Setting | Default | Reason |
|---------|---------|--------|
| Markdown raw HTML | **Blocked** | XSS prevention |
| Allowed link protocols | **http, https, mailto only** | Block javascript: and data: URIs |
| External links | **target="_blank" rel="noopener noreferrer"** | Prevent tab-napping |
| SVG file uploads | **Blocked** | SVG can contain scripts |
| Max message render length | **10,000 chars** | Prevent rendering DoS |
| Max reactions per message | **8** | Prevent reaction spam |
| Max gallery images inline | **4** | Prevent image bomb |
| Read receipts | **Off** | Privacy by default |
| Presence indicators | **Off** | Privacy by default |
| File size limit (UI) | **25MB** | Prevent accidental large uploads |
| Bidi override stripping | **On** | Prevent text spoofing |
| Emoji validation | **On** | Prevent non-emoji injection in reactions |

---

## 10. What chatcn Does NOT Handle (Backend's Job)

chatcn is a UI library. These security concerns belong to the developer's backend, but chatcn's docs should list them explicitly so developers don't assume chatcn handles them:

1. **Authentication & Authorization** — Who can send messages where. Not chatcn's concern.
2. **Message persistence & encryption** — E2E encryption, at-rest encryption. Backend.
3. **Rate limiting** — Preventing message flood. Backend.
4. **Content moderation** — Detecting hate speech, spam, NSFL images. Backend.
5. **SSRF prevention** — When fetching link previews server-side. Backend.
6. **File scanning** — Malware detection in uploaded files. Backend.
7. **EXIF stripping** — Removing metadata from uploaded images. Backend.
8. **Image re-encoding** — Re-encoding uploads to strip polyglot payloads. Backend.
9. **Input length validation** — Maximum message length enforcement. Backend (chatcn truncates for display but doesn't prevent sending).
10. **Audit logging** — Tracking who sent/edited/deleted what. Backend.

---

## 11. Security Documentation for chatcn.dev

The docs site should include a dedicated `/docs/security` page covering:

1. How chatcn prevents XSS (with code examples)
2. Recommended CSP headers for apps using chatcn
3. File upload best practices
4. Privacy features and their defaults
5. The "Backend's Job" checklist above
6. How to report security vulnerabilities (security@chatcn.dev or GitHub security advisories)
7. Version policy — security patches backported to latest minor

This page doubles as trust-building marketing. Enterprise developers specifically look for security documentation before adopting a library.

---

## Summary

The three most important security rules for chatcn:

1. **Never use `dangerouslySetInnerHTML` with user content.** React's auto-escaping is your first line of defense. The only exception is Shiki's pre-tokenized code output.

2. **Sanitize all URLs.** Every `href` in the rendered output must pass through `sanitizeUrl()` that blocks everything except `http://`, `https://`, and `mailto:`.

3. **Validate and constrain all user-supplied data before rendering.** File names, emoji reactions, message length, image counts, sender names — every prop that comes from user input gets validated and truncated.

Ship with secure defaults. Document the backend's responsibilities. Make the security page a first-class citizen in the docs. Enterprise developers will star the repo just for the security documentation alone.
