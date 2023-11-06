import { LucideProps } from "lucide-react";
import { ReactNode } from "react";

export type BasicTabCardProps = {
  Icon: (props: LucideProps) => ReactNode;
  title: string;
  suffix?: string;
  selected?: boolean;
  onClick?: () => void;
};

export function BasicTabCard({
  Icon,
  title,
  suffix,
  selected = false,
  onClick = () => {},
}: BasicTabCardProps) {
  return (
    <div
      className={`flex flex-col p-[16px] gap-[14px] border-[1px] border-[#1F2329] min-w-[187px] cursor-pointer ${
        selected ? "bg-primary" : "bg-[#13141B]"
      }`}
      onClick={onClick}
    >
      <Icon
        strokeWidth={1.5}
        size={25}
        color={selected ? "black" : "#6B7280"}
      />
      <div
        className={`flex items-center justify-between font-normal text-[17px] leading-[26px] ${
          selected ? "text-black" : "#6B7280"
        }`}
      >
        <p>{title}</p>
        {suffix && <p>{suffix}</p>}
      </div>
    </div>
  );
}

export type Tabs = "friends" | "friend-requests";

export type TabCardProps = {
  name: Tabs;
  Icon: (props: LucideProps) => ReactNode;
  title: string;
  suffix?: string;
  isSelected: (tab: Tabs) => boolean;
  onClick: (tab: Tabs) => void;
};

export function TabCard({
  name,
  Icon,
  title,
  suffix,
  isSelected,
  onClick,
}: TabCardProps) {
  return (
    <BasicTabCard
      Icon={Icon}
      title={title}
      suffix={suffix}
      selected={isSelected(name)}
      onClick={() => onClick(name)}
    />
  );
}
