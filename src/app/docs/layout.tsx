import { Navbar } from "@/components/docs/navbar"
import { Sidebar } from "@/components/docs/sidebar"
import { Footer } from "@/components/docs/footer"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      data-chat-theme="lunar"
      className="min-h-screen flex flex-col"
      style={{ background: "#FAFAFA", color: "#18181B" }}
    >
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
