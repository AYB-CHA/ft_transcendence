"use client";

import Button from "@/components/Button";
import Ft from "@/components/icons/Ft";

export default function ProvidersButtons() {
  function login() {
    document.location.href =
      process.env["NEXT_PUBLIC_BACKEND_BASEURL"] + "auth/login";
  }

  return (
    <div className="grid gap-4">
      <Button variant="dark" className="w-full" onClick={login}>
        <Ft />
      </Button>
    </div>
  );
}
