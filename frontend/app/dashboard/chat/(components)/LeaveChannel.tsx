import React, { PropsWithChildren, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/Dialog";

import Card from "@/components/card/Card";
import CardFooter from "@/components/card/CardFooter";
import Button from "@/components/Button";
import CardBody from "@/components/card/CardBody";
import CardHeader from "@/components/card/CardHeader";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LeaveChannel({
  status,
  setStatus,
  id,
}: {
  id: string;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
  status: boolean;
}) {
  const router = useRouter();

  async function leaveCurrentChannel() {
    await axios.delete(`/chat/channel/leave/${id}`);
    router.push("/dashboard/chat/channel");
    setStatus(false);
  }

  return (
    <div>
      <Dialog open={status} onOpenChange={setStatus}>
        <DialogContent className="max-w-md">
          <Card>
            <CardHeader>
              <DialogTitle>Are you sure you want to Leave ?</DialogTitle>
            </CardHeader>
            <CardBody>
              <DialogDescription>
                Are you certain you want to proceed? Leaving this channel may
                result in irreversible consequences.
              </DialogDescription>
            </CardBody>
            <CardFooter>
              <Button variant="danger" onClick={leaveCurrentChannel}>
                Leave Channel
              </Button>
              <Button variant="secondary" onClick={() => setStatus(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
