import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Swords } from "lucide-react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface StatsProps {
  wonGames?: number;
  lostGames?: number;
}

export default function Stats({ wonGames, lostGames }: StatsProps) {
  const totalGames = (wonGames ?? 0) + (lostGames ?? 0);
  const data = {
    datasets: [
      {
        data: [wonGames ?? 0, lostGames ?? 0],
        backgroundColor: ["#C2C4C0", "#0F1015"],
        borderwidth: 1,
      },
    ],
  };

  return (
    <div className="relative right-[25%]">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          cutout: "80%",
        }}
      />
    </div>
  );
}
