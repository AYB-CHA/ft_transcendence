import { User } from "../user";
import type { MatchStatus } from "./status";

export interface Game {
  id: string;

  status: "FINISHED" | "READY";
  initiator: User;
  participant: User;
  initiatorScore: number;
  participantScore: number;

  initiatorStatus: MatchStatus;
  participantStatus: MatchStatus;
}

export interface GameLaunch {
  matchId: string;
  opponent: User;
  isInitiator: boolean;
}
