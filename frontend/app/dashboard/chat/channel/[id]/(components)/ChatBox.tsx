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
import axios from "@/lib/axios";
import { AxiosError } from "axios";

type messageType = {
  text: string;
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

  async function loadMessages(controller: AbortController) {
    try {
      let response = await axios.get(`/chat/channel/messages/${id}`, {
        signal: controller.signal,
      });

      response.data?.forEach((message: any) => {
        setMessages((oldMessages) => [
          ...oldMessages,
          { text: message.text, id: message.id, senderId: message.userId },
        ]);
      });
    } catch (error) {
      if (error instanceof AxiosError) console.log(error.response);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadMessages(controller);

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
      setMessages((oldMessages) => [...oldMessages, message]);
    });
    return () => {
      socket.current?.disconnect();
      controller.abort();
    };
  }, [id]);

  function sendMessage(text: string) {
    socket.current?.emit("newMessage", { channelId: id, text });
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
                return <MyMessage key={message.id} message={message.text} />;
              return <OtherMessage key={message.id} message={message.text} />;
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
