import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import MessagesBox from "./MessagesBox";
import ChatBoxHeader from "./ChatBoxHeader";

import { notFound, useParams } from "next/navigation";
import { ChannelType, getChannelData } from "./ChannelController";
import { useAuth } from "@/hooks/auth";
import useSWR from "swr";
import { MehIcon } from "lucide-react";

export type MessageType = {
  text: string;
  senderId: string;
  id: string;
};

export default function ChatBox() {
  let { user: me } = useAuth();
  let { id } = useParams();

  let { data, isLoading, error } = useSWR<ChannelType>(
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
          <div className="flex h-full justify-center items-center flex-col gap-4">
            <MehIcon className="text-gray-600" size={50} strokeWidth={1} />
            <span>You are baned from this channel.</span>
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
