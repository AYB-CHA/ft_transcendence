"use client";
import EditAvatar from "@/app/(components)/EditAvatar";
import { triggerValidationToast } from "@/app/lib/Toast";
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

import {
  AlignRight,
  Fingerprint,
  KeyRoundIcon,
  PenIcon,
  SpellCheck2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

type ChannelVisibilityType = "public" | "private" | "protected";

let avatarUrl = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] as string);
avatarUrl.pathname = "public/avatars/";

export default function NewChannel({
  setParentDialog,
}: {
  setParentDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<ChannelVisibilityType>("public");
  const [avatar, setAvatar] = useState("channel.jpg");

  const handelSumption = async () => {
    let data: {
      [key: string]: string;
    } = {
      name,
      avatar: avatarUrl.toString() + avatar,
      type: visibility,
      topic: description,
    };
    if (visibility === "protected") data.password = password;

    try {
      let response = await axios.post("chat/channel", data);
      router.push(`/dashboard/chat/channel/${response.data?.id}`);
      setOpen(false);
      setParentDialog(false);
      mutate("/chat/channel");
      toast.dismiss();
    } catch (error) {
      if (error instanceof AxiosError)
        triggerValidationToast(
          <SpellCheck2 size={18} />,
          "Validation",
          camelCaseToNormal(error.response?.data.message[0])
        );
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
                  <EditAvatar
                    src={avatarUrl.toString() + avatar}
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
