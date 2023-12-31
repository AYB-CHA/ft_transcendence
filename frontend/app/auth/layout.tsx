import GlowCard from "@/components/GlowCard/GlowCard";
import IntroGame from "./register/(components)/IntroGame";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <div className="w-[90%] max-w-5xl">
        <div>
          <GlowCard>
            <div className="grid grid-cols-2">
              <div className="bg-dark-dim mr-px h-full grid grid-cols-1">
                <IntroGame />
              </div>
              <div className="p-6 bg-dark-dim">{children}</div>
            </div>
          </GlowCard>
        </div>
      </div>
    </main>
  );
}
