import Button from "@/components/Button";
import Ft from "@/components/icons/Ft";
import Link from "next/link";

export default async function ProvidersButtons() {
  return (
    <div className="grid gap-4">
      <Link href={process.env["NEXT_PUBLIC_BACKEND_BASEURL"] + "auth/login"}>
        <Button variant="dark" className="w-full">
          <Ft />
        </Button>
      </Link>
    </div>
  );
}
