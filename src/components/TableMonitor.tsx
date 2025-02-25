import { Image, Table, Tag } from "antd";

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
      sorter: (a: any, b: any) => a.monitor_cloro_tipo.localeCompare(b.monitor_cloro_tipo),
    },
    {
      title: "Punto Estrategico",
      dataIndex: "monitor_cloro_punto",
      key: "monitor_cloro_punto",
      sorter: (a: any, b: any) => a.monitor_cloro_punto.localeCompare(b.monitor_cloro_punto),
    },
    {
      title: "Observaciones",
      dataIndex: "monitor_cloro_observaciones",
      key: "monitor_cloro_observaciones",
      render: (data: string) => (
        <span style={{ color: "red", opacity: .7 }}>{data}</span>
      )
    },
    {
      title: "Capturas",
      dataIndex: "monitor_cloro_images",
      key: "monitor_cloro_images",
      width: "200px",
      render: (images: any[]) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {images?.map((img, index) => (
            <Image
              key={index}
              src={img.monitor_cloro_image_url}
              alt={`Captura ${index + 1}`}
              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
            />
          ))}
        </div>
      )
    }


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
