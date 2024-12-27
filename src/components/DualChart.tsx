import { DualAxes } from '@ant-design/plots';

const DualChart = ({ monitorGestor }: any) => {

    const config = {
        xField: 'monitor_cloro_punto',
        children: [
            {
                data: monitorGestor,
                type: 'interval',
                yField: 'monitor_cloro_value',
                colorField: 'monitor_cloro_tipo',
                group: true,
                style: { maxWidth: 80 },
                interaction: { elementHighlight: { background: true } },
            },

        ],
    };
    return <DualAxes {...config} />;
};

export default DualChart