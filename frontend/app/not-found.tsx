"use client";

import Button from "@/components/Button";

import { useRouter } from "next/navigation";

export default function Error() {
  const { back } = useRouter();

  return (
    <div className="grid h-screen px-4 place-content-center">
      <div className="flex flex-col">
        <div className="text-center">
          <h1 className="font-black text-9xl opacity-20">404</h1>
          <p className="text-2xl font-bold tracking-tight sm:text-4xl">
            Not Found!
          </p>
        </div>
        <p className="mt-4 text-gray-500 mb-6">
          This page doesn&apos;t exists, it may have been moved or no longer
          exists.
        </p>
        <div className="flex justify-center">
          <Button onClick={back}>Go back</Button>
        </div>
      </div>
    </div>
  );
}
