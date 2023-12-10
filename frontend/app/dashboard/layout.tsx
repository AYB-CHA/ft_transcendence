import DMSocketProvider from "../(components)/DMSocket";
import NavBar from "./(components)/NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen">
      <div className="flex">
        <NavBar />
      </div>
      <div className="flex flex-col flex-1 overflow-auto py-8">
        <div className="flex flex-col flex-1 container px-4">
          <DMSocketProvider>{children}</DMSocketProvider>
        </div>
      </div>
    </main>
  );
}
