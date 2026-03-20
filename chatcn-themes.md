# chatcn — Themes System

## Three distinct visual personalities. Zero Apple lawsuits.

---

## 0. Legal Safety First — What We Change

The original UI doc leaned too hard into iMessage's specific visual identity. Here's what crosses the line and what we replace:

| Too Close to Apple | chatcn Replacement |
|---|---|
| #007AFF "iMessage Blue" as default outgoing | chatcn uses its own signature blue (#3B82F6 — Tailwind blue-500) or theme-specific accent |
| Bubble tail with exact iMessage clip-path curve | chatcn uses rounded corners only, no tail by default (tail is opt-in and uses a different geometry) |
| SF Pro as first font in the stack | chatcn defaults to the system font stack without naming SF Pro first |
| True black (#000000) background matching iMessage OLED | chatcn uses near-black (#09090B — Zinc 950) which is visually identical but legally distinct |
| "Delivered" / "Read" with double checkmarks | chatcn uses its own status icons (single dot → double dot → filled double dot) |
| Tapback long-press behavior clone | chatcn uses a hover toolbar (desktop) and long-press sheet (mobile) with its own layout |

**The principle:** Be inspired by Apple's clarity and warmth. Never replicate their specific visual assets, colors, or interaction patterns. chatcn should feel premium and native — not feel like iMessage with different branding.

**The font stack becomes:**
```css
--chat-font-sans: system-ui, -apple-system, BlinkMacSystemFont, 
                  "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
```
This still picks up SF Pro on Apple devices (via `-apple-system`) but doesn't explicitly name it. Legally clean. Visually identical on Macs.

---

## 1. Theme Architecture

### How Themes Work

Each theme is a set of CSS custom properties. The developer picks one at install time or switches dynamically:

```tsx
<ChatProvider theme="lunar">    {/* "lunar" | "aurora" | "ember" */}
```

Each theme defines:
- Color palette (backgrounds, bubbles, accents, text)
- Border radius scale (how rounded everything is)
- Spacing density (comfortable vs compact)
- Shadow style (soft vs sharp vs none)
- Bubble style (filled, outlined, or flat)
- Animation character (bouncy, smooth, or snappy)
- Font weight preferences

The underlying component structure is identical. Only the CSS variables change. A developer can also create a fully custom theme by overriding the variables.

### Theme Switching

```tsx
// Static — set once
<ChatProvider theme="aurora">

// Dynamic — switch at runtime
const [theme, setTheme] = useState("lunar")
<ChatProvider theme={theme}>

// Custom — override individual tokens
<ChatProvider theme="lunar" style={{
  "--chat-accent": "#8B5CF6",
  "--chat-bubble-radius": "12px",
}}>
```

---

## 2. Theme 1: Lunar (Default)

### Personality
**"Calm midnight workspace."**

Inspired by: Linear, Raycast, Arc browser's dark mode, Vercel dashboard. This is the developer's natural habitat. Deep, desaturated, precise. The kind of interface you'd use at 2am and your eyes wouldn't hurt. Feels like a premium tool, not a toy.

### Visual Identity
- Deep neutral dark backgrounds (not true black — warm charcoals)
- Subtle violet/indigo accent (not blue — distinctly chatcn)
- Soft, diffused shadows (like light through fog)
- Rounded but not bubbly (14px radius, not 18px)
- Generous spacing — every element breathes

### Color Palette

```css
/* === LUNAR — Light Mode === */
--chat-bg-app:              #FAFAFA;
--chat-bg-sidebar:          #F4F4F5;         /* Zinc 100 */
--chat-bg-main:             #FFFFFF;
--chat-bg-header:           rgba(255, 255, 255, 0.75);
--chat-bg-composer:         rgba(255, 255, 255, 0.82);

--chat-bubble-outgoing:     #6366F1;         /* Indigo 500 — chatcn signature */
--chat-bubble-outgoing-text: #FFFFFF;
--chat-bubble-incoming:     #F4F4F5;         /* Zinc 100 */
--chat-bubble-incoming-text: #18181B;        /* Zinc 900 */

--chat-accent:              #6366F1;         /* Indigo 500 */
--chat-accent-soft:         rgba(99, 102, 241, 0.08);
--chat-green:               #22C55E;         /* Green 500 */
--chat-orange:              #F59E0B;         /* Amber 500 */
--chat-red:                 #EF4444;         /* Red 500 */

--chat-text-primary:        #18181B;         /* Zinc 900 */
--chat-text-secondary:      #71717A;         /* Zinc 500 */
--chat-text-tertiary:       #A1A1AA;         /* Zinc 400 */
--chat-border:              rgba(0, 0, 0, 0.06);
--chat-border-strong:       rgba(0, 0, 0, 0.10);

/* === LUNAR — Dark Mode === */
.dark {
  --chat-bg-app:            #09090B;         /* Zinc 950 */
  --chat-bg-sidebar:        #18181B;         /* Zinc 900 */
  --chat-bg-main:           #09090B;         /* Zinc 950 */
  --chat-bg-header:         rgba(24, 24, 27, 0.75);
  --chat-bg-composer:       rgba(24, 24, 27, 0.82);

  --chat-bubble-outgoing:   #818CF8;         /* Indigo 400 */
  --chat-bubble-outgoing-text: #FFFFFF;
  --chat-bubble-incoming:   #27272A;         /* Zinc 800 */
  --chat-bubble-incoming-text: #FAFAFA;

  --chat-accent:            #818CF8;         /* Indigo 400 */
  --chat-accent-soft:       rgba(129, 140, 248, 0.10);
  --chat-green:             #4ADE80;
  --chat-orange:            #FBBF24;
  --chat-red:               #F87171;

  --chat-text-primary:      #FAFAFA;
  --chat-text-secondary:    #A1A1AA;         /* Zinc 400 */
  --chat-text-tertiary:     #52525B;         /* Zinc 600 */
  --chat-border:            rgba(255, 255, 255, 0.06);
  --chat-border-strong:     rgba(255, 255, 255, 0.10);
}
```

### Shape & Spacing

```css
--chat-bubble-radius:       14px;
--chat-bubble-radius-grouped: 4px;     /* Tight corner on grouped bubbles */
--chat-card-radius:         12px;       /* Link previews, file cards */
--chat-input-radius:        20px;       /* Composer pill shape */
--chat-avatar-radius:       50%;        /* Circular */

--chat-spacing-messages:    14px;       /* Between different senders */
--chat-spacing-grouped:     2px;        /* Between grouped messages */
--chat-spacing-section:     20px;       /* Around date separators */

--chat-shadow-toolbar:      0 2px 16px rgba(0, 0, 0, 0.12);
--chat-shadow-float:        0 8px 30px rgba(0, 0, 0, 0.08);
```

### Animation

```css
--chat-ease:                cubic-bezier(0.25, 0.1, 0.25, 1.0);  /* Smooth Apple-like */
--chat-duration-fast:       150ms;
--chat-duration-normal:     250ms;
--chat-duration-slow:       350ms;
```

### Why Indigo?

Indigo (#6366F1) is chatcn's signature color. It's distinct from:
- Apple's #007AFF (pure blue)
- Facebook Messenger's #0084FF (similar blue)
- Slack's #4A154B (purple)
- Discord's #5865F2 (close but bluer)
- WhatsApp's #25D366 (green)
- Telegram's #0088CC (teal-blue)

Indigo sits in unclaimed territory — warm enough to feel friendly, cool enough to feel professional. It reads as "modern developer tool" not "corporate messenger."

---

## 3. Theme 2: Aurora

### Personality
**"Soft morning light."**

Inspired by: Apple Notes, Notion, Stripe's dashboard, the warmth of paper. This is for people who want chat to feel gentle and approachable. Great for customer support widgets, community platforms, and consumer-facing apps. It doesn't scream "developer tool" — it whispers "friendly conversation."

### Visual Identity
- Warm cream/ivory backgrounds (not cold white)
- Soft teal accent (calming, trusting, not aggressive)
- Paper-like texture feel (very subtle warm undertone in every surface)
- More rounded (18px radius — softer, friendlier)
- Outlined bubbles instead of filled (lighter, airier)
- Very soft shadows with warm undertones

### Color Palette

```css
/* === AURORA — Light Mode === */
--chat-bg-app:              #FFFBF5;         /* Warm ivory */
--chat-bg-sidebar:          #FFF8F0;         /* Slightly warmer */
--chat-bg-main:             #FFFBF5;
--chat-bg-header:           rgba(255, 251, 245, 0.80);
--chat-bg-composer:         rgba(255, 251, 245, 0.85);

/* Aurora uses OUTLINED bubbles — background is transparent/subtle */
--chat-bubble-outgoing:     #0D9488;         /* Teal 600 */
--chat-bubble-outgoing-bg:  rgba(13, 148, 136, 0.06);  /* Very subtle teal wash */
--chat-bubble-outgoing-border: rgba(13, 148, 136, 0.25);
--chat-bubble-outgoing-text: #1C1917;        /* Warm black */

--chat-bubble-incoming:     transparent;
--chat-bubble-incoming-bg:  rgba(0, 0, 0, 0.03);
--chat-bubble-incoming-border: rgba(0, 0, 0, 0.08);
--chat-bubble-incoming-text: #1C1917;

--chat-accent:              #0D9488;         /* Teal 600 */
--chat-accent-soft:         rgba(13, 148, 136, 0.06);
--chat-green:               #16A34A;
--chat-orange:              #EA580C;
--chat-red:                 #DC2626;

--chat-text-primary:        #1C1917;         /* Stone 900 — warm black */
--chat-text-secondary:      #78716C;         /* Stone 500 */
--chat-text-tertiary:       #A8A29E;         /* Stone 400 */
--chat-border:              rgba(120, 113, 108, 0.10);
--chat-border-strong:       rgba(120, 113, 108, 0.18);

/* === AURORA — Dark Mode === */
.dark {
  --chat-bg-app:            #0C0A09;         /* Stone 950 */
  --chat-bg-sidebar:        #1C1917;         /* Stone 900 */
  --chat-bg-main:           #0C0A09;
  --chat-bg-header:         rgba(28, 25, 23, 0.78);
  --chat-bg-composer:       rgba(28, 25, 23, 0.85);

  --chat-bubble-outgoing:   #2DD4BF;         /* Teal 400 */
  --chat-bubble-outgoing-bg: rgba(45, 212, 191, 0.08);
  --chat-bubble-outgoing-border: rgba(45, 212, 191, 0.20);
  --chat-bubble-outgoing-text: #FAFAF9;

  --chat-bubble-incoming:   transparent;
  --chat-bubble-incoming-bg: rgba(255, 255, 255, 0.04);
  --chat-bubble-incoming-border: rgba(255, 255, 255, 0.08);
  --chat-bubble-incoming-text: #FAFAF9;

  --chat-accent:            #2DD4BF;         /* Teal 400 */
  --chat-accent-soft:       rgba(45, 212, 191, 0.08);

  --chat-text-primary:      #FAFAF9;
  --chat-text-secondary:    #A8A29E;
  --chat-text-tertiary:     #57534E;
  --chat-border:            rgba(255, 255, 255, 0.06);
  --chat-border-strong:     rgba(255, 255, 255, 0.10);
}
```

### Shape & Spacing

```css
--chat-bubble-radius:       18px;            /* Rounder, softer */
--chat-bubble-radius-grouped: 6px;
--chat-card-radius:         16px;
--chat-input-radius:        24px;            /* Very pill-like */
--chat-avatar-radius:       30%;             /* Squircle, not circle */

--chat-spacing-messages:    16px;            /* More breathing room */
--chat-spacing-grouped:     3px;
--chat-spacing-section:     28px;

--chat-shadow-toolbar:      0 4px 20px rgba(120, 113, 108, 0.10);
--chat-shadow-float:        0 12px 40px rgba(120, 113, 108, 0.08);
```

### Key Difference: Outlined Bubbles

Aurora doesn't use filled outgoing bubbles. Instead:

```css
/* Aurora outgoing bubble */
.aurora .bubble-outgoing {
  background: var(--chat-bubble-outgoing-bg);     /* Nearly transparent teal */
  border: 1.5px solid var(--chat-bubble-outgoing-border);  /* Soft teal border */
  color: var(--chat-bubble-outgoing-text);        /* Dark text, not white */
}
```

This creates a lighter, airier feel. The teal accent comes from the border and subtle wash, not from a solid fill. It's closer to how Notion or Linear shows selected states — a whisper of color, not a shout.

### Animation

```css
--chat-ease:                cubic-bezier(0.34, 1.56, 0.64, 1);  /* Slight bounce */
--chat-duration-fast:       180ms;
--chat-duration-normal:     280ms;
--chat-duration-slow:       400ms;
```

Aurora allows a tiny bounce. Not cartoonish — just a 1.56 overshoot that gives elements a subtle springiness. It matches the warm, friendly personality.

---

## 4. Theme 3: Ember

### Personality
**"Dense. Fast. No bullshit."**

Inspired by: Discord, Slack, Terminal, Superhuman. This is for power users building internal tools, team dashboards, DevOps chat, and dense communication interfaces. Maximum information density. Minimal decoration. Every pixel earns its place.

### Visual Identity
- High-contrast dark backgrounds (no warmth — pure cold neutrals)
- Electric orange accent (urgent, visible, distinctive)
- Sharp corners (8px radius — angular, utilitarian)
- FLAT bubbles — no bubbles at all. Slack/Discord style with left color bar
- Compact spacing — fits 2x more messages on screen
- No shadows — flat with borders only
- Monospace-influenced typography details

### Color Palette

```css
/* === EMBER — Light Mode === */
--chat-bg-app:              #FFFFFF;
--chat-bg-sidebar:          #F8FAFC;         /* Slate 50 */
--chat-bg-main:             #FFFFFF;
--chat-bg-header:           #FFFFFF;          /* No blur — solid, fast */
--chat-bg-composer:         #FFFFFF;

/* Ember doesn't use bubbles — uses left-border accent on message rows */
--chat-bubble-outgoing:     transparent;
--chat-bubble-outgoing-accent: #F97316;       /* Orange 500 — left border */
--chat-bubble-outgoing-text: #0F172A;         /* Slate 900 */

--chat-bubble-incoming:     transparent;
--chat-bubble-incoming-accent: #64748B;       /* Slate 500 — muted left border */
--chat-bubble-incoming-text: #0F172A;

--chat-accent:              #F97316;          /* Orange 500 */
--chat-accent-soft:         rgba(249, 115, 22, 0.06);
--chat-green:               #22C55E;
--chat-orange:              #F97316;
--chat-red:                 #EF4444;

--chat-text-primary:        #0F172A;          /* Slate 900 */
--chat-text-secondary:      #64748B;          /* Slate 500 */
--chat-text-tertiary:       #94A3B8;          /* Slate 400 */
--chat-border:              #E2E8F0;          /* Slate 200 — visible, not transparent */
--chat-border-strong:       #CBD5E1;          /* Slate 300 */

/* === EMBER — Dark Mode === */
.dark {
  --chat-bg-app:            #0B0F19;          /* Very dark blue-black */
  --chat-bg-sidebar:        #111827;          /* Gray 900 */
  --chat-bg-main:           #0B0F19;
  --chat-bg-header:         #111827;          /* Solid, no blur */
  --chat-bg-composer:       #111827;

  --chat-bubble-outgoing-accent: #FB923C;     /* Orange 400 */
  --chat-bubble-outgoing-text: #F8FAFC;

  --chat-bubble-incoming-accent: #475569;     /* Slate 600 */
  --chat-bubble-incoming-text: #F8FAFC;

  --chat-accent:            #FB923C;          /* Orange 400 */
  --chat-accent-soft:       rgba(251, 146, 60, 0.08);

  --chat-text-primary:      #F8FAFC;
  --chat-text-secondary:    #94A3B8;
  --chat-text-tertiary:     #475569;
  --chat-border:            rgba(255, 255, 255, 0.08);
  --chat-border-strong:     rgba(255, 255, 255, 0.12);
}
```

### Shape & Spacing

```css
--chat-bubble-radius:       0px;             /* No bubble radius — flat rows */
--chat-bubble-radius-grouped: 0px;
--chat-card-radius:         8px;             /* Sharp, utilitarian */
--chat-input-radius:        8px;             /* Rectangular input, not pill */
--chat-avatar-radius:       6px;             /* Rounded square, like Discord */

--chat-spacing-messages:    8px;             /* Tight — density is the point */
--chat-spacing-grouped:     0px;             /* Zero gap within groups */
--chat-spacing-section:     16px;

--chat-shadow-toolbar:      none;            /* No shadows — flat with border */
--chat-shadow-float:        none;
```

### Key Difference: Flat Message Rows (No Bubbles)

Ember renders messages like Slack — no bubble shape at all. Each message is a full-width row with a left color bar:

```css
/* Ember message row */
.ember .message {
  padding: 6px 16px 6px 12px;
  border-left: 3px solid var(--chat-bubble-outgoing-accent);
  background: transparent;
  
  /* Hover shows a very subtle background */
  &:hover {
    background: var(--chat-accent-soft);
  }
}

/* Sender name is inline with timestamp — Slack style */
.ember .sender-name {
  font-weight: 700;
  font-size: 14px;
  color: var(--chat-text-primary);
}
.ember .timestamp {
  font-size: 11px;
  color: var(--chat-text-tertiary);
  margin-left: 8px;
  /* Always visible, not hover-only */
}
```

Layout for a message in Ember:

```
┌─────────────────────────────────────────┐
│▎ 🔲 Alex Chen  10:42 AM                │
│▎    Hey, did you see the new PR?        │
│▎    The auth refactor looks solid       │
│▎    Only concern is the token refresh   │
│                                         │
│▎ 🔲 Sara Kim  10:44 AM                 │
│▎    Yeah I reviewed it this morning     │
└─────────────────────────────────────────┘
  3px  32px                               
  bar  avatar (rounded square)
```

### No Frosted Glass

Ember doesn't use `backdrop-filter` anywhere. Headers and composers are solid backgrounds with border separators. This is intentional — frosted glass feels decorative. Ember rejects decoration. Everything is flat, fast, utilitarian.

### Animation

```css
--chat-ease:                cubic-bezier(0.16, 1, 0.3, 1);  /* Sharp ease-out */
--chat-duration-fast:       100ms;           /* Snappy */
--chat-duration-normal:     150ms;           /* Snappy */
--chat-duration-slow:       200ms;           /* Still fast */
```

Ember's animations are nearly instant. 150ms ease-out. No bounce, no overshoot, no flourish. Elements appear. They don't announce themselves.

---

## 5. Theme Comparison — At a Glance

| Property | Lunar (Default) | Aurora | Ember |
|---|---|---|---|
| **Vibe** | Calm midnight tool | Soft morning paper | Dense power interface |
| **Accent** | Indigo #6366F1 | Teal #0D9488 | Orange #F97316 |
| **Bubble style** | Filled (classic) | Outlined (border) | None (flat rows) |
| **Bubble radius** | 14px | 18px | 0px |
| **Avatar shape** | Circle | Squircle (30%) | Rounded square (6px) |
| **Input shape** | Pill (20px) | Big pill (24px) | Rectangle (8px) |
| **Background tone** | Cool (Zinc) | Warm (Stone/Ivory) | Cold (Slate/Blue-black) |
| **Dark mode base** | #09090B | #0C0A09 | #0B0F19 |
| **Shadows** | Soft, diffused | Warm, subtle | None |
| **Frosted glass** | Yes | Yes | No |
| **Density** | Comfortable | Spacious | Compact |
| **Animation** | Smooth (250ms) | Slight bounce (280ms) | Snappy (150ms) |
| **Message spacing** | 14px | 16px | 8px |
| **Sender display** | Above first grouped message | Above first grouped message | Inline with timestamp |
| **Timestamp** | On hover | On hover | Always visible |
| **Font weight** | Normal (400) | Normal (400) | Slightly bolder (sender 700) |
| **Best for** | SaaS, dev tools, general | Consumer, support, community | Internal tools, DevOps, teams |

---

## 6. Choosing a Theme — Developer Guidance

The docs site should include a visual theme picker that shows the same conversation rendered in all three themes side-by-side. The developer clicks the one they like and gets the install command.

### Recommendation Guide

```
Building a SaaS product?          → Lunar
Building customer support?        → Aurora  
Building internal/team tooling?   → Ember
Not sure?                         → Lunar (the safe default)
```

### Custom Themes

Developers can create their own theme by overriding the CSS variables:

```css
/* Custom brand theme */
[data-chat-theme="custom"] {
  --chat-accent: #8B5CF6;                    /* Your brand violet */
  --chat-bubble-outgoing: #8B5CF6;
  --chat-bubble-radius: 16px;
  --chat-bg-sidebar: #FAF5FF;
  /* Override only what you need — the rest inherits from Lunar */
}
```

Or pass inline overrides:

```tsx
<ChatProvider 
  theme="lunar"
  style={{ "--chat-accent": "#8B5CF6" }}
>
```

---

## 7. Theme-Specific Component Variations

Some components render differently per theme beyond just colors:

### Typing Indicator

| Theme | Behavior |
|---|---|
| Lunar | Three pulsing dots in a bubble (scale animation, 1.4s) |
| Aurora | Three pulsing dots in a bubble + subtle background glow |
| Ember | Text only: "Alex is typing..." in italic, no dots, no bubble |

### Message Actions Toolbar

| Theme | Behavior |
|---|---|
| Lunar | Frosted glass floating toolbar, appears on hover with scale-up |
| Aurora | Frosted glass toolbar with slight bounce entrance |
| Ember | Inline icon row that appears at the right edge of the message row, no glass, no shadow |

### Date Separator

| Theme | Behavior |
|---|---|
| Lunar | Centered text on a line: `——— Today ———` |
| Aurora | Text in a soft rounded pill: `( Today )` with no line |
| Ember | Full-width solid border with left-aligned bold text: `Today` |

### Reactions

| Theme | Behavior |
|---|---|
| Lunar | Pills below bubble with background fill |
| Aurora | Pills below bubble with border outline (matching bubble style) |
| Ember | Inline text after message: `😂 4  🔥 2` — no pills, just emoji + count |

### Read Receipts

| Theme | Behavior |
|---|---|
| Lunar | Custom dot icons (·  ··  ●●) in accent color |
| Aurora | Custom dot icons with a gentle color fade transition |
| Ember | Text only: "Sent" / "Delivered" / "Read 3:42 PM" — no icons |

---

## 8. The Demo That Sells Themes

The docs site hero should NOT show just one theme. It should show a **theme switcher** — three tabs at the top (Lunar / Aurora / Ember) and the SAME conversation rendering below, live-switching between themes with a smooth crossfade.

This accomplishes three things:
1. Shows the developer that chatcn is flexible, not opinionated
2. Demonstrates the power of the CSS variable system
3. Gives people three screenshots to share instead of one

The README should include a horizontal triptych image — the same conversation in Lunar (left), Aurora (center), Ember (right), with labels above each. Three screenshots. Three aesthetics. One component library.

---

## 9. What the Developer Actually Ships

After install, the developer's `chat.tsx` file includes all three theme definitions as CSS at the top. The component defaults to Lunar. Switching is one prop change. No extra files, no separate installs, no theme packages.

```tsx
// The developer's code — theme switching is this simple
<ChatProvider theme="ember">
  <ChatMessages messages={messages} />
  <ChatComposer onSend={handleSend} />
</ChatProvider>
```

The developer owns all three theme definitions in their codebase. They can:
- Delete themes they don't use
- Modify any theme's variables
- Create new themes by copying one and changing values
- Mix and match (Ember layout density with Lunar colors)

This is the shadcn way: you own the code, you customize everything.
