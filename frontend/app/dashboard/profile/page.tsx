"use client";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { Achievments } from "./(components)/achievments";
import { History } from "./(components)/history";
import { useAuth } from "@/hooks/auth";

type profileType = {
  id: string;
  name: string;
  avatar: string;
  email: string;
};

export default function Page() {
  const {user, isLoading, error} = useAuth();
  return (
    <div className="container h-full flex place-items-center justify-center flex-col gap-4">
      <div className=" border p-6 bg-dark-dim flex flex-col md:flex-row gap-4 h-[244px] place-items-center mx-8 w-full">
        <Avatar
          className="h-[90%] w-auto aspect-square rounded-[12px] place-self-center"
          src={"/avatar-2.png"}
        ></Avatar>
        <div className="grow md:text-left text-center pt-4">
          <p className="text-2xl">Fatima-zehra El Bouaazzaoui</p>
          <p>@Tema</p>
        </div>
        <Button>GO TO SETTINGS</Button>
      </div>
      {/* hna sala div dyal profile */}
      <Achievments id={user?.id}/>
      <History id={user?.id}/>
    </div>
  );
}
