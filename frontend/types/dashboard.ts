export type WeeklyDashboardDay = {
  date: string; // YYYY-MM-DD
  has_log: boolean;
  counts: number[]; // per-category (0..11)
  tracked_hours: number;
  unassigned_hours: number;
};

export type CategoryTotal = {
  category_id: number;
  hours: number;
};

export type WeeklyInsights = {
  average_sleep_hours: number;
  most_frequent_category: number | null;
  most_balanced_day: string | null;
};

export type WeeklyDashboardResponse = {
  start_date: string;
  end_date: string;
  days: WeeklyDashboardDay[];
  total_tracked_hours: number;
  average_sleep_hours: number;
  logged_days: number;
  // V3 additions
  category_totals: CategoryTotal[];
  insights: WeeklyInsights;
};


