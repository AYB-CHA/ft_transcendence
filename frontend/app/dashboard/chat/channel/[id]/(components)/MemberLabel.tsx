import Avatar from "@/components/DropDownAvatar";

export default function MemberLabel({
  avatar,
  username,
  name,
}: {
  avatar: string;
  username: string;
  name: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div>
          <Avatar src={avatar} className="h-10 w-10" />
        </div>
        <div>
          <h4>{name}</h4>
          <h5 className="text-gray-500 text-xs">@{username}</h5>
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
