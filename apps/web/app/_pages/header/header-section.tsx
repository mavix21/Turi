import { Link } from "@/app/_shared/i18n";

import { AuthMenu } from "./auth-menu";

export function HeaderSection() {
  return (
    <header className="bg-background border-border fixed top-0 right-0 left-0 z-50 border-b shadow-lg transition-all duration-500 ease-in-out">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 transition-all duration-300 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg shadow-lg">
            <span className="text-primary-foreground text-lg font-bold">T</span>
          </div>
          <h1 className="text-foreground text-2xl font-bold">Turi</h1>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-foreground hover:text-foreground/80 text-sm font-medium transition"
          >
            Home
          </Link>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground text-sm transition"
          >
            Explore
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground text-sm transition"
          >
            Activity
          </a>
        </nav>
        <AuthMenu />
      </div>
    </header>
  );
}
