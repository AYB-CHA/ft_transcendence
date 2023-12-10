import Button from "@/components/Button";
import Ft from "@/components/icons/Ft";
import Link from "next/link";

type LoginProviderType = {
  redirectUrl: string;
};

export default async function ProvidersButtons() {

  return (
    <div className="grid grid-cols-2 gap-4">

      <Link href={process.env["NEXT_PUBLIC_BACKEND_BASEURL"] + "auth/login"}>
        <Button variant="dark" className="w-full">
          <Ft />
        </Button>
      </Link>
      {/* <Button variant="dark">OK</Button> */}
    </div>
  );
}
