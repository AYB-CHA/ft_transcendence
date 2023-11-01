import Avatar from "@/components/Avatar";
import Button from "@/components/Button";

type StatisticTextProps = {
  title: string;
  value: string;
};

function StatisticText({ title, value }: StatisticTextProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-[8px]">
      <p className="font-semibold text-[20px] text-[#C2C4C0]">{value}</p>
      <p className="font-semibold text-[14px] text-[#6B7280] uppercase">
        {title}
      </p>
    </div>
  );
}

type BasicFriendCardWithStatsProps = {
  image: string;
  name: string;
  username: string;
  wonGames: number;
  lostGames: number;
  actions: JSX.Element;
};

function BasicFriendWithStatsCard({
  image,
  name,
  username,
  wonGames,
  lostGames,
  actions,
}: BasicFriendCardWithStatsProps) {
  const playedGames = lostGames + wonGames;
  const winRatio = Math.round((wonGames * 100) / playedGames);

  return (
    <div className="grid grid-cols-6 p-[16px]">
      <div className="flex flex-row items-center gap-[7px]">
        <Avatar src={image} className="max-w-[44px] max-h-[44px]" />
        <div className="flex flex-col">
          <p className="font-semibold text-[#F3F4F6] text-[15px] leading-[23px]">
            {name}
          </p>
          <p className="font-normal text-[#9CA3AF] text-[12px] leading-[19px]">
            @{username}
          </p>
        </div>
      </div>
      <StatisticText title="Games" value={String(playedGames)} />
      <StatisticText title="Won Games" value={String(wonGames)} />
      <StatisticText title="Lost Games" value={String(lostGames)} />
      <StatisticText title="Win Ratio" value={`${winRatio}%`} />
      <div className="flex flex-row items-end justify-center gap-[18px]">
        {actions}
      </div>
    </div>
  );
}

type BasicFriendCardProps = {
  image: string;
  name: string;
  username: string;
  actions: JSX.Element;
};

function BasicFriendCard({
  image,
  name,
  username,
  actions,
}: BasicFriendCardProps) {
  return (
    <div className="flex flex-row items-center justify-between px-[8px] py-[12px]">
      <div className="flex flex-row items-center gap-[7px] col-span-1">
        <Avatar src={image} className="max-w-[44px] max-h-[44px]" />
        <div className="flex flex-col">
          <p className="font-semibold text-[#F3F4F6] text-[15px] leading-[23px]">
            {name}
          </p>
          <p className="font-normal text-[#9CA3AF] text-[12px] leading-[19px]">
            @{username}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-end justify-center gap-[18px] col-span-1">
        {actions}
      </div>
    </div>
  );
}

export type FriendCardProps = Omit<BasicFriendCardWithStatsProps, "actions"> & {
  onRemove: () => void;
};

export function FriendCard(props: FriendCardProps) {
  return (
    <BasicFriendWithStatsCard
      {...props}
      actions={
        <Button onClick={props.onRemove} variant="secondary">
          Remove Friend
        </Button>
      }
    />
  );
}

export type FriendRequestCard = Omit<
  BasicFriendCardWithStatsProps,
  "actions"
> & {
  onAccept: () => void;
  onReject: () => void;
};

export function FriendRequestCard(props: FriendRequestCard) {
  return (
    <BasicFriendWithStatsCard
      {...props}
      actions={
        <>
          <Button onClick={props.onReject} variant="secondary">
            Reject
          </Button>
          <Button onClick={props.onAccept} variant="secondary">
            Accept
          </Button>
        </>
      }
    />
  );
}

export type SearchFriendCardProps = Omit<
  BasicFriendCardWithStatsProps,
  "actions" | "wonGames" | "lostGames"
> & {
  userId: string;
  action: { text: string; fn: () => void };
};

export function SearchFriendRequestCard(props: SearchFriendCardProps) {
  return (
    <BasicFriendCard
      {...props}
      actions={
        <Button variant="secondary" onClick={() => props.action.fn()}>
          {props.action.text}
        </Button>
      }
    />
  );
}
