"use client";

import Card from "@/components/card/Card";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxInput from "./ChatBoxInput";
import { notFound, useParams, useRouter } from "next/navigation";
import { useDMSocket } from "@/app/(components)/DMSocket";
import { useEffect, useState } from "react";
import {
  MessageType,
  formatMessages,
} from "../../../channel/[id]/(components)/ChatBox";
import OtherMessage from "../../../channel/[id]/(components)/OtherMessage";
import MyMessage from "../../../channel/[id]/(components)/MyMessage";
import { useAuth } from "@/hooks/auth";
import useSWR from "swr";
import axios from "@/lib/axios";

export type OtherUserType = {
  id: string;
  avatar: string;
  username: string;
  fullName: string;
};

async function getOldMessages(url: string) {
  return (await axios.get<MessageType[]>(url)).data;
}

export default function ChatBox() {
  let { user: me } = useAuth();
  let { id: chatThreadId } = useParams();
  let socket = useDMSocket();
  let { id } = useParams();
  let [messages, setMessages] = useState<MessageType[]>([]);

  let { data: oldMessages, error } = useSWR<MessageType[]>(
    `/chat/dm/messages/${id}`,
    getOldMessages,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  let { data: otherUser, isLoading } = useSWR(
    `/chat/dm/thread/other/${chatThreadId}`,
    async (url: string) => {
      return (await axios.get<OtherUserType>(url)).data;
    }
  );

  if (error) throw notFound();

  useEffect(() => {
    if (oldMessages) setMessages(oldMessages);
  }, [oldMessages]);

  function onNewMessage(message: MessageType) {
    setMessages((oldMessages) => [...oldMessages, message]);
  }

  useEffect(() => {
    socket?.on("newMessage", onNewMessage);
    return () => {
      socket?.off("newMessage", onNewMessage);
    };
  }, [socket]);

  function sendMessage(text: string) {
    socket?.emit("newMessage", { text, threadId: id });
  }

  return (
    <Card className="col-span-3">
      <div className="flex flex-col h-full">
        <CardHeader>
          <ChatBoxHeader isLoading={isLoading} data={otherUser} />
        </CardHeader>
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
      </div>
    </Card>
  );
}
