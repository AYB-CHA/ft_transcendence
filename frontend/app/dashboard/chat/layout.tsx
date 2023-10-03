import Card from "@/components/card/Card";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import Input from "@/components/input/Input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import { Search } from "lucide-react";
import NewChat from "./(components)/NewChat";
import ChannelsSidebar from "./(components)/ChannelsSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 grow grid grid-cols-4 gap-4">
      <Card className="flex flex-col">
        <div className="grow">
          <Tabs defaultValue="channels">
            <CardHeader>
              <Input placeholder="Search" icon={<Search size={18} />} />
            </CardHeader>
            <CardHeader>
              <TabsList>
                <TabsTrigger value="channels">Channels</TabsTrigger>
                <TabsTrigger value="dms">DMs</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardBody>
              <div>
                <TabsContent value="channels">
                  <div className="flex flex-col gap-4">
                    <ChannelsSidebar />
                  </div>
                </TabsContent>
                <TabsContent value="dms">Here Will be DMs.</TabsContent>
              </div>
            </CardBody>
          </Tabs>
        </div>
        <CardFooter>
          <div className="w-full">
            <NewChat />
          </div>
        </CardFooter>
      </Card>
      {children}
    </div>
  );
}
