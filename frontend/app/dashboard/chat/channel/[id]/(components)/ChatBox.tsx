import Avatar from "@/components/Avatar";
import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import CardFooter from "@/components/card/CardFooter";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";

import { ImageIcon, Link, SendHorizonal, Swords } from "lucide-react";
export default function ChatBox() {
  return (
    <Card className="col-span-2">
      <div className="flex flex-col h-full">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div>
                <Avatar src={"/avatar-1.png"} className="h-10 w-10" />
              </div>
              <div>
                <h4>Pong gang</h4>
                <h5 className="text-gray-500 text-xs">33 members</h5>
              </div>
            </div>
            <div>
              <span className="text-gray-500">5:15 pm</span>
            </div>
          </div>
        </CardHeader>
        <div className="grow">
          <div className="flex flex-col p-4 gap-4">
            <MyMessage />
            <OtherMessage />
            <MyMessage />
            <OtherMessage />
            <OtherMessage />
            <MyMessage />
            <OtherMessage />
          </div>
        </div>
        <CardFooter>
          <div className="flex w-full py-2 gap-4">
            <div className="flex gap-3 text-gray-500">
              <ImageIcon size={20} strokeWidth={1} />
              <Link size={20} strokeWidth={1} />
              <Swords size={20} strokeWidth={1} />
            </div>
            <div className="grow">
              <input
                className="bg-transparent w-full focus:outline-none placeholder:text-gray-500"
                type="text"
                placeholder="Start new message"
              />
            </div>
            <div>
              <SendHorizonal
                className="text-primary-500"
                size={20}
                strokeWidth={1}
              />
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
