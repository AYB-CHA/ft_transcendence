import NavBar from "./(components)/NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col h-screen">
      <div className="grow relative">
        <div className="absolute z-10 inset-0">
          <div className="container">{children}</div>
        </div>
        {/* todo: add background */}
        <div className="absolute inset-0 bg-dark/90 backdrop-blur-xl"></div>
      </div>
      <div className="flex">
        <NavBar />
      </div>
    </main>
  );
}
