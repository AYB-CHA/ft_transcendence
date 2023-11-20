import { dispatchNotification, triggerValidationToast } from "@/app/lib/Toast";
import Button from "@/components/Button";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import axios from "@/lib/axios";
import { Lock } from "lucide-react";
import Image from "next/image";
import React, { createElement, useEffect, useState } from "react";
import AuthCode from "react-auth-code-input";

export default function Enable2FA({ mutate }: { mutate: any }) {
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    axios.get<{ image: string }>("/user/2fa/qrcode").then((response) => {
      setQrcode(response.data.image);
    });
  }, []);

  async function enable2FAButtonClick() {
    try {
      await axios.put("/user/update/enable2FA", {
        verificationCode,
      });
      setIsOpen(false);
      mutate();
    } catch (error) {
      dispatchNotification({
        title: "Code",
        icon: Lock,
        description: "Verification code is invalid.",
      });
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button">Enable 2F authentication</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <CardHeader>Enable Two Factor Authentication</CardHeader>
        <CardBody className="flex flex-col gap-6 py-4">
          <p className="text-center text-sm text-dark-semi-light">
            Scan the QR code with your authenticator app.
          </p>
          <div>
            {qrcode && (
              <div className="flex justify-center">
                <Image
                  className="border rounded-md"
                  src={qrcode}
                  alt="QrCode"
                  unoptimized
                  width={150}
                  height={150}
                />
              </div>
            )}
          </div>
          <p className="text-center text-sm text-dark-semi-light">
            Enter the 6-digit code from your authenticator app.
          </p>
          <div className="px-4">
            <AuthCode
              onChange={(code) => {
                setVerificationCode(code);
              }}
              allowedCharacters="numeric"
              autoFocus
              containerClassName="flex gap-6"
              inputClassName="w-6 py-2 text-center placeholder:text-gray-400 border border-dark-semi-light/20 focus:border-b-primary-300/50 transition-colors border-b-2 block w-full bg-dark-semi-dim focus:outline-none"
            />
          </div>
        </CardBody>
        <CardFooter>
          <Button
            disabled={verificationCode.length != 6}
            onClick={enable2FAButtonClick}
          >
            Enable 2FA
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}
