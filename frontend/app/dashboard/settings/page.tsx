"use client";
import Button from "@/components/Button";
import Card from "@/components/card/Card";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import { useAuth } from "@/hooks/auth";
import { useState } from "react";
import Inputs from "./(components)/Inputs";
import Image from "next/image";

export default function Page() {
  // const [qrcode, setQrCode] = useState<string | null>(null);

  return (
    <div className="h-full flex justify-center items-center">
      <div className="max-w-4xl w-full">
        <Card>
          <CardHeader>Profile Settings</CardHeader>
          {/* {qrcode === null ? (
            <Inputs
              isLoading={isLoading}
              user={user}
              mutate={mutate}
              setQrCode={setQrCode}
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
                    setQrCode(null);
                  }}
                >
                  Ok I Understand
                </Button>
              </CardFooter>
            </>
          )} */}
          <Inputs />
        </Card>
      </div>
    </div>
  );
}
