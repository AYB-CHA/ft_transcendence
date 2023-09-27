import Avatar from "@/components/Avatar";

export default function ChatGroup() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div>
          <Avatar src={"/avatar-1.png"} className="h-10 w-10" />
        </div>
        <div>
          <h4>Pong gang</h4>
          <h5 className="text-gray-500 text-xs">
            this is a message that sent you....
          </h5>
        </div>
      </div>
      <div>
        <div className="mb-2">
          <span className="text-gray-500 text-xs">5:16 PM</span>
        </div>
        <div className="rounded-full h-2 w-2 bg-primary-500 border border-white ml-auto"></div>
      </div>
    </div>
  );
}
