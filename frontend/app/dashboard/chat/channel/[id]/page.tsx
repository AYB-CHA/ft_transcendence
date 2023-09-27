import Image from "next/image";
import Avatar from "@/components/Avatar";
import MemberLabel from "../../(components)/MemberLabel";
import MyMessage from "../../(components)/MyMessage";
import OtherMessage from "../../(components)/OtherMessage";
import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import CardFooter from "@/components/card/CardFooter";
import {
  ImageIcon,
  Link,
  PenIcon,
  Search,
  SendHorizonal,
  Swords,
} from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/input/Input";

export default function Page() {
  return (
    <>
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
      <Card className="flex flex-col">
        <CardHeader>
          <Input placeholder="Search Members" icon={<Search size={18} />} />
        </CardHeader>
        <div className="grow px-4">
          <div className="py-10">
            <div className="flex justify-center items-center">
              <div className="text-center flex flex-col items-center">
                <div className="relative cursor-pointer mb-6">
                  <div className="border-2 border-primary h-32 w-32 rounded-full overflow-hidden ">
                    <Image
                      src={"https://github.com/shadcn.png"}
                      className="h-full w-full"
                      alt="Avatar"
                      width={128}
                      height={128}
                      unoptimized
                    />
                    <div className="absolute bg-primary text-dark top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border border-dark h-5 w-5 flex justify-center items-center rounded-full">
                      <PenIcon size={12} />
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-base mb-1">{"Channel Name"}</h3>
                <p className="text-gray-500">{"Channel Description"}</p>
              </div>
            </div>
          </div>
          <div>
            <span className="text-gray-500">Members:</span>
            <div className="flex flex-col gap-4 mt-6">
              <MemberLabel />
              <hr className="border-dark-semi-dim" />
              <MemberLabel />
              <hr className="border-dark-semi-dim" />
              <MemberLabel />
              <hr className="border-dark-semi-dim" />
              <MemberLabel />
            </div>
          </div>
        </div>
        <CardFooter>
          <div className="w-full grid grid-cols-2 gap-4">
            <Button variant="danger">Leave Channel</Button>
            <Button>Invite People</Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
