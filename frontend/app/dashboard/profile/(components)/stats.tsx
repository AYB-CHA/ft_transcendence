import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

export interface StatsProps {
    wonGames?: number;
    lostGames?: number;
}
// playedGames: number;
// winRatio: number;

export default function Stats({wonGames, lostGames}: StatsProps){
  const totalGames = (wonGames ?? 0) + (lostGames ?? 0);
  
  return (
    <div>
      <ReactApexChart
        // options={}
        series={[lostGames ?? 0, wonGames ?? 0]}
        labels={["Won", "Lost"]}
        type="donut"
      />
    </div>
  );
}
  