export type DateStatus = "live" | "reconstructed" | "future";

export type DayLogApiResponse =
  | {
      id: string;
      date: string;
      hours: number[];
      is_reconstructed: boolean;
    }
  | null;

