import Image from "next/image";

export default function Header() {
  return (
    <header className="mb-8 flex items-center gap-3">
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
    </header>
  );
}

