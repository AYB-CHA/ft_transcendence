import { DropdownMenuItem } from "@/components/ui/DropDown";
import { MessageSquare } from "lucide-react";
import React from "react";

export default function SendDM() {
  return (
    <DropdownMenuItem>
      <MessageSquare className="mr-2 h-4 w-4" />
      <span>Send DM</span>
    </DropdownMenuItem>
  );
}
