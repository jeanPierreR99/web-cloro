import { Treemap } from '@ant-design/plots';
import React from 'react';

const CloroGlobalChart:React.FC = () => {
  const data = {
    name: 'C.P',
    children: [
      { name: 'Shintuya', value: 1 },
      { name: 'Puerto Maldonado', value: 0.8 },
      { name: 'Planchon', value: 0.5 },
      { name: 'Las Piedras', value: 0.5 },
      { name: 'Santo Domingo', value: 0.7 },
      { name: 'Nueva', value: 0.7 },
      { name: 'Huepetue', value: 0.5 },
      { name: 'La novia', value: 0.3 },
    ],
  };
  const config = {
    data,
    colorField: 'value',
    valueField: 'value',
    scale: {
      color: {
        range: [
          '#4e79a7',
          '#f28e2c',
          '#e15759',
          '#76b7b2',
          '#59a14f',
          '#edc949',
          '#af7aa1',
          '#ff9da7',
          '#9c755f',
          '#bab0ab',
        ],
      },
    },
    legend: false,
  };
  return <Treemap {...config} />;
};

export default CloroGlobalChart