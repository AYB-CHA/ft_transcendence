import { LoadingIndicator } from "./LoadingIndicator";
import { useFriends } from "../(hooks)/Friends";
import { EmptyState } from "../../../../components/EmptyState";
import { FriendCard } from "./FriendCard";
import { User } from "lucide-react";

import axios from "@/lib/axios";
import { dispatchServerError } from "@/app/lib/Toast";

export function FriendsTabContent() {
  const { data, mutate, isLoading } = useFriends();

  function removeFriend(requestId: string) {
    return async () => {
      try {
        await axios.delete("/user/friends/remove/" + requestId);
        mutate();
      } catch (error) {
        dispatchServerError();
      }
    };
  }

  if (isLoading) {
    return <LoadingIndicator visible={isLoading} />;
  }

  return (
    <>
      {data &&
        (data.length == 0 ? (
          <EmptyState
            Icon={User}
            description="You don't have any friends yet. Send some friend requests."
            fullHeight
          />
        ) : (
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
          ))
        ))}
    </>
  );
}
