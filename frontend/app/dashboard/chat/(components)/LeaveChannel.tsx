import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/Dialog";

import CardFooter from "@/components/card/CardFooter";
import Button from "@/components/Button";
import CardBody from "@/components/card/CardBody";
import CardHeader from "@/components/card/CardHeader";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { dispatchServerError } from "@/app/lib/Toast";

export default function LeaveChannel({
  status,
  setStatus,
  id,
}: {
  id?: string;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
  status: boolean;
}) {
  const router = useRouter();
  async function leaveCurrentChannel() {
    router.push("/dashboard/chat");
    try {
      await axios.delete(`/chat/channel/${id}/leave`);
    } catch {
      dispatchServerError();
    }

    setStatus(false);
    mutate("/chat/channel", undefined);
    mutate("/chat/channel/discover");
  }

  return (
    <div>
      <Dialog open={status} onOpenChange={setStatus}>
        <DialogContent className="max-w-md">
          <CardHeader>Are you sure you want to Leave ?</CardHeader>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
