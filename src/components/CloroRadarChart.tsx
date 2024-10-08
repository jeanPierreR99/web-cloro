import { Radar } from "@ant-design/plots";

const CloroRadarChart = ({ monitorGestor }: any) => {
  const config = {
    data: monitorGestor,
    xField: "monitor_cloro_punto",
    yField: "monitor_cloro_value",
    seriesField: "monitor_cloro_date",
    colorField: "monitor_cloro_date",
    color: ["#1f77b4", "#ff7f0e", "#2ca02c"],
    areaStyle: {
      fillOpacity: 0.1,
    },
    point: {
      size: 5,
      shape: "circle",
    },
  };

  return <Radar {...config} />;
};

export default CloroRadarChart;
