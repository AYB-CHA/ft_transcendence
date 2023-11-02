import { MessageType } from "./ChatBox";
import { useEffect, useState } from "react";
import { useChannelChatSocket } from "../page";
import useSWR from "swr";
import { useParams } from "next/navigation";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import CardFooter from "@/components/card/CardFooter";
import ChatBoxInput from "./ChatBoxInput";
import { UserType } from "@/hooks/auth";
import axios from "@/lib/axios";

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

export default function MessagesBox({ me }: { me?: UserType }) {
  let { id } = useParams();
  let socket = useChannelChatSocket();
  let [messages, setMessages] = useState<MessageType[]>([]);
  let { data: oldMessages } = useSWR<MessageType[]>(
    `/chat/channel/messages/${id}`,
    getOldMessages,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (oldMessages) setMessages(oldMessages);
  }, [oldMessages]);

  useEffect(() => {
    socket?.on("newMessage", (message: MessageType) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [id, socket]);

  function sendMessage(text: string) {
    socket?.emit("newMessage", { channelId: id, text });
  }

  return (
    <>
      <div className="grow h-0 overflow-auto">
        <div className="flex flex-col p-4 gap-4">
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
      </div>
      <CardFooter>
        <ChatBoxInput handler={sendMessage} />
      </CardFooter>
    </>
  );
}
