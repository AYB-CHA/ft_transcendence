import { ImageIcon, Link, SendHorizonal, Swords } from "lucide-react";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { clearSWRCache } from "../providers/ChatSocketProvider";

dayjs.extend(relativeTime);

export default function ChatBoxInput({
  handler,
  mutedUntil,
}: {
  handler: (message: string) => void;
  mutedUntil?: Date;
}) {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (mutedUntil) {
      const delay = mutedUntil.getTime() - Date.now();
      const timeOutHandler = setTimeout(() => {
        clearSWRCache();
      }, delay);
      return () => {
        clearTimeout(timeOutHandler);
      };
    }
  }, [mutedUntil]);

  return (
    <form
      className="flex w-full py-2.5 gap-4 relative"
      onSubmit={(e) => {
        e.preventDefault();

        if (!message.trim().length) return;
        handler(message);
        setMessage("");
      }}
    >
      {mutedUntil ? (
        <div className="py-1 text-center text-xs text-dark-semi-light flex-1">
          You are muted from this channel You will be able to send messages{" "}
          {dayjs(mutedUntil).fromNow()}
        </div>
      ) : (
        <>
          <div className="flex gap-3 text-gray-500">
            {/* <ImageIcon size={20} strokeWidth={1} />
            <Link size={20} strokeWidth={1} /> */}
            <Swords size={20} strokeWidth={1} />
          </div>
          <div className="grow">
            <input
              className="bg-transparent w-full focus:outline-none placeholder:text-gray-500"
              type="text"
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
        </>
      )}
    </form>
  );
}
