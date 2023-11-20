"use client";

import MemberLabeLoading from "../channel/[id]/(components)/MemberLabeLoading";
import OnlineStatus from "../../(components)/OnlineStatus";
import Avatar from "@/components/Avatar";
import React, { Fragment } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import useSWR from "swr";

import { UserStatusType } from "../channel/[id]/(components)/ChannelMembers";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";

type ThreadType = {
  id: string;
  message: { text: string } | undefined;
  user: {
    avatar: string;
    fullName: string;
    id: string;
    username: string;
    status: UserStatusType;
  };
};

async function getThreads(url: string) {
  return (await axios.get<ThreadType[]>(url)).data;
}

export default function ThreadSideBar() {
  const { data, isLoading } = useSWR("/chat/dm/threads", getThreads);
  const { id } = useParams();

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
              <div className="flex items-center relative">
                <div
                  hidden={id !== thread.id}
                  className="rounded-full border-4 border-primary-500 border-l-transparent border-b-transparent rotate-45 absolute top-1/2 -translate-y-1/2 -left-[calc(1rem+0.25rem)]"
                />
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
                          ? thread.message.text + ""
                          : "@" + thread.user.username}
                      </h5>
                    </div>
                  </Link>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="text-gray-500 text-xs">5:16 PM</span>
                  </div>
                  <OnlineStatus status={thread.user.status !== "OFFLINE"} />
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
