import { CATEGORIES } from "../lib/categories";

export default function CategoryLegend() {
  return (
    <div className="border-t border-[var(--border)] pt-6">
      <h2 className="text-sm font-medium text-zinc-400 mb-3">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {CATEGORIES.map((cat, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${cat.colorClass}`} />
            <span className="text-sm">{cat.icon}</span>
            <span className="text-xs text-zinc-300">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

