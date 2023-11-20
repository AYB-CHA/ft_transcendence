"use client";
import Card from "@/components/card/Card";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import Input from "@/components/input/Input";

import { Tabs, TabsContent } from "@/components/ui/Tabs";

import { Search } from "lucide-react";
import NewChat from "./(components)/NewChat";
import ChannelsSidebar from "./(components)/ChannelsSidebar";
import ThreadSideBar from "./(components)/ThreadSideBar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NewChannel from "./(components)/NewChannel";
import { twMerge } from "tailwind-merge";
import TabSwitcher from "./(components)/TabSwitcher";

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const [activeTab, setActiveTab] = useState<"channels" | "dms">(
    path.startsWith("/dashboard/chat/dm") ? "dms" : "channels"
  );

  useEffect(() => {
    setActiveTab(path.startsWith("/dashboard/chat/dm") ? "dms" : "channels");
  }, [path]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "channels" | "dms");
  };

  return (
    <div className="my-8 grow grid grid-cols-4 gap-4">
      <Card className="flex flex-col">
        <div className="grow">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            defaultValue="channels"
          >
            <CardHeader>
              <Input placeholder="Search" icon={<Search size={18} />} />
            </CardHeader>
            <CardHeader className="p-0 px-4">
              <TabSwitcher
                activeTab={activeTab}
                setActiveTab={handleTabChange}
              />
            </CardHeader>
            <CardBody>
              <div>
                <TabsContent value="channels">
                  <div className="flex flex-col gap-4">
                    <ChannelsSidebar />
                  </div>
                </TabsContent>
                <TabsContent value="dms">
                  <div className="flex flex-col gap-4">
                    <ThreadSideBar />
                  </div>
                </TabsContent>
              </div>
            </CardBody>
          </Tabs>
        </div>
        <CardFooter>
          <div className="w-full grid grid-cols-2 gap-2">
            <NewChannel />
            <NewChat />
          </div>
        </CardFooter>
      </Card>
      {children}
    </div>
  );
}
