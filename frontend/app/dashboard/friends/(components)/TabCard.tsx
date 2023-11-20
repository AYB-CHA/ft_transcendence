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
      {/* <Icon
        className="absolute -right-7 -top-6 z-10 text-primary-800/20 transition-transform duration-300 group-hover:rotate-12 group-hover:text-dark-semi-light/30"
        strokeWidth={1}
        width={70}
        height={70}
      /> */}
      <Icon
        className="relative z-10 mb-4 text-lg transition-colors duration-300 group-hover:text-dark"
        strokeWidth={1}
      />
      <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-primary-500 to-primary-400 transition-transform duration-300 group-hover:translate-y-[0%]"></div>
      <h3 className="relative text-sm z-10 font-medium text-start duration-300 group-hover:text-dark flex justify-between">
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
