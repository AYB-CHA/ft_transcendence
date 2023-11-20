"use client";
import { dispatchNotification } from "@/app/lib/Toast";
import Button from "@/components/Button";
import Input from "@/components/input/Input";
import Label from "@/components/input/Label";
import { useAuth } from "@/hooks/auth";
import { Fingerprint, KeyRoundIcon, SpellCheck2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoginBoard() {
  const [usernameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, setError, login } = useAuth({ middleware: "guest" });

  useEffect(() => {
    if (error)
      dispatchNotification({
        title: "Invalid input",
        icon: SpellCheck2,
        description: error,
        onClick: () => {
          setError(null);
        },
      });
  }, [error, setError]);

  return (
    <div>
      <div className="mb-6">
        <Label>Username</Label>
        <Input
          placeholder="username or email"
          icon={<Fingerprint size={17} />}
          value={usernameOrEmail}
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
