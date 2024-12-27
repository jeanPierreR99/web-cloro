import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Tag,
  Spin,
  Dropdown,
  Menu,
  Popconfirm,
} from "antd";
import { centrosProp } from "../page/admin/PopulateCenter";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import appFirebase from "../js/credentials";
import TableMonitor from "./TableMonitor";
import DualChart from "./DualChart";
const db = getFirestore(appFirebase);

export interface Gestor {
  gestor_create_at: string;
  gestor_id: string;
  gestor_dni: string;
  id_centro_poblado: string;
  gestor_name_complete: string;
  gestor_phone: string;
  gestor_user: string;
  gestor_password: string;
  gestor_status: boolean;
}

interface InfoGestor {
  gestor: Gestor;
  centro_poblado: centrosProp;
}

interface GestorTableProps {
  gestores: Gestor[];
  onEdit: (gestor: Gestor) => void;
  loading: boolean; // Nuevo prop para manejar el estado de carga
}

const TableGestor: React.FC<GestorTableProps> = ({
  gestores,
  onEdit,
  loading,
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isMonitorModalVisible, setIsMonitorModalVisible] = useState(false);
  const [editingGestor, setEditingGestor] = useState<Gestor | null>(null);
  const [infoGestor, setInfoGestor] = useState<InfoGestor | null>(null);
  const [monitorGestor, setMonitorGestor] = useState<any[] | null>(null);
  const [form] = Form.useForm();
  const [loadByMonitor, setLoadByMonitor] = useState(false);
  const [loadByEdit, setLoadByEdit] = useState(false);

  const handleEdit = (gestor: Gestor) => {
    setEditingGestor(gestor);
    form.setFieldsValue(gestor);
    setIsEditModalVisible(true);
  };

  const handleInfo = async (gestorId: string, centroId: string) => {
    try {
      setIsInfoModalVisible(true);
      setLoadByEdit(true);
      const docRefGestor = doc(db, "gestores", gestorId);
      const docRefCentro = doc(db, "centros_poblados", centroId);

      const gestorSnap = await getDoc(docRefGestor);
      const centroSnap = await getDoc(docRefCentro);

      const gestorData = gestorSnap.data() as Gestor;
      const centroData = centroSnap.data() as centrosProp;

      const gestorInfo: InfoGestor = {
        gestor: gestorData,
        centro_poblado: centroData,
      };
      console.log(gestorInfo);
      setInfoGestor(gestorInfo);
      setLoadByEdit(false);
    } catch (error) {
      console.error("Error al obtener datos: ", error);
      setLoadByEdit(false);
    }
  };

  const handleMonitor = async (gestorId: string, centroId: string) => {
    setLoadByMonitor(true);
    try {
      setIsMonitorModalVisible(true);
      const userQuery = query(
        collection(db, "monitor_cloro"),
        where("monitor_cloro_gestor_id", "==", gestorId),
        where("monitor_cloro_populate_center_id", "==", centroId),
      );

      const querySnapshot = await getDocs(userQuery);
      const filteredDocs: any = [];

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        filteredDocs.push({ ...docData });
      });

      filteredDocs.sort((a: any, b: any) => {
        const dateA = a.monitor_cloro_date.split('/').reverse().join('-'); // Convierte DD/MM/YYYY a YYYY-MM-DD
        const dateB = b.monitor_cloro_date.split('/').reverse().join('-');
        return dateB.localeCompare(dateA); // Orden descendente
      });

      setLoadByMonitor(false);
      setMonitorGestor(filteredDocs);
    } catch (error) {
      setLoadByMonitor(false);
      console.error("Error al obtener datos: ", error);
    }
  };

  const confirm = async (gestorId: string, centroId: string) => {
    try {
      const docRefGestor = doc(db, "gestores", gestorId);
      await updateDoc(docRefGestor, { gestor_status: false });

      const docRefCenter = doc(db, "centros_poblados", centroId);
      await updateDoc(docRefCenter, { centro_status: false });

      notification.success({
        message: "Dado de baja",
        description: `El gestor ha sido dado de baja`,
        placement: "top",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudo dar de baja al gestor.",
        placement: "top",
      });
      console.error("Error actualizando el campo: ", error);
    }
  };

  const menu = (gestor: Gestor) => (
    <Menu>
      <div>
        {gestor.gestor_status && (
          <p
            style={{ margin: 2 }}
            className="hover-edit"
            onClick={() => handleEdit(gestor)}
          >
            Editar
          </p>
        )}
        <p
          style={{ margin: 2 }}
          className="hover-edit"
          onClick={() => handleInfo(gestor.gestor_id, gestor.id_centro_poblado)}
        >
          Información
        </p>
        <p
          style={{ margin: 2 }}
          className="hover-edit"
          onClick={() =>
            handleMonitor(gestor.gestor_id, gestor.id_centro_poblado)
          }
        >
          Monitoreo
        </p>
        {gestor.gestor_status && (
          <Popconfirm
            title={`Seguro que queire dar de baja`}
            description={`${gestor.gestor_name_complete}`}
            onConfirm={() => confirm(gestor.gestor_id, gestor.id_centro_poblado)}
          >
            <p className="hover-delete">Eliminar</p>
          </Popconfirm>
        )}
      </div>
    </Menu>
  );
  const handleEditSubmit = (values: any) => {
    if (editingGestor) {
      onEdit({ ...editingGestor, ...values });
      setIsEditModalVisible(false);
      notification.success({
        message: "Gestor Editado",
        description: `El gestor ${values.gestor_name_complete} ha sido editado con éxito.`,
        placement: "top",
      });
    }
  };

  const columns = [
    {
      title: "Fecha de registro",
      dataIndex: "gestor_create_at",
      key: "gestor_create_at",
    },
    {
      title: "Nombre Completo",
      dataIndex: "gestor_name_complete",
      key: "gestor_name_complete",
    },
    {
      title: "Teléfono",
      dataIndex: "gestor_phone",
      key: "gestor_phone",
    },
    {
      title: "Usuario",
      dataIndex: "gestor_user",
      key: "gestor_user",
    },
    {
      title: "Estado",
      dataIndex: "gestor_status",
      key: "gestor_status",
      render: (data: boolean) => (
        <Tag color={data ? "green" : "red"}>{data ? "Activo" : "Baja"}</Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, gestor: Gestor) => (
        <Dropdown
          trigger={["click"]}
          overlay={menu(gestor)}
          placement="bottomRight"
          arrow
        >
          <Button>Menu</Button>
        </Dropdown>
      ),
    },
  ];

  const rowClassName = (record: Gestor) => {
    return record.gestor_status ? "" : "row-red";
  };

  return (
    <>
      <p style={{ fontWeight: 700, marginBottom: 10 }}>GESTORES</p>
      <Spin spinning={loading} tip="Cargando...">
        <Table
          dataSource={gestores}
          columns={columns}
          rowKey="gestor_id"
          rowClassName={rowClassName}
          scroll={{ x: "min-content" }}
        />
      </Spin>
      <Modal
        title="Editar Gestor"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="gestor_name_complete"
            label="Nombre Completo"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el nombre completo",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gestor_phone"
            label="Teléfono"
            rules={[
              { required: true, message: "Por favor ingrese el teléfono" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gestor_user"
            label="Usuario"
            rules={[
              { required: true, message: "Por favor ingrese el usuario" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gestor_password"
            label="Contraseña"
            rules={[
              { required: true, message: "Por favor ingrese la contraseña" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal para informacion gestor */}
      <Modal
        title="Información del gestor"
        visible={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={null}
      >
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              {" "}
              <th colSpan={2} style={{ background: "#f2f2f2" }}>
                Personal
              </th>
            </tr>
          </thead>
          <Spin spinning={loadByEdit} tip={"...cargando"}>
            <tbody style={{ textAlign: "justify" }}>
              <tr>
                <th>Fecha de registro: </th>
                <td>{infoGestor?.gestor.gestor_create_at}</td>
              </tr>
              <tr>
                <th>DNI:</th>
                <td>{infoGestor?.gestor.gestor_dni}</td>
              </tr>
              <tr>
                <th>Nombre:</th>
                <td>{infoGestor?.gestor.gestor_name_complete}</td>
              </tr>
              <tr>
                <th>Telefono:</th>
                <td>{infoGestor?.gestor.gestor_phone}</td>
              </tr>
              <tr>
                <th>Estado:</th>
                <td>
                  {infoGestor && (
                    <Tag
                      color={infoGestor.gestor.gestor_status ? "green" : "red"}
                    >
                      {infoGestor.gestor.gestor_status ? "Activo" : "Baja"}
                    </Tag>
                  )}
                </td>
              </tr>
            </tbody>
          </Spin>
        </table>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              {" "}
              <th colSpan={2} style={{ background: "#f2f2f2" }}>
                Centro Poblado
              </th>
            </tr>
          </thead>
          <Spin spinning={loadByEdit} tip={"...cargando"}>
            <tbody style={{ textAlign: "justify" }}>
              <tr>
                <th>Centro Poblado:</th>
                <td>{infoGestor?.centro_poblado.centro_nombre}</td>
              </tr>
              <tr>
                <th>Provinvia:</th>
                <td>{infoGestor?.centro_poblado.centro_provincia}</td>
              </tr>
              <tr>
                <th>Distrito:</th>
                <td>{infoGestor?.centro_poblado.centro_distrito}</td>
              </tr>
              <tr>
                <th>Latitud:</th>
                <td>{infoGestor?.centro_poblado.centro_latitud}</td>
              </tr>
              <tr>
                <th>Longuitud:</th>
                <td>{infoGestor?.centro_poblado.centro_longitud}</td>
              </tr>
              <tr>
                <th>Meta Fed:</th>
                <td>
                  {infoGestor && (
                    <Tag
                      color={
                        infoGestor.centro_poblado.centro_enMeta
                          ? "green"
                          : "red"
                      }
                    >
                      {infoGestor.centro_poblado.centro_enMeta
                        ? "En meta"
                        : "No"}
                    </Tag>
                  )}
                </td>
              </tr>
            </tbody>
          </Spin>
        </table>
      </Modal>
      {/* monitoreo */}
      <Modal
        title="Información de Monitoreo"
        visible={isMonitorModalVisible}
        onCancel={() => setIsMonitorModalVisible(false)}
        footer={null}
        width={"80%"}
      >
        <Spin spinning={loadByMonitor} tip={"...cargando"}>
          {
            monitorGestor && monitorGestor.length == 0 && <span>Sin datos ....</span>
          }
          <DualChart monitorGestor={monitorGestor}></DualChart>
          <TableMonitor monitorGestor={monitorGestor}></TableMonitor>
        </Spin>
      </Modal>
    </>
  );
};

export default TableGestor;
