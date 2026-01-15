export enum DreamState {
  None = 0,
  Unremembered = 1,
  Remembered = 2,
}

export type DreamApiResponse =
  | {
      id: string;
      date: string;
      dream_state: DreamState;
      description: string | null;
    }
  | null;

export type DreamUpsertPayload = {
  date: string;
  dream_state: DreamState;
  description?: string | null;
};

