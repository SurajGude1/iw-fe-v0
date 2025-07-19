"use client";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";

import { Pie, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";

// Registering necessary components for the charts
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function DailyAnalysis() {
  // Color palette
  const colors = {
    richBlack: "#001011",
    midnightGreen: "#093A3E",
    verdigris: "#3AAFB9",
    electricBlue: "#64E9EE",
    lightSkyBlue: "#97C8EB",
  };

  // Data for the Pie chart (Card 1)
  const pieData = {
    labels: ["Red", "Blue", "Yellow", "Green"],
    datasets: [
      {
        label: "My Pie Dataset",
        data: [300, 50, 100, 150],
        backgroundColor: [
          colors.richBlack,
          colors.midnightGreen,
          colors.verdigris,
          colors.electricBlue,
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Data for the Donut chart (Card 2)
  const donutData = {
    labels: ["Red", "Blue", "Yellow", "Green"],
    datasets: [
      {
        label: "My Donut Dataset",
        data: [250, 100, 150, 200],
        backgroundColor: [
          colors.richBlack,
          colors.midnightGreen,
          colors.verdigris,
          colors.electricBlue,
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Data for the Line chart (Card 3)
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Sales",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: colors.verdigris, // Line color
        tension: 0.1,
        backgroundColor: colors.lightSkyBlue, // Line area background (if any)
        pointBackgroundColor: colors.electricBlue, // Data point color
      },
    ],
  };

  function GaugePointer() {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();

    if (valueAngle === null) {
      // No value to display
      return null;
    }

    const target = {
      x: cx + outerRadius * Math.sin(valueAngle),
      y: cy - outerRadius * Math.cos(valueAngle),
    };
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill="red" />
        <path
          d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
          stroke="var(--coke-red)"
          strokeWidth={2}
        />
      </g>
    );
  }

  return (
    <div className="Margin80Auto ShadowPrimary FlexBoxColumn BorderRadius4 OverflowHidden BoxW96Hauto Padding30 Gap25 BackgroundN RoutesMainContainer">
      <h1 className="Header TextAlignCenter">Daily Analysis</h1>

      <div className="MakeCards Gap15 Padding20 GridCol2x">
        <div className="FlexBoxColumn Gap30 ShadowSecondary Padding20 CursorPointer TextAlignCenter BorderRadius4 Transition02 ShadowSecondary">
          <h3>Daily Website Traffic</h3>
          <div style={{ width: "100%", height: "250px" }}>
            <Line data={lineData} />
          </div>
        </div>

        <div className="FlexBoxColumn Gap30 ShadowSecondary Padding20 CursorPointer TextAlignCenter BorderRadius4 Transition02 ShadowSecondary">
          <h3>Bar chart</h3>
          <BarChart
            series={[
              { data: [35, 44, 24, 34] },
              { data: [51, 6, 49, 30] },
              { data: [15, 25, 30, 50] },
              { data: [60, 50, 15, 25] },
            ]}
            height={290}
            xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </div>

        <div className="FlexBoxColumn Gap30 ShadowSecondary Padding20 CursorPointer TextAlignCenter BorderRadius4 Transition02 ShadowSecondary">
          <h3>Time Spent on Site</h3>
          <div style={{ width: "100%", height: "250px" }}>
            <Doughnut data={donutData} />
          </div>
        </div>

        <div className="FlexBoxColumn Gap30 ShadowSecondary Padding20 CursorPointer TextAlignCenter BorderRadius4 Transition02 ShadowSecondary">
          <h3>Ad Performance</h3>
          <div style={{ width: "100%", height: "250px" }}>
            <Pie data={pieData} />
          </div>
        </div>

        <div className="FlexBoxColumn Gap30 ShadowSecondary Padding20 CursorPointer TextAlignCenter BorderRadius4 Transition02 ShadowSecondary">
          <h3>New vs Returning Visitors</h3>
          <div style={{ width: "100%", height: "250px" }}>
            <Pie data={pieData} />
          </div>
        </div>

        <div className="FlexBoxColumn Gap30 ShadowSecondary Padding20 CursorPointer TextAlignCenter BorderRadius4 Transition02 ShadowSecondary">
          <h3>Line chart</h3>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            width={500}
            height={300}
          />
        </div>

        <div className="FlexBoxColumn Gap30 ShadowSecondary Padding20 CursorPointer TextAlignCenter BorderRadius4 Transition02 ShadowSecondary">
          <h3>Gudge meter</h3>
          <GaugeContainer
            width={200}
            height={200}
            startAngle={-110}
            endAngle={110}
            value={30}
          >
            <GaugeReferenceArc />
            <GaugeValueArc />
            <GaugePointer />
          </GaugeContainer>{" "}
        </div>
      </div>
    </div>
  );
}
