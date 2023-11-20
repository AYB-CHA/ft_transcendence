"use client";
import { dispatchNotification } from "@/app/lib/Toast";
import Button from "@/components/Button";
import Input from "@/components/input/Input";
import Label from "@/components/input/Label";
import { useAuth } from "@/hooks/auth";
import {
  Fingerprint,
  KeyRoundIcon,
  Mail,
  SpellCheck2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function RegisterBoard() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const { error, setError, register } = useAuth({ middleware: "guest" });

  useEffect(() => {
    if (error)
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
        <Label>Full Name</Label>
        <Input
          placeholder="Full Name"
          icon={<User size={17} />}
          onChange={(e) => setFullName(e.target.value)}
          value={fullName}
        />
      </div>
      <div className="mb-6">
        <Label>Username</Label>
        <Input
          placeholder="username"
          icon={<Fingerprint size={17} />}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      <div className="mb-6">
        <Label>Email</Label>
        <Input
          placeholder="Email"
          icon={<Mail size={17} />}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          value={email}
        />
      </div>
      <div className="mb-8">
        <Label>Password</Label>
        <Input
          placeholder="password"
          icon={<KeyRoundIcon size={17} type="password" />}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <div className="mb-6">
        <Button
          className="w-full"
          onClick={() => {
            register({ fullName, username, password, email });
          }}
        >
          Register
        </Button>
      </div>
    </div>
  );
}
