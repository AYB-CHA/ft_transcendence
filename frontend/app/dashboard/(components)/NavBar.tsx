"use client";

import DropDownAvatar from "@/components/DropDownAvatar";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import CardBody from "@/components/card/CardBody";
import Card from "@/components/card/Card";
import Button from "@/components/Button";
import MessagesTab from "./MessagesTab";
import axios from "@/lib/axios";
import NavTab from "./NavTab";
import Link from "next/link";
import useSWR from "swr";

import { EmptyState } from "@/components/EmptyState";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { ReactNode, useEffect, useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropDown";

import {
  Trophy,
  Settings,
  User,
  SettingsIcon,
  LogOut,
  Users,
  Activity,
  Bell,
  LucideProps,
  Swords,
  BellOff,
  MessageSquare,
  UserPlus,
  Gamepad2,
} from "lucide-react";

import { ROUTER } from "@/lib/ROUTER";

import { io } from "socket.io-client";
import { dispatchServerError } from "@/app/lib/Toast";

type NotificationType =
  | "CHANNEL_INVITATION"
  | "FRIEND_INVITAION"
  | "GAME_INVITAION";

type Notification = {
  id: string;
  type: NotificationType;
  description: string;
  read: boolean;
  link: string;
};

type NotificationMetadata = {
  Icon: (props: LucideProps) => ReactNode;
  title: string;
  link: string;
};

const notificationsMetadata: Record<NotificationType, NotificationMetadata> = {
  CHANNEL_INVITATION: {
    Icon: MessageSquare,
    link: "Join Channel",
    title: "Join Channel",
  },
  FRIEND_INVITAION: {
    Icon: UserPlus,
    link: "See Friend Requests",
    title: "Friend Request",
  },
  GAME_INVITAION: {
    Icon: Swords,
    link: "Start New Game",
    title: "Game Challenge",
  },
};

type NotificationItemProps = {
  link: string;
  description: string;
  type: NotificationType;
  read: boolean;
  markAsRead: () => void;
};

function NotificationItem({
  description,
  markAsRead,
  link,
  type,
  read,
}: NotificationItemProps) {
  const metadata = notificationsMetadata[type];

  return (
    <div className={`flex flex-col items-end gap-2 p-4 ${!read && "bg-dark"}`}>
      <div className="flex flex-row w-full gap-4">
        <metadata.Icon className="min-w-[24px] min-h-[24px]" strokeWidth={1} />
        <div className="flex flex-col gap-1">
          <p className="uppercase">{metadata.title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <Link href={link} onClick={markAsRead}>
        <Button>{metadata.link}</Button>
      </Link>
    </div>
  );
}

function Notifications() {
  const { data, mutate } = useSWR<Notification[]>(
    "/user/notifications",
    async (key: string) => {
      const { data } = await axios.get(key);
      return data;
    },
  );

  const socket = useMemo(() => {
    const url = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "");
    url.pathname = "/notification";
    url.protocol = "ws";
    return io(url.toString(), {
      withCredentials: true,
      transports: ["websocket"],
    });
  }, []);

  const { user } = useAuth();

  useEffect(() => {
    const userId: string | undefined = user?.id;

    if (userId === undefined) {
      return;
    }

    const callback = () => {
      mutate();
    };

    socket.on(userId, callback);

    return () => {
      socket.off(userId, callback);
    };
  }, [socket, user?.id, mutate]);

  async function clearNotifications() {
    try {
      await axios.delete("/user/notifications");
    } catch {
      dispatchServerError();
    }
    mutate();
  }

  const [open, setOpen] = useState(false);

  function markAsRead(notificationId: string) {
    return async () => {
      setOpen(false);
      try {
        await axios.patch("/user/notifications/" + notificationId);
        mutate();
      } catch {
        dispatchServerError();
      }
    };
  }

  const unreadCount = useMemo(
    () => data?.reduce((acc, item) => acc + (item.read ? 0 : 1), 0) ?? 0,
    [data],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Bell
            className="hover:text-gray-300 cursor-pointer transition-colors"
            strokeWidth={1}
          />
          {unreadCount > 0 && (
            <span className="absolute bg-primary text-xs text-dark border border-dark px-1 -top-[6px] -right-[3px] rounded-lg">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border-0 rounded-none px-0 py-0 shadow-lg shadow-dark-semi-dim/20"
        sideOffset={30}
        collisionPadding={{
          bottom: 72,
        }}
        side="right"
      >
        <Card className="w-[600px]">
          <CardHeader>Notifications</CardHeader>
          <CardBody className="max-h-[700px] overflow-auto py-0 px-0 divide-y divide-dark-semi-dim">
            {data &&
              (data.length === 0 ? (
                <EmptyState
                  Icon={BellOff}
                  description="You have no notifications."
                />
              ) : (
                data.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    description={notification.description}
                    link={notification.link}
                    type={notification.type}
                    read={notification.read}
                    markAsRead={markAsRead(notification.id)}
                  />
                ))
              ))}
          </CardBody>
          <CardFooter>
            <div className="w-full text-center">
              <span
                onClick={clearNotifications}
                className="text-xs text-gray-500 hover:underline cursor-pointer select-none"
              >
                Clear Notifications
              </span>
            </div>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function NavBar() {
  const { user, logOut, isLoading } = useAuth({ middleware: "auth" });
  const pathname = usePathname();

  const navLinks: { href: string; count?: number; icon: React.ReactNode }[] = [
    {
      href: ROUTER.GAMES,
      icon: <Gamepad2 strokeWidth={1} />,
    },
    {
      href: "/dashboard/friends",
      icon: <Users strokeWidth={1} />,
    },
    {
      href: "/dashboard/leaderboard",
      icon: <Trophy strokeWidth={1} />,
    },
    {
      href: "/dashboard/settings",
      icon: <Settings strokeWidth={1} />,
    },
  ];

  return (
    <div>
      <div className="flex h-full flex-col items-center border-r border-dark-semi-dim py-4 justify-between gap-4">
        <div className="flex flex-col gap-6 overflow-auto">
          <NavTab href="/dashboard" active={pathname === "/dashboard"}>
            <Activity strokeWidth={1} />
          </NavTab>
          <MessagesTab />
          {navLinks.map((link, i) => (
            <NavTab
              href={link.href}
              active={pathname.startsWith(link.href)}
              count={link.count}
              key={i}
            >
              {link.icon}
            </NavTab>
          ))}
        </div>
        <div>
          <div className="flex flex-col items-center gap-6">
            {user && <Notifications />}
            {isLoading ? (
              <div className="h-10 w-10 rounded-full animate-pulse bg-dark-semi-dim"></div>
            ) : (
              <DropDownAvatar className="h-10 w-10" src={user?.avatar ?? null}>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard/profile/me">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/friends">
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Friends</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/settings">
                  <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropDownAvatar>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
