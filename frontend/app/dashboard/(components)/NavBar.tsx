"use client";
import { usePathname } from "next/navigation";
import NavTab from "./NavTab";
import Avatar from "@/components/DropDownAvatar";
import {
  LayoutPanelLeft,
  MessageCircle,
  Trophy,
  Settings,
  Swords,
  User,
  SettingsIcon,
  LogOut,
  Users,
} from "lucide-react";

import { useAuth } from "@/hooks/auth";

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropDown";
import DropDownAvatar from "@/components/DropDownAvatar";

export default function NavBar() {
  const pathname = usePathname();
  let { user, logOut } = useAuth();

  let navLinks: { href: string; icon: React.ReactNode }[] = [
    {
      href: "/dashboard",
      icon: <LayoutPanelLeft strokeWidth={1} />,
    },
    {
      href: "/dashboard/settings",
      icon: <Settings strokeWidth={1} />,
    },
    {
      href: "/dashboard/chat",
      icon: <MessageCircle strokeWidth={1} />,
    },
    {
      href: "/dashboard/leaderboard",
      icon: <Trophy strokeWidth={1} />,
    },
  ];

  return (
    <div>
      <div className="flex h-full flex-col items-center border-r border-dark-semi-dim py-4 justify-between">
        <div className="flex flex-col gap-6">
          {navLinks.map((link, i) => (
            <NavTab href={link.href} active={pathname == link.href} key={i}>
              {link.icon}
            </NavTab>
          ))}
        </div>
        <div>
          <div className="flex items-center">
            <DropDownAvatar className="h-10 w-10" src={user?.avatar ?? null}>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Friends</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropDownAvatar>
            {/* <div className="text-sm pl-2 mt-1.5">
              <h3 className="leading-3">{user && "@" + user?.username}</h3>
              <span className="text-primary text leading-3">
                {user && "lvl 7.4"}
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
