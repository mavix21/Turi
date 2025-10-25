import { SidebarClient } from "@/app/_pages/sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  type Section = "about" | "passport" | "trips" | "rewards" | "providers";

  return (
    <main className="bg-background min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Sidebar Navigation */}
          <aside className="flex-shrink-0 lg:w-64">
            <div className="lg:sticky lg:top-24">
              <h1 className="text-foreground mb-6 hidden text-2xl font-bold lg:block">
                Profile
              </h1>

              {/* Mobile: Horizontal tabs */}
              <SidebarClient />
            </div>
          </aside>
          {children}
        </div>
      </div>
    </main>
  );
}
