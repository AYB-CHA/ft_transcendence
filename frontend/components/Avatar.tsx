import Image from "next/image";

export default function Avatar({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <img
      className={`rounded-full border border-primary cursor-pointer ${className}`}
      height={60}
      width={60}
      src={src}
      alt="avatar"
    />
  );
}
