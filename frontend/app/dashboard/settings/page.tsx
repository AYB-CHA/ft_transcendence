"use client";
import EditAvatar from "@/app/(components)/EditAvatar";
import Button from "@/components/Button";
import Card from "@/components/card/Card";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import Input from "@/components/input/Input";
import Label from "@/components/input/Label";
import {
  Fingerprint,
  Info,
  KeyRoundIcon,
  Mail,
  Repeat,
  Repeat1,
  User,
} from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [avatar, setAvatar] = useState("");
  return (
    <div className="h-full flex justify-center items-center">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader>Profile Settings</CardHeader>
          <CardBody className="py-8">
            <div className="flex justify-center mb-8">
              <EditAvatar src="/avatar-1.png" setSrc={setAvatar} />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="Full Name"
                  icon={<User size={17} />}
                  // onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input
                  placeholder="Username"
                  icon={<Fingerprint size={17} />}
                  // onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Email</Label>
                <Input
                  placeholder="Email"
                  icon={<Mail size={17} />}
                  // onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
              <div className="col-span-2 text-xs text-dark-semi-light flex gap-2">
                <Info size={17} strokeWidth={1} />
                If you wish to keep your password unchanged, you can leave the
                password field empty.
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  placeholder="Password"
                  icon={<KeyRoundIcon size={17} type="password" />}
                  type="password"
                  // onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label>Password confirmation</Label>
                <Input
                  placeholder="Password confirmation"
                  icon={<Repeat size={17} type="password" />}
                  type="password"
                  // onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button>Enable 2F authentication</Button>
            <Button variant="secondary">Save changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
