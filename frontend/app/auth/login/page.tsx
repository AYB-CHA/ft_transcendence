"use client"
import { useAuth } from "@/hooks/auth";
import ProvidersButtons from "../(components)/ProvidersButtons";

export default function page() {
  const {  } = useAuth({ middleware: "guest" });
  return (
    <div className="min-h-[300px] flex items-center flex-col justify-center">
      <h2 className="text-2xl text-center mb-4 font-bold">PING PONG</h2>
      <div className="mb-6 w-full">
        <ProvidersButtons />
      </div>
      <div className="text-center">
        <span className="text-gray-500">
          By Click on the button above you agree to our terms{" "}
        </span>
      </div>
    </div>
  );
}
