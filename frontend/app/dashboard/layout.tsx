import DMSocketProvider from "../(components)/DMSocket";
import NavBar from "./(components)/NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen">
      <div className="flex">
        <NavBar />
      </div>
      <div className="grow">
        <div className="container h-full flex flex-col px-4">
          <DMSocketProvider>{children}</DMSocketProvider>
        </div>
      </div>
    </main>
  );
}
