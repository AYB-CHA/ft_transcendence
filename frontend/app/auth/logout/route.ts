import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = () => {
  const cookieStore = cookies();
  cookieStore.set("access_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    expires: new Date(),
  });
  return NextResponse.json({ message: "Signed out" });
  // const cookieStore = cookies();
  // cookieStore.set("access_token", "", {
  //   httpOnly: true,
  //   secure: false,
  //   expires: new Date(),
  // });
  // return NextResponse.json({ message: "Signed out" });
};
