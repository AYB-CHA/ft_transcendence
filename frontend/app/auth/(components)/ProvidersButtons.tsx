import Github from "@/components/icons/Github";
import serverAxios from "@/lib/serverAxios";
import Button from "@/components/Button";
import Ft from "@/components/icons/Ft";
import Link from "next/link";

type LoginProviderType = {
  redirectUrl: string;
};

async function getRedirectUrl(uri: string) {
  try {
    const response = await serverAxios.get<LoginProviderType>(uri);
    return response.data.redirectUrl;
  } catch {}
  return null;
}

export default async function ProvidersButtons() {
  const githubLink = await getRedirectUrl("/auth/login/github");
  const fortyTwoLink = await getRedirectUrl("/auth/login/ft");

  if (!githubLink || !fortyTwoLink)
    return (
      <div className="text-center text-xs text-dark-semi-light">
        Server Error
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-4">
      <Link href={githubLink} className="flex">
        <Button variant="dark" className="w-full">
          <Github />
        </Button>
      </Link>

      <Link href={fortyTwoLink}>
        <Button variant="dark" className="w-full">
          <Ft />
        </Button>
      </Link>
    </div>
  );
}
