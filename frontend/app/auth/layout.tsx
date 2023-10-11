import Card from "@/components/card/Card";
import IntroGame from "./register/(components)/IntroGame";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <div className="max-w-4xl w-full">
        <div>
          <Card>
            <div className="grid grid-cols-2">
              <IntroGame />
              <div className="p-6">{children}</div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
