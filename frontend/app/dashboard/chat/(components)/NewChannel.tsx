"use client";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import Input from "@/components/input/Input";
import Label from "@/components/input/Label";
import TextArea from "@/components/input/TextArea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import axios from "@/lib/axios";
import { camelCaseToNormal } from "@/lib/string";
import { AxiosError } from "axios";

import { AlignRight, Fingerprint, KeyRoundIcon, PenIcon } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useState } from "react";

type ChannelVisibilityType = "public" | "private" | "protected";

export default function NewChannel() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<ChannelVisibilityType>("public");

  const handelSumption = async () => {
    let data: {
      [key: string]: string;
    } = {
      name,
      avatar: "avatar.png",
      type: visibility,
      topic: description,
    };
    if (visibility === "protected") data.password = password;
    try {
      let response = await axios.post("chat/channel", data);
      router.push(`/dashboard/chat/channel/${response.data?.id}`);
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError)
        setError(camelCaseToNormal(error.response?.data.message[0]));
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mx-auto">Create New Channel</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <CardHeader>New Channel</CardHeader>
          <CardBody>
            <div>{error && <Alert>{error}</Alert>}</div>
            <div className="grid grid-cols-2 px-2 py-4 gap-8">
              <div>
                <div className="mb-6">
                  <Label>Channel Name</Label>
                  <Input
                    placeholder="Channel Name"
                    icon={<Fingerprint size={17} />}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                  />
                </div>
                <div className="mb-6">
                  <Label>Viability</Label>
                  <Select
                    defaultValue={visibility}
                    onValueChange={(value: ChannelVisibilityType) =>
                      setVisibility(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent sideOffset={4}>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="protected">Protected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {visibility === "protected" && (
                  <div className="mb-6">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<KeyRoundIcon size={17} />}
                    />
                  </div>
                )}
                <div>
                  <Label>Topic</Label>
                  <TextArea
                    placeholder="Channel brief description."
                    icon={<AlignRight size={17} />}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="text-center flex flex-col items-center">
                  <div className="relative cursor-pointer mb-4">
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
                  <h3 className="font-medium text-base">
                    {name.length > 0 ? name : "Channel Name"}
                  </h3>
                  <p className="text-gray-500">
                    {description.length > 0
                      ? description
                      : "Channel Description"}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button onClick={handelSumption}>Create Channel</Button>
          </CardFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
