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

import Link from "next/link";
import LeaveChannel from "./LeaveChannel";
import DeleteChannel from "./DeleteChannel";
import { ChannelType } from "../channel/[id]/(components)/ChannelController";
import Invite from "./Invite";

export default function ChatGroup({
  data,
  selectedChannelId,
}: {
  data: ChannelType;
  selectedChannelId: string;
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(false);

  return (
    <div className="flex items-center relative">
      <div className="flex gap-2 grow">
        {selectedChannelId === data.id && (
          <div className="rounded-full border-4 border-primary-500 border-l-transparent border-b-transparent rotate-45 absolute top-1/2 -translate-y-1/2 -left-[calc(1rem+0.25rem)]" />
        )}
        <div>
          <Avatar src={data.avatar} className="h-10 w-10">
            <DropdownMenuLabel>Channel</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={data.amIBaned}
              onClick={() => setLeaveConfirm(true)}
            >
              <div className="flex">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Leave Channel</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                data.myRole !== "ADMINISTRATOR" || data.type !== "PRIVATE"
              }
              onClick={() => {
                setInviteStatus(true);
              }}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              <span>Invite People</span>
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
            <h5 className="text-gray-500 text-xs">{data.topic}.</h5>
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
      />
      <DeleteChannel
        id={data.id}
        status={deleteConfirm}
        setStatus={setDeleteConfirm}
      />
      {data.myRole === "ADMINISTRATOR" && data.type === "PRIVATE" && (
        <Invite
          channelId={data.id}
          open={inviteStatus}
          setOpen={setInviteStatus}
        />
      )}
    </div>
  );
}
