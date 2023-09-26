import ProvidersButtons from "../(components)/ProvidersButtons";
import Link from "next/link";
import RegisterBoard from "./(components)/RegisterBoard";

export default function page() {
  return (
    <div>
      <RegisterBoard />
      <div className="h-px bg-dark-semi-light relative mb-6">
        <span className="bg-dark absolute left-1/2 text-xs top-1/2 -translate-y-1/2 -translate-x-1/2 px-1">
          OR
        </span>
      </div>
      <div className="mb-6">
        <ProvidersButtons />
      </div>
      <div className="text-center">
        <span className="text-gray-500">You have an account? </span>
        <Link href={"/auth/login"}>
          <span className="text-primary font-medium">Login</span>
        </Link>
      </div>
    </div>
  );
}
