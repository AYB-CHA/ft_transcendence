import Button from "@/components/Button";
import Ft from "@/components/icons/Ft";
import Github from "@/components/icons/Github";

export default function ProvidersButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="dark">
        <Github />
      </Button>
      <Button variant="dark">
        <Ft />
      </Button>
      {/* <Button variant="dark">OK</Button> */}
    </div>
  );
}
