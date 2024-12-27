// CentroPobladoTable.tsx

import React from "react";
import { Table, Tag, Spin } from "antd";

export interface CentroPoblado {
  centro_id: number;
  centro_nombre: string;
  centro_provincia: string;
  centro_distrito: string;
  centro_latitud: string;
  centro_longitud: string;
  centro_enMeta: boolean;
}

interface CentroPobladoTableProps {
  centros: CentroPoblado[];
  loading: boolean;
}

const TablePopulateCenter: React.FC<CentroPobladoTableProps> = ({
  centros,
  loading,
}) => {
  const columns = [
    {
      title: "Id",
      dataIndex: "centro_id",
      key: "id",
      render: (data: string) => <Tag color="blue">{data}</Tag>,
    },
    {
      title: "Nombre",
      dataIndex: "centro_nombre",
      key: "nombre",
    },
    {
      title: "Provincia",
      dataIndex: "centro_provincia",
      key: "provincia",
    },
    {
      title: "Distrito",
      dataIndex: "centro_distrito",
      key: "distrito",
    },
    {
      title: "Estado",
      dataIndex: "centro_status",
      key: "centro_status",
      render: (text: boolean) => (
        <Tag color={text ? "green" : "red"}>
          {text ? "Con Gestor" : "Sin Gestor"}
        </Tag>
      ),
    },
    {
      title: "Meta Fed",
      dataIndex: "centro_enMeta",
      key: "enMeta",
      render: (enMeta: boolean) => (
        <Tag style={{ fontSize: "12px" }} color={enMeta ? "green" : "red"}>
          {enMeta ? "En Meta" : "No"}
        </Tag>
      ),
    },
  ];

  return (
    <Spin spinning={loading} tip="Cargando...">
      <Table
        dataSource={centros}
        columns={columns}
        scroll={{ x: "min-content" }}
        rowKey="id"
      />
    </Spin>
  );
};

export default TablePopulateCenter;
