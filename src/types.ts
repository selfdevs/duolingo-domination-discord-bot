type Language = {
  streak: number;
  points: number;
};

export type User = {
  language_data: Record<string, Language>;
};
