import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { useSearchFriends, SearchUser } from "../(hooks)/Friends";
import { EmptyState } from "../../../../components/EmptyState";
import { LoadingIndicator } from "./LoadingIndicator";
import { useState, PropsWithChildren } from "react";
import { BasicFriendCard } from "./FriendCard";
import { useDebounce } from "use-debounce";
import { BasicTabCard } from "./TabCard";
import { Search } from "lucide-react";

import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import CardBody from "@/components/card/CardBody";
import Input from "@/components/input/Input";
import Button from "@/components/Button";
import axios from "@/lib/axios";

export type SearchFriendsModalProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

export function SearchFriendsModal({
  isOpen,
  setOpen,
}: SearchFriendsModalProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 200);

  const { data, mutate, isLoading, error } = useSearchFriends(debouncedQuery);

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

  function acceptInvitation(requestId: string) {
    return async () => {
      await axios.patch(`/user/friends/requests/accept/${requestId}`);
      mutate();
    };
  }

  function rejectInvitation(requestId: string) {
    return async () => {
      await axios.delete(`/user/friends/requests/reject/${requestId}`);
      mutate();
    };
  }

  function cancelInvitation(requestId: string) {
    return async () => {
      await axios.delete("/user/friends/requests/cancel/" + requestId);
      mutate();
    };
  }

  function actionMapper({
    id: userId,
    status,
    requestId,
  }: SearchUser): JSX.Element {
    const ActionButton = (
      props: PropsWithChildren & { onClick: () => void }
    ) => <Button className="w-24" variant="secondary" {...props} />;

    switch (status) {
      case "PENDING-RECEIVER":
        return (
          <>
            <ActionButton onClick={rejectInvitation(requestId!)}>
              Reject
            </ActionButton>
            <ActionButton onClick={acceptInvitation(requestId!)}>
              Accept
            </ActionButton>
          </>
        );
      case "PENDING-SENDER":
        return (
          <ActionButton onClick={cancelInvitation(requestId!)}>
            Cancel
          </ActionButton>
        );
      case "FRIEND":
        return (
          <ActionButton onClick={removeFriend(requestId!)}>
            Unfriend
          </ActionButton>
        );
      case "NONE":
        return (
          <ActionButton onClick={addFriend(userId)}>Add Friend</ActionButton>
        );
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
      <DialogContent className="max-w-3xl" closeButton={false}>
        <CardHeader>Search For Friends</CardHeader>
        <CardBody className="flex flex-col flex-1">
          <div className="p-2">
            <Input
              className="py-3"
              color="#4B5563"
              icon={<Search strokeWidth={1} />}
              placeholder="Enter a search query..."
              onChange={(event) => setQuery(event.target.value)}
              value={query}
            />
          </div>
          <div className="flex flex-col flex-1 divide-y divide-dark-semi-dim py-[8px]">
            <LoadingIndicator visible={isLoading} className="py-[110px]" />
            {data &&
              (data.length == 0 ? (
                <EmptyState
                  Icon={Search}
                  description="No search results were found."
                />
              ) : (
                data.map((user) => (
                  <BasicFriendCard
                    key={user.id}
                    image={user.avatar}
                    name={user.fullName}
                    username={user.username}
                    actions={actionMapper(user)}
                  />
                ))
              ))}
          </div>
        </CardBody>
        <CardFooter>
          <Button
            className="w-24"
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
