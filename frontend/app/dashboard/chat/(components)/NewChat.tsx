"use client";
import Button from "@/components/Button";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import Input from "@/components/input/Input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Search } from "lucide-react";
import ChannelLabel from "./ChannelLabel";
import NewChannel from "./NewChannel";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function NewChat() {
  let [channels, setChannels] = useState([]);
  // let [loading, setLoading] = useState(false);
  let [query, setQuery] = useState("");

  useEffect(() => {
    // setLoading(true);
    axios
      .get("/chat/channel/discover" + `?search=${query}`)
      .then((response) => {
        setChannels(response.data);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, [query]);

  console.log(channels);

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
                <Input
                  placeholder="Search"
                  icon={<Search size={16} />}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-4">
                {channels.map((channel: any, indx: number) => (
                  <React.Fragment key={channel.id}>
                    <ChannelLabel
                      avatar={channel.avatar}
                      name={channel.name}
                      type={channel.type}
                      topic={channel.topic}
                      usersCount={channel._count.users}
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
            <NewChannel />
          </CardFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
