"use client";
import Avatar from "@/components/Avatar";
import axios from "@/lib/axios";
import Link from "next/link";
import React, { Fragment } from "react";
import useSWR from "swr";
import OnlineStatus from "../../(components)/OnlineStatus";
import MemberLabeLoading from "../channel/[id]/(components)/MemberLabeLoading";

type ThreadType = {
  id: string;
  message: { text: string } | undefined;
  user: {
    avatar: string;
    fullName: string;
    id: string;
    username: string;
  };
};

async function getThreads(url: string) {
  return (await axios.get<ThreadType[]>(url)).data;
}

export default function ThreadSideBar() {
  let { data, isLoading } = useSWR("/chat/dm/threads", getThreads);
  if (isLoading)
    return (
      <>
        <MemberLabeLoading />
        <MemberLabeLoading />
        <MemberLabeLoading />
        <MemberLabeLoading />
        <MemberLabeLoading />
      </>
    );
  if (data?.length === 0)
    return (
      <div className="py-24 text-xs text-gray-500 text-center">
        send a dm to start talking.
      </div>
    );
  return (
    <>
      {data &&
        data.map((thread, index) => {
          return (
            <Fragment key={thread.id}>
              <div className="flex items-center">
                <div className="flex gap-2 grow">
                  <div>
                    <Avatar
                      src={thread.user.avatar}
                      className="h-10 w-10"
                    ></Avatar>
                  </div>
                  <Link
                    href={`/dashboard/chat/dm/${thread.id}`}
                    className="block grow"
                  >
                    <div>
                      <h4>{thread.user.fullName}</h4>
                      <h5 className="text-gray-500 text-xs">
                        {thread.message
                          ? thread.message.text + "..."
                          : "@" + thread.user.username}
                      </h5>
                    </div>
                  </Link>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="text-gray-500 text-xs">5:16 PM</span>
                  </div>
                  <OnlineStatus status={true} />
                </div>
              </div>
              {index != (data?.length ?? 0) - 1 && (
                <hr className="border-dark-semi-dim" />
              )}
            </Fragment>
          );
        })}
    </>
  );
}
