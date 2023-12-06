import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import { FlameIcon } from "lucide-react";
import NewChannel from "./NewChannel";
import useSWR from "swr";
import { SearchChannelType } from "./NewChat";
import APIClient from "@/lib/axios";
import CardBody from "@/components/card/CardBody";
import MemberLabeLoading from "../channel/[id]/(components)/MemberLabeLoading";
import React from "react";
import ChannelLabel from "./ChannelLabel";

export default function PopularChannels() {
  const { data, isLoading } = useSWR<SearchChannelType[]>(
    "/chat/channel/discover",
    async (url: string) => {
      return (await APIClient(url)).data;
    }
  );

  console.log(data);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex justify-between text-gray-500">
        <div className="flex gap-2 items-center text-xs">
          <FlameIcon size={20} strokeWidth={1} />
          <span>Popular Channels</span>
        </div>
        <div className="flex gap-2">
          <NewChannel />
        </div>
      </CardHeader>
      <CardBody className="grow h-0 overflow-auto">
        <div className="grid flex-1 gap-4 py-1">
          {isLoading && (
            <>
              <MemberLabeLoading />
              <MemberLabeLoading />
              <MemberLabeLoading />
              <MemberLabeLoading />
              <MemberLabeLoading />
            </>
          )}
          {data?.map((channel, index) => (
            <React.Fragment key={channel.id}>
              <ChannelLabel
                avatar={channel.avatar}
                name={channel.name}
                type={channel.type}
                topic={channel.topic}
                usersCount={channel.members}
                id={channel.id}
              />
              {index < data.length - 1 && (
                <hr className="border-dark-semi-dim" />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
