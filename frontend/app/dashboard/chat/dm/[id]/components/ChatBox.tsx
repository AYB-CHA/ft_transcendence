"use client";

import OtherMessage from "../../../channel/[id]/(components)/OtherMessage";
import MyMessage from "../../../channel/[id]/(components)/MyMessage";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxInput from "./ChatBoxInput";
import Card from "@/components/card/Card";
import axios from "@/lib/axios";

import { formatMessages } from "../../../channel/[id]/(components)/MessagesBox";
import { MessageType } from "../../../channel/[id]/(components)/ChatBox";
import { useDMSocket } from "@/app/(components)/DMSocket";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MehIcon } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { AxiosError } from "axios";

import useSWR, { useSWRConfig } from "swr";

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
  const { mutate } = useSWRConfig();
  const { user: me } = useAuth();
  const { id: chatThreadId } = useParams();
  const socket = useDMSocket();
  const { id } = useParams();
  const [messages, setMessages] = useState<MessageType[]>([]);

  const { data: oldMessages, error } = useSWR<MessageType[], AxiosError>(
    `/chat/dm/messages/${id}`,
    getOldMessages,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error?.response?.status === 404) throw notFound();

  const { data: otherUser, isLoading } = useSWR(
    `/chat/dm/thread/other/${chatThreadId}`,
    async (url: string) => {
      return (await axios.get<OtherUserType>(url)).data;
    }
  );

  useEffect(() => {
    if (oldMessages) {
      setMessages(oldMessages);
    }
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

  useEffect(() => {
    return () => {
      mutate("/chat/dm/threads/unread-messages");
    };
  }, [mutate]);

  function sendMessage(text: string) {
    socket?.emit("newMessage", { text, threadId: id });
  }

  return (
    <Card className="col-span-3">
      <div className="flex flex-col h-full">
        <CardHeader>
          <ChatBoxHeader isLoading={isLoading} data={otherUser} />
        </CardHeader>
        {error ? (
          <div className="flex h-full justify-center items-center flex-col gap-4">
            <MehIcon className="text-gray-700" size={35} strokeWidth={1} />
            <span className="text-dark-semi-light">
              {"You can't send this use messages."}
            </span>
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
