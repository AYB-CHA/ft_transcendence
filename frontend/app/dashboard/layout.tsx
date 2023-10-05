import DMSocketProvider from "../(components)/DMSocket";
import NavBar from "./(components)/NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col h-screen">
      <div className="grow">
        <div className="container h-full flex flex-col">
          <DMSocketProvider>{children}</DMSocketProvider>
        </div>
      </div>
      <div className="flex">
        <NavBar />
      </div>
    </main>
  );
}
