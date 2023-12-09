import { useFriendRequests } from "../(hooks)/Friends";
import { LoadingIndicator } from "./LoadingIndicator";
import { FriendRequestCard } from "./FriendCard";
import { EmptyState } from "../../../../components/EmptyState";
import { UserPlus } from "lucide-react";
import axios from "@/lib/axios";
import { dispatchServerError } from "@/app/lib/Toast";

export function FriendRequestsTabContent() {
  const { data, mutate, isLoading } = useFriendRequests();

  function acceptRequest(requestId: string) {
    return async () => {
      try {
        await axios.patch(`/user/friends/requests/accept/${requestId}`);
        mutate();
      } catch {
        dispatchServerError();
      }
    };
  }

  function rejectRequest(requestId: string) {
    return async () => {
      try {
        await axios.delete(`/user/friends/requests/reject/${requestId}`);
        mutate();
      } catch {
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
            Icon={UserPlus}
            description="You don't have any friends requests."
            fullHeight
          />
        ) : (
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
          ))
        ))}
    </>
  );
}
