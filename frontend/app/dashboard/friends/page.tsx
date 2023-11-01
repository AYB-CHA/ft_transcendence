"use client";

import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import CardBody from "@/components/card/CardBody";
import Input from "@/components/input/Input";
import Card from "@/components/card/Card";
import Button from "@/components/Button";
import axios from "@/lib/axios";
import useSWR from "swr";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Tabs, TabCard, BasicTabCard } from "./(components)/TabCard";
import { Search, UserPlus, Users } from "lucide-react";
import { useState } from "react";

import {
  FriendCard,
  FriendRequestCard,
  SearchFriendRequestCard,
} from "./(components)/FriendCard";

type Friendship = {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatar: string;
};

function FriendsTabContent() {
  const { data, mutate, error, isLoading } = useSWR<Friendship[]>(
    "/user/friends",
    async (key: string) => {
      const { data } = await axios.get(key);
      return data;
    }
  );

  function removeFriend(requestId: string) {
    return async () => {
      await axios.post("/user/friends/remove/" + requestId);
      mutate();
    };
  }

  return (
    <>
      {data &&
        data.map((friend) => (
          <FriendCard
            key={friend.id}
            image={friend.avatar}
            name={friend.fullName}
            username={friend.username}
            wonGames={420}
            lostGames={69}
            onRemove={removeFriend(friend.id)}
          />
        ))}
    </>
  );
}

function FriendRequestsTabContent() {
  const { data, error, mutate, isLoading } = useSWR<Friendship[]>(
    "/user/friends/requests",
    async (key: string) => {
      const { data } = await axios.get(key);
      return data;
    }
  );

  function acceptRequest(requestId: string) {
    return async () => {
      await axios.patch(`/user/friends/requests/accept/${requestId}`);
      mutate();
    };
  }

  function rejectRequest(requestId: string) {
    return async () => {
      await axios.delete(`/user/friends/requests/reject/${requestId}`);
      mutate();
    };
  }

  return (
    <>
      {data &&
        data.map((friend) => (
          <FriendRequestCard
            key={friend.id}
            image={friend.avatar}
            name={friend.fullName}
            username={friend.username}
            onAccept={acceptRequest(friend.id)}
            onReject={rejectRequest(friend.id)}
            wonGames={420}
            lostGames={69}
          />
        ))}
    </>
  );
}

type SearchFriendsModalProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

type FriendshipStatus =
  | "FRIEND"
  | "PENDING-SENDER"
  | "PENDING-RECEIVER"
  | "NONE";

type SearchUser = {
  id: string;
  username: string;
  requestId: string | null;
  fullName: string;
  avatar: string;
  status: FriendshipStatus;
};

function SearchFriendsModal({ isOpen, setOpen }: SearchFriendsModalProps) {
  const { data, mutate, isLoading, error } = useSWR<SearchUser[]>(
    "/user/search",
    async (key: string) => {
      const { data } = await axios.get(key);
      return data;
    }
  );

  function addFriend(userId: string) {
    return async () => {
      await axios.post("/user/friends/add/" + userId);
      mutate();
    };
  }

  function removeFriend(requestId: string) {
    return async () => {
      await axios.delete("/user/friends/remove/" + requestId);
      mutate();
    };
  }

  function cancelInvitation(requestId: string) {
    return async () => {
      await axios.delete("/user/friends/requests/cancel/" + requestId);
      mutate();
    };
  }

  function actionMapper({ id: userId, status, requestId }: SearchUser): {
    text: string;
    fn: () => void;
  } {
    switch (status) {
      case "PENDING-RECEIVER":
        return { text: "Pending", fn: () => {} };
      case "PENDING-SENDER":
        return { text: "Cancel", fn: cancelInvitation(requestId!) };
      case "FRIEND":
        return { text: "Remove Friend", fn: removeFriend(requestId!) };
      case "NONE":
        return { text: "Add Friend", fn: addFriend(userId) };
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        <BasicTabCard
          Icon={Search}
          title="Search Friends"
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="max-w-4xl" closeButton={false}>
        <CardHeader>Search For Friends</CardHeader>
        <CardBody className="flex flex-col flex-1">
          <div className="p-[16px]">
            <Input
              color="#4B5563"
              icon={<Search strokeWidth={1} />}
              placeholder="Enter a search query..."
            />
          </div>
          <div className="flex flex-col flex-1 divide-y divide-dark-semi-dim p-[8px]">
            {data &&
              data.map((user) => (
                <SearchFriendRequestCard
                  key={user.id}
                  userId={user.id}
                  image={user.avatar}
                  name={user.fullName}
                  username={user.username}
                  action={actionMapper(user)}
                />
              ))}
          </div>
        </CardBody>
        <CardFooter>
          <Button
            className="px-7"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Go Back
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Page() {
  const [currentTab, setCurrentTab] = useState<Tabs>("friends");
  const [isSearchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex flex-col h-full justify-center gap-[30px] py-[150px]">
      <div className="flex gap-[35px]">
        <TabCard
          name="friends"
          Icon={Users}
          title="Friends"
          suffix="12"
          isSelected={(tab) => tab === currentTab}
          onClick={setCurrentTab}
        />
        <TabCard
          name="friend-requets"
          Icon={UserPlus}
          title="Friend Requests"
          suffix="12"
          isSelected={(tab) => tab === currentTab}
          onClick={setCurrentTab}
        />
        <SearchFriendsModal isOpen={isSearchOpen} setOpen={setSearchOpen} />
      </div>
      <Card className="h-full flex flex-col">
        <CardHeader>
          {currentTab === "friend-requets" ? "Friend Requests" : "Friends"}
        </CardHeader>
        <CardBody className="divide-y divide-dark-semi-dim grow h-0 overflow-auto">
          {currentTab === "friend-requets" ? (
            <FriendRequestsTabContent />
          ) : (
            <FriendsTabContent />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
