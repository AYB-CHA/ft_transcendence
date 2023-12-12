"use client";

import { GameInviteSocketProvider } from "./GameInvitationSocket";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GameInviteSocketProvider>{children}</GameInviteSocketProvider>;
}
