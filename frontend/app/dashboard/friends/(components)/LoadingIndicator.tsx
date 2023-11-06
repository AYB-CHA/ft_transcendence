import Spinner from "@/components/Spinner";

export function LoadingIndicator({
  visible,
  className = "",
}: {
  visible: boolean;
  className?: string;
}) {
  return (
    <>
      {visible && (
        <div className={`grid place-content-center h-full ${className}`}>
          <Spinner />
        </div>
      )}
    </>
  );
}
