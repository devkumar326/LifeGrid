export type WeeklyDashboardDay = {
  date: string; // YYYY-MM-DD
  has_log: boolean;
  counts: number[]; // per-category (0..11)
  tracked_hours: number;
  unassigned_hours: number;
};

export type WeeklyDashboardResponse = {
  start_date: string;
  end_date: string;
  days: WeeklyDashboardDay[];
  total_tracked_hours: number;
  average_sleep_hours: number;
  logged_days: number;
};


