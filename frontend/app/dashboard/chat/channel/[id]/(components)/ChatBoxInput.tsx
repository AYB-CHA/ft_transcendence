import { ImageIcon, Link, SendHorizonal, Swords } from "lucide-react";
import { useState } from "react";

export default function ChatBoxInput({
  handler,
}: {
  handler: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  return (
    <form
      className="flex w-full py-2.5 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handler(message);
        setMessage("");
      }}
    >
      <div className="flex gap-3 text-gray-500">
        <ImageIcon size={20} strokeWidth={1} />
        <Link size={20} strokeWidth={1} />
        <Swords size={20} strokeWidth={1} />
      </div>
      <div className="grow">
        <input
          className="bg-transparent w-full focus:outline-none placeholder:text-gray-500"
          type="text"
          placeholder="Start new message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </div>
      <div>
        <button type="submit">
          <SendHorizonal
            className="text-primary-500"
            size={20}
            strokeWidth={1}
          />
        </button>
      </div>
    </form>
  );
}
