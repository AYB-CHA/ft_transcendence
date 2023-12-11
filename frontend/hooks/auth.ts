import axios from "@/lib/axios";
import rawAxios from "axios";
import useSWR from "swr";

import { dispatchNotification } from "@/app/lib/Toast";
import { AxiosError, isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { camelCaseToNormal } from "@/lib/string";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

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
    },
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
      logOut();
  }, [middleware, user, push, redirectIfAuth, serverError]);

  const logOut = async () => {
    try {
      await rawAxios.post("api/auth/logout");
    } catch {}

    mutate(undefined, { revalidate: false });
    rawAxios.post("/auth/logout");
  };

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await axios.post("api/auth/login", {
        usernameOrEmail,
        password,
      });

      mutate();
      push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(camelCaseToNormal(error.response?.data.message[0]));
      }
    }
  };

  const register = async (data: { [key: string]: string }) => {
    try {
      const response = await axios.post("auth/register", data);
      push("/dashboard/settings");
      mutate();
    } catch (error) {
      if (error instanceof AxiosError)
        setError(camelCaseToNormal(error.response?.data.message[0]));
    }
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
    register,
    login,
    logOut,
    isLoading,
    verify2FA,
    mutate,
    setError,
  };
}
