"use client";
import Button from "@/components/Button";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import Input from "@/components/input/Input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Search, SearchSlash } from "lucide-react";
import ChannelLabel from "./ChannelLabel";
import NewChannel from "./NewChannel";
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { debounce } from "lodash";
import { ChannelVisibilityType } from "../channel/[id]/(components)/ChannelController";

type SearchChannelType = {
  id: string;
  name: string;
  avatar: string;
  type: ChannelVisibilityType;
  topic: string;
  members: number;
};

export default function NewChat() {
  const [open, setOpen] = useState(false);
  let [channels, setChannels] = useState<SearchChannelType[]>([]);
  // let [loading, setLoading] = useState(false);
  let [query, setQuery] = useState("");

  useEffect(() => {
    // setLoading(true);
    axios
      .get<SearchChannelType[]>("/chat/channel/discover" + `?search=${query}`)
      .then((response) => {
        setChannels(response.data);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, [query, open]);

  const debouncedSetQuery = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, 200);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mx-auto">Enter a New Chat</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <CardHeader>New Chat</CardHeader>
          <CardBody>
            <div className="py-6">
              <div className="mb-8">
                <Input
                  placeholder="Search"
                  icon={<Search size={16} />}
                  onChange={debouncedSetQuery}
                />
              </div>
              <div className="flex flex-col gap-4">
                {!channels.length && (
                  <div className="py-20 flex justify-center flex-col items-center">
                    <SearchSlash
                      size={50}
                      strokeWidth={1}
                      className="text-gray-500"
                    />
                    <div className="mt-4">
                      <span className="text-gray-500">No Channels found.</span>
                    </div>
                  </div>
                )}
                {channels.map((channel, indx: number) => (
                  <React.Fragment key={channel.id}>
                    <ChannelLabel
                      setParentDialog={setOpen}
                      avatar={channel.avatar}
                      name={channel.name}
                      type={channel.type}
                      topic={channel.topic}
                      usersCount={channel.members}
                      id={channel.id}
                    />
                    {indx < channels.length - 1 && (
                      <hr className="border-dark-semi-dim" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <NewChannel setParentDialog={setOpen} />
          </CardFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
