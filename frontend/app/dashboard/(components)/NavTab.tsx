import { PropsWithChildren } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
type Props = {
  active?: boolean;
  href: string;
  count?: number;
} & PropsWithChildren;

export default function NavTab({
  children,
  href,
  active = false,
  count = 0,
}: Props) {
  return (
    <motion.span whileTap={{ scale: 0.95 }}>
      <Link className="h-full" href={href}>
        <div
          className={`border-x-[2.5px] border-transparent hover:text-gray-300 h-full flex justify-center items-center cursor-pointer transition-colors relative group px-4 py-2 ${
            active ? "border-l-primary text-gray-300" : "text-gray-500"
          }`}
        >
          <div>{children}</div>
          {count > 0 && (
            <span className="absolute bg-primary text-xs text-dark border border-dark px-1 top-[2px] right-[8px] rounded-lg">
              {count}
            </span>
          )}
          {/* <div
          className={` group-hover:bg-primary/60 h-5 w-5 absolute blur-md transition-colors ${
            active ? "bg-primary/60" : "bg-transparent"
          }`}
        /> */}
        </div>
      </Link>
    </motion.span>
  );
}
