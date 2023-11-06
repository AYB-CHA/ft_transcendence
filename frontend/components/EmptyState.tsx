import { LucideProps } from "lucide-react";
import { ReactNode } from "react";

export function EmptyState({
  Icon,
  description,
  fullHeight = false,
}: {
  Icon: (props: LucideProps) => ReactNode;
  description: string;
  fullHeight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullHeight ? "h-full" : "py-[80px]"
      }`}
    >
      <Icon size={35} strokeWidth={1} className="text-gray-500" />
      <div className="mt-4">
        <span className="text-gray-500 text-xs">{description}</span>
      </div>
    </div>
  );
}
