import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="mb-8 flex items-start justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10">
          <Image
            src="/lifegridIcn.png"
            alt="LifeGrid logo"
            fill
            sizes="40px"
            className="rounded-md"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">LifeGrid</h1>
          <p className="text-zinc-400 text-sm">Track how you spend each hour of your day</p>
        </div>
      </div>

      <nav className="flex items-center gap-4 text-sm text-zinc-400">
        <Link href="/" className="hover:text-zinc-200 transition-colors">
          Log
        </Link>
        <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
          Dashboard
        </Link>
        <Link href="/events" className="hover:text-zinc-200 transition-colors">
          Events
        </Link>
      </nav>
    </header>
  );
}

