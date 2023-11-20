import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import CardBody from "@/components/card/CardBody";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import axios from "@/lib/axios";
import { mutate } from "swr";

import {
  DialogDescription,
  DialogContent,
  Dialog,
} from "@/components/ui/Dialog";

export default function DeleteChannel({
  status,
  setStatus,
  id,
}: {
  id: string;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
  status: boolean;
}) {
  const router = useRouter();

  async function deleteCurrentChannel() {
    await axios.delete(`/chat/channel/${id}`);
    router.push("/dashboard/chat");
    setStatus(false);
    mutate("/chat/channel");
  }

  return (
    <Dialog open={status} onOpenChange={setStatus}>
      <DialogContent className="max-w-md">
        <CardHeader>Are you sure you want to delete channel ?</CardHeader>
        <CardBody>
          <DialogDescription>
            This action cannot be undone and will permanently remove all content
            and members associated with the channel. Please confirm your
            decision to proceed with the deletion.
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
      </DialogContent>
    </Dialog>
  );
}
