import { GameSocketProvider } from "./socket";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GameSocketProvider>{children}</GameSocketProvider>;
}
