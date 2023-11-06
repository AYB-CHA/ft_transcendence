import { PropsWithChildren } from "react";
import { FriendsSocketProvider } from "./(components)/FriendsSocketProvider";

export default function Layout({ children }: PropsWithChildren) {
  return <FriendsSocketProvider>{children}</FriendsSocketProvider>;
}
