"use client";

import MemberLabeLoading from "./MemberLabeLoading";
import MemberLabel from "./MemberLabel";
import axios from "@/lib/axios";
import useSWR from "swr";

import { ChannelType, UserRoleOnChannel } from "./ChannelController";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/auth";

import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimateListContainer from "@/components/List/AnimateListContainer";
import AnimateList from "@/components/List/AnimateList";

export type UserStatusType = "OFFLINE" | "ONLINE" | "IN_GAME";

export type ChannelMemberType = {
  id: string;
  username: string;
  fullName: string;
  isMuted: boolean;
  avatar: string;
  role: UserRoleOnChannel;
  status: UserStatusType;
};

const strContainsInsensitive = (haystack: string, needle: string) => {
  return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
};
export default function ChannelMembers({
  currentChannel,
  searchQuery = "",
}: {
  currentChannel?: ChannelType;
  searchQuery: string;
}) {
  const { id } = useParams();

  const { data: members, isLoading } = useSWR<ChannelMemberType[]>(
    `/chat/channel/${id}/members`,
    async (uri: string) => {
      return (await axios.get(uri)).data;
    }
  );

  const { user: me } = useAuth();

  const filteredMembers = useMemo(
    () =>
      members?.filter(
        (item) =>
          strContainsInsensitive(item.username, searchQuery) ||
          strContainsInsensitive(item.fullName, searchQuery)
      ),
    [searchQuery, members]
  );

  return (
    <div>
      <div className="flex flex-col relative">
        {isLoading ? (
          <div className="space-y-4">
            <MemberLabeLoading />
            <MemberLabeLoading />
            <MemberLabeLoading />
            <MemberLabeLoading />
          </div>
        ) : (
          <AnimateListContainer>
            {me &&
              currentChannel &&
              filteredMembers?.map((member, index: number) => {
                return (
                  <AnimateList key={member.id} top={(57 + 16) * index}>
                    <MemberLabel
                      me={me}
                      channel={currentChannel}
                      member={member}
                    />
                    {index < (filteredMembers?.length ?? 0) - 1 && (
                      <hr className="border-dark-semi-dim mt-4" />
                    )}
                  </AnimateList>
                );
              })}
            {me && currentChannel && (filteredMembers?.length ?? 0) === 0 && (
              <div className="mt-8 text-center">
                <span className="text-gray-500 text-xs">
                  No search results were found.
                </span>
              </div>
            )}
          </AnimateListContainer>
        )}
      </div>
    </div>
  );
}
