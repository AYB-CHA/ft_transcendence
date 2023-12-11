import Image from "next/image";

interface AchievementIconProps {
    src: string;
    className?: string;
    obtained: boolean;
}

export function AchievementIcon({
    src,
    className,
    obtained,
}: AchievementIconProps) {
    const not_src = `/not_${src}`;
    src = `/${src}`;
    console.log(src, obtained);

    return (
        <Image
            src={obtained ? src : not_src}
            className={className}
            height={40}
            width={40}
            unoptimized
            alt="achievement"
            title={src}
        />
    );
}