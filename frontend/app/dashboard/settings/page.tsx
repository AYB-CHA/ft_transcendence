"use client";
import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import Inputs from "./(components)/Inputs";
import dynamic from "next/dynamic";

const Themes = dynamic(
  () => import("./(components)/theme").then((mod) => mod.Themes),
  { ssr: false },
);

export default function Page() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="max-w-4xl w-full">
        <Card>
          <CardHeader>Profile Settings</CardHeader>
          <Inputs />
          <Themes />
        </Card>
      </div>
    </div>
  );
}
