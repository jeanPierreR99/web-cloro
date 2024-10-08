
import { Line, Column } from "@ant-design/plots";

const CHART_MAP:any = {};

    interface Cloro {
        date: string;
        cloro_residual: number;
        punto: string;
      }
      
      const data: Cloro[] = [
        { date: "enero 2024", cloro_residual: 0.5, punto: "Reservorio" },
        { date: "febrero 2024", cloro_residual: 0.4, punto: "Primera Vivienda" },
        { date: "marzo 2024", cloro_residual: 0.5, punto: "Vivienda Intermedia" },
        { date: "abril 2024", cloro_residual: 0.5, punto: "Ultima Vivienda" },
        { date: "mayo 2024", cloro_residual: 0.7, punto: "Reservorio" },
        { date: "junio 2024", cloro_residual: 0.9, punto: "Primera Vivienda" },
        { date: "julio 2024", cloro_residual: 0.9, punto: "Vivienda Intermedia" },
        { date: "agosto 2024", cloro_residual: 0.8, punto: "Ultima Vivienda" },
        { date: "septiembre 2024", cloro_residual: 0.5, punto: "Reservorio" },
        { date: "diciembre 2024", cloro_residual: 1, punto: "Primera Vivienda" },
        { date: "enero 2025", cloro_residual: 0.5, punto: "Reservorio" },
        { date: "febrero 2025", cloro_residual: 0.4, punto: "Primera Vivienda" },
        { date: "marzo 2025", cloro_residual: 0.5, punto: "Vivienda Intermedia" },
        { date: "abril 2025", cloro_residual: 0.5, punto: "Ultima Vivienda" },
        { date: "mayo 2025", cloro_residual: 0.7, punto: "Reservorio" },
        { date: "junio 2025", cloro_residual: 0.9, punto: "Primera Vivienda" },
        { date: "julio 2025", cloro_residual: 0.9, punto: "Vivienda Intermedia" },
        { date: "agosto 2025", cloro_residual: 0.8, punto: "Ultima Vivienda" },
        { date: "septiembre 2025", cloro_residual: 0.5, punto: "Reservorio" },
        { date: "diciembre 2025", cloro_residual: 1, punto: "Primera Vivienda" },
      ];
const CloroColumnChart = () => {


  const config = {
    data,
    xField: "date",
    yField: "cloro_residual",
    height: 200,
  };

  const showTooltip = (data:any) => {
    const { line, column } = CHART_MAP;
    //  连续图表
    line.emit("tooltip:show", {
      data: { data: { x: data.date } },
    });
    column.emit("tooltip:show", {
      data: { data },
    });
  };

  const hideTooltip = () => {
    const { line, column } = CHART_MAP;
    line.emit("tooltip:hide");
    column.emit("tooltip:hide");
  };

  const setTooltipPosition = (evt:any, chart:any) => {
    showTooltip(data);
  };

  return (
    <div>
      <Line
        {...config}
        onReady={({ chart }) => {
          CHART_MAP["line"] = chart;
          chart.on("plot:pointermove", (evt:any) => {
            setTooltipPosition(evt, chart);
          });
          chart.on("plot:pointerout", hideTooltip);
        }}
      />
      <Column
        {...config}
        onReady={({ chart }) => {
          CHART_MAP["column"] = chart;
          chart.on("plot:pointermove", (evt:any) => {
            setTooltipPosition(evt, chart);
          });
          chart.on("plot:pointerout", hideTooltip);
        }}
      />
    </div>
  );
};
export default CloroColumnChart;
