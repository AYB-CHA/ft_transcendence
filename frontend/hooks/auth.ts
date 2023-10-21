import { camelCaseToNormal } from "@/lib/string";
import { AxiosError, isAxiosError } from "axios";
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
  } = useSWR(
    "/user/me",
    async (param) => {
      console.log(Cookies.get("access_token"));
      const response = await axios.get<UserType>(param, {
        headers: {
          Authorization: "Bearer " + Cookies.get("access_token"),
        },
      });
      return response.data;
    },
    {
      onErrorRetry: () => {},
    }
  );

  const logOut = () => {
    Cookies.remove("access_token");
    mutate();
    push("/");
  };

  useEffect(() => {
    if (
      isAxiosError(serverError) &&
      serverError.response?.data.error === "TOTP_UNVERIFIED"
    ) {
      console.log(user, serverError);
      return push("/auth/2fa");
    }
    if (middleware === "guest" && redirectIfAuth && user) push(redirectIfAuth);
    if (middleware === "auth" && !user && serverError) logOut();
  }, [middleware, user, push, redirectIfAuth, serverError]);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      let response = await axios.post("auth/login", {
        usernameOrEmail,
        password,
      });
      Cookies.set("access_token", response.data.jwtToken);
      push("/dashboard");
      mutate();
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(camelCaseToNormal(error.response?.data.message[0]));
      }
    }
  };

  const register = async (data: { [key: string]: string }) => {
    try {
      let response = await axios.post("auth/register", data);
      Cookies.set("access_token", response.data.jwtToken);
      push("/dashboard/settings");
      mutate();
    } catch (error) {
      if (error instanceof AxiosError)
        setError(camelCaseToNormal(error.response?.data.message[0]));
    }
  };

  const verify2FA = async (verificationCode: string) => {
    console.log(verificationCode);
    try {
      let response = await axios.post(
        "/auth/verify/2fa",
        {
          verificationCode,
        },
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("access_token"),
          },
        }
      );
      Cookies.set("access_token", response.data.jwtToken);
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

  return { user, error, register, login, logOut, isLoading, verify2FA, mutate };
}
