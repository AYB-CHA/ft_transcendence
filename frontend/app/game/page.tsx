import dynamic from "next/dynamic";
import { Game } from "./components";

/* const Game = dynamic(
  () => import("./components/index").then((mod) => mod.Game),
  { ssr: false },
); */

export default function Page() {
  return <Game />;
}
