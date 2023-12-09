"use client";

import EditAvatar from "@/app/(components)/EditAvatar";
import CardFooter from "@/components/card/CardFooter";
import CardBody from "@/components/card/CardBody";
import Input from "@/components/input/Input";
import Label from "@/components/input/Label";
import Spinner from "@/components/Spinner";
import Button from "@/components/Button";
import Enable2FA from "./Enable2FA";
import axios from "@/lib/axios";

import { dispatchNotification, dispatchServerError } from "@/app/lib/Toast";
import { avatarsBaseUrl } from "../../chat/(components)/NewChannel";
import { camelCaseToNormal } from "@/lib/string";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { AxiosError } from "axios";

import {
  Check,
  Fingerprint,
  Info,
  KeyRoundIcon,
  Mail,
  Repeat,
  SpellCheck2,
  User,
} from "lucide-react";

import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export default function Inputs({}: {}) {
  const { user, isLoading, mutate } = useAuth({ middleware: "auth" });

  const router = useRouter();

  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    setAvatar(user?.avatar ?? "");
    setUsername(user?.username ?? "");
    setEmail(user?.email ?? "");
    setFullName(user?.fullName ?? "");
  }, [user]);

  function setAvatarFullUrl(avatarName: string) {
    setAvatar(avatarsBaseUrl() + avatarName);
  }

  const handelSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axios.put("/user/update", {
        avatar,
        fullName,
        username,
        email,
        password: password.length ? password : undefined,
        passwordConfirmation: password.length
          ? passwordConfirmation
          : undefined,
      });
      dispatchNotification({
        title: "Success",
        icon: Check,
        description: "Profile updated successfully",
      });
      mutate();
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatchNotification({
          title: "Validation",
          icon: SpellCheck2,
          description: camelCaseToNormal(error.response?.data.message[0]),
        });
      }
    }
  };

  async function disable2FAButtonClick() {
    try {
      await axios.put("/user/update/disable2FA");
      mutate();
    } catch {
      dispatchServerError();
    }
  }
  return (
    <form onSubmit={handelSubmit}>
      <CardBody className="py-8 min-h-[320px] flex flex-col">
        {isLoading && (
          <div className="flex justify-center grow items-center">
            <Spinner />
          </div>
        )}
        {user && (
          <div className="grid grid-cols-5">
            <div className="col-span-3">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Full Name"
                    icon={<User size={17} />}
                    value={fullName}
                    name="fullName"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Username</Label>
                  <Input
                    placeholder="Username"
                    icon={<Fingerprint size={17} />}
                    value={username}
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input
                    placeholder="Email"
                    icon={<Mail size={17} />}
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
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
                    disabled={!!user.passwordless}
                    placeholder="Password"
                    icon={<KeyRoundIcon size={17} type="password" />}
                    type="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
                <div>
                  <Label>Password confirmation</Label>
                  <Input
                    disabled={!!user.passwordless}
                    placeholder="Password confirmation"
                    icon={<Repeat size={17} type="password" />}
                    type="password"
                    name="passwordConfirmation"
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    value={passwordConfirmation}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center col-span-2">
              <div className="flex justify-center w-fit">
                <EditAvatar
                  src={avatar.length ? avatar : user.avatar}
                  setSrc={setAvatarFullUrl as Dispatch<SetStateAction<string>>}
                />
              </div>
            </div>
          </div>
        )}
      </CardBody>
      <CardFooter>
        {!isLoading &&
          user &&
          (!user?.is2FAEnabled ? (
            <Enable2FA mutate={mutate} />
          ) : (
            <Button
              type="button"
              variant="danger"
              onClick={disable2FAButtonClick}
            >
              Disable 2F authentication
            </Button>
          ))}
        <Button type="submit" variant="secondary">
          Save changes
        </Button>
      </CardFooter>
    </form>
  );
}
