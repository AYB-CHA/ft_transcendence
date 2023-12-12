import { ImageIcon, Link, SendHorizonal, Swords } from "lucide-react";
import { useState } from "react";

export default function ChatBoxInput({
  startGame,
  handler,
}: {
  handler: (message: string) => void;
  startGame: () => void;
}) {
  const [message, setMessage] = useState("");
  return (
    <form
      className="flex w-full py-2.5 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!message.trim().length) return;
        handler(message);
        setMessage("");
      }}
    >
      <div className="flex gap-3 text-gray-500">
        <Swords onClick={startGame} size={20} strokeWidth={1} />
      </div>
      <div className="grow">
        <input
          className="bg-transparent w-full focus:outline-none placeholder:text-gray-500"
          type="text"
          autoComplete="off"
          placeholder="Start new message"
          value={message}
          name="message"
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
