# chatcn

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Beautiful, ready-to-use chat UI components for React. Styled with Tailwind CSS.

## Features

- **Messages** — Bubbles, grouping, replies, reactions, read receipts
- **Composer** — Rich input with file attachments and voice recording
- **Threads** — Flat and nested threading
- **Conversations** — Sidebar with search, unread counts, presence
- **Media** — Images, files, voice messages, code blocks, link previews
- **4 Themes** — Lunar, Aurora, Ember, Midnight
- **Accessible** — Keyboard navigation, screen reader support, reduced motion
- **TypeScript** — Fully typed props and exports

## Quick Start

```bash
npx shadcn@latest add https://raw.githubusercontent.com/leonickson1/chatcn/main/public/r/chat.json
```

Then import and use:

```tsx
import { ChatProvider, ChatMessages, ChatComposer } from "@/components/ui/chat"

export default function Chat() {
  return (
    <ChatProvider>
      <ChatMessages />
      <ChatComposer />
    </ChatProvider>
  )
}
```

## Documentation

Visit [chatcn.vercel.app/docs](https://chatcn.vercel.app/docs) for full documentation, examples, and API reference.

## License

[MIT](LICENSE)
