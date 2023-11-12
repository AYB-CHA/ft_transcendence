import { camelCaseToNormal } from "@/lib/string";
import rawAxios, { AxiosError, isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { createElement, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "@/lib/axios";
import useSWR from "swr";
import { triggerValidationToast } from "@/app/lib/Toast";
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
      console.log(response);
      return response.data;
    },
    {
      onErrorRetry: () => {},
    }
  );

  const logOut = async () => {
    try {
      await rawAxios.post("/auth/logout");
    } catch {}

    mutate(undefined, { revalidate: false });
    push("/");
  };

  useEffect(() => {
    if (
      isAxiosError(serverError) &&
      serverError.response?.data.error === "TOTP_UNVERIFIED"
    ) {
      return push("/auth/2fa");
    }
    if (middleware === "guest" && redirectIfAuth && user) push(redirectIfAuth);
    if (middleware === "auth" && !user && serverError) {
      // logOut();
    }
  }, [middleware, user, push, redirectIfAuth, serverError]);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      let response = await axios.post("auth/login", {
        usernameOrEmail,
        password,
      });
      Cookies.set("access_token", response.data.jwtToken);
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
      Cookies.set("access_token", response.data.jwtToken);
      push("/dashboard/settings");
      mutate();
    } catch (error) {
      if (error instanceof AxiosError)
        setError(camelCaseToNormal(error.response?.data.message[0]));
    }
  };

  const verify2FA = async (verificationCode: string) => {
    try {
      await axios.post("/auth/verify/2fa", {
        verificationCode,
      });
      console.log("ok");
      mutate();
      push("/dashboard");
    } catch {
      triggerValidationToast(
        createElement(Lock, { size: 18 }),
        "Code",
        "Verification code is invalid."
      );
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
