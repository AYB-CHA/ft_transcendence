"use client";
import { triggerValidationToast } from "@/app/lib/Toast";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthCode from "react-auth-code-input";
import { mutate } from "swr";
export default function Page() {
  const { logOut, verify2FA } = useAuth();
  const { push } = useRouter();
  const [code, setCode] = useState("");

  const handelSubmit = async () => {
    if (code.length !== 6) return;
    verify2FA(code);
    // try {
    //   let response = await axios.post(
    //     "/auth/verify/2fa",
    //     {
    //       verificationCode: code,
    //     },
    //     {
    //       headers: {
    //         Authorization: "Bearer " + Cookies.get("access_token"),
    //       },
    //     }
    //   );
    //   // Cookies.set("access_token", response.data.jwtToken);
    //   // // console.log(response.data.jwtToken);
    //   // mutate("/user/me");
    //   // push("/dashboard");
    // } catch (error) {
    //   triggerValidationToast(
    //     <Lock size={18} />,
    //     "Code",
    //     "Verification code is invalid."
    //   );
    // }
  };

  // const removeAccessToken = () => {
  //   Cookies.remove("access_token");
  //   mutate("/user/me");
  // };

  return (
    <div className="">
      <div className="py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Lock size={75} strokeWidth={1} />
          </div>
          <h1 className="font-semibold text-lg mb-2">
            Enter you verification code
          </h1>
          <p className="text-xs text-dark-semi-light">
            Please enter a code generated by your authenticator application in
            the field below.
          </p>
        </div>

        <AuthCode
          onChange={setCode}
          allowedCharacters="numeric"
          autoFocus
          containerClassName="flex gap-8"
          inputClassName="w-6 py-2 text-center placeholder:text-gray-400 border border-dark-semi-light block w-full bg-dark-semi-dim focus:outline-none"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Link href={"/auth/login"} onClick={logOut}>
          <Button variant="secondary">Cancel</Button>
        </Link>
        <Button className="w-full" onClick={handelSubmit}>{`Let's Go`}</Button>
      </div>
    </div>
  );
}
