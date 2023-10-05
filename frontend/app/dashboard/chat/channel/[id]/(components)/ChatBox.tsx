import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import CardFooter from "@/components/card/CardFooter";
import MyMessage from "./MyMessage";

import { notFound, useParams } from "next/navigation";
import useSWR from "swr";
import { ChannelType, getChannelData } from "./ChannelController";
import { useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";
import ChatBoxInput from "./ChatBoxInput";
import ChatBoxHeader from "./ChatBoxHeader";
import { useAuth } from "@/hooks/auth";
import OtherMessage from "./OtherMessage";
import axios from "@/lib/axios";
import { MehIcon } from "lucide-react";
import { useChannelChatSocket } from "../page";

export type MessageType = {
  text: string;
  senderId: string;
  id: string;
};

async function getOldMessages(url: string) {
  return (await axios.get<MessageType[]>(url)).data;
}

export function formatMessages(messages: MessageType[]) {
  let messagesGroup: MessageType[][] = [];
  let group: MessageType[] = [];

  messages.forEach((message) => {
    if (!group.length) {
      group.push(message);
    } else {
      if (group[0].senderId == message.senderId) group.push(message);
      else {
        messagesGroup.push(group);
        group = [];
        group.push(message);
      }
    }
  });
  if (group.length != 0) messagesGroup.push(group);
  return messagesGroup;
}

export default function ChatBox() {
  let { id } = useParams();
  let { user: me } = useAuth();
  let [messages, setMessages] = useState<MessageType[]>([]);

  let socket = useChannelChatSocket();

  let { data, isLoading, error } = useSWR<ChannelType>(
    `/chat/channel/${id}`,
    getChannelData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) throw notFound();

  let { data: oldMessages } = useSWR<MessageType[]>(
    `/chat/channel/messages/${id}`,
    getOldMessages,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) throw notFound();

  useEffect(() => {
    if (oldMessages) setMessages(oldMessages);
  }, [oldMessages]);

  useEffect(() => {
    socket?.on("newMessage", (message: MessageType) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    });
  }, [id, socket]);

  function sendMessage(text: string) {
    socket?.emit("newMessage", { channelId: id, text });
  }

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
            <div className="grow h-0 overflow-auto">
              <div className="flex flex-col p-4 gap-4">
                {formatMessages(messages).map((messagesGroup) => {
                  if (messagesGroup[0].senderId === me?.id)
                    return (
                      <MyMessage
                        avatar={me.avatar}
                        username={me.username}
                        key={messagesGroup[0].id}
                        messages={messagesGroup}
                      />
                    );
                  return (
                    <OtherMessage
                      key={messagesGroup[0].id}
                      messages={messagesGroup}
                    />
                  );
                })}
              </div>
            </div>
            <CardFooter>
              <ChatBoxInput handler={sendMessage} />
            </CardFooter>
          </>
        )}
      </div>
    </Card>
  );
}
