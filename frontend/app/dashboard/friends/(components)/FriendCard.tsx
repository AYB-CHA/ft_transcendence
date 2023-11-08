import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { PropsWithChildren } from "react";

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
    <div className="grid grid-cols-6 p-[8px]">
      <div className="flex flex-row items-center gap-[7px]">
        <Avatar src={image} className="max-w-[44px] max-h-[44px]" />
        <div className="flex flex-col">
          <p className="text-primary text-[15px] leading-[23px]">{name}</p>
          <p className="font-normal text-gray-500 text-[12px] leading-[19px]">
            @{username}
          </p>
        </div>
      </div>
      <StatisticText title="Games" value={String(playedGames)} />
      <StatisticText title="Won Games" value={String(wonGames)} />
      <StatisticText title="Lost Games" value={String(lostGames)} />
      <StatisticText title="Win Ratio" value={`${winRatio}%`} />
      <div className="flex flex-row items-center justify-end gap-[18px]">
        {actions}
      </div>
    </div>
  );
}

export type BasicFriendCardProps = {
  image: string;
  name: string;
  username: string;
  actions: JSX.Element;
};

export function BasicFriendCard({
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
          <p className="text-primary text-[15px] leading-[23px]">{name}</p>
          <p className="font-normal text-gray-500 text-[12px] leading-[19px]">
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
          Unfriend
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
