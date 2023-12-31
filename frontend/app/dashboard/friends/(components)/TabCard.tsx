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
      onClick={onClick}
      className="group relative block overflow-hidden border-[1px] border-dark-semi-dim bg-dark-dim p-4 w-[200px]"
    >
      <Icon
        className="relative z-10 mb-4 text-lg transition-colors duration-300"
        strokeWidth={1}
      />
      <div className="absolute h-[2px] -translate-x-full group-hover:translate-x-0 w-full bottom-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 transition-transform duration-300 group-hover:translate-y-[0%]"></div>
      <h3 className="relative z-10 font-medium text-start duration-300 flex justify-between text-gray-500 text-xs">
        <p>{title}</p>
        {suffix && <p>{suffix}</p>}
      </h3>
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
