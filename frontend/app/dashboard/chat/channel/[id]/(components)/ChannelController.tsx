"use client";

import CardHeader from "@/components/card/CardHeader";
import CardFooter from "@/components/card/CardFooter";
import ChannelMembers from "./ChannelMembers";
import Input from "@/components/input/Input";
import UpdateChannel from "./UpdateChannel";
import Card from "@/components/card/Card";
import axios from "@/lib/axios";
import Image from "next/image";
import useSWR from "swr";

import { notFound, useParams } from "next/navigation";
import { PenIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";

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
  mutedUntil: string | null;
  amIMuted: boolean;
};

export default function ChannelController() {
  const { id } = useParams();
  const [query, setQuery] = useState("");

  const { data, isLoading, error, mutate } = useSWR<ChannelType>(
    `/chat/channel/${id}`,
    getChannelData
  );

  if (error?.response?.status === 404) throw notFound();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Input
          onChange={({ target }) => setQuery(target.value)}
          value={query}
          placeholder="Search Members"
          name="searchMembers"
          icon={<Search size={18} />}
        />
      </CardHeader>
      <div className="flex flex-col grow">
        <div className="py-10">
          <div className="flex justify-center items-center">
            <div className="text-center flex flex-col items-center">
              <div className="relative mb-6">
                <div
                  className={`border-2 h-32 w-32 rounded-full overflow-hidden  ${
                    !isLoading ? "border-primary" : "border-dark-dim"
                  }`}
                >
                  {isLoading || error ? (
                    <div className="h-full w-full bg-dark-semi-dim animate-pulse"></div>
                  ) : (
                    <>
                      <Image
                        src={data?.avatar ?? ""}
                        className="h-full w-full"
                        alt="Avatar"
                        width={128}
                        height={128}
                        priority
                        unoptimized
                      />
                      {data?.myRole === "ADMINISTRATOR" && (
                        <UpdateChannel channelData={data}>
                          <div className="absolute bg-primary text-dark top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border border-dark h-5 w-5 flex justify-center items-center rounded-full">
                            <PenIcon size={11} />
                          </div>
                        </UpdateChannel>
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
        <div className="mb-6 px-4">
          <span className="text-gray-500">Members:</span>
        </div>
        <div className="overflow-auto grow h-0 px-4">
          {<ChannelMembers searchQuery={query} currentChannel={data} />}
        </div>
      </div>
      <CardFooter>
        <div className="py-[7px]">
          <p className="text-xs text-dark-semi-light">
            Please remember to treat channel members with respect. Disruptive
            behavior may result in being removed from the channel or even
            channel deletion.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

export async function getChannelData(url: string) {
  return (await axios.get(url)).data;
}
