import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get("access_token") ?? "";
  const redirectUrl = new URL(process.env["FRONTEND_BASEURL"] as string);

  if (request.nextUrl.searchParams.has("userNameOrEmailError")) {
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.append("userNameOrEmailError", "");
    return NextResponse.redirect(redirectUrl);
  }

  const cookieStore = cookies();
  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  redirectUrl.pathname = request.nextUrl.searchParams.get("2fa")
    ? "/auth/2fa"
    : "/dashboard";

  return NextResponse.redirect(redirectUrl, 301);
};
