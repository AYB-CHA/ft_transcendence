import { AlertCircle } from "lucide-react";
import { PropsWithChildren } from "react";

type AlertPropsType = PropsWithChildren & {
  variant?: "danger";
  className?: string;
};

export default function Alert({
  children,
  className,
  variant = "danger",
}: AlertPropsType) {
  const variants = {
    danger: "border text-white border-red-500 bg-red-500",
  };
  return (
    <div
      className={
        `p-4 mb-4 flex items-center ${variants[variant]}> ` + className
      }
    >
      <div className="mr-4">
        <AlertCircle size={16} />
      </div>
      <div>{children}</div>
    </div>
  );
}
