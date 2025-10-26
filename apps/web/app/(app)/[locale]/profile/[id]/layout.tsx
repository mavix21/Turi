import { useTranslations } from "next-intl";

import { SidebarClient } from "@/app/_pages/sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("home.profile");

  return (
    <main className="bg-background min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Sidebar Navigation */}
          <aside className="shrink-0 lg:w-64">
            <div className="lg:sticky lg:top-24">
              <h1 className="text-foreground mb-6 hidden text-2xl font-bold lg:block">
                {t("title")}
              </h1>

              {/* Mobile: Horizontal tabs */}
              <SidebarClient />
            </div>
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
