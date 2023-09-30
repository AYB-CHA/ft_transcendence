import Avatar from "@/components/DropDownAvatar";
import {
  LinkIcon,
  LockIcon,
  LogOut,
  Share2,
  Target,
  Trash,
} from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropDown";

import { useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import LeaveChannel from "./LeaveChannel";
import DeleteChannel from "./DeleteChannel";
import { ChannelType } from "../channel/[id]/(components)/ChannelController";

export default function ChatGroup({ data }: { data: ChannelType }) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);

  const router = useRouter();

  return (
    <div className="flex items-center">
      <div className="flex gap-2 grow">
        <div>
          <Avatar src={data.avatar} className="h-10 w-10">
            <DropdownMenuLabel>Channel</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LinkIcon className="mr-2 h-4 w-4" />
              <span>Invite People</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLeaveConfirm(true)}>
              <div className="flex">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Leave Channel</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={data.myRole !== "ADMINISTRATOR"}
              onClick={() => setDeleteConfirm(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete Channel</span>
            </DropdownMenuItem>
          </Avatar>
        </div>
        <Link
          href={`/dashboard/chat/channel/${data.id}`}
          className="block grow"
        >
          <div>
            <h4>{data.name}</h4>
            <h5 className="text-gray-500 text-xs">{data.topic}...</h5>
          </div>
        </Link>
      </div>
      <div>
        <div className="mb-2">
          <span className="text-gray-500 text-xs">5:16 PM</span>
        </div>
        {data.type === "PROTECTED" && (
          <LockIcon size={11} className="text-gray-500 ml-auto" />
        )}
        {data.type === "PRIVATE" && (
          <Share2 size={11} className="text-gray-500 ml-auto" />
        )}
        {data.type === "PUBLIC" && (
          <Target size={11} className="text-gray-500 ml-auto" />
        )}
      </div>

      <LeaveChannel
        id={data.id}
        status={leaveConfirm}
        setStatus={setLeaveConfirm}
      ></LeaveChannel>
      <DeleteChannel
        id={data.id}
        status={deleteConfirm}
        setStatus={setDeleteConfirm}
      ></DeleteChannel>
    </div>
  );
}
