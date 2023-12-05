import Spinner from "@/components/Spinner";

const useHistory = (id: string | undefined) => {};

export function History({ id }: { id: string | undefined }) {
  return (
    <div className="border bg-dark-dim flex w-full">
      <div className="w-full">
        <p className="border-b text-xl p-6">Match History</p>
        <div>
        </div>
      </div>
    </div>
  );
}
