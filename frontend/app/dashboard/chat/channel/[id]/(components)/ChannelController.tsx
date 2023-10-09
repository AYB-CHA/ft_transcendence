"use client";

import Image from "next/image";
import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import CardFooter from "@/components/card/CardFooter";
import { PenIcon, Search } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/input/Input";
import useSWR from "swr";
import { notFound, useParams } from "next/navigation";
import axios from "@/lib/axios";
import ChannelMembers from "./ChannelMembers";
import LeaveChannel from "../../../(components)/LeaveChannel";
import { useState } from "react";

export type UserRoleOnChannel = "MEMBER" | "ADMINISTRATOR" | "MODERATOR";
export type ChannelVisibilityType = "PRIVATE" | "PUBLIC" | "PROTECTED";

export type ChannelType = {
  id: string;
  name: string;
  topic: string;
  avatar: string;
  members: number;
  type: ChannelVisibilityType;
  myRole: UserRoleOnChannel;
  amIBaned: boolean;
};

export default function ChannelController() {
  let { id } = useParams();
  const [leaveConfirm, setLeaveConfirm] = useState(false);

  let { data, isLoading, error, mutate } = useSWR<ChannelType>(
    `/chat/channel/${id}`,
    getChannelData
  );

  if (error) throw notFound();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Input placeholder="Search Members" icon={<Search size={18} />} />
      </CardHeader>
      <div className="grow px-4">
        <div className="py-10">
          <div className="flex justify-center items-center">
            <div className="text-center flex flex-col items-center">
              <div className="relative cursor-pointer mb-6">
                <div
                  className={`border-2 h-32 w-32 rounded-full overflow-hidden  ${
                    !isLoading ? "border-primary" : "border-dark-dim"
                  }`}
                >
                  {isLoading ? (
                    <div className="h-full w-full bg-dark-semi-dim animate-pulse"></div>
                  ) : (
                    <>
                      <Image
                        src={data?.avatar ?? ""}
                        className="h-full w-full"
                        alt="Avatar"
                        width={128}
                        height={128}
                        unoptimized
                      />
                      {data?.myRole === "ADMINISTRATOR" && (
                        <div className="absolute bg-primary text-dark top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border border-dark h-5 w-5 flex justify-center items-center rounded-full">
                          <PenIcon size={11} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              {isLoading ? (
                <>
                  <div className="w-16 py-2.5 bg-dark-semi-dim animate-pulse my-auto mb-3"></div>
                  <div className="w-36 py-1.5 bg-dark-semi-dim animate-pulse mx-auto"></div>
                </>
              ) : (
                <>
                  <h3 className="font-medium text-base mb-1">{data?.name}</h3>
                  <p className="text-gray-500">{data?.topic}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div>{<ChannelMembers currentChannel={data} />}</div>
      </div>
      <CardFooter>
        <div className="py-[7px]">
          <p className="text-xs text-dark-semi-light">
            Please remember to treat channel members with respect. Disruptive
            behavior may result in being removed from the channel or even
            channel deletion.
          </p>
        </div>
        {/* <div className="w-full grid grid-cols-2 gap-4">
          <Button
            disabled={data?.amIBaned}
            variant="danger"
            onClick={() => setLeaveConfirm(true)}
          >
            Leave Channel
          </Button>
          <Button>Invite People</Button>
        </div>
        <LeaveChannel
          id={data?.id}
          status={leaveConfirm}
          setStatus={setLeaveConfirm}
        /> */}
      </CardFooter>
    </Card>
  );
}

export async function getChannelData(url: string) {
  return (await axios.get(url)).data;
}
