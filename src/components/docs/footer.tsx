import Link from "next/link"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Components", href: "/docs/messages" },
      { label: "Themes", href: "/docs/theming" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/leonickson1/chatcn", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "React", href: "https://react.dev", external: true },
      { label: "shadcn/ui", href: "https://ui.shadcn.com", external: true },
      { label: "Tailwind", href: "https://tailwindcss.com", external: true },
    ],
  },
]

export function Footer() {
  return (
    <footer
      className="border-t px-6 py-10 mt-auto"
      style={{
        borderColor: "var(--chat-border)",
        color: "var(--chat-text-tertiary)",
      }}
    >
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20">
        {/* Tagline */}
        <div className="flex-1 min-w-[200px]">
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--chat-text-primary)" }}
          >
            chatcn
          </p>
          <p className="text-sm leading-relaxed">
            Free &amp; open-source chat components for React.
          </p>
        </div>

        {/* Columns */}
        {columns.map((col) => (
          <div key={col.title} className="min-w-[120px]">
            <h5
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--chat-text-secondary)" }}
            >
              {col.title}
            </h5>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) =>
                "external" in link && link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline transition-colors"
                      style={{ color: "var(--chat-text-tertiary)" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:underline transition-colors"
                      style={{ color: "var(--chat-text-tertiary)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  )
}
