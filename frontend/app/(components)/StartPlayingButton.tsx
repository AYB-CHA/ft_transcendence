"use client";

import Button from "@/components/Button";
import Link from "next/link";

import { useAuth } from "@/hooks/auth";

export default function StartPlayingButton() {
  const { user } = useAuth();
  return (
    <Link href={user ? "/dashboard" : "/auth/login"}>
      <Button>Start Playing</Button>
    </Link>
  );
}
