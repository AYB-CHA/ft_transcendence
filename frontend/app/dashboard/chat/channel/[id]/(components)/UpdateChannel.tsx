"use client";

import EditAvatar from "@/app/(components)/EditAvatar";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import TextArea from "@/components/input/TextArea";
import CardBody from "@/components/card/CardBody";
import Input from "@/components/input/Input";
import Label from "@/components/input/Label";
import Button from "@/components/Button";
import axios from "@/lib/axios";

import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { dispatchNotification } from "@/app/lib/Toast";
import { ChannelType } from "./ChannelController";
import { camelCaseToNormal } from "@/lib/string";
import { AxiosError } from "axios";

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
  Info,
  KeyRoundIcon,
  SpellCheck2,
} from "lucide-react";

import {
  ChannelVisibilityType,
  avatarsBaseUrl,
} from "../../../(components)/NewChannel";

export default function UpdateChannel({
  children,
  channelData,
}: { channelData: ChannelType } & PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(channelData.name);
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState(channelData.topic);
  const [visibility, setVisibility] = useState<ChannelVisibilityType>(
    channelData.type
  );
  const [avatar, setAvatar] = useState(channelData.avatar);
  function setAvatarFullUrl(avatarName: string) {
    setAvatar(avatarsBaseUrl() + avatarName);
  }

  const handelSumption = async () => {
    const data: {
      [key: string]: string;
    } = {
      name,
      avatar: avatar,
      type: visibility,
      topic: description,
    };

    if (visibility === "PROTECTED" && password.length) {
      data.password = password;
    }

    try {
      await axios.put(`chat/channel/update/${channelData.id}`, data);
      setOpen(false);
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
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-3xl">
          <CardHeader>Update Channel</CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 px-2 py-4 gap-8">
              <div>
                <div className="mb-6">
                  <Label>Channel Name</Label>
                  <Input
                    placeholder="Channel Name"
                    icon={<Fingerprint size={17} />}
                    onChange={(e) => setName(e.target.value)}
                    value={name}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="text-center flex flex-col items-center">
                  <EditAvatar
                    src={avatar}
                    setSrc={
                      setAvatarFullUrl as Dispatch<SetStateAction<string>>
                    }
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
            <div className="flex w-full justify-between">
              <span className="ms-2 text-xs text-dark-semi-light inline-flex items-center gap-2">
                <Info size={15} strokeWidth={1.5} /> leave the password filed
                empty to not change it
              </span>
              <Button onClick={handelSumption}>Save Changes</Button>
            </div>
          </CardFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
