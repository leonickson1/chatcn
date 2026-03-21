import Link from "next/link"

export default function SecurityPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#18181B] mb-4">Security</h1>
      <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
        chatcn renders user-generated content. Every text rendering path is protected against XSS,
        URL injection, file upload attacks, and content spoofing.
      </p>

      {/* Security Defaults */}
      <div className="mt-8">
        <h2 className="text-[20px] font-bold text-[#18181B] mb-4">Security Defaults</h2>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Setting</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Default</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Reason</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Markdown raw HTML</td>
                <td className="px-4 py-2.5">Blocked</td>
                <td className="px-4 py-2.5">XSS prevention</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Allowed link protocols</td>
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">http</code>,{" "}
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">https</code>,{" "}
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">mailto</code> only
                </td>
                <td className="px-4 py-2.5">
                  Block <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">javascript:</code> and{" "}
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">data:</code> URIs
                </td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">External links</td>
                <td className="px-4 py-2.5">
                  <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">target=&quot;_blank&quot; rel=&quot;noopener noreferrer&quot;</code>
                </td>
                <td className="px-4 py-2.5">Prevent tab-napping</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">SVG file uploads</td>
                <td className="px-4 py-2.5">Blocked</td>
                <td className="px-4 py-2.5">SVG can contain scripts</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Max message render length</td>
                <td className="px-4 py-2.5">10,000 chars</td>
                <td className="px-4 py-2.5">Prevent rendering DoS</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Max reactions per message</td>
                <td className="px-4 py-2.5">8</td>
                <td className="px-4 py-2.5">Prevent reaction spam</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">File size limit (UI)</td>
                <td className="px-4 py-2.5">25MB</td>
                <td className="px-4 py-2.5">Prevent large uploads</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Bidi override stripping</td>
                <td className="px-4 py-2.5">On</td>
                <td className="px-4 py-2.5">Prevent text spoofing</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Emoji validation</td>
                <td className="px-4 py-2.5">On</td>
                <td className="px-4 py-2.5">Prevent non-emoji injection</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Built-in Security Utilities */}
      <div className="mt-12">
        <h2 className="text-[20px] font-bold text-[#18181B] mb-4">Built-in Security Utilities</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-6">
          Import from{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">@/components/ui/chat</code>:
        </p>

        <div className="flex flex-col gap-6">
          {/* sanitizeUrl */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.10)] p-4">
            <h3 className="text-[15px] font-semibold text-[#18181B] mb-1">
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px]">sanitizeUrl(url)</code>
            </h3>
            <p className="text-[13px] text-[#71717A] mb-3">
              Blocks <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">javascript:</code>,{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">data:</code>,{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">vbscript:</code>,{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">blob:</code> protocols.
              Only allows <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">http://</code>,{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">https://</code>,{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">mailto:</code>.
            </p>
            <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed">
              <code>{`import { sanitizeUrl } from "@/components/ui/chat"

sanitizeUrl("https://example.com")      // "https://example.com"
sanitizeUrl("javascript:alert(1)")       // "#"
sanitizeUrl("data:text/html,<script>")   // "#"`}</code>
            </pre>
          </div>

          {/* validateFile */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.10)] p-4">
            <h3 className="text-[15px] font-semibold text-[#18181B] mb-1">
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px]">validateFile(file, opts?)</code>
            </h3>
            <p className="text-[13px] text-[#71717A] mb-3">
              Blocks dangerous extensions (<code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.exe</code>,{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.bat</code>,{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.svg</code>,{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.html</code>,{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.js</code> + 25 more).
              Enforces 25MB size limit.
            </p>
            <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed">
              <code>{`import { validateFile } from "@/components/ui/chat"

const result = validateFile(file)
if (!result.valid) {
  console.error(result.error) // "File type .exe is not allowed"
}

// Custom size limit
validateFile(file, { maxSize: 10 * 1024 * 1024 }) // 10MB`}</code>
            </pre>
          </div>

          {/* sanitizeFileName */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.10)] p-4">
            <h3 className="text-[15px] font-semibold text-[#18181B] mb-1">
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px]">sanitizeFileName(name)</code>
            </h3>
            <p className="text-[13px] text-[#71717A] mb-3">
              Strips path traversal (<code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">/</code>{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">\</code>), null bytes, bidi overrides. Truncates to 100 chars.
            </p>
            <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed">
              <code>{`import { sanitizeFileName } from "@/components/ui/chat"

sanitizeFileName("../../etc/passwd")  // ".._.._ etc_passwd"
sanitizeFileName("report.pdf")        // "report.pdf"`}</code>
            </pre>
          </div>

          {/* isValidEmoji */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.10)] p-4">
            <h3 className="text-[15px] font-semibold text-[#18181B] mb-1">
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px]">isValidEmoji(str)</code>
            </h3>
            <p className="text-[13px] text-[#71717A] mb-3">
              Unicode regex validation for reactions. Prevents non-emoji injection.
            </p>
            <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed">
              <code>{`import { isValidEmoji } from "@/components/ui/chat"

isValidEmoji("\u{1F44D}")           // true
isValidEmoji("<script>")      // false`}</code>
            </pre>
          </div>

          {/* stripBidiOverrides */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.10)] p-4">
            <h3 className="text-[15px] font-semibold text-[#18181B] mb-1">
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px]">stripBidiOverrides(text)</code>
            </h3>
            <p className="text-[13px] text-[#71717A] mb-3">
              Removes U+202A-202E, U+2066-2069 (RLO attack prevention).
            </p>
            <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed">
              <code>{`import { stripBidiOverrides } from "@/components/ui/chat"

stripBidiOverrides("hello\\u202Eworld")  // "helloworld"`}</code>
            </pre>
          </div>

          {/* truncateMessage */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.10)] p-4">
            <h3 className="text-[15px] font-semibold text-[#18181B] mb-1">
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px]">truncateMessage(text, maxLength?)</code>
            </h3>
            <p className="text-[13px] text-[#71717A] mb-3">
              Caps at 10,000 chars by default to prevent rendering DoS. Returns{" "}
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">{`{ text, truncated }`}</code>.
            </p>
            <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed">
              <code>{`import { truncateMessage } from "@/components/ui/chat"

truncateMessage("short")          // { text: "short", truncated: false }
truncateMessage(longText, 5000)   // { text: "...(truncated)", truncated: true }`}</code>
            </pre>
          </div>

          {/* sanitizeSenderName */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.10)] p-4">
            <h3 className="text-[15px] font-semibold text-[#18181B] mb-1">
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px]">sanitizeSenderName(name)</code>
            </h3>
            <p className="text-[13px] text-[#71717A] mb-3">
              Strips bidi overrides and truncates to 100 chars.
            </p>
            <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed">
              <code>{`import { sanitizeSenderName } from "@/components/ui/chat"

sanitizeSenderName("Alice")  // "Alice"`}</code>
            </pre>
          </div>

          {/* formatReactionCount */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.10)] p-4">
            <h3 className="text-[15px] font-semibold text-[#18181B] mb-1">
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px]">formatReactionCount(count)</code>
            </h3>
            <p className="text-[13px] text-[#71717A] mb-3">
              Floors at 0, caps at &quot;999+&quot;.
            </p>
            <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed">
              <code>{`import { formatReactionCount } from "@/components/ui/chat"

formatReactionCount(5)      // "5"
formatReactionCount(1500)   // "999+"
formatReactionCount(-1)     // "0"`}</code>
            </pre>
          </div>

          {/* displayHostname */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.10)] p-4">
            <h3 className="text-[15px] font-semibold text-[#18181B] mb-1">
              <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px]">displayHostname(url)</code>
            </h3>
            <p className="text-[13px] text-[#71717A] mb-3">
              Safe URL display showing only hostname. Prevents misleading long URLs.
            </p>
            <pre className="bg-[#18181B] text-[#FAFAFA] rounded-xl p-4 overflow-x-auto font-mono text-[13px] leading-relaxed">
              <code>{`import { displayHostname } from "@/components/ui/chat"

displayHostname("https://example.com/very/long/path")  // "example.com"`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* XSS Prevention */}
      <div className="mt-12">
        <h2 className="text-[20px] font-bold text-[#18181B] mb-4">XSS Prevention</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          All text rendering uses React JSX (auto-escaped). No{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">dangerouslySetInnerHTML</code>{" "}
          anywhere except Shiki code output.
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2 text-[15px] text-[#71717A] leading-relaxed">
          <li>Plain text messages render through React text nodes</li>
          <li>
            Markdown rendering uses{" "}
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">react-markdown</code>{" "}
            with element allowlist (no{" "}
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">rehypeRaw</code>)
          </li>
          <li>
            Link rendering overrides{" "}
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">&lt;a&gt;</code>{" "}
            tags to sanitize URLs
          </li>
          <li>Code block language names stripped to alphanumeric only</li>
          <li>Mention names treated as untrusted text</li>
        </ul>
      </div>

      {/* File Upload Security */}
      <div className="mt-12">
        <h2 className="text-[20px] font-bold text-[#18181B] mb-4">File Upload Security</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          Frontend validation via{" "}
          <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[13px] text-[#18181B]">validateFile()</code>:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2 text-[15px] text-[#71717A] leading-relaxed">
          <li>
            Blocked extensions:{" "}
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.exe</code>,{" "}
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.bat</code>,{" "}
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.svg</code>,{" "}
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.html</code>,{" "}
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.js</code>,{" "}
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">.sh</code> + 25 more
          </li>
          <li>
            SVG specifically blocked (can contain{" "}
            <code className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[12px] text-[#18181B]">&lt;script&gt;</code> tags)
          </li>
          <li>25MB size limit (configurable)</li>
          <li>File name sanitization strips path traversal and null bytes</li>
        </ul>
      </div>

      {/* Privacy Defaults */}
      <div className="mt-12">
        <h2 className="text-[20px] font-bold text-[#18181B] mb-4">Privacy Defaults</h2>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.10)]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Feature</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Default</th>
                <th className="px-4 py-3 text-left font-semibold text-[#18181B]">Notes</th>
              </tr>
            </thead>
            <tbody className="text-[#71717A]">
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Read receipts</td>
                <td className="px-4 py-2.5">Off (opt-in)</td>
                <td className="px-4 py-2.5">Users should control their own</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Presence indicators</td>
                <td className="px-4 py-2.5">Off (opt-in)</td>
                <td className="px-4 py-2.5">Users should control visibility</td>
              </tr>
              <tr className="border-b border-[rgba(0,0,0,0.04)]">
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Typing indicator</td>
                <td className="px-4 py-2.5">On</td>
                <td className="px-4 py-2.5">Standard UX expectation</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-[#18181B]">Avatar URLs</td>
                <td className="px-4 py-2.5">Proxy recommended</td>
                <td className="px-4 py-2.5">Can be tracking pixels</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Backend Responsibilities */}
      <div className="mt-12">
        <h2 className="text-[20px] font-bold text-[#18181B] mb-4">Backend Responsibilities</h2>
        <p className="text-[15px] text-[#71717A] leading-relaxed mb-4">
          chatcn is a UI library. These are <strong className="text-[#18181B]">NOT</strong> handled by chatcn:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2 text-[15px] text-[#71717A] leading-relaxed">
          <li>Authentication &amp; authorization</li>
          <li>Message encryption (E2E, at-rest)</li>
          <li>Rate limiting</li>
          <li>Content moderation</li>
          <li>SSRF prevention (link preview fetching)</li>
          <li>File malware scanning</li>
          <li>EXIF stripping from images</li>
          <li>Input length validation (server-side)</li>
          <li>Audit logging</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-6">
        <Link
          href="/docs/advanced"
          className="text-[14px] font-medium text-[#6366F1] hover:underline"
        >
          &larr; Advanced
        </Link>
        <span />
      </div>
    </div>
  )
}
