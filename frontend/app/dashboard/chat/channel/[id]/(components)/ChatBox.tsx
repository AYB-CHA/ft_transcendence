import CardHeader from "@/components/card/CardHeader";
import ChatBoxHeader from "./ChatBoxHeader";
import Card from "@/components/card/Card";
import MessagesBox from "./MessagesBox";
import useSWR from "swr";

import { ChannelType, getChannelData } from "./ChannelController";
import { notFound, useParams } from "next/navigation";
import { MehIcon } from "lucide-react";
import { useAuth } from "@/hooks/auth";

export type MessageType = {
  text: string;
  senderId: string;
  id: string;
};

export default function ChatBox() {
  const { user: me } = useAuth();
  const { id } = useParams();

  const { data, isLoading, error } = useSWR<ChannelType>(
    `/chat/channel/${id}`,
    getChannelData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) throw notFound();

  return (
    <Card className="col-span-2">
      <div className="flex flex-col h-full">
        <CardHeader>
          <ChatBoxHeader data={data} isLoading={isLoading} />
        </CardHeader>
        {data?.amIBaned ? (
          <div className="flex h-full justify-center items-center flex-col gap-4 text-dark-semi-light">
            <MehIcon
              className="text-dark-semi-light"
              size={50}
              strokeWidth={1}
            />
            <span className="text-xs">You are baned from this channel.</span>
          </div>
        ) : (
          <>
            <MessagesBox me={me} channel={data} isLoading={isLoading} />
          </>
        )}
      </div>
    </Card>
  );
}
