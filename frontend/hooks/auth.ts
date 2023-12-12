import axios from "@/lib/axios";
import rawAxios from "axios";
import useSWR from "swr";

import { dispatchNotification } from "@/app/lib/Toast";
import { AxiosError, isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import APIClient from "@/lib/axios";

export type UserType = {
  id: string;
  avatar: string;
  email: string;
  fullName: string;
  username: string;
  is2FAEnabled: Boolean;
  passwordless: Boolean;
};

type AuthProps = {
  middleware?: "guest" | "auth";
  redirectIfAuth?: string;
};

export function useAuth({
  middleware,
  redirectIfAuth = "/dashboard",
}: AuthProps | undefined = {}) {
  const [error, setError] = useState<string | null>(null);
  const { push } = useRouter();

  const {
    data: user,
    mutate,
    isLoading,
    error: serverError,
  } = useSWR<UserType, AxiosError<{ error?: "TOTP_UNVERIFIED" }>>(
    "/user/me",
    async (param) => {
      const response = await axios.get<UserType>(param);
      return response.data;
    },
    {
      onErrorRetry: () => {},
    }
  );

  useEffect(() => {
    if (
      isAxiosError(serverError) &&
      serverError.response?.data.error === "TOTP_UNVERIFIED"
    ) {
      return push("/auth/2fa");
    }

    if (middleware === "guest" && redirectIfAuth && user) push(redirectIfAuth);

    if (middleware === "auth" && serverError?.response?.status === 401)
      push("/auth/login");
  }, [middleware, user, push, redirectIfAuth, serverError]);

  const logOut = async () => {
    try {
      await APIClient.post(
        process.env["NEXT_PUBLIC_BACKEND_BASEURL"] + "auth/logout"
      );
    } catch (err) {
      console.log(err);
    }

    mutate(undefined, { revalidate: false });
    push("/");
    // rawAxios.post("/auth/logout");
    // location.href = "/";
  };

  const verify2FA = async (verificationCode: string) => {
    try {
      await axios.post("auth/verify/2fa", {
        code: verificationCode,
      });
      mutate();
      push("/dashboard");
    } catch {
      dispatchNotification({
        title: "Code",
        icon: Lock,
        description: "Verification code is invalid.",
      });
    }
  };

  return {
    user,
    error,
    logOut,
    isLoading,
    verify2FA,
    mutate,
    setError,
  };
}
