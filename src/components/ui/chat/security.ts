/**
 * chatcn — Security Utilities
 * XSS prevention, URL sanitization, file validation, bidi stripping, emoji validation
 */

// ─── URL Sanitization ─────────────────────────────────────────────────────────

const ALLOWED_URL_PROTOCOL = /^(https?:\/\/|mailto:)/i

/** Sanitize a URL — only allow http, https, and mailto. Blocks javascript:, data:, etc. */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "#"
  const trimmed = url.trim()
  if (!ALLOWED_URL_PROTOCOL.test(trimmed)) return "#"
  return trimmed
}

/** Extract hostname from a URL for display (prevents misleading long URLs) */
export function displayHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

// ─── Text Sanitization ───────────────────────────────────────────────────────

/** Strip bidi override characters that can disguise malicious content (RLO attacks) */
export function stripBidiOverrides(text: string): string {
  // Remove LRO, RLO, LRE, RLE, PDF, LRI, RLI, FSI, PDI
  return text.replace(/[\u202A-\u202E\u2066-\u2069]/g, "")
}

/** Truncate message text to prevent rendering DoS */
export function truncateMessage(
  text: string,
  maxLength: number = 10_000
): { text: string; truncated: boolean } {
  if (text.length <= maxLength) return { text, truncated: false }
  return { text: text.slice(0, maxLength) + "\u2026", truncated: true }
}

/** Sanitize sender name — strip bidi, truncate */
export function sanitizeSenderName(name: string): string {
  return stripBidiOverrides(name).slice(0, 100)
}

// ─── File Validation ──────────────────────────────────────────────────────────

const BLOCKED_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".scr", ".pif", ".com",
  ".js", ".jsx", ".ts", ".tsx", ".mjs",
  ".html", ".htm", ".xhtml",
  ".svg",
  ".xml", ".xsl", ".xslt",
  ".hta", ".vbs", ".vbe", ".wsf", ".wsh",
  ".ps1", ".psm1",
  ".sh", ".bash",
])

const DEFAULT_MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

export interface FileValidationResult {
  valid: boolean
  error?: string
}

export function validateFile(
  file: File,
  opts?: { maxSize?: number }
): FileValidationResult {
  const maxSize = opts?.maxSize ?? DEFAULT_MAX_FILE_SIZE

  // Check extension
  const parts = file.name.split(".")
  const ext = parts.length > 1 ? "." + parts[parts.length - 1].toLowerCase() : ""
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `File type ${ext} is not allowed` }
  }

  // Check size
  if (file.size > maxSize) {
    const mbLimit = Math.round(maxSize / (1024 * 1024))
    return { valid: false, error: `File exceeds maximum size of ${mbLimit}MB` }
  }

  return { valid: true }
}

/** Sanitize a file name for display */
export function sanitizeFileName(name: string): string {
  let clean = name.replace(/[/\\]/g, "_")   // Remove path traversal
  clean = clean.replace(/\0/g, "")           // Remove null bytes
  clean = stripBidiOverrides(clean)           // Remove bidi overrides
  if (clean.length > 100) clean = clean.slice(0, 97) + "..."
  return clean
}

// ─── Emoji Validation ─────────────────────────────────────────────────────────

const EMOJI_REGEX = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(\u200D(\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*$/u

/** Validate that a string is a valid emoji (not arbitrary text) */
export function isValidEmoji(str: string): boolean {
  return EMOJI_REGEX.test(str) && str.length <= 20
}

// ─── Reaction Count Safety ────────────────────────────────────────────────────

/** Format reaction count for display (cap at 999+, floor at 0) */
export function formatReactionCount(count: number): string {
  if (count <= 0) return "0"
  if (count > 999) return "999+"
  return String(count)
}
