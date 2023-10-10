import React from "react";

export default function OnlineStatus({ status = true }: { status: boolean }) {
  return (
    <div
      className={`rounded-full h-2 w-2  border border-white ml-auto ${
        status ? "bg-green-500" : "bg-gray-500"
      }`}
    ></div>
  );
}
