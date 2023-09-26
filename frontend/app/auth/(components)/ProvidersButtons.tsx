import Button from "@/components/Button";
import Ft from "@/components/icons/Ft";
import Github from "@/components/icons/Github";
import serverAxios from "@/lib/serverAxios";
import Link from "next/link";

type LoginProviderType = {
  redirectUrl: string;
};

export default async function ProvidersButtons() {
  let githubLink = (
    await serverAxios.get<LoginProviderType>("/auth/login/github")
  ).data.redirectUrl;
  let ftLink = (await serverAxios.get<LoginProviderType>("/auth/login/ft")).data
    .redirectUrl;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Link href={githubLink} className="flex">
        <Button variant="dark" className="w-full">
          <Github />
        </Button>
      </Link>

      <Link href={ftLink}>
        <Button variant="dark" className="w-full">
          <Ft />
        </Button>
      </Link>
      {/* <Button variant="dark">OK</Button> */}
    </div>
  );
}
