import React from "react";
import { twMerge } from "tailwind-merge";
import { useUnreadMessagesCount } from "../../(components)/MessagesTab";

export default function TabSwitcher({
  activeTab,
  setActiveTab,
}: {
  activeTab: "channels" | "dms";
  setActiveTab: (tab: string) => void;
}) {
  const unreadMessages = useUnreadMessagesCount();
  return (
    <div className="grid grid-cols-2 gap-4 text-center">
      <div
        className={twMerge(
          "border-b-2 py-3  cursor-pointer border-b-transparent",
          activeTab === "channels" ? "border-b-primary-500" : ""
        )}
        onClick={() => setActiveTab("channels")}
      >
        channels
      </div>
      <div
        className={twMerge(
          "border-b-2 py-3 cursor-pointer border-b-transparent",
          activeTab === "dms" ? "border-b-primary-500" : ""
        )}
        onClick={() => setActiveTab("dms")}
      >
        dms {(unreadMessages ?? 0) > 0 && `(${unreadMessages})`}
      </div>
    </div>
  );
}
