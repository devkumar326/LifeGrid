export type DailySummaryApiResponse =
  | {
      id: string;
      date: string;
      highlight: string | null;
      reflection: string | null;
    }
  | null;

export type DailySummaryUpsertPayload = {
  highlight?: string | null;
  reflection?: string | null;
};


