import React from "react";

export default function OnlineStatus({ status = true }: { status: boolean }) {
  return (
    <div className="rounded-full h-2 w-2 bg-primary-500 border border-white ml-auto"></div>
  );
}
