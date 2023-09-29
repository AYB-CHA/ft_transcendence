import Avatar from "@/components/Avatar";
import { MessageType } from "./ChatBox";

export default function MyMessage({ messages }: { messages: MessageType[] }) {
  return (
    <div className="flex gap-2">
      <div>
        <Avatar src={"https://github.com/shadcn.png"} className="h-10 w-10" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-gray-500 text-xs">@ssmith</span>
        {messages.map((message) => (
          <div
            key={message.id}
            className="p-2 border border-gray-600 w-fit bg-dark-semi-dim rounded rounded-tl-none"
          >
            {message.text}
          </div>
        ))}
      </div>
    </div>
  );
}
