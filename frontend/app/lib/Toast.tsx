import { X } from "lucide-react";
import { PropsWithChildren, ReactNode } from "react";
import { toast } from "react-toastify";
const Container = (props: PropsWithChildren & { onClick?: () => void }) => (
  <div onClick={props.onClick}>{props.children}</div>
);

export function triggerValidationToast(
  icon: ReactNode,
  title: string,
  message: string
) {
  toast.dismiss();
  toast(
    <Container>
      <div className="toast-content-wrapper">
        <div className="mb-2 flex gap-2 items-center">
          <div className="text-primary">{icon}</div>
          <h3>{title}</h3>
        </div>
        <div className="text-gray-500">{message}</div>
      </div>
    </Container>,
    {
      closeButton: (
        <Container>
          <X className="text-gray-500" size={15} />
        </Container>
      ),
    }
  );
}
export function triggerSuccessToast(
  icon: ReactNode,
  title: string,
  message: string,
  onclick?: () => void
) {
  toast.dismiss();
  toast(
    <Container onClick={onclick}>
      <div className="toast-content-wrapper">
        <div className="mb-2 flex gap-2 items-center">
          <div className="text-green-500">{icon}</div>
          <h3>{title}</h3>
        </div>
        <div className="text-gray-500">{message}</div>
      </div>
    </Container>,
    {
      closeButton: (
        <Container>
          <X className="text-gray-500" size={15} />
        </Container>
      ),
    }
  );
}
