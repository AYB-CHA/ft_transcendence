import { PropsWithChildren } from "react";
import Link from "next/link";

type Props = { active?: boolean; href: string } & PropsWithChildren;

export default function NavTab({ children, href, active = false }: Props) {
  return (
    <Link className="h-full" href={href}>
      <div
        className={`border-x-[2.5px] border-transparent hover:text-gray-300 h-full flex justify-center items-center cursor-pointer transition-colors relative group px-4 py-2 ${
          active ? "border-l-primary text-gray-300" : "text-gray-500"
        }`}
      >
        <div>{children}</div>
        {/* <div
          className={` group-hover:bg-primary/60 h-5 w-5 absolute blur-md transition-colors ${
            active ? "bg-primary/60" : "bg-transparent"
          }`}
        /> */}
      </div>
    </Link>
  );
}
