import axios from "@/lib/axios";
import useSWR from "swr";

export type Friendship = {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatar: string;
};

export function useFriends() {
  return useSWR<Friendship[]>("/user/friends", async (key: string) => {
    const { data } = await axios.get(key);
    return data;
  });
}

export function useFriendRequests() {
  return useSWR<Friendship[]>("/user/friends/requests", async (key: string) => {
    const { data } = await axios.get(key);
    return data;
  });
}

export type FriendshipStatus =
  | "FRIEND"
  | "PENDING-SENDER"
  | "PENDING-RECEIVER"
  | "NONE";

export type SearchUser = {
  id: string;
  username: string;
  requestId: string | null;
  fullName: string;
  avatar: string;
  status: FriendshipStatus;
};

export function useSearchFriends(query: string) {
  return useSWR<SearchUser[]>(
    ["/user/search", query],
    async ([key, query]: readonly [string, ...unknown[]]) => {
      const { data } = await axios.get(key, { params: { q: query } });
      return data;
    }
  );
}
