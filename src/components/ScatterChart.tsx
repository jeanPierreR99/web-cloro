import { Scatter } from '@ant-design/plots';

const ScatterChart = ({ data }: any) => {

    console.log(data)
    const config = {
        paddingLeft: 60,
        data: data,
        xField: "monitor_cloro_punto",
        yField: 'monitor_cloro_value',
        colorField: 'monitor_cloro_value',
        shapeField: 'point',
        style: {
            stroke: '#000',
            strokeOpacity: 0.2,
        },
        scale: {
            color: {
                palette: 'rdBu',
                offset: (t: any) => 1 - t,
            },
        },
        // tooltip: [{ channel: 'x', name: 'year', valueFormatter: (d: any) => d.getFullYear() }, { channel: 'y' }],
        // annotations: [{ type: 'lineY', data: [0], style: { stroke: '#000', strokeOpacity: 0.2 } }],
    };
    return <Scatter {...config} />;
};

export default ScatterChart
