"use client";

import Image from "next/image";
import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import CardFooter from "@/components/card/CardFooter";
import { PenIcon, Search } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/input/Input";
import MemberLabel from "./MemberLabel";
import useSWR from "swr";
import { notFound, useParams } from "next/navigation";
import axios from "@/lib/axios";
import Spinner from "@/components/Spinner";

export default function ChannelController() {
  let { id } = useParams();
  let { data, isLoading, error } = useSWR(
    `/chat/channel/${id}`,
    getChannelData
  );

  if (error) throw notFound();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Input placeholder="Search Members" icon={<Search size={18} />} />
      </CardHeader>
      <div className="grow px-4">
        <div className="py-10">
          <div className="flex justify-center items-center">
            {isLoading ? (
              <div className="py-8">
                <Spinner />
              </div>
            ) : (
              <div className="text-center flex flex-col items-center">
                <div className="relative cursor-pointer mb-6">
                  <div className="border-2 border-primary h-32 w-32 rounded-full overflow-hidden ">
                    <Image
                      src={data?.avatar}
                      className="h-full w-full"
                      alt="Avatar"
                      width={128}
                      height={128}
                      unoptimized
                    />
                    {data.isAdmin && (
                      <div className="absolute bg-primary text-dark top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border border-dark h-5 w-5 flex justify-center items-center rounded-full">
                        <PenIcon size={11} />
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="font-medium text-base mb-1">{data.name}</h3>
                <p className="text-gray-500">{data.topic}</p>
              </div>
            )}
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
  );
}

async function getChannelData(url: string) {
  return (await axios.get(url)).data;
}
