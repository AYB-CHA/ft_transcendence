import Button from "@/components/Button";
import Input from "@/components/input/Input";
import Label from "@/components/input/Label";
import ProvidersButtons from "../(components)/ProvidersButtons";
import Link from "next/link";
import { Fingerprint, Key } from "lucide-react";

export default function page() {
  return (
    <div>
      <div className="mb-6">
        <Label>Username</Label>
        <Input
          placeholder="username or email"
          icon={<Fingerprint size={17} />}
        />
      </div>
      <div className="mb-8">
        <Label>Password</Label>
        <Input placeholder="password" icon={<Key size={17} />} />
      </div>
      <div className="mb-6">
        <Button className="w-full">Login</Button>
      </div>
      <div className="h-px bg-dark-semi-light relative mb-6">
        <span className="bg-dark absolute left-1/2 text-xs top-1/2 -translate-y-1/2 -translate-x-1/2 px-1">
          OR
        </span>
      </div>
      <div className="mb-6">
        <ProvidersButtons />
      </div>
      <div className="text-center">
        <span className="text-gray-500">Don’t have an account? </span>
        <Link href={"/auth/register"}>
          <span className="text-primary font-medium">sign up</span>
        </Link>
      </div>
    </div>
  );
}
