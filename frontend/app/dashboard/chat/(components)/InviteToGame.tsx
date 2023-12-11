import Input from "@/components/input/Input";
import Card from "@/components/card/Card";
import Button from "@/components/Button";
import APIClient from "@/lib/axios";
import useSWR from "swr";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { BasicFriendCard } from "../../friends/(components)/FriendCard";
import { Search, SearchSlash, Swords } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  ChannelMemberType,
  strContainsInsensitive,
} from "../channel/[id]/(components)/ChannelMembers";

export default function InviteToGame() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: members, isLoading } = useSWR<ChannelMemberType[]>(
    `/chat/channel/${id}/members`,
    async (uri: string) => {
      return (await APIClient.get(uri)).data;
    }
  );

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
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex gap-3 text-gray-500">
              <Swords size={20} strokeWidth={1} />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" closeButton={false}>
            <div className="absolute -top-16 -left-px w-[calc(100%+2px)]  bg-slate-500">
              <Card>
                <Input
                  className="bg-dark-dim border-0 py-4"
                  placeholder="Search"
                  icon={<Search size={16} />}
                  name="search"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Card>
            </div>
            <div className="flex flex-col gap-4 p-4 min-h-[300px]">
              <div className="divide-y divide-dark-semi-dim h-full">
                {filteredMembers?.length === 0 && (
                  <EmptyState
                    Icon={SearchSlash}
                    fullHeight={true}
                    description="No channel members were found."
                  />
                )}

                {filteredMembers?.map((user, indx: number) => (
                  <BasicFriendCard
                    key={user.id}
                    image={user.avatar}
                    name={user.fullName}
                    username={user.username}
                    actions={
                      <Button className="w-24" onClick={() => {}}>
                        Invite
                      </Button>
                    }
                  />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
