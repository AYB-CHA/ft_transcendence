import Card from "@/components/card/Card";
import CardHeader from "@/components/card/CardHeader";
import Inputs from "./(components)/Inputs";

export default function Page() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="max-w-4xl w-full">
        <Card>
          <CardHeader>Profile Settings</CardHeader>
          <Inputs />
        </Card>
      </div>
    </div>
  );
}
