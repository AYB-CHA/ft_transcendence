import { PropsWithChildren } from "react";
import Link from "next/link";

type Props = { active?: boolean; href: string } & PropsWithChildren;

export default function NavTab({ children, href, active = false }: Props) {
  return (
    <Link className="h-full" href={href}>
      <div
        className={` border-y-[2.5px] border-transparent  hover:text-gray-300 h-full px-3 flex justify-center items-center cursor-pointer transition-colors relative group ${
          active ? "border-b-primary text-gray-300" : "text-gray-500"
        }`}
      >
        <div>{children}</div>
        <div
          className={` group-hover:bg-primary/60 h-5 w-5 absolute blur-md transition-colors ${
            active ? "bg-primary/60" : "bg-transparent"
          }`}
        ></div>
      </div>
    </Link>
  );
}
