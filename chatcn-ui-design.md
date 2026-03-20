# chatcn — UI Design Bible

## Visual language inspired by iMessage, Claude, Linear, and Apple's Liquid Glass.
## This is the document a developer follows pixel by pixel.

---

## 1. Design Philosophy — Three Words

**Clarity. Warmth. Depth.**

Not "modern." Not "clean." Not "minimal." Those are lazy words that produce lazy interfaces. chatcn follows three specific principles stolen from the best:

**Clarity** (from Apple HIG): Every element serves exactly one purpose. The UI disappears — you see the conversation, not the interface. No decoration. No element competes with the message content. Typography does the heavy lifting. The hierarchy is so obvious a five-year-old gets it.

**Warmth** (from iMessage + Claude): Chat is human. The interface should feel alive and personal — not like a database viewer with bubbles. Soft corners. Gentle animations. Colors that feel organic, not clinical. The subtle difference between "a chat app" and "talking to someone."

**Depth** (from Apple Liquid Glass + Linear): Layered surfaces. The sidebar sits behind the main panel. The hover toolbar floats above the message. The reply preview slides up from behind the composer. Every element has a clear z-position. Not flat, not skeuomorphic — spatial.

---

## 2. The Reference Stack — What We Steal From Each

### From iMessage (iOS 26 / Liquid Glass)
- Bubble shape and tail geometry
- Message grouping behavior (consecutive messages merge)
- Tapback reactions (long-press emoji picker)
- Delivery status indicators (sent → delivered → read)
- The feeling that the conversation IS the interface
- Liquid Glass translucency on header and composer

### From Claude (claude.ai)
- The centered, content-first layout
- Generous whitespace between messages
- The warm but neutral color palette (no aggressive brand colors)
- The auto-growing composer textarea
- The feeling of talking to something intelligent and calm
- The way Claude renders code blocks, markdown, and long-form content inline

### From Linear
- The sidebar density and navigation patterns
- Keyboard-first interaction design
- The dark mode palette (deep charcoals, not pure black)
- Micro-animations on state changes (200ms ease-out, never bouncy)
- The command palette (Cmd+K) for search

### From Google Messages / Google Chat
- Material You color extraction (adaptive accent colors)
- Rich link preview cards
- The compact group chat variant
- Smart reply suggestions UI

---

## 3. Typography

### Font Stack

```css
--chat-font-sans: "SF Pro Display", "SF Pro Text", -apple-system, 
                  BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
--chat-font-mono: "SF Mono", "JetBrains Mono", "Fira Code", 
                  ui-monospace, monospace;
```

SF Pro is the iMessage font. On non-Apple systems, the system font stack takes over. This gives the chatcn that native Apple feel on macOS/iOS while looking correct everywhere else.

If the developer has a custom font in their Tailwind config, chatcn inherits it. The above is the fallback.

### Type Scale

```
Sender name:      14px / 600 weight / tracking -0.01em / text-foreground
Message text:     15px / 400 weight / tracking -0.01em / text-foreground  
Timestamp:        11px / 400 weight / tracking  0.02em / text-muted-foreground
System message:   13px / 500 weight / tracking  0.01em / text-muted-foreground
Composer input:   15px / 400 weight / tracking -0.01em / text-foreground
Conversation title: 15px / 600 weight / tracking -0.02em / text-foreground
Last message preview: 13px / 400 weight / tracking 0 / text-muted-foreground
Badge count:      11px / 700 weight / tabular-nums / text-primary-foreground
Code block:       13px / 400 weight / font-mono / tracking 0
```

**Why 15px for messages, not 14px or 16px?** 14px is too small for sustained reading. 16px feels like a document, not a chat. 15px is the sweet spot — readable but conversational. iMessage uses 17px on iOS (which maps to roughly 15px at web DPI).

**Negative letter-spacing on names and messages** is the Apple touch. SF Pro is designed for it. It makes text feel tighter and more refined, like you're reading a real Apple app.

---

## 4. Color Palette

### Light Mode

```css
/* Backgrounds — Layered from back to front */
--chat-bg-app:         #FAFAFA;     /* App background (behind sidebar) */
--chat-bg-sidebar:     #F5F5F5;     /* Sidebar surface */
--chat-bg-main:        #FFFFFF;     /* Main conversation area */
--chat-bg-header:      rgba(255, 255, 255, 0.72);  /* Frosted glass header */
--chat-bg-composer:    rgba(255, 255, 255, 0.80);  /* Frosted glass composer */

/* Bubbles */
--chat-bubble-outgoing:     #007AFF;     /* Apple Blue — the iMessage blue */
--chat-bubble-outgoing-text: #FFFFFF;
--chat-bubble-incoming:     #E9E9EB;     /* iMessage gray */
--chat-bubble-incoming-text: #1C1C1E;

/* Accents */
--chat-accent:         #007AFF;     /* Primary interactive color */
--chat-accent-soft:    rgba(0, 122, 255, 0.08);  /* Hover states */
--chat-green:          #34C759;     /* Online, success, delivered */
--chat-orange:         #FF9500;     /* Away, warning */
--chat-red:            #FF3B30;     /* DND, error, unread badge */

/* Text */
--chat-text-primary:   #1C1C1E;     /* Apple system label */
--chat-text-secondary: #8E8E93;     /* Apple secondary label */
--chat-text-tertiary:  #C7C7CC;     /* Apple tertiary label */

/* Borders */
--chat-border:         rgba(0, 0, 0, 0.06);   /* Barely visible dividers */
--chat-border-strong:  rgba(0, 0, 0, 0.12);   /* Sidebar/panel borders */

/* Shadows */
--chat-shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.04);
--chat-shadow-md:  0 4px 12px rgba(0, 0, 0, 0.06);
--chat-shadow-lg:  0 8px 30px rgba(0, 0, 0, 0.08);
--chat-shadow-toolbar: 0 2px 16px rgba(0, 0, 0, 0.10);
```

### Dark Mode

```css
/* Backgrounds — Depth through subtle lightness differences */
--chat-bg-app:         #000000;     /* True black (OLED-friendly, like iMessage) */
--chat-bg-sidebar:     #1C1C1E;     /* Apple elevated surface */
--chat-bg-main:        #000000;     /* True black main area */
--chat-bg-header:      rgba(28, 28, 30, 0.72);   /* Frosted dark glass */
--chat-bg-composer:    rgba(28, 28, 30, 0.80);   /* Frosted dark glass */

/* Bubbles */
--chat-bubble-outgoing:     #0A84FF;     /* Apple Blue (dark adjusted) */
--chat-bubble-outgoing-text: #FFFFFF;
--chat-bubble-incoming:     #2C2C2E;     /* Elevated gray */
--chat-bubble-incoming-text: #FFFFFF;

/* Accents — slightly brighter in dark mode for contrast */
--chat-accent:         #0A84FF;
--chat-accent-soft:    rgba(10, 132, 255, 0.12);
--chat-green:          #30D158;
--chat-orange:         #FF9F0A;
--chat-red:            #FF453A;

/* Text */
--chat-text-primary:   #FFFFFF;
--chat-text-secondary: #8E8E93;
--chat-text-tertiary:  #48484A;

/* Borders */
--chat-border:         rgba(255, 255, 255, 0.06);
--chat-border-strong:  rgba(255, 255, 255, 0.10);

/* Shadows — darker and wider in dark mode */
--chat-shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.20);
--chat-shadow-md:  0 4px 16px rgba(0, 0, 0, 0.30);
--chat-shadow-lg:  0 8px 40px rgba(0, 0, 0, 0.40);
--chat-shadow-toolbar: 0 2px 20px rgba(0, 0, 0, 0.40);
```

### Why Apple Blue (#007AFF)?

Because it's the most universally recognized "this is a message from me" color in the world. 2 billion iPhone users see this blue every day. Using it as the default outgoing bubble color creates instant familiarity. Developers can override it with their brand color, but the default should feel like home.

---

## 5. Bubble Geometry — The Details That Make It Feel Real

### Shape

```css
/* Outgoing bubble (right side) */
.bubble-outgoing {
  border-radius: 18px 18px 4px 18px;   /* Bottom-right corner is tight */
  padding: 8px 14px;
  max-width: 75%;                        /* Never wider than 75% of container */
}

/* Incoming bubble (left side) */
.bubble-incoming {
  border-radius: 18px 18px 18px 4px;   /* Bottom-left corner is tight */
  padding: 8px 14px;
  max-width: 75%;
}

/* Grouped message (not first in group) — tighter corners */
.bubble-outgoing.grouped {
  border-radius: 18px 4px 4px 18px;    /* Top-right and bottom-right tight */
}
.bubble-incoming.grouped {
  border-radius: 4px 18px 18px 4px;    /* Top-left and bottom-left tight */
}

/* Last message in a group — restore the wide bottom corner */
.bubble-outgoing.group-last {
  border-radius: 18px 4px 18px 18px;   /* Only bottom-left stays round */
}
```

This creates the **stacking effect** where consecutive bubbles from the same person nestle together like puzzle pieces. iMessage does this. It's the #1 visual detail that separates amateur chat UIs from real ones.

### Spacing

```
Between different senders:     16px
Between grouped messages:      2px     ← Almost touching
Between date separator:        24px above and below
System message margin:         16px above and below
Message group to composer:     8px minimum
```

The 2px gap between grouped messages is critical. It's just enough to visually separate them without breaking the flow. 4px is too much. 0px makes them look broken.

### Tail (Optional Decorative Element)

iMessage has a small speech-bubble tail pointing to the sender. chatcn includes this as a CSS pseudo-element, enabled by default in the `bubble` variant:

```css
.bubble-outgoing.group-last::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: -6px;
  width: 12px;
  height: 12px;
  background: var(--chat-bubble-outgoing);
  clip-path: path("M 0 12 Q 0 0, 6 0 Q 0 0, 0 6 Z");
}
```

This creates a small curved tail that feels organic, not geometric. It's subtle — most users won't consciously notice it, but they'll feel the difference.

---

## 6. Frosted Glass Surfaces (Liquid Glass Influence)

The header and composer use `backdrop-filter: blur()` to create the Apple Liquid Glass effect. Content scrolls behind them, visible but blurred.

### Header

```css
.chat-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--chat-bg-header);          /* 72% opacity */
  backdrop-filter: blur(20px) saturate(180%); /* The magic */
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--chat-border);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
```

### Composer

```css
.chat-composer {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: var(--chat-bg-composer);        /* 80% opacity */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid var(--chat-border);
  padding: 8px 12px 8px 12px;
}
```

### Hover Toolbar (Message Actions)

```css
.message-toolbar {
  position: absolute;
  top: -4px;
  right: 8px;                                /* or left: 8px for incoming */
  background: var(--chat-bg-main);
  background: rgba(var(--chat-bg-main-rgb), 0.80);
  backdrop-filter: blur(12px);
  border: 1px solid var(--chat-border-strong);
  border-radius: 8px;
  padding: 2px;
  box-shadow: var(--chat-shadow-toolbar);
  display: flex;
  gap: 1px;
  
  /* Entrance animation */
  animation: toolbar-in 150ms ease-out;
  transform-origin: bottom center;
}

@keyframes toolbar-in {
  from { opacity: 0; transform: scale(0.95) translateY(4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
```

The blur creates the feeling that the toolbar is floating on a glass layer above the message. Combined with the shadow, it reads as a physical object hovering in space.

---

## 7. Animation System

### Principles
- **Duration:** 150-250ms for micro-interactions, 300-400ms for layout changes
- **Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1.0)` — Apple's default ease-out
- **Never bounce.** No spring physics. No elastic. chatcn is calm and precise.
- **Reduce motion:** Respect `prefers-reduced-motion` — collapse all animations to instant

### Message Enter Animation

New messages slide up from below with a gentle fade:

```css
@keyframes message-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-new {
  animation: message-enter 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0);
}

/* Outgoing messages can have a slightly different feel — scale from smaller */
.message-new.outgoing {
  animation: message-enter-outgoing 200ms cubic-bezier(0.25, 0.1, 0.25, 1.0);
}

@keyframes message-enter-outgoing {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### Typing Indicator

Three dots pulse in sequence. Inspired by iMessage but softer:

```css
.typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--chat-text-secondary);
  animation: typing-pulse 1.4s ease-in-out infinite;
}
.typing-dot:nth-child(1) { animation-delay: 0ms; }
.typing-dot:nth-child(2) { animation-delay: 160ms; }
.typing-dot:nth-child(3) { animation-delay: 320ms; }

@keyframes typing-pulse {
  0%, 60%, 100% { 
    opacity: 0.3; 
    transform: scale(1); 
  }
  30% { 
    opacity: 1; 
    transform: scale(1.15);  /* Subtle scale, not translateY bounce */
  }
}
```

Why scale instead of translateY? translateY (bouncing dots) looks playful but cheap. Scale (pulsing dots) looks refined and modern. Claude uses a similar pulsing pattern for its thinking indicator.

### Reaction Add Animation

When a reaction is added, the pill pops in with a quick scale:

```css
@keyframes reaction-pop {
  0%   { transform: scale(0); opacity: 0; }
  70%  { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
```

### Read Receipt Transition

The status check marks transition from gray to blue smoothly:

```css
.status-icon {
  transition: color 400ms ease-out;
}
.status-icon.read {
  color: var(--chat-accent);
}
```

### Scroll-to-Bottom FAB

Appears with a slide-up + fade, disappears with slide-down + fade:

```css
.scroll-anchor {
  transition: all 200ms cubic-bezier(0.25, 0.1, 0.25, 1.0);
}
.scroll-anchor.hidden {
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
}
.scroll-anchor.visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 8. Layout System — Pixel Specifications

### Full Messenger Layout (Desktop, >1024px)

```
┌──────────────────────────────────────────────────┐
│                    Full Width                      │
├────────────┬─────────────────────────────────────┤
│  Sidebar   │           Main Panel                 │
│  320px     │           flex: 1                    │
│  fixed     │                                      │
│            │  ┌─────────────────────────────────┐ │
│  ┌──────┐  │  │ Header (56px height)            │ │
│  │Search│  │  │ backdrop-filter: blur(20px)      │ │
│  └──────┘  │  ├─────────────────────────────────┤ │
│            │  │                                  │ │
│  ┌──────┐  │  │ Messages (scroll area)           │ │
│  │ Alex │  │  │ padding: 0 16px                  │ │
│  │ Sara │  │  │                                  │ │
│  │ Team │  │  │ max-width: 768px                 │ │
│  │ Dan  │  │  │ margin: 0 auto                   │ │
│  │ ···  │  │  │ (centered like Claude)           │ │
│  └──────┘  │  │                                  │ │
│            │  ├─────────────────────────────────┤ │
│  ┌──────┐  │  │ Composer (auto height)           │ │
│  │ You  │  │  │ backdrop-filter: blur(20px)      │ │
│  └──────┘  │  │ padding: 8px 12px                │ │
│            │  └─────────────────────────────────┘ │
├────────────┴─────────────────────────────────────┤
│              Container: 100vw × 100vh             │
└──────────────────────────────────────────────────┘
```

**Key detail: Message column max-width is 768px, centered.** This is the Claude approach. Even on a 1920px wide screen, messages don't stretch to fill. They stay in a comfortable reading column. This makes chat feel intimate, not like a spreadsheet.

### Sidebar Specifications

```
Width:                   320px (collapsible to 72px on tablet)
Background:              var(--chat-bg-sidebar)
Border right:            1px solid var(--chat-border-strong)
Padding:                 0

Search bar:
  Margin:                12px
  Height:                36px
  Border-radius:         10px
  Background:            var(--chat-bg-main) at 50% opacity
  Placeholder:           "Search" (centered, with magnifying glass icon)
  Font:                  14px / 400 / text-secondary

Conversation item:
  Height:                72px
  Padding:               12px 16px
  Gap (avatar to text):  12px
  Active state:          background var(--chat-accent-soft)
  Hover state:           background rgba(0,0,0,0.03) [light] / rgba(255,255,255,0.04) [dark]
  Border-radius:         12px (with 4px margin on sides for the rounded selected state)
  
  Avatar:                44px × 44px / border-radius: 50%
  Presence dot:          10px × 10px / border: 2px solid var(--chat-bg-sidebar)
                         positioned bottom-right of avatar
  Title:                 15px / 600 / single line / ellipsis
  Preview:               13px / 400 / single line / ellipsis / text-secondary
  Time:                  11px / 400 / text-tertiary / aligned top-right
  Unread badge:          18px height / min-width 18px / border-radius: 9px
                         background: var(--chat-red) / text: white / 11px 700
```

### Conversation Item Layout

```
┌──────────────────────────────────┐
│ ┌────┐  Alex Chen         10:42 │
│ │ 🟢 │  Hey, did you see t…  2  │  ← unread badge
│ └────┘                           │
└──────────────────────────────────┘
  44px   flex: 1              auto
```

### Message Bubble Dimensions

```
Bubble padding:          8px top/bottom, 14px left/right
Max width:               75% of message column (≈ 576px at 768px column)
Min width:               none (shrinks to content)
Border-radius:           18px (see bubble geometry section for specifics)
Margin between groups:   16px
Margin within group:     2px

Avatar (for incoming):   32px × 32px / border-radius: 50%
                         aligned to bottom of first message in group
                         
Sender name:             shown only for first message in group
                         14px / 600 / text-secondary / margin-bottom: 2px
                         
Timestamp:               shown on hover OR at bottom of group
                         11px / 400 / text-tertiary
```

### Composer Area

```
Container padding:       8px horizontal, 8px top, safe-area bottom
Input area:
  Background:            var(--chat-bg-sidebar) [light] / var(--chat-bg-sidebar) [dark]
  Border:                1px solid var(--chat-border)
  Border-radius:         22px (pill shape, like iMessage)
  Padding:               10px 44px 10px 16px   (right padding for send button)
  Min height:            44px (single line)
  Max height:            160px (≈6 lines, then scroll)
  Font:                  15px / 400
  Placeholder:           "Message" in text-tertiary (like iMessage, one word)

Send button:
  Size:                  32px × 32px
  Border-radius:         50%
  Background:            var(--chat-accent) when text present, transparent when empty
  Icon:                  Arrow-up (↑) 16px, white
  Position:              absolute, right: 6px, bottom: 6px
  Transition:            background 200ms, transform 200ms
  Hover:                 scale(1.05)
  Active:                scale(0.95)

Toolbar (below input):
  Height:                36px
  Icons:                 20px, color text-secondary
  Items:                 [Attach 📎] [Camera 📷] [Emoji 😊] [Voice 🎤]
  Spacing:               8px gap
  Left-aligned, send button right-aligned
```

---

## 9. Component Visual Specs

### Reactions Bar

```
┌─────────────────────────────────────────┐
│  [😂 4] [🔥 2] [👍 12]  [+]            │
└─────────────────────────────────────────┘

Pill:
  Height:          26px
  Padding:         0 8px
  Border-radius:   13px
  Background:      var(--chat-bg-sidebar)
  Border:          1px solid var(--chat-border)
  Font:            emoji at 14px + count at 12px / 500 / tabular-nums
  Gap:             4px between emoji and count
  
Pill (current user reacted):
  Background:      var(--chat-accent-soft)
  Border:          1px solid var(--chat-accent) at 30% opacity

Plus button:
  Width:           26px
  Height:          26px
  Border-radius:   13px
  Background:      transparent
  Border:          1px dashed var(--chat-border)
  Icon:            Plus at 12px, text-tertiary
  Opacity:         0 (appears on message hover)
  Transition:      opacity 150ms

Bar spacing:
  Gap between pills: 4px
  Margin top:        4px (below bubble)
```

### Read Receipt Indicators

```
Single check (sent):
  Icon:            Checkmark, 12px, text-tertiary
  
Double check (delivered):
  Icon:            Double checkmark, 14px, text-tertiary

Double check (read):
  Icon:            Double checkmark, 14px, var(--chat-accent)
  Transition:      color 400ms ease-out

Position:          Right-aligned below outgoing bubble, 4px gap
                   Next to timestamp: "10:42 AM ✓✓"
```

### Scroll-to-Bottom Button

```
Size:              40px × 40px
Border-radius:     50%
Background:        var(--chat-bg-main)
Border:            1px solid var(--chat-border-strong)
Shadow:            var(--chat-shadow-md)
Icon:              Chevron-down, 18px, text-secondary
Position:          Fixed, 16px from right edge, 16px above composer
Z-index:           5

Unread badge (on top of button):
  Size:            18px
  Border-radius:   9px
  Background:      var(--chat-accent)
  Text:            11px / 700 / white
  Position:        -4px top, -4px right
```

### Date Separator

```
┌──────────────────────────────────────────┐
│ ─────────  Today  ────────               │
└──────────────────────────────────────────┘

Line:              1px solid var(--chat-border)
                   extends full width with gap for text
Text:
  Font:            11px / 600 / uppercase / tracking 0.08em
  Color:           text-tertiary
  Background:      var(--chat-bg-main) with 12px horizontal padding
                   (covers the line behind it)
  Text-align:      center
Margin:            24px top/bottom
```

### Typing Indicator

```
┌───────────────────┐
│ 🟢 Alex is typing │
│ ┌───────┐         │
│ │ · · · │         │
│ └───────┘         │
└───────────────────┘

Container:
  Same shape as incoming bubble
  Background:      var(--chat-bubble-incoming)
  Border-radius:   18px 18px 18px 4px
  Padding:         12px 16px
  Width:           64px
  Display:         flex, align-items center, justify-content center, gap 4px

Dots:
  Size:            7px × 7px
  Border-radius:   50%
  Background:      var(--chat-text-secondary)
  Animation:       typing-pulse 1.4s ease-in-out infinite (staggered)

Label (above indicator):
  "Alex is typing..." in 12px / 400 / text-tertiary
  Fades in/out with 200ms transition
```

### Image Message

```
Single image:
  Max width:       320px
  Max height:      400px
  Border-radius:   18px (matches bubble)
  Object-fit:      cover
  Background:      var(--chat-bg-sidebar) (placeholder while loading)
  Cursor:          zoom-in
  Transition:      transform 200ms (scale 1.02 on hover)

Gallery (2 images):
  Layout:          flex row, gap 2px
  Each image:      50% width, aspect-ratio preserved
  Container:       border-radius 18px with overflow hidden

Gallery (3 images):
  Layout:          grid, 2 columns
  First image:     spans both rows (left side, 60% width)
  Second + third:  stacked on right (40% width)
  Gap:             2px
  Container:       border-radius 18px with overflow hidden

Gallery (4+ images):
  Layout:          2×2 grid, gap 2px
  Fourth cell:     overlay "+N" if more than 4
  "+N" overlay:    rgba(0,0,0,0.5), 24px / 700 / white, centered
  Container:       border-radius 18px with overflow hidden
```

### Voice Message

```
┌────────────────────────────────────────┐
│  ▶  ▏▎▏▎▏▍▏▏▎▎▏▎▏▍▏▎▏▎▏▎▏▏  0:42    │
└────────────────────────────────────────┘

Container:
  Same as bubble styling
  Min width:       200px
  Max width:       300px
  Padding:         10px 14px
  Display:         flex, align-items center, gap 10px

Play button:
  Size:            32px × 32px
  Border-radius:   50%
  Background:      var(--chat-accent) (outgoing) / var(--chat-text-secondary) (incoming)
  Icon:            Play/Pause, 14px, white

Waveform:
  Height:          28px
  Flex:            1
  Rendered as:     inline SVG with ~50 vertical bars
  Bar width:       2px
  Bar gap:         1.5px
  Bar color:       text-primary-foreground (outgoing) / text-secondary (incoming)
  Played portion:  full opacity
  Unplayed:        30% opacity
  Scrub:           click/drag on waveform to seek

Duration:
  Font:            11px / 500 / tabular-nums / text-secondary
  Shows:           remaining time while playing, total time when paused
```

### Link Preview Card

```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │         og:image                │ │
│ │         (16:9 aspect)           │ │
│ └─────────────────────────────────┘ │
│  example.com                        │
│  Article Title Here                 │
│  First two lines of description...  │
└─────────────────────────────────────┘

Container:
  Background:      var(--chat-bg-sidebar)
  Border:          1px solid var(--chat-border)
  Border-radius:   12px
  Overflow:        hidden
  Max width:       360px
  Cursor:          pointer
  
  Hover:           border-color var(--chat-border-strong)
                   shadow var(--chat-shadow-sm)
                   transition 200ms

Image:
  Width:           100%
  Aspect-ratio:    16/9
  Object-fit:      cover

Text area:
  Padding:         10px 12px
  
  Domain:          12px / 400 / text-tertiary / single-line
  Title:           14px / 600 / text-primary / max 2 lines / ellipsis
  Description:     12px / 400 / text-secondary / max 2 lines / ellipsis
```

---

## 10. Dark Mode First

The README hero, the docs site hero, every screenshot — **dark mode first**.

Developers live in dark mode. The screenshots they share on Twitter are dark mode. The 4am coding session when they discover chatcn — dark mode.

The dark palette uses true black (#000000) for the main background, matching iMessage's dark mode on OLED iPhones. The sidebar uses Apple's elevated surface gray (#1C1C1E). Bubbles use a slightly lighter gray (#2C2C2E) that just barely lifts off the background.

The outgoing blue (#0A84FF) pops against true black in a way that's instantly recognizable as "messaging." It's the visual signature of the component.

---

## 11. Accessibility Requirements

These aren't optional. They ship on day one.

- **Color contrast:** All text/background combinations meet WCAG 2.1 AA (4.5:1 for body text, 3:1 for large text). The Apple system colors already pass.
- **Focus indicators:** Every interactive element gets a visible focus ring (2px solid var(--chat-accent), 2px offset) when navigated via keyboard.
- **Keyboard navigation:** Tab through conversation list, Enter to select, arrow keys within messages, Escape to dismiss overlays.
- **Screen reader labels:** Every icon-only button has `aria-label`. Message groups have `role="log"` and `aria-live="polite"` for new messages. Reactions announce "Emoji name, N people reacted."
- **Reduced motion:** When `prefers-reduced-motion: reduce`, all animations are instant (duration: 0ms). The typing indicator dots go static (opacity pulse only, no scale).
- **Touch targets:** Every interactive element is minimum 44×44px (Apple's standard). Reaction pills, toolbar buttons, and send button all meet this.
- **High contrast mode:** Works with Windows High Contrast and macOS Increase Contrast.

---

## 12. The Hero Screenshot — Composition Guide

This is the image that goes on the README, the docs site hero, and every tweet.

**Composition:**
- Dark mode
- Full messenger layout (sidebar + main)
- Sidebar shows 5 conversations: 2 with unread badges, 1 with typing indicator, 1 with online presence dot, 1 muted
- Active conversation shows a mix: 4-5 text messages (grouped), 1 image message, 1 message with 3 reactions, 1 reply-to quote, typing indicator at bottom
- The outgoing blue bubbles against true black background is the visual center
- Frosted glass header and composer with content visible behind the blur
- One hover toolbar visible on a message (showing reply, react, more buttons)
- A scroll-to-bottom FAB with a "3" badge in the bottom-right

**Don't include in the hero:**
- Code. No code in the marketing screenshot.
- Browser chrome. Crop it out.
- Any UI that isn't chatcn (no VS Code, no terminal).

The screenshot should make someone think: *"That looks like a real app, not a component demo."*

---

## Summary

Every pixel in chatcn follows one test: **"Would this look at home in iMessage?"** If yes, ship it. If it looks like a Bootstrap demo from 2019, redo it.

The Liquid Glass blur on header and composer, the 18px rounded bubbles with 2px grouped gaps, the pulsing typing dots, the popping reaction pills, the true-black dark mode, the 768px centered message column — these details compound into something that feels native, premium, and real.

The developer who installs chatcn and sees their first conversation render should have one reaction: *"Holy shit, this looks better than what I could have designed myself."* That reaction is what drives stars.
