"use client";
import axios from "@/lib/axios";
import React from "react";
import useSWR from "swr";

async function getThreads(url: string) {
  return (await axios.get(url)).data;
}

export default function ThreadSideBar() {
  let { data } = useSWR("/chat/dm/threads", getThreads);
  console.log(data);
  return <div>ThreadSideBar</div>;
}
