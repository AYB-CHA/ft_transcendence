import Avatar from "@/components/DropDownAvatar";
import { ChannelType } from "./ChannelsSidebar";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/Dialog";

import { useState } from "react";
import Card from "@/components/card/Card";
import CardFooter from "@/components/card/CardFooter";
import Button from "@/components/Button";
import CardBody from "@/components/card/CardBody";
import CardHeader from "@/components/card/CardHeader";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChatGroup({ data }: { data: ChannelType }) {
  const [confirmDialogStatus, setConfirmDialogStatus] = useState(false);
  const router = useRouter();
  async function deleteCurrentChannel() {
    await axios.delete(`/chat/channel/${data.id}`);
    router.push("/dashboard/chat/channel");
    setConfirmDialogStatus(false);
  }

  return (
    <div className="flex items-center">
      <div className="flex gap-2 grow">
        <div>
          <Avatar src={"/avatar-1.png"} className="h-10 w-10">
            <DropdownMenuLabel>Channel</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LinkIcon className="mr-2 h-4 w-4" />
              <span>Invite People</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Leave Channel</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!data?.isAdmin}
              onClick={() => setConfirmDialogStatus(true)}
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
      <Dialog open={confirmDialogStatus} onOpenChange={setConfirmDialogStatus}>
        <DialogContent className="max-w-md">
          <Card>
            <CardHeader>
              <DialogTitle>
                Are you sure you want to delete channel ?
              </DialogTitle>
            </CardHeader>
            <CardBody>
              <DialogDescription>
                This action cannot be undone and will permanently remove all
                content and members associated with the channel. Please confirm
                your decision to proceed with the deletion.
              </DialogDescription>
            </CardBody>
            <CardFooter>
              <Button variant="danger" onClick={deleteCurrentChannel}>
                Delete Channel
              </Button>
              <Button
                variant="secondary"
                onClick={() => setConfirmDialogStatus(false)}
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
