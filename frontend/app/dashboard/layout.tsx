"use client";

import DMSocketProvider from "../(components)/DMSocket";
import NavBar from "./(components)/NavBar";
import { GameInviteSocketProvider } from "./games/match/GameInvitationSocket";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen">
      <div className="flex">
        <NavBar />
      </div>
      <div className="flex flex-col flex-1 overflow-auto py-8">
        <div className="flex flex-col flex-1 container px-4">
          <DMSocketProvider>
            <GameInviteSocketProvider>{children}</GameInviteSocketProvider>
          </DMSocketProvider>
        </div>
      </div>
    </main>
  );
}
