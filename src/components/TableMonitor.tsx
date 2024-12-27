import { Table, Tag } from "antd";

const TableMonitor = ({ monitorGestor }: any) => {

  const columns = [
    {
      title: "Fecha de registro",
      dataIndex: "monitor_cloro_date",
      key: "monitor_cloro_date",
    },
    {
      title: "Cloro",
      dataIndex: "monitor_cloro_value",
      key: "monitor_cloro_value",
      render: (data: number) => (
        <Tag color={data <= 0.5 ? "red" : "green"}>{data}</Tag>
      ),
    },
    {
      title: "Periodo",
      dataIndex: "monitor_cloro_tipo",
      key: "monitor_cloro_tipo",
    },
    {
      title: "Punto Estrategico",
      dataIndex: "monitor_cloro_punto",
      key: "monitor_cloro_punto",
    },
    {
      title: "Observaciones",
      dataIndex: "monitor_cloro_observaciones",
      key: "monitor_cloro_observaciones",
    },
  ];

  return (
    <div>
      <Table
        dataSource={monitorGestor}
        columns={columns}
        rowKey="gestor_id"
        scroll={{ x: "min-content" }}
      />
    </div>
  )
};

export default TableMonitor;
