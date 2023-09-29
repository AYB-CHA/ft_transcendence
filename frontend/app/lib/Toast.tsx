import { ReactNode } from "react";
import { toast } from "react-toastify";

export function triggerValidationToast(
  icon: ReactNode,
  title: string,
  message: string
) {
  toast.dismiss();
  toast(
    <div>
      <div className="mb-2 flex gap-2 items-center">
        <div className="text-primary">{icon}</div>
        <h3>{title}</h3>
      </div>
      <div className="text-gray-500">{message}</div>
    </div>
  );
}
