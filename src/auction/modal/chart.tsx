import React from "react";
import { Chart as ChartReact } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface IMyChartState {
  chartLabels?: string[];
  chartData?: number[];
}

export default class MyChart extends React.Component<{}, IMyChartState> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  public update(data: IMyChartState) {
    this.setState(data);
  }

  // helper function to format chart data since you do this twice
  formatData(data?: number[], labels?: string[]): ChartData {
    if (data === undefined) {
      data = [];
    }
    if (labels === undefined) {
      labels = [];
    }

    return {
      labels: labels,
      datasets: [
        {
          data,
          label: "Bids",
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
  }

  render() {
    return (
      <div className="self-center w-1/2">
        <div className="overflow-hidden">
          <ChartReact
            type="line"
            data={this.formatData(this.state.chartData, this.state.chartLabels)}
          />
        </div>
      </div>
    );
  }
}
