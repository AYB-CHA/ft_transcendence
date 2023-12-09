"use client";

import Input from "@/components/input/Input";
import axios from "@/lib/axios";
import Card from "@/components/card/Card";
import ChannelLabel from "./ChannelLabel";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Search, SearchSlash } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";

import { debounce } from "lodash";
import { ChannelVisibilityType } from "../channel/[id]/(components)/ChannelController";

export type SearchChannelType = {
  id: string;
  name: string;
  avatar: string;
  type: ChannelVisibilityType;
  topic: string;
  members: number;
};

export default function NewChat() {
  const [channels, setChannels] = useState<SearchChannelType[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, [open]);

  const fetchChannels = async (query: string = "") => {
    axios
      .get<SearchChannelType[]>("/chat/channel/discover" + `?search=${query}`)
      .then((response) => {
        setChannels(response.data);
      })
      .catch((e) => {})
      .finally(() => {});
  };

  const debouncedSearch = debounce(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      fetchChannels(target.value);
    },
    200
  );

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>
            <Input
              placeholder="Search for channels"
              icon={<Search size={18} />}
            />
          </div>
          {/* <Button className="w-full" variant="dark">
            Enter a New Chat
          </Button> */}
        </DialogTrigger>
        <DialogContent className="max-w-2xl" closeButton={false}>
          <div className="absolute -top-16 -left-px w-[calc(100%+2px)]  bg-slate-500">
            <Card>
              <Input
                className="bg-dark-dim border-0 py-4"
                placeholder="Search"
                icon={<Search size={16} />}
                onChange={debouncedSearch}
              />
            </Card>
          </div>
          <div className="flex flex-col gap-4 p-4 min-h-[300px]">
            {!channels.length && (
              <div className="py-20 flex justify-center flex-col items-center">
                <SearchSlash
                  size={35}
                  strokeWidth={1}
                  className="text-gray-500"
                />
                <div className="mt-4">
                  <span className="text-gray-500 text-xs">
                    No Channels found.
                  </span>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
