"use client";
import Card from "@/components/card/Card";
import CardBody from "@/components/card/CardBody";
import CardHeader from "@/components/card/CardHeader";

import { Tabs, TabsContent } from "@/components/ui/Tabs";

import ChannelsSidebar from "./(components)/ChannelsSidebar";
import ThreadSideBar from "./(components)/ThreadSideBar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TabSwitcher from "./(components)/TabSwitcher";

import NewChat from "./(components)/NewChat";
import PopularChannels from "./(components)/PopularChannels";

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
      <div className="grid grid-rows-2 gap-4">
        <Card className="flex flex-col">
          <div className="grow grid">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              defaultValue="channels"
              className="grow flex flex-col"
            >
              <CardHeader>
                <NewChat />
              </CardHeader>
              <CardHeader className="p-0 px-4">
                <TabSwitcher
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                />
              </CardHeader>
              <CardBody className="grow h-0 overflow-auto">
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
        </Card>
        <PopularChannels />
      </div>
      {children}
    </div>
  );
}
