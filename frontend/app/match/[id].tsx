import { useParams } from "next/navigation";

export default function Match() {
  const { userId } = useParams();
  return <div>{userId}</div>;
}
