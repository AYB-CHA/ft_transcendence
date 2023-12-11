"use client";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { Achievments } from "./../(components)/achievments";
import Spinner from "@/components/Spinner";
import Alert from "@/components/Alert";
import dynamic from "next/dynamic";
import { ROUTER } from "@/lib/ROUTER";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "../../games/repo";

const History = dynamic(
  () => import("./../(components)/history").then((mod) => mod.History),
  {
    ssr: false,
  },
);

export default function Page() {
  const { id } = useParams();
  const { data: user, isLoading, error } = useUser(id as string);
  const actualId = id === "me" ? (user?.id as string) : (id as string);
  return (
    <div className="container h-full flex place-items-center justify-center flex-col gap-4">
      {isLoading && <Spinner />}
      {error && <Alert>{`couldn&apos;t find user ${user?.fullName}`}</Alert>}
      {user && (
        <>
          <div className=" border p-6 bg-dark-dim flex flex-col md:flex-row gap-4 h-[244px] place-items-center mx-8 w-full">
            <Avatar
              className="h-[90%] w-auto aspect-square rounded-[12px] place-self-center"
              src={user.avatar}
            ></Avatar>
            <div className="grow md:text-left text-center pt-4">
              <p className="text-2xl">{user.fullName}</p>
              <p>{user.username}</p>
            </div>
            {id === "me" && (
              <Link href={ROUTER.SETTINGS}>
                <Button>GO TO SETTINGS</Button>
              </Link>
            )}
          </div>
          <Achievments id={actualId} />
          <History id={actualId} />
        </>
      )}
    </div>
  );
}
