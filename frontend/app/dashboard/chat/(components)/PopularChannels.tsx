import MemberLabeLoading from "../channel/[id]/(components)/MemberLabeLoading";
import CardHeader from "@/components/card/CardHeader";
import CardBody from "@/components/card/CardBody";
import ChannelLabel from "./ChannelLabel";
import Card from "@/components/card/Card";
import { FlameIcon } from "lucide-react";
import NewChannel from "./NewChannel";
import APIClient from "@/lib/axios";
import React from "react";
import useSWR from "swr";

import { SearchChannelType } from "./NewChat";

export default function PopularChannels() {
  const { data, isLoading } = useSWR<SearchChannelType[]>(
    "/chat/channel/discover",
    async (url: string) => {
      return (await APIClient(url)).data;
    }
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex justify-between text-gray-500">
        <div className="flex items-center gap-2 text-xs">
          <FlameIcon size={20} strokeWidth={1} />
          <span>Popular Channels</span>
        </div>
        <div className="flex gap-2">
          <NewChannel />
        </div>
      </CardHeader>
      <CardBody className="h-0 overflow-auto grow">
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
