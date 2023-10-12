"use client";
import { triggerValidationToast } from "@/app/lib/Toast";
import Alert from "@/components/Alert";
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

  const { error, register } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <Label>Full Name</Label>
        <Input
          placeholder="Full Name"
          icon={<User size={17} />}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <Label>Username</Label>
        <Input
          placeholder="username"
          icon={<Fingerprint size={17} />}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <Label>Email</Label>
        <Input
          placeholder="Email"
          icon={<Mail size={17} />}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      </div>
      <div className="mb-8">
        <Label>Password</Label>
        <Input
          placeholder="password"
          icon={<KeyRoundIcon size={17} type="password" />}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <Button
          className="w-full"
          onClick={() => {
            register({ fullName, username, password, email });
            if (error) {
              triggerValidationToast(
                <SpellCheck2 size={18} />,
                "Validation",
                error
              );
            }
          }}
        >
          Register
        </Button>
      </div>
    </div>
  );
}
