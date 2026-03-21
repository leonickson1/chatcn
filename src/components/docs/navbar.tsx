"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Github, Menu, X, MessageCircle, Star } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/docs/messages" },
]

const searchPages = [
  { title: "Getting Started", href: "/docs", description: "Introduction to chatcn" },
  { title: "Installation", href: "/docs/installation", description: "Install and set up chatcn" },
  { title: "Theming", href: "/docs/theming", description: "4 themes: Lunar, Aurora, Ember, Midnight" },
  { title: "API Reference", href: "/docs/api-reference", description: "Props and types reference" },
  { title: "Messages", href: "/docs/messages", description: "Message bubbles, grouping, replies" },
  { title: "Composer", href: "/docs/composer", description: "Input, attachments, file upload" },
  { title: "Reactions", href: "/docs/reactions", description: "Emoji reaction pills" },
  { title: "Threads", href: "/docs/threads", description: "Flat and nested threading" },
  { title: "Conversations", href: "/docs/conversations", description: "Sidebar conversation list" },
  { title: "Media", href: "/docs/media", description: "Images, files, voice, code, links" },
  { title: "Presence", href: "/docs/presence", description: "Online status, typing, read receipts" },
  { title: "Search", href: "/docs/search", description: "Command palette search" },
  { title: "Advanced", href: "/docs/advanced", description: "Hooks, shortcuts, performance" },
  { title: "Security", href: "/docs/security", description: "XSS prevention, file validation, privacy defaults" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [starCount, setStarCount] = useState<number | null>(null)

  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return searchPages
    return searchPages.filter(
      (page) =>
        page.title.toLowerCase().includes(q) ||
        page.description.toLowerCase().includes(q),
    )
  }, [searchQuery])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") setSearchOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    fetch("https://api.github.com/repos/leonickson1/chatcn")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.stargazers_count != null) setStarCount(data.stargazers_count)
      })
      .catch(() => {})
  }, [])

  return (
    <header
      className="sticky top-0 z-50 h-14 border-b flex items-center px-4 md:px-6"
      style={{
        borderColor: "var(--chat-border)",
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[16px] font-bold tracking-tight"
          style={{ color: "var(--chat-text-primary)" }}
        >
          <MessageCircle className="w-[18px] h-[18px]" style={{ color: "#6366F1", fill: "#6366F1" }} />
          chatcn
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/docs"
                ? pathname === "/docs"
                : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                )}
                style={{
                  color: isActive
                    ? "var(--chat-accent)"
                    : "var(--chat-text-secondary)",
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] transition-colors hover:bg-[#F4F4F5]"
            style={{ borderColor: "#E4E4E7", color: "#A1A1AA", minWidth: "200px" }}
          >
            <Search className="size-3.5" />
            <span className="flex-1 text-left">Search docs...</span>
            <kbd className="rounded border px-1.5 py-0.5 text-[10px] font-medium" style={{ borderColor: "#E4E4E7", color: "#A1A1AA" }}>
              ⌘K
            </kbd>
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/leonickson1/chatcn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 h-8 rounded-md px-2 transition-colors hover:opacity-80"
            style={{ color: "var(--chat-text-secondary)" }}
          >
            <Github className="w-4 h-4" />
            {starCount !== null && (
              <span className="flex items-center gap-0.5 text-[12px] font-medium" style={{ color: "#71717A" }}>
                <Star className="w-3 h-3" style={{ fill: "#FBBF24", color: "#FBBF24" }} />
                {starCount}
              </span>
            )}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 ml-auto"
          style={{ color: "var(--chat-text-primary)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute top-14 left-0 right-0 border-b p-4 flex flex-col gap-2 md:hidden"
          style={{
            borderColor: "var(--chat-border)",
            background: "var(--chat-bg-main)",
          }}
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/docs"
                ? pathname === "/docs"
                : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={{
                  color: isActive
                    ? "var(--chat-accent)"
                    : "var(--chat-text-secondary)",
                  background: isActive ? "var(--chat-accent-soft)" : undefined,
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="flex items-center gap-3 pt-2 mt-2 border-t" style={{ borderColor: "var(--chat-border)" }}>
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(true) }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border flex-1"
              style={{
                borderColor: "var(--chat-border-strong)",
                color: "var(--chat-text-tertiary)",
                background: "var(--chat-bg-sidebar)",
              }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
            </button>
            <a
              href="https://github.com/leonickson1/chatcn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-md"
              style={{ color: "var(--chat-text-secondary)" }}
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          style={{ background: "rgba(0,0,0,0)" }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border bg-white shadow-2xl overflow-hidden"
            style={{ borderColor: "#E4E4E7" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center gap-3 border-b px-4 py-3"
              style={{ borderColor: "#F4F4F5" }}
            >
              <Search className="size-4" style={{ color: "#A1A1AA" }} />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="flex-1 bg-transparent text-[15px] outline-none"
                style={{ color: "#18181B" }}
              />
              <kbd
                className="rounded border px-1.5 py-0.5 text-[10px]"
                style={{ borderColor: "#E4E4E7", color: "#A1A1AA" }}
              >
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filteredResults.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                  className="flex flex-col px-4 py-2.5 transition-colors hover:bg-[#F4F4F5]"
                >
                  <span
                    className="text-[14px] font-medium"
                    style={{ color: "#18181B" }}
                  >
                    {page.title}
                  </span>
                  <span className="text-[12px]" style={{ color: "#A1A1AA" }}>
                    {page.description}
                  </span>
                </Link>
              ))}
              {filteredResults.length === 0 && searchQuery && (
                <div
                  className="px-4 py-6 text-center text-[13px]"
                  style={{ color: "#A1A1AA" }}
                >
                  No results found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
