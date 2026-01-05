export type CategoryDefinition = {
  name: string;
  colorClass: string;
  icon: string;
};

/**
 * Category definitions - fixed enum shared with backend.
 * Index = category code, value = { name, color class, icon }
 */
export const CATEGORIES: CategoryDefinition[] = [
  { name: "Sleep", colorClass: "cat-0", icon: "🌙" },
  { name: "Work", colorClass: "cat-1", icon: "💼" },
  { name: "Learning & Building", colorClass: "cat-2", icon: "📘" },
  { name: "Deep Thinking / Reflection", colorClass: "cat-3", icon: "🧠" },
  { name: "Exercise & Health", colorClass: "cat-4", icon: "🏋️" },
  { name: "Friends & Social", colorClass: "cat-5", icon: "🧑‍🤝‍🧑" },
  { name: "Relaxation & Leisure", colorClass: "cat-6", icon: "🎮" },
  { name: "Dating / Partner", colorClass: "cat-7", icon: "❤️" },
  { name: "Family", colorClass: "cat-8", icon: "👪" },
  { name: "Life Admin / Chores", colorClass: "cat-9", icon: "🧾" },
  { name: "Travel / Commute", colorClass: "cat-10", icon: "✈️" },
  { name: "Getting Ready / Misc", colorClass: "cat-11", icon: "🚿" },
];

export const CATEGORY_COUNT = CATEGORIES.length;

