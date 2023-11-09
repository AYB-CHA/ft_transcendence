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
import { Unlink } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

type InvitedChannelType = {
  id: string;
  name: string;
  avatar: string;
  topic: string;
};

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InvitedChannelType | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { get, post } = APIClient;

  useEffect(() => {
    get<InvitedChannelType>(`chat/channel/private/${id}/channel`)
      .then(({ data }) => {
        setData(data);
      })
      .catch((e: AxiosError) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [get, id]);

  async function acceptInvitation() {
    try {
      const {
        data: { channelId },
      } = await post<{ channelId: string }>(`chat/channel/private/${id}/join`);
      mutate(`/chat/channel/${channelId}`);
      router.push(`/dashboard/chat/channel/${channelId}`);
    } catch (error) {}
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>Channel Invitation</CardHeader>
        <CardBody className="py-8 flex flex-col items-center justify-center">
          {loading && (
            <div className="py-12">
              <Spinner />
            </div>
          )}
          {error && (
            <>
              <div className="py-12 flex justify-center flex-col items-center">
                <Unlink size={35} strokeWidth={1} className="text-gray-500" />
                <div className="mt-4">
                  <span className="text-gray-500 text-xs">
                    Invitation Link Is Invalid.
                  </span>
                </div>
              </div>
            </>
          )}
          {data && (
            <>
              <Avatar className="mb-4 w-20 aspect-square" src={data?.avatar} />
              <div className="flex flex-col gap-1 text-center">
                <h1 className="">{data?.name}</h1>
                <p className="text-xs text-gray-500">{data?.topic}</p>
              </div>
            </>
          )}
        </CardBody>
        {data && (
          <CardFooter>
            <p className="text-xs text-dark-semi-light text-center w-full">
              You have been Invited to join this channel.
            </p>
          </CardFooter>
        )}
        <CardFooter>
          <div className="w-full grid grid-cols-2 gap-4">
            <Button onClick={router.back}>Go back</Button>
            <Button disabled={!data} onClick={acceptInvitation}>
              {!data ? "..." : "Accept"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
