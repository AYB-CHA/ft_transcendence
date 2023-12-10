"use client";
import { dispatchNotification } from "@/app/lib/Toast";
import Button from "@/components/Button";
import Input from "@/components/input/Input";
import Label from "@/components/input/Label";

import {
  Fingerprint,
  FingerprintIcon,
  KeyRoundIcon,
  SpellCheck2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginBoard() {
  const [usernameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, setError, login } = useAuth({ middleware: "guest" });
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (searchParams.has("userNameOrEmailError")) {
      timer = setTimeout(() => {
        dispatchNotification({
          title: "Email or username",
          icon: FingerprintIcon,
          description:
            "A user with the same email or username already registered",
        });
      }, 100);
      router.replace("/auth/login");
    }
    if (error)
      dispatchNotification({
        title: "Invalid input",
        icon: SpellCheck2,
        description: error,
        onClick: () => {
          setError(null);
        },
      });
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [error, setError, router, searchParams]);

  return (
    <div>
      <div className="mb-6">
        <Label>Username</Label>
        <Input
          placeholder="username or email"
          icon={<Fingerprint size={17} />}
          value={usernameOrEmail}
          name="usernameOrEmail"
          onChange={(e) => setUserNameOrEmail(e.target.value)}
        />
      </div>
      <div className="mb-8">
        <Label>Password</Label>
        <Input
          placeholder="password"
          icon={<KeyRoundIcon size={17} type="password" />}
          type="password"
          value={password}
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <Button
          className="w-full"
          onClick={() => {
            login(usernameOrEmail, password);
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
