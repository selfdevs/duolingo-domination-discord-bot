export type User = {
  streak: number;
  totalXp: number;
  lastWeekXP: number;
  name: string;
};

export type XPSummaries = {
  summaries: Array<{
    gainedXp: number;
  }>;
};
