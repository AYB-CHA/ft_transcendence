import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface StatsProps {
  wonGames: number;
  lostGames: number;
}

export default function Stats({ wonGames, lostGames }: StatsProps) {
  const totalGames = (wonGames ?? 0) + (lostGames ?? 0);
  const chartRef = useRef<ChartJS | null>(null);

  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(80),
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
      })
    );

    series.labels.template.setAll({
      textType: "circular",
      centerX: 0,
      centerY: 0,
      fill: am5.color(0xC2C4C0),
     
    });

    // series.labelsContainer

    series.set("colors", am5.ColorSet.new(root, {
      colors: [
        am5.color(0xC2C4C0),
        am5.color(0x0F1015),
      ],
    }))
    

    series.data.setAll([
      { value: wonGames, category: "Won" },
      { value: lostGames, category: "Lost" }
    ]);

    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      })
    );
    legend.hide(0);

    legend.data.setAll(series.dataItems);
    series.appear(1000, 100);
    chartRef.current = root;
  }, []);

  useEffect(() => {
    return () => {
      chartRef.current?.dispose();
    };
  }, []);

  return <div  id="chartdiv"  style={{ width: "100%", height: "24rem" }}></div>;
}
