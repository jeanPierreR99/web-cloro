import { Scatter } from '@ant-design/plots';

const ScatterChart = ({ data }: any) => {
    // Calcular la frecuencia de cada combinación de valores
    const processedData = data.map((item: any) => {
        const frequency = data.filter(
            (d: any) =>
                d.monitor_cloro_punto === item.monitor_cloro_punto &&
                d.monitor_cloro_value === item.monitor_cloro_value
        ).length;

        return { ...item, frequency };
    });

    console.log(processedData);

    const config = {
        data: processedData,
        xField: "monitor_cloro_punto",
        yField: "monitor_cloro_value",
        sizeField: "frequency", // Cambiar tamaño según la frecuencia
        shape: 'circle',
        colorField: 'frequency',
        scale: {
            size: { type: 'log', range: [5, 25] },
            color: {
                palette: 'gnBu',
                offset: (t: any) => t,
            },
          },
        style: {
            stroke: 'gray',
            lineWidth: 1,
        },
    };

    return <Scatter {...config} />;
};

export default ScatterChart;
