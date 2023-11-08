"use client";

import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import Card from "@/components/card/Card";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import APIClient from "@/lib/axios";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";

export default function Page() {
  const [message, setMessage] = useState("You are being redirected");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  useEffect(() => {
    APIClient.post<{ channelId: string }>(`chat/channel/private/${id}/join`)
      .then(({ data: { channelId } }) => {
        mutate(`/chat/channel/${channelId}`);
        router.push(`/dashboard/chat/channel/${channelId}`);
      })
      .catch((e: AxiosError<{ channelId: string }>) => {
        if (e.status === 400) {
          mutate(`/chat/channel/${e.response?.data.channelId}`);
          router.push(`/dashboard/chat/channel/${e.response?.data.channelId}`);
        } else setMessage("Invalid invitation");
      });
  }, [id, router, mutate]);

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>Channel Invitation</CardHeader>
        <CardBody className="py-8 flex flex-col items-center justify-center">
          <Avatar className="mb-4 w-20 aspect-square" src="/avatar-1.png" />
          <div className="flex flex-col gap-1 text-center">
            <h1 className="">Channel Name</h1>
            <p className="text-xs text-gray-500">Topic</p>
          </div>
        </CardBody>
        <CardFooter>
          <p className="text-xs text-dark-semi-light text-center w-full">
            You have been Invited to join this channel.
          </p>
        </CardFooter>
        <CardFooter>
          <div className="w-full grid grid-cols-2 gap-4">
            <Button variant="danger" onClick={router.back}>
              Reject
            </Button>
            <Button>Accept</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
