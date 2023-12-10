import CardFooter from "@/components/card/CardFooter";
import Spinner from "@/components/Spinner";
import OtherMessage from "./OtherMessage";
import ChatBoxInput from "./ChatBoxInput";
import MyMessage from "./MyMessage";
import axios from "@/lib/axios";
import useSWR from "swr";

import { ChannelType } from "./ChannelController";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserType } from "@/hooks/auth";
import { MessageType } from "./ChatBox";
import { useChannelChatSocket } from "../providers/ChatSocketProvider";

async function getOldMessages(url: string) {
  return (await axios.get<MessageType[]>(url)).data;
}

export function formatMessages(messages: MessageType[]) {
  const messagesGroup: MessageType[][] = [];
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

export default function MessagesBox({
  me,
  channel,
  isLoading,
}: {
  me?: UserType;
  channel: ChannelType | undefined;
  isLoading: boolean;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams();
  const socket = useChannelChatSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { data: oldMessages } = useSWR<MessageType[]>(
    `/chat/channel/messages/${id}`,
    getOldMessages,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  function scrollDown() {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }

  useEffect(scrollDown, [messages]);

  useEffect(() => {
    if (oldMessages) setMessages(oldMessages);
  }, [oldMessages]);

  const newMessageHandler = (message: MessageType) => {
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  useEffect(() => {
    socket?.on("newMessage", newMessageHandler);
    return () => {
      socket?.off("newMessage", newMessageHandler);
    };
  }, [socket]);

  function sendMessage(text: string) {
    socket?.emit("newMessage", { channelId: id, text });
  }

  return (
    <>
      <div
        ref={boxRef}
        className="grow h-0 flex p-4 flex-col gap-4 overflow-auto"
      >
        {me &&
          formatMessages(messages).map((messagesGroup) => {
            if (messagesGroup[0].senderId === me?.id) {
              return (
                <MyMessage
                  avatar={me.avatar}
                  username={me.username}
                  key={messagesGroup[0].id}
                  messages={messagesGroup}
                />
              );
            }
            return (
              <OtherMessage
                key={messagesGroup[0].id}
                messages={messagesGroup}
              />
            );
          })}
      </div>
      <CardFooter>
        {isLoading ? (
          <div className="flex justify-center py-2.5 w-full">
            <Spinner />
          </div>
        ) : (
          <ChatBoxInput
            handler={sendMessage}
            mutedUntil={
              (channel?.amIMuted && new Date(channel?.mutedUntil as string)) ||
              undefined
            }
          />
        )}
      </CardFooter>
    </>
  );
}
