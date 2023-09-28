"use client";
import Avatar from "@/components/Avatar";
import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import CardFooter from "@/components/card/CardFooter";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";

import { ImageIcon, Link, SendHorizonal, Swords } from "lucide-react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { getChannelData } from "./ChannelController";
export default function ChatBox() {
  let { id } = useParams();
  let { data, isLoading, error } = useSWR(
    `/chat/channel/${id}`,
    getChannelData
  );

  return (
    <Card className="col-span-2">
      <div className="flex flex-col h-full">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div>
                {isLoading ? (
                  <div className="w-10 h-10 bg-dark-semi-dim rounded-full animate-pulse"></div>
                ) : (
                  <Avatar src={data.avatar} className="h-10 w-10" />
                )}
              </div>
              <div>
                <h4>
                  {isLoading ? (
                    <div className="bg-dark-semi-dim h-3 animate-pulse w-20 mt-1"></div>
                  ) : (
                    data.name
                  )}
                </h4>
                <h5 className="text-gray-500 text-xs">
                  {isLoading ? (
                    <div className="bg-dark-semi-dim h-2 animate-pulse w-16 mt-2"></div>
                  ) : (
                    `${data._count.users} members`
                  )}
                </h5>
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="bg-dark-semi-dim h-4 animate-pulse w-12 mt-2"></div>
              ) : (
                <span className="text-gray-500">5:15 pm</span>
              )}
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
