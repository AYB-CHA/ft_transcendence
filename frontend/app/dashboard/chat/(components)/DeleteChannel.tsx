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

export default function DeleteChannel({
  status,
  setStatus,
  id,
}: {
  id: string;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
  status: boolean;
}) {
  let router = useRouter();
  async function deleteCurrentChannel() {
    await axios.delete(`/chat/channel/${id}`);
    router.push("/dashboard/chat/channel");
    setStatus(false);
  }
  return (
    <Dialog open={status} onOpenChange={setStatus}>
      <DialogContent className="max-w-md">
        <Card>
          <CardHeader>
            <DialogTitle>Are you sure you want to delete channel ?</DialogTitle>
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
            <Button variant="secondary" onClick={() => setStatus(false)}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
