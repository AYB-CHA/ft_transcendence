"use client";
import Avatar from "@/components/Avatar";
import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import CardFooter from "@/components/card/CardFooter";
import MyMessage from "./MyMessage";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { getChannelData } from "./ChannelController";
import { useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import ChatBoxInput from "./ChatBoxInput";
import ChatBoxHeader from "./ChatBoxHeader";
import { useAuth } from "@/hooks/auth";
import OtherMessage from "./OtherMessage";

type messageType = {
  message: string;
  senderId: string;
  id: string;
};

export default function ChatBox() {
  let { id } = useParams();
  let { user: me } = useAuth();
  let [messages, setMessages] = useState<messageType[]>([]);
  let { data, isLoading, error } = useSWR(
    `/chat/channel/${id}`,
    getChannelData
  );

  let socket = useRef<Socket | null>(null);

  useEffect(() => {
    let url = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "");
    url.protocol = "ws";
    url.pathname = "/channel";

    socket.current = io(url.toString(), {
      extraHeaders: { Authorization: `Bearer ${Cookies.get("access_token")}` },
      query: {
        channelId: id,
      },
    });
    socket.current.on("newMessage", (message: messageType) => {
      console.log(message);

      setMessages((oldMessages) => [...oldMessages, message]);
    });
    return () => {
      socket.current?.disconnect();
    };
  }, [id]);

  function sendMessage(message: string) {
    socket.current?.emit("newMessage", { channelId: id, message });
  }

  return (
    <Card className="col-span-2">
      <div className="flex flex-col h-full">
        <CardHeader>
          <ChatBoxHeader data={data} isLoading={isLoading} />
        </CardHeader>
        <div className="grow">
          <div className="flex flex-col p-4 gap-4">
            {messages.map((message) => {
              if (message.senderId === me?.id)
                return <MyMessage key={message.id} message={message.message} />;
              return (
                <OtherMessage key={message.id} message={message.message} />
              );
            })}
          </div>
        </div>
        <CardFooter>
          <ChatBoxInput handler={sendMessage} />
        </CardFooter>
      </div>
    </Card>
  );
}
