import Card from "@/components/card/Card";

export default function page() {
  return (
    <Card className="col-span-3 flex items-center justify-center">
      <div className="py-24 text-xs text-gray-500 text-center">
        select a conversation to and start talking.
      </div>
    </Card>
  );
}
