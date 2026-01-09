export type NotableEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string | null;
  category: number | null;
};

export type CreateNotableEventPayload = {
  date: string; // YYYY-MM-DD
  title: string;
  description?: string | null;
  category?: number | null;
};


