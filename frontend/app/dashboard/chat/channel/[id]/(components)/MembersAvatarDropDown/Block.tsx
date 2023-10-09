import { DropdownMenuItem } from "@/components/ui/DropDown";
import { UserMinus } from "lucide-react";

export default function Block() {
  return (
    <DropdownMenuItem>
      <UserMinus className="mr-2 h-4 w-4" />
      <span>Block</span>
    </DropdownMenuItem>
  );
}
