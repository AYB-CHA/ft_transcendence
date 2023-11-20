"use client";
import Input from "@/components/input/Input";
import axios from "@/lib/axios";
import Card from "@/components/card/Card";

import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Search, SearchSlash } from "lucide-react";
import { debounce } from "lodash";

import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { AxiosError } from "axios";
import { BasicFriendCard } from "../../friends/(components)/FriendCard";
import Button from "@/components/Button";

type SearchUserInviteType = {
  id: string;
  fullName: string;
  username: string;
  avatar: string;
  hasBeenInvited?: boolean;
};

export default function Invite({
  channelId,
  open,
  setOpen,
}: {
  channelId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [users, setUsers] = useState<SearchUserInviteType[]>([]);
  // const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // setLoading(true);
    open &&
      axios
        .get<SearchUserInviteType[]>(
          `/chat/channel/private/${channelId}/invite`,
          { params: { q: query } }
        )
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error: AxiosError) => {})
        .finally(() => {
          // setLoading(false);
        });
  }, [query, channelId, open]);

  const debouncedSetQuery = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, 200);

  async function inviteUser(userId: string) {
    try {
      const response = await axios.post<{ id: string }>(
        `/chat/channel/private/${channelId}/invite`,
        { userId }
      );
      setUsers((oldUsers) => {
        return oldUsers.map((user) => {
          if (user.id === userId) user.hasBeenInvited = true;
          return user;
        });
      });
    } catch (error) {}
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl" closeButton={false}>
          <div className="absolute -top-16 -left-px w-[calc(100%+2px)]  bg-slate-500">
            <Card>
              <Input
                className="bg-dark-dim border-0 py-4"
                placeholder="Search"
                icon={<Search size={16} />}
                onChange={debouncedSetQuery}
              />
            </Card>
          </div>
          <div className="flex flex-col gap-4 p-4 min-h-[300px]">
            {users.length === 0 && (
              <div className="py-20 flex justify-center flex-col items-center">
                <SearchSlash
                  size={35}
                  strokeWidth={1}
                  className="text-gray-500"
                />
                <div className="mt-4">
                  <span className="text-gray-500 text-xs">
                    No none channel members were found.
                  </span>
                </div>
              </div>
            )}
            <div className="divide-y divide-dark-semi-dim">
              {users.map((user, indx: number) => (
                <React.Fragment key={user.id}>
                  <BasicFriendCard
                    image={user.avatar}
                    name={user.fullName}
                    username={user.username}
                    actions={
                      <Button
                        className="w-24"
                        disabled={user.hasBeenInvited}
                        onClick={() => {
                          inviteUser(user.id);
                        }}
                      >
                        {user.hasBeenInvited ? "Invited" : "Invite"}
                      </Button>
                    }
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
