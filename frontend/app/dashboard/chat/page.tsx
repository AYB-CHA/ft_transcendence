import Button from "@/components/Button";
import Card from "@/components/card/Card";
import CardBody from "@/components/card/CardBody";
import CardFooter from "@/components/card/CardFooter";
import CardHeader from "@/components/card/CardHeader";
import Input from "@/components/input/Input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Search } from "lucide-react";
import NewChat from "./(components)/NewChat";

export default function Page() {
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
                  Here Will be channels.
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
      <Card className="col-span-3"></Card>
    </div>
  );
}
