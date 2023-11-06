import Spinner from "@/components/Spinner";

export function LoadingIndicator({ visible }: { visible: boolean }) {
  return (
    <>
      {visible && (
        <div className="grid place-content-center h-full ">
          <Spinner />
        </div>
      )}
    </>
  );
}
