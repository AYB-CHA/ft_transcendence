"use client";

import { FriendRequestsTabContent } from "./(components)/FriendRequestsTab";
import { SearchFriendsModal } from "./(components)/SearchFriendsModal";
import { useFriendRequests, useFriends } from "./(hooks)/Friends";
import { FriendsTabContent } from "./(components)/FriendsTab";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabCard } from "./(components)/TabCard";
import { UserPlus, Users } from "lucide-react";
import { useState } from "react";

import CardHeader from "@/components/card/CardHeader";
import CardBody from "@/components/card/CardBody";
import Card from "@/components/card/Card";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isSearchOpen, setSearchOpen] = useState(false);

  const { data: friendRequests } = useFriendRequests();
  const { data: friends } = useFriends();

  const currentTab = searchParams.get("tab") ?? "friends";

  function setCurrentTab(tab: Tabs) {
    router.replace("/dashboard/friends?tab=" + tab);
  }

  return (
    <div className="flex flex-col max-w-7xl w-full mx-auto h-full justify-center gap-[30px] py-[150px]">
      <div className="flex gap-[35px]">
        <TabCard
          name={"friends" satisfies Tabs}
          Icon={Users}
          title="Friends"
          suffix={friends?.length?.toString()}
          isSelected={(tab) => tab === currentTab}
          onClick={setCurrentTab}
        />
        <TabCard
          name={"friend-requests" satisfies Tabs}
          Icon={UserPlus}
          title="Friend Requests"
          suffix={friendRequests?.length?.toString()}
          isSelected={(tab) => tab === currentTab}
          onClick={setCurrentTab}
        />
        <SearchFriendsModal isOpen={isSearchOpen} setOpen={setSearchOpen} />
      </div>
      <Card className="h-full flex flex-col">
        <CardHeader>
          {currentTab === ("friend-requests" satisfies Tabs)
            ? "Friend Requests"
            : "Friends"}
        </CardHeader>
        <CardBody className="divide-y divide-dark-semi-dim grow h-0 overflow-auto">
          {currentTab === ("friend-requests" satisfies Tabs) ? (
            <FriendRequestsTabContent />
          ) : (
            <FriendsTabContent />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
