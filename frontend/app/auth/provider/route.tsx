import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get("access_token") ?? "";
  const cookieStore = cookies();

  let redirectUrl = new URL(process.env["FRONTEND_BASEURL"] ?? "");
  redirectUrl.pathname += "/dashboard";

  cookieStore.set("access_token", token);
  return NextResponse.redirect(redirectUrl);
};
