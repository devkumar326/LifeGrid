import Image from "next/image";
import Link from "next/link";
import LifeGridIcon from "../app/favicon.ico";

export default function Header() {
  return (
    <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-10 w-10">
          <Image
            src={LifeGridIcon}
            alt="LifeGrid logo"
            fill
            sizes="40px"
            className="rounded-md"
            priority
          />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">LifeGrid</h1>
          <p className="text-zinc-400 text-sm hidden sm:block">
            Track how you spend each hour of your day
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-2 sm:gap-4 text-sm sm:text-sm text-zinc-400">
        <Link
          href="/"
          className="min-h-11 px-3 py-2 rounded-lg sm:rounded-md sm:px-0 sm:py-0 flex items-center sm:inline sm:min-h-0 sm:hover:text-zinc-200 transition-colors"
        >
          Log
        </Link>
        <Link
          href="/dashboard"
          className="min-h-11 px-3 py-2 rounded-lg sm:rounded-md sm:px-0 sm:py-0 flex items-center sm:inline sm:min-h-0 sm:hover:text-zinc-200 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/events"
          className="min-h-11 px-3 py-2 rounded-lg sm:rounded-md sm:px-0 sm:py-0 flex items-center sm:inline sm:min-h-0 sm:hover:text-zinc-200 transition-colors"
        >
          Events
        </Link>
      </nav>
    </header>
  );
}

