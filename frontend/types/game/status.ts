export const MatchStatus = ["PLAYING", "FINISHED", "PENDING"] as const;

export type MatchStatus = (typeof MatchStatus)[number];
