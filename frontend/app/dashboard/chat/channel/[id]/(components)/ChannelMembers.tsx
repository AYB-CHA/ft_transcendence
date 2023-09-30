"use client";
import React from "react";
import MemberLabel from "./MemberLabel";
import { useParams } from "next/navigation";
import useSWR from "swr";
import axios from "@/lib/axios";
import MemberLabeLoading from "./MemberLabeLoading";
import { ChannelType } from "./ChannelController";

export default function ChannelMembers({
  currentChannel = undefined,
}: {
  currentChannel?: ChannelType;
}) {
  let { id } = useParams();

  let { data: members, isLoading } = useSWR(
    `/chat/channel/${id}/members`,
    async (uri) => {
      return (await axios.get(uri)).data;
    }
  );

  return (
    <div>
      <span className="text-gray-500">Members:</span>
      <div className="flex flex-col gap-4 mt-6">
        {isLoading ? (
          <>
            <MemberLabeLoading />
            <MemberLabeLoading />
            <MemberLabeLoading />
            <MemberLabeLoading />
          </>
        ) : (
          <React.Fragment>
            {members.map((member: any, index: number) => {
              return (
                <React.Fragment key={member.id}>
                  <MemberLabel
                    username={member.username}
                    name={member.fullName}
                    avatar={member.avatar}
                  />
                  {index < members.length - 1 && (
                    <hr className="border-dark-semi-dim" />
                  )}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
