import Avatar from "@/components/Avatar";
import { ChannelType } from "./ChannelController";

export default function ChatBoxHeader({
  data,
  isLoading,
}: {
  data?: ChannelType;
  isLoading: boolean;
}) {
  return (
    <div className="flex justify-between py-px">
      <div className="flex gap-2">
        <div>
          {isLoading ? (
            <div className="w-10 h-10 bg-dark-semi-dim rounded-full animate-pulse"></div>
          ) : (
            data && <Avatar src={data?.avatar} className="h-10 w-10" />
          )}
        </div>
        <div>
          <h4>
            {isLoading ? (
              <div className="bg-dark-semi-dim h-3 animate-pulse w-20 mt-1"></div>
            ) : (
              data?.name
            )}
          </h4>
          <h5 className="text-gray-500 text-xs">
            {isLoading ? (
              <div className="bg-dark-semi-dim h-2 animate-pulse w-16 mt-2"></div>
            ) : (
              `${data?.members} members`
            )}
          </h5>
        </div>
      </div>
    </div>
  );
}
