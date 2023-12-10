"use client";
import { cn } from "@/app/lib/cn";
import { useThemeStore } from "@/app/store/theme";
import Image from "next/image";

export function Themes() {
  const [theme, setPitch, setPaddle] = useThemeStore((state) => [
    state.theme,
    state.setPitch,
    state.setPaddleColor,
  ]);

  const pitches = ["blue", "green"];

  const paddles = ["white", "orange", "red"];

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold">Theme</h2>
        <div className="flex gap-2 p-4 flex-wrap justify-center">
          {pitches.map((pitch) => (
            <button
              className={cn(
                "curspr-pointer",
                theme.pitch !== pitch && "border-4 border-transparent ring-0",
                theme.pitch === pitch &&
                  "border-4 border-transparent ring-2 ring-white ring-offset-1",
              )}
              key={pitch}
              onClick={() => {
                setPitch(pitch);
              }}
            >
              <Image
                height={200}
                width={200}
                src={`/pitch-${pitch}.png`}
                alt={`${pitch} pitch`}
              />
            </button>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold">Paddle</h2>
          <div className="flex gap-2 p-4 flex-wrap justify-center">
            {paddles.map((paddle, i) => (
              <div key={paddle + i}>
                <button
                  className={cn(
                    "curspr-pointer",
                    theme.paddle !== paddle &&
                      "border-4 border-transparent ring-0",
                    theme.paddle === paddle &&
                      "border-4 border-transparent ring-2 ring-white ring-offset-1",
                  )}
                  key={paddle}
                  onClick={() => {
                    setPaddle(paddle);
                  }}
                >
                  <div
                    className="h-7 w-48"
                    style={{
                      backgroundColor: paddle,
                    }}
                  ></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
