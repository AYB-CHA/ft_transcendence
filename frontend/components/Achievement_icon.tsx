import { cn } from "@/app/lib/cn";
import Image from "next/image";

interface AchievementIconProps {
    src: string;
    className?: string;
    obtained: boolean;
    title: string;
}

export function AchievementIcon({
    src,
    className,
    obtained,
    title,
}: AchievementIconProps) {
    return (
        <Image
            src={"/" + src}
            className={cn(className, !obtained && "grayscale")}
            height={40}
            width={40}
            unoptimized
            alt="achievement"
            title={title}
        />
    );
}