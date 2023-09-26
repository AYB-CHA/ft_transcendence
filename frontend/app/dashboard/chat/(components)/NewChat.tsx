import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Card from "@/components/card/Card";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import Input from "@/components/input/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Search } from "lucide-react";
import UserLabel from "./UserLabel";
import ChannelLabel from "./ChannelLabel";
import NewChannel from "./NewChannel";

export default function NewChat() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mx-auto">Enter a New Chat</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <CardHeader>New Chat</CardHeader>
          <CardBody>
            <div className="py-6">
              <div className="mb-8">
                <Input placeholder="Search" icon={<Search size={16} />} />
              </div>
              <div className="flex flex-col gap-4">
                <UserLabel />
                <hr className="border-dark-semi-dim" />
                <ChannelLabel />
                <hr className="border-dark-semi-dim" />
                <UserLabel />
                <hr className="border-dark-semi-dim" />
                <ChannelLabel />
                <hr className="border-dark-semi-dim" />
                <UserLabel />
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <NewChannel />
          </CardFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
