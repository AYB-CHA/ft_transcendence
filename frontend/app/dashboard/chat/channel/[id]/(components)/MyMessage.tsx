import Avatar from "@/components/Avatar";
import { MessageType } from "./ChatBox";
export default function MyMessage({
  messages,
  avatar,
  username,
}: {
  messages: MessageType[];
  avatar: string;
  username: string;
}) {
  return (
    <div className="flex gap-2">
      <div>
        <Avatar src={avatar} className="h-10 w-10" />
      </div>
      <div className="flex flex-col gap-1 w-1/2">
        <span className="text-gray-500 text-xs">@{username}</span>
        {messages.map((message) => (
          <div
            key={message.id}
            className="p-2 border border-dark-semi-dim w-fit max-w-full break-words bg-dark-semi-dark/30 rounded rounded-tl-none"
          >
            {message.text}
          </div>
        ))}
      </div>
    </div>
  );
}
