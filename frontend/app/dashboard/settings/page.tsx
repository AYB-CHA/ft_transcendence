"use client";
import EditAvatar from "@/app/(components)/EditAvatar";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import Card from "@/components/card/Card";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import Input from "@/components/input/Input";
import Label from "@/components/input/Label";
import { useAuth } from "@/hooks/auth";
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

import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { avatarsBaseUrl } from "../chat/(components)/NewChannel";
import axios from "@/lib/axios";
import { triggerSuccessToast, triggerValidationToast } from "@/app/lib/Toast";
import { AxiosError } from "axios";
import { camelCaseToNormal } from "@/lib/string";
import { useRouter } from "next/navigation";
import Inputs from "./(components)/Inputs";
import Image from "next/image";

export default function Page() {
  const { user, isLoading, mutate } = useAuth();
  const [qrcode, setQrcode] = useState<string | null>(null);

  return (
    <div className="h-full flex justify-center items-center">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader>Profile Settings</CardHeader>
          {qrcode === null ? (
            <Inputs
              isLoading={isLoading}
              user={user}
              mutate={mutate}
              setQrcode={setQrcode}
            />
          ) : (
            <>
              <CardBody className="flex flex-col items-center py-8 gap-4 px-12">
                <p className="text-center text-xs text-dark-semi-light">
                  <strong>Important</strong>: Before anything else, scan the
                  provided QR code to set up Two-Factor Authentication (2FA) for
                  your account. Remember to safeguard your 2FA code, as losing
                  it may result in being locked out of your account.
                </p>
                <Image
                  className="border rounded-md"
                  src={qrcode}
                  alt="QrCode"
                  unoptimized
                  width={150}
                  height={150}
                />
              </CardBody>
              <CardFooter>
                <Button
                  onClick={() => {
                    setQrcode(null);
                  }}
                >
                  Ok I Understand
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
