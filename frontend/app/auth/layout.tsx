export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <div className="max-w-sm w-full">{children}</div>
    </main>
  );
}
