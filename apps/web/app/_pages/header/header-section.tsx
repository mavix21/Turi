import { Link } from "@/app/_shared/i18n";
import { LanguageSwitcher } from "@/app/_shared/ui/language-switcher";
import { ThemeSwitcher } from "@/app/_shared/ui/theme-switcher";

import { AuthMenu } from "./auth-menu";
import { NavLinks } from "./nav-links";

export function HeaderSection() {
  return (
    <header className="bg-background border-border fixed top-0 right-0 left-0 z-50 border-b shadow-lg transition-all duration-500 ease-in-out">
      <div className="mx-auto grid max-w-7xl grid-flow-col grid-cols-1 items-center justify-between px-4 py-3 transition-all duration-300 sm:px-6 md:grid-cols-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg shadow-lg">
            <span className="text-primary-foreground text-lg font-bold">T</span>
          </div>
          <h1 className="text-foreground text-2xl font-bold">Turi</h1>
        </Link>
        <div className="flex justify-center gap-8">
          <NavLinks />
        </div>
        <div className="flex items-center justify-end gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <AuthMenu />
        </div>
      </div>
    </header>
  );
}
