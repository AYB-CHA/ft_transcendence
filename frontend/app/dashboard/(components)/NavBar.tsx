"use client";
import { usePathname } from "next/navigation";
import NavTab from "./NavTab";
import Avatar from "@/components/Avatar";
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

export default function NavBar() {
  const pathname = usePathname();
  let { user, logOut } = useAuth();

  let navLinks: { href: string; icon: React.ReactNode }[] = [
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
    {
      href: "/dashboard",
      icon: <LayoutPanelLeft strokeWidth={1} />,
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center border-t border-gray-800 grow pr-4 bg-dark">
        <div className="flex pl-2 items-center">
          <Avatar className="h-10 w-10" src={user?.avatar ?? ""}>
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
          </Avatar>
          <div className="text-sm pl-2 mt-1.5">
            <h3 className="font-semibold leading-3">@{user?.username}</h3>
            <span className="text-primary text leading-3">lvl 5.7</span>
          </div>
        </div>
        <div className="flex gap-4 h-full">
          <div className="flex gap-4 items-center h-full">
            {navLinks.map((link, i) => (
              <NavTab href={link.href} active={pathname == link.href} key={i}>
                {link.icon}
              </NavTab>
            ))}
          </div>
        </div>
      </div>
      <div>
        <button className="py-4 px-12 bg-primary text-black flex justify-center items-center relative overflow-hidden group border-t border-gray-800">
          <div className="w-6 h-32 absolute bg-primary-400/20 -rotate-45 translate-x-24 group-hover:-translate-x-24 transition-transform duration-300"></div>
          <Swords size={20} strokeWidth={1.3} />
        </button>
      </div>
    </>
  );
}
