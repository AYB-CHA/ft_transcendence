import { dispatchServerError } from "@/app/lib/Toast";
import { DropdownMenuItem } from "@/components/ui/DropDown";
import axios from "@/lib/axios";
import { UserMinus } from "lucide-react";

export default function Block({
  userId,
  myId,
}: {
  userId: string;
  myId?: string;
}) {
  async function blockUser() {
    try {
      await axios.post(`/user/block/${userId}`);
    } catch {
      dispatchServerError();
    }
  }

  return (
    <DropdownMenuItem onClick={blockUser} disabled={userId === myId}>
      <UserMinus className="mr-2 h-4 w-4" />
      <span>Block</span>
    </DropdownMenuItem>
  );
}
