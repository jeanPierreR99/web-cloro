// CentroPobladoTable.tsx

import React from "react";
import { Table, Button, Space, Tag, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";

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
  onEdit: (centro: CentroPoblado) => void;
  loading: boolean;
}

const TablePopulateCenter: React.FC<CentroPobladoTableProps> = ({
  centros,
  onEdit,
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
    {
      title: "Acciones",
      key: "acciones",
      render: (_text: any, record: CentroPoblado) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            style={{ fontSize: "12px" }}
            onClick={() => onEdit(record)}
          >
            Ver/Editar
          </Button>
        </Space>
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
