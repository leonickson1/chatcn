"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarSection {
  label: string
  items: { title: string; href: string }[]
}

const sections: SidebarSection[] = [
  {
    label: "Basics",
    items: [
      { title: "Getting Started", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Theming", href: "/docs/theming" },
      { title: "API Reference", href: "/docs/api-reference" },
      { title: "Security", href: "/docs/security" },
    ],
  },
  {
    label: "Messaging",
    items: [
      { title: "Messages", href: "/docs/messages" },
      { title: "Composer", href: "/docs/composer" },
      { title: "Reactions", href: "/docs/reactions" },
      { title: "Threads", href: "/docs/threads" },
      { title: "Conversations", href: "/docs/conversations" },
      { title: "Tickets", href: "/docs/tickets" },
      { title: "Media", href: "/docs/media" },
      { title: "Presence", href: "/docs/presence" },
      { title: "Search", href: "/docs/search" },
      { title: "Advanced", href: "/docs/advanced" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:block w-[240px] shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto py-6 pl-4 pr-2"
      style={{ borderRight: "1px solid var(--chat-border)" }}
    >
      <nav className="flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.label}>
            <h4
              className="text-[11px] font-semibold uppercase tracking-wider mb-2 px-3"
              style={{ color: "var(--chat-text-tertiary)" }}
            >
              {section.label}
            </h4>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                      )}
                      style={{
                        color: isActive
                          ? "var(--chat-accent)"
                          : "var(--chat-text-secondary)",
                        background: isActive
                          ? "var(--chat-accent-soft)"
                          : undefined,
                      }}
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
