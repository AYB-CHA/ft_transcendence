import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get("access_token") ?? "";
  const redirectUrl = new URL(process.env["FRONTEND_BASEURL"] as string);

  const cookieStore = cookies();
  cookieStore.set("access_token", token, { httpOnly: true, secure: false });

  redirectUrl.pathname = request.nextUrl.searchParams.get("2fa")
    ? "/auth/2fa"
    : "/dashboard";

  return NextResponse.redirect(redirectUrl, 301);
};
