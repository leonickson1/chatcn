"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"

interface PreviewTabsProps {
  preview: React.ReactNode
  code: string
  height?: number
  /** Center the preview content (for non-chat demos like cards, badges, etc.) */
  centered?: boolean
}

export function PreviewTabs({ preview, code, height = 400, centered = false }: PreviewTabsProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview")
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--chat-border-strong)" }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center gap-0 border-b px-1 h-10"
        style={{
          borderColor: "var(--chat-border)",
          background: "var(--chat-bg-sidebar)",
        }}
      >
        <button
          onClick={() => setTab("preview")}
          className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors")}
          style={{
            color:
              tab === "preview"
                ? "var(--chat-text-primary)"
                : "var(--chat-text-tertiary)",
            background:
              tab === "preview" ? "var(--chat-bg-main)" : "transparent",
          }}
        >
          Preview
        </button>
        <button
          onClick={() => setTab("code")}
          className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors")}
          style={{
            color:
              tab === "code"
                ? "var(--chat-text-primary)"
                : "var(--chat-text-tertiary)",
            background:
              tab === "code" ? "var(--chat-bg-main)" : "transparent",
          }}
        >
          Code
        </button>
      </div>

      {/* Content */}
      <div style={{ height, position: "relative" }}>
        {tab === "preview" ? (
          <div
            className={cn(
              "w-full h-full",
              centered ? "flex items-center justify-center p-6 overflow-auto" : "flex flex-col overflow-hidden"
            )}
            style={{ background: "var(--chat-bg-main)" }}
          >
            {preview}
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-md border transition-colors"
              style={{
                borderColor: "var(--chat-border-strong)",
                background: "var(--chat-bg-main)",
                color: "var(--chat-text-secondary)",
              }}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <pre
              className="w-full h-full overflow-auto p-4 text-[13px] leading-relaxed"
              style={{
                background: "var(--chat-bg-sidebar)",
                color: "var(--chat-text-primary)",
                fontFamily: "var(--font-geist-mono), var(--chat-font-mono)",
                margin: 0,
              }}
            >
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
