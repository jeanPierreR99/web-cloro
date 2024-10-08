import { Line } from "@ant-design/plots";

const CloroLineChart = ({ monitorGestor }:any) => {
  const config = {
    data: monitorGestor,
    xField: "monitor_cloro_date",
    yField: "monitor_cloro_value",
    colorField: "monitor_cloro_punto",
    axis: {
      y: {
        labelFormatter: (v: any) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    scale: { color: { range: ["#30BF78", "#F4664A", "#FAAD14", "#0031c1e0"] } },
    style: {
      lineWidth: 2,
    },
  };

  return <Line {...config} />;
};

export default CloroLineChart;
