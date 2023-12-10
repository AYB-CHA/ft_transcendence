"use client";
import Spinner from "@/components/Spinner";
import axios from "@/lib/axios";
import { PenIcon, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { dispatchNotification } from "../lib/Toast";

export default function EditAvatar({
  src,
  setSrc,
}: {
  src: string;
  setSrc: Dispatch<SetStateAction<string>>;
}) {
  const [isLoading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function submitFile(e: ChangeEvent<HTMLInputElement>) {
    setLoading(true);
    const form = new FormData();
    if (!e.target.files?.length) return;
    form.append("avatar", e.target.files[0]);
    try {
      const { data } = await axios.post("/upload/avatar", form);
      setSrc(data);
    } catch (error) {
      dispatchNotification({
        title: "Cant upload Avatar.",
        description: "An error happened while processing the request.",
        icon: ShieldAlert,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative cursor-pointer mb-4"
      style={{ width: 128 }}
      onClick={() => {
        inputRef.current?.click();
      }}
    >
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        hidden
        name="avatar"
        onChange={submitFile}
      />
      <div className="border-2 border-primary h-32 w-32 rounded-full overflow-hidden">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-dark-dim/80 flex justify-center items-center">
              <Spinner />
            </div>
          )}
          <Image
            src={src}
            className="h-full w-full"
            alt="Avatar"
            width={128}
            height={128}
            priority
            unoptimized
          />
        </div>
        <div className="absolute bg-primary text-dark top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border border-dark h-5 w-5 flex justify-center items-center rounded-full">
          <PenIcon size={12} />
        </div>
      </div>
    </div>
  );
}
