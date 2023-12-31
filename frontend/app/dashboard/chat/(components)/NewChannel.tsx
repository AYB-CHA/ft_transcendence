"use client";
import EditAvatar from "@/app/(components)/EditAvatar";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import CardBody from "@/components/card/CardBody";
import TextArea from "@/components/input/TextArea";
import Input from "@/components/input/Input";
import Label from "@/components/input/Label";
import Button from "@/components/Button";
import axios from "@/lib/axios";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { dispatchNotification } from "@/app/lib/Toast";
import { camelCaseToNormal } from "@/lib/string";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useState } from "react";
import { mutate } from "swr";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import {
  AlignRight,
  Fingerprint,
  KeyRoundIcon,
  PlusIcon,
  SpellCheck2,
} from "lucide-react";

export type ChannelVisibilityType = "PUBLIC" | "PRIVATE" | "PROTECTED";

export function avatarsBaseUrl() {
  const avatarUrl = new URL(
    process.env["NEXT_PUBLIC_BACKEND_BASEURL"] as string
  );
  avatarUrl.pathname += "public/avatars/";
  return avatarUrl.toString();
}

export default function NewChannel({}: {}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<ChannelVisibilityType>("PUBLIC");
  const [avatar, setAvatar] = useState("channel.jpg");

  const handelSumption = async () => {
    const data: {
      [key: string]: string;
    } = {
      name,
      avatar: avatarsBaseUrl() + avatar,
      type: visibility.toLowerCase(),
      topic: description,
    };
    if (visibility === "PROTECTED") data.password = password;

    try {
      const response = await axios.post("chat/channel", data);
      router.push(`/dashboard/chat/channel/${response.data?.id}`);
      setOpen(false);
      mutate("/chat/channel");
    } catch (error) {
      if (error instanceof AxiosError)
        dispatchNotification({
          title: "Validation",
          icon: SpellCheck2,
          description: camelCaseToNormal(error.response?.data.message[0]),
        });
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <PlusIcon
            className="hover:text-primary cursor-pointer"
            strokeWidth={1}
            size={20}
          />
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <CardHeader>New Channel</CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 px-2 py-4 gap-8">
              <div>
                <div className="mb-6">
                  <Label>Channel Name</Label>
                  <Input
                    placeholder="Channel Name"
                    icon={<Fingerprint size={17} />}
                    onChange={(e) => setName(e.target.value)}
                    name="channelName"
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
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="PROTECTED">Protected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {visibility === "PROTECTED" && (
                  <div className="mb-6">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Password"
                      name="password"
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
                  <EditAvatar
                    src={avatarsBaseUrl() + avatar}
                    setSrc={setAvatar}
                  />
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
