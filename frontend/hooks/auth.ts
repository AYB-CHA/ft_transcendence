import { camelCaseToNormal } from "@/lib/string";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "@/lib/axios";
import useSWR from "swr";

export type UserType = {
  id: string;
  avatar: string;
  email: string;
  fullName: string;
  username: string;
};

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const { push } = useRouter();

  const { data: user, mutate } = useSWR("/user/me", async (param) => {
    const response = await axios.get<UserType>(param);
    return response.data;
  });

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
      if (error instanceof AxiosError)
        setError(camelCaseToNormal(error.response?.data.message[0]));
    }
  };

  const register = async (data: { [key: string]: string }) => {
    try {
      let response = await axios.post("auth/register", data);
      Cookies.set("access_token", response.data.jwtToken);
      mutate();
      push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError)
        setError(camelCaseToNormal(error.response?.data.message[0]));
    }
  };

  return { user, error, register, login };
}
